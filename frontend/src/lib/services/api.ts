import axios from 'axios';
import type { Project, ProjectCreate, ProjectUpdate, Host, Container, ApiResponse } from '$lib/types';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const projectApi = {
  getAll: async (includeArchived = false): Promise<Project[]> => {
    const response = await api.get<Project[]>('/api/projects', {
      params: { include_archived: includeArchived },
    });
    return response.data;
  },

  getById: async (id: string): Promise<Project> => {
    const response = await api.get<Project>(`/api/projects/${id}`);
    return response.data;
  },

  create: async (project: ProjectCreate): Promise<ApiResponse<Project>> => {
    const response = await api.post<ApiResponse<Project>>('/api/projects', project);
    return response.data;
  },

  update: async (id: string, updates: ProjectUpdate): Promise<ApiResponse<Project>> => {
    const response = await api.put<ApiResponse<Project>>(`/api/projects/${id}`, updates);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/projects/${id}`);
  },

  archive: async (id: string): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>(`/api/projects/${id}/archive`);
    return response.data;
  },

  restore: async (id: string): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>(`/api/projects/${id}/restore`);
    return response.data;
  },

  export: async (id: string): Promise<string> => {
    const response = await api.get<ApiResponse<string>>(`/api/projects/${id}/export`);
    return response.data.data || '';
  },

  import: async (payload: any): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>('/api/projects/import', payload);
    return response.data;
  },

  addHost: async (projectId: string, host: Host): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>(`/api/projects/${projectId}/hosts`, host);
    return response.data;
  },

  getHosts: async (projectId: string): Promise<Host[]> => {
    const response = await api.get<Host[]>(`/api/projects/${projectId}/hosts`);
    return response.data;
  },

  addContainer: async (hostIp: string, container: Container): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>(`/api/projects/hosts/${hostIp}/containers`, container);
    return response.data;
  },

  getContainers: async (hostIp: string): Promise<Container[]> => {
    const response = await api.get<Container[]>(`/api/projects/hosts/${hostIp}/containers`);
    return response.data;
  },
};
