from fastapi import APIRouter, HTTPException, status
from typing import List
from models.Project import Project, ProjectCreate, ProjectUpdate, ProjectResponse, Host, Container
from services.ProjectService import ProjectService

router = APIRouter(prefix="/api/projects", tags=["projects"])
service = ProjectService()

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_project(project_data: ProjectCreate):
    """Create a new project"""
    try:
        project = Project(**project_data.model_dump())
        result = service.create_project(project)
        return {"message": "Project created successfully", "project": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create project: {str(e)}")

@router.get("", response_model=List[dict])
async def get_projects(include_archived: bool = False):
    """Get all projects"""
    try:
        projects = service.get_projects(include_archived)
        return projects
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch projects: {str(e)}")

@router.get("/{project_id}", response_model=dict)
async def get_project(project_id: str):
    """Get a specific project by ID"""
    try:
        project = service.get_project_by_id(project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        return project
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch project: {str(e)}")

@router.put("/{project_id}", response_model=dict)
async def update_project(project_id: str, updates: ProjectUpdate):
    """Update a project"""
    try:
        update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
        result = service.update_project(project_id, update_data)
        if not result:
            raise HTTPException(status_code=404, detail="Project not found")
        return {"message": "Project updated successfully", "project": result}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update project: {str(e)}")

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(project_id: str):
    """Delete a project"""
    try:
        success = service.delete_project(project_id)
        if not success:
            raise HTTPException(status_code=404, detail="Project not found")
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete project: {str(e)}")

@router.post("/{project_id}/archive", response_model=dict)
async def archive_project(project_id: str):
    """Archive a project"""
    try:
        success = service.archive_project(project_id)
        if not success:
            raise HTTPException(status_code=404, detail="Project not found")
        return {"message": "Project archived successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to archive project: {str(e)}")

@router.post("/{project_id}/restore", response_model=dict)
async def restore_project(project_id: str):
    """Restore an archived project"""
    try:
        success = service.restore_project(project_id)
        if not success:
            raise HTTPException(status_code=404, detail="Project not found")
        return {"message": "Project restored successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to restore project: {str(e)}")

@router.get("/{project_id}/export", response_model=dict)
async def export_project(project_id: str):
    """Export a project as JSON"""
    try:
        json_data = service.export_project(project_id)
        return {"data": json_data}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to export project: {str(e)}")

@router.post("/import", response_model=dict)
async def import_project(payload: dict):
    """Import a project from JSON"""
    try:
        result = service.import_project(payload)
        return {"message": "Project imported successfully", "result": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to import project: {str(e)}")

@router.post("/{project_id}/hosts", response_model=dict)
async def add_host(project_id: str, host: Host):
    """Add a host to a project"""
    try:
        result = service.add_host_to_project(project_id, host)
        return {"message": "Host added successfully", "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add host: {str(e)}")

@router.get("/{project_id}/hosts", response_model=List[dict])
async def get_hosts(project_id: str):
    """Get all hosts for a project"""
    try:
        hosts = service.get_hosts_for_project(project_id)
        return hosts
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch hosts: {str(e)}")

@router.post("/hosts/{host_ip}/containers", response_model=dict)
async def add_container(host_ip: str, container: Container):
    """Add a container to a host"""
    try:
        result = service.add_container_to_host(host_ip, container)
        return {"message": "Container added successfully", "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add container: {str(e)}")

@router.get("/hosts/{host_ip}/containers", response_model=List[dict])
async def get_containers(host_ip: str):
    """Get all containers for a host"""
    try:
        containers = service.get_containers_for_host(host_ip)
        return containers
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch containers: {str(e)}")
