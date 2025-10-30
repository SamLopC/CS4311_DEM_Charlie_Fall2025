import json
import uuid
from typing import Optional, Dict, Any, List
from models.Project import Project, Host, Container
from services.DatabaseManager import DatabaseManager

_VALID_EVENT_TYPES = {"CVI", "CVPA"}

class ProjectService:
    def __init__(self):
        self.db = DatabaseManager()
        self.db.ensure_constraints()

    def create_project(self, project: Project) -> Dict[str, Any]:
        if project.eventType not in _VALID_EVENT_TYPES:
            raise ValueError("Invalid event type (must be CVI or CVPA)")

        key = f"{project.name}|{project.analystInitials}|{project.startDate}|{project.endDate}|{project.eventType}"
        project.id = str(uuid.uuid5(uuid.NAMESPACE_DNS, key))

        cypher = """
        MERGE (p:Project {id: $id})
        SET p.name = $name,
            p.analystInitials = $analystInitials,
            p.startDate = $startDate,
            p.endDate = $endDate,
            p.eventType = $eventType,
            p.archived = coalesce(p.archived, false)
        RETURN p
        """
        params = {
            "id": project.id,
            "name": project.name,
            "analystInitials": project.analystInitials,
            "startDate": project.startDate.isoformat(),
            "endDate": project.endDate.isoformat(),
            "eventType": project.eventType
        }
        result = self.db.executeQuery(cypher, params)
        return result[0]["p"] if result else {}

    def get_projects(self, include_archived: bool = False) -> List[Dict[str, Any]]:
        cypher = """
        MATCH (p:Project) 
        WHERE $inc OR coalesce(p.archived,false)=false 
        OPTIONAL MATCH (p)-[:HAS_HOST]->(h:Host)
        WITH p, count(h) as hostCount
        RETURN p, hostCount
        ORDER BY p.name
        """
        results = self.db.executeQuery(cypher, {"inc": include_archived})
        projects = []
        for r in results:
            proj = r.get("p", {})
            proj["hostCount"] = r.get("hostCount", 0)
            projects.append(proj)
        return projects

    def get_project_by_id(self, project_id: str) -> Optional[Dict[str, Any]]:
        cypher = """
        MATCH (p:Project {id:$id}) 
        OPTIONAL MATCH (p)-[:HAS_HOST]->(h:Host)
        WITH p, count(h) as hostCount
        RETURN p, hostCount
        LIMIT 1
        """
        res = self.db.executeQuery(cypher, {"id": project_id})
        if res:
            proj = res[0].get("p", {})
            proj["hostCount"] = res[0].get("hostCount", 0)
            return proj
        return None

    def update_project(self, project_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if not updates:
            return self.get_project_by_id(project_id)
        
        set_clauses = []
        params = {"id": project_id}
        
        for key, value in updates.items():
            if value is not None:
                set_clauses.append(f"p.{key} = ${key}")
                if key in ["startDate", "endDate"] and hasattr(value, "isoformat"):
                    params[key] = value.isoformat()
                else:
                    params[key] = value
        
        if not set_clauses:
            return self.get_project_by_id(project_id)
        
        cypher = f"""
        MATCH (p:Project {{id:$id}})
        SET {", ".join(set_clauses)}
        RETURN p
        """
        
        result = self.db.executeQuery(cypher, params)
        return result[0]["p"] if result else None

    def delete_project(self, project_id: str) -> bool:
        cypher = """
        MATCH (p:Project {id:$id})
        OPTIONAL MATCH (p)-[:HAS_HOST]->(h:Host)-[:RUNS]->(c:Container)
        DETACH DELETE p, h, c
        RETURN count(p) as deleted
        """
        res = self.db.executeQuery(cypher, {"id": project_id})
        return res[0]["deleted"] > 0 if res else False

    def archive_project(self, project_id: str) -> bool:
        cypher = "MATCH (p:Project {id:$id}) SET p.archived=true RETURN p"
        res = self.db.executeQuery(cypher, {"id": project_id})
        return bool(res)

    def restore_project(self, project_id: str) -> bool:
        cypher = "MATCH (p:Project {id:$id}) SET p.archived=false RETURN p"
        res = self.db.executeQuery(cypher, {"id": project_id})
        return bool(res)

    def export_project(self, project_id: str) -> str:
        cypher = """
        MATCH (p:Project {id:$id})
        OPTIONAL MATCH (p)-[:HAS_HOST]->(h:Host)
        OPTIONAL MATCH (h)-[:RUNS]->(c:Container)
        WITH p, collect(DISTINCT h) AS hosts, collect(DISTINCT c) AS containers
        RETURN {
          project: p,
          hosts: [h IN hosts | h],
          containers: [c IN containers | c]
        } AS payload
        """
        res = self.db.executeQuery(cypher, {"id": project_id})
        if not res:
            raise ValueError("Project not found")
        return json.dumps(res[0]["payload"], default=str, indent=2)

    def import_project(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        p = payload.get("project", {})
        for field in ("id", "name", "analystInitials", "startDate", "endDate", "eventType"):
            if field not in p:
                raise ValueError(f"Missing field in project payload: {field}")
        if p["eventType"] not in _VALID_EVENT_TYPES:
            raise ValueError("Invalid event type in payload")

        cy_project = """
        MERGE (p:Project {id:$id})
        SET p.name=$name,
            p.analystInitials=$analystInitials,
            p.startDate=$startDate,
            p.endDate=$endDate,
            p.eventType=$eventType,
            p.archived=coalesce($archived,false)
        RETURN p
        """
        project_params = {
            "id": p["id"],
            "name": p["name"],
            "analystInitials": p["analystInitials"],
            "startDate": p["startDate"],
            "endDate": p["endDate"],
            "eventType": p["eventType"],
            "archived": p.get("archived", False)
        }
        self.db.executeQuery(cy_project, project_params)

        hosts = payload.get("hosts", [])
        for h in hosts:
            self.add_host_to_project(p["id"], Host(ip=h.get("ip"), port=h.get("port", None)))

        containers = payload.get("containers", [])
        for c in containers:
            cont = Container(
                id=c["id"],
                name=c.get("name", c["id"]),
                image=c.get("image", ""),
                version=c.get("version"),
                hostIp=c.get("hostIp"),
                openPorts=c.get("openPorts", []),
            )
            if cont.hostIp:
                self.add_container_to_host(cont.hostIp, cont)

        return {"status": "ok", "projectId": p["id"]}

    def add_host_to_project(self, project_id: str, host: Host):
        cypher = """
        MATCH (p:Project {id:$pid})
        MERGE (h:Host {ip: toString($ip)})
          ON CREATE SET h.port = $port, h.openPorts = $openPorts
          ON MATCH  SET h.port = coalesce($port, h.port)
        MERGE (p)-[:HAS_HOST]->(h)
        RETURN p,h
        """
        params = {
            "pid": project_id, 
            "ip": str(host.ip), 
            "port": host.port, 
            "openPorts": host.openPorts if host.openPorts else []
        }
        return self.db.executeQuery(cypher, params)

    def add_container_to_host(self, host_ip: str, container: Container):
        cypher = """
        MATCH (h:Host {ip: toString($host_ip)})
        MERGE (c:Container {id:$id})
        SET c.name=$name,
            c.image=$image,
            c.version=$version,
            c.openPorts=$openPorts,
            c.hostIp=$host_ip
        MERGE (h)-[:RUNS]->(c)
        RETURN h,c
        """
        params = {
            "id": container.id,
            "name": container.name,
            "image": container.image,
            "version": container.version,
            "openPorts": container.openPorts if container.openPorts else [],
            "host_ip": str(host_ip)
        }
        return self.db.executeQuery(cypher, params)

    def get_hosts_for_project(self, project_id: str) -> List[Dict[str, Any]]:
        cypher = """
        MATCH (p:Project {id:$pid})-[:HAS_HOST]->(h:Host)
        OPTIONAL MATCH (h)-[:RUNS]->(c:Container)
        WITH h, collect(c) as containers
        RETURN h, containers
        """
        results = self.db.executeQuery(cypher, {"pid": project_id})
        hosts = []
        for r in results:
            host = r.get("h", {})
            host["containers"] = r.get("containers", [])
            hosts.append(host)
        return hosts

    def get_containers_for_host(self, host_ip: str) -> List[Dict[str, Any]]:
        cypher = """
        MATCH (h:Host {ip: toString($ip)})-[:RUNS]->(c:Container)
        RETURN c
        """
        results = self.db.executeQuery(cypher, {"ip": str(host_ip)})
        return [r.get("c", {}) for r in results]