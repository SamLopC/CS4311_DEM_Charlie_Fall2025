export type EventType = 'CVI' | 'CVPA';

export interface Project {
  id: string;
  name: string;
  analystInitials: string;
  startDate: string;
  endDate: string;
  eventType: EventType;
  archived: boolean;
  hostCount?: number;
  topologyMap?: Record<string, any>;
  vulnerabilityDetails?: Array<Record<string, any>>;
  exploitationDetails?: Array<Record<string, any>>;
}

export interface ProjectCreate {
  name: string;
  analystInitials: string;
  startDate: string;
  endDate: string;
  eventType: EventType;
}

export interface ProjectUpdate {
  name?: string;
  analystInitials?: string;
  startDate?: string;
  endDate?: string;
  eventType?: EventType;
}

export interface Host {
  ip: string;
  port?: number;
  openPorts: number[];
  containers?: Container[];
}

export interface Container {
  id: string;
  name: string;
  image: string;
  version?: string;
  hostIp?: string;
  openPorts: number[];
}

export interface ApiResponse<T = any> {
  message?: string;
  project?: T;
  result?: T;
  data?: T;
}
