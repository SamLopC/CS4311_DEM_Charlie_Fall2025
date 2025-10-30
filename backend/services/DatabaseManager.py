from __future__ import annotations
import os
import logging
from typing import Any, Dict, List, Optional

from neo4j import GraphDatabase, Driver, Session, Transaction
from neo4j.exceptions import ServiceUnavailable, Neo4jError

logger = logging.getLogger("db")
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(message)s")
    handler.setFormatter(formatter)
    logger.addHandler(handler)
logger.setLevel(logging.INFO)

class DatabaseManager:
    _driver: Optional[Driver] = None

    def __init__(
        self,
        uri: Optional[str] = None,
        user: Optional[str] = None,
        password: Optional[str] = None,
        database: Optional[str] = None,
    ):
        self.uri = uri or os.getenv("NEO4J_URI")
        self.user = user or os.getenv("NEO4J_USERNAME")
        self.password = password or os.getenv("NEO4J_PASSWORD")
        self.database = database or os.getenv("NEO4J_DATABASE", "neo4j")

        if DatabaseManager._driver is None:
            logger.info(f"Connecting to Neo4j at {self.uri} (db={self.database})")
            DatabaseManager._driver = GraphDatabase.driver(
                self.uri,
                auth=(self.user, self.password),
                max_connection_lifetime=3600,
                max_connection_pool_size=50,
                connection_timeout=15,
                keep_alive=True,
            )

        self._driver = DatabaseManager._driver

    def close(self) -> None:
        if self._driver is not None:
            logger.info("Closing Neo4j driver")
            self._driver.close()
            DatabaseManager._driver = None

    def executeQuery(self, cypher: str, params: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        params = params or {}
        mode = self._infer_mode(cypher)
        if mode == "read":
            return self._run_with_retry(self._execute_read, cypher, params)
        return self._run_with_retry(self._execute_write, cypher, params)

    def executeRead(self, cypher: str, params: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        return self._run_with_retry(self._execute_read, cypher, params or {})

    def executeWrite(self, cypher: str, params: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        return self._run_with_retry(self._execute_write, cypher, params or {})

    def ensure_constraints(self) -> None:
        statements = [
            "CREATE CONSTRAINT project_id IF NOT EXISTS FOR (p:Project) REQUIRE p.id IS UNIQUE",
            "CREATE CONSTRAINT host_ip IF NOT EXISTS FOR (h:Host) REQUIRE h.ip IS UNIQUE",
            "CREATE CONSTRAINT container_id IF NOT EXISTS FOR (c:Container) REQUIRE c.id IS UNIQUE",
        ]
        for s in statements:
            try:
                self.executeWrite(s)
            except Exception as e:
                logger.warning(f"Constraint creation warning: {e}")

    def _session(self) -> Session:
        assert self._driver is not None, "Neo4j driver not initialized"
        return self._driver.session(database=self.database)

    @staticmethod
    def _infer_mode(cypher: str) -> str:
        first = cypher.strip().split(None, 1)[0].upper() if cypher.strip() else ""
        if first in {"MATCH", "OPTIONAL", "WITH", "UNWIND", "CALL"} and "CREATE" not in cypher.upper() \
           and "MERGE" not in cypher.upper() and "SET" not in cypher.upper() and "DELETE" not in cypher.upper():
            return "read"
        return "write"

    def _run_with_retry(self, fn, cypher: str, params: Dict[str, Any], retries: int = 2) -> List[Dict[str, Any]]:
        last_err: Optional[Exception] = None
        for attempt in range(retries + 1):
            try:
                return fn(cypher, params)
            except (ServiceUnavailable, Neo4jError) as e:
                last_err = e
                msg = getattr(e, "code", "") or str(e)
                if "TransientError" in msg and attempt < retries:
                    logger.warning(f"Transient error on attempt {attempt+1}, retrying... ({msg})")
                    continue
                logger.error(f"Neo4j error: {msg}")
                break
        if last_err:
            raise last_err
        return []

    def _execute_read(self, cypher: str, params: Dict[str, Any]) -> List[Dict[str, Any]]:
        with self._session() as session:
            return session.execute_read(lambda tx: self._tx_run(tx, cypher, params))

    def _execute_write(self, cypher: str, params: Dict[str, Any]) -> List[Dict[str, Any]]:
        with self._session() as session:
            return session.execute_write(lambda tx: self._tx_run(tx, cypher, params))

    def _tx_run(self, tx: Transaction, cypher: str, params: Dict[str, Any]) -> List[Dict[str, Any]]:
        result = tx.run(cypher, **params)
        rows: List[Dict[str, Any]] = []
        keys = result.keys()
        for record in result:
            row: Dict[str, Any] = {}
            for key in keys:
                row[key] = self._value_to_py(record.get(key))
            rows.append(row)
        return rows

    def _value_to_py(self, v: Any) -> Any:
        from neo4j.graph import Node, Relationship, Path

        if isinstance(v, Node):
            return {
                "_id": v.id,
                "_labels": list(v.labels),
                **{k: self._value_to_py(v[k]) for k in v.keys()},
            }
        if isinstance(v, Relationship):
            return {
                "_id": v.id,
                "_type": v.type,
                "start": v.start_node.id,
                "end": v.end_node.id,
                **{k: self._value_to_py(v[k]) for k in v.keys()},
            }
        if isinstance(v, Path):
            return {
                "nodes": [self._value_to_py(n) for n in v.nodes],
                "relationships": [self._value_to_py(r) for r in v.relationships],
            }
        if isinstance(v, dict):
            return {k: self._value_to_py(val) for k, val in v.items()}
        if isinstance(v, (list, tuple, set)):
            return [self._value_to_py(i) for i in v]
        return v
