from __future__ import annotations
from typing import List, Optional, Literal, Dict, Any
from datetime import date
from pydantic import BaseModel, Field, field_validator

EventType = Literal["CVI", "CVPA"]

class Host(BaseModel):
    ip: str
    port: Optional[int] = Field(default=None, ge=1, le=65535)
    openPorts: List[int] = Field(default_factory=list)

class Container(BaseModel):
    id: str
    name: str
    image: str
    version: Optional[str] = None
    hostIp: Optional[str] = None
    openPorts: List[int] = Field(default_factory=list)

class Project(BaseModel):
    id: Optional[str] = Field(default=None)
    name: str = Field(min_length=1)
    analystInitials: str = Field(min_length=1, max_length=10)
    startDate: date
    endDate: date
    eventType: EventType
    archived: bool = False
    topologyMap: Dict[str, Any] = Field(default_factory=dict)
    vulnerabilityDetails: List[Dict[str, Any]] = Field(default_factory=list)
    exploitationDetails: List[Dict[str, Any]] = Field(default_factory=list)

    @field_validator("endDate")
    @classmethod
    def _end_after_start(cls, v: date, info):
        start: date = info.data.get("startDate")
        if start and v < start:
            raise ValueError("endDate must be on or after startDate")
        return v

class ProjectCreate(BaseModel):
    name: str = Field(min_length=1)
    analystInitials: str = Field(min_length=1, max_length=10)
    startDate: date
    endDate: date
    eventType: EventType

class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1)
    analystInitials: Optional[str] = Field(default=None, min_length=1, max_length=10)
    startDate: Optional[date] = None
    endDate: Optional[date] = None
    eventType: Optional[EventType] = None

class ProjectResponse(BaseModel):
    id: str
    name: str
    analystInitials: str
    startDate: str
    endDate: str
    eventType: str
    archived: bool
    hostCount: int = 0
