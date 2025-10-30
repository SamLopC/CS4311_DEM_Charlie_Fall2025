import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Server, Box, Plus, Download } from 'lucide-react';
import { projectApi } from '../services/api';
import type { Project, Host } from '../types';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (id) {
      loadProject();
      loadHosts();
    }
  }, [id]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const data = await projectApi.getById(id!);
      setProject(data);
    } catch (error: any) {
      showMessage('error', 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const loadHosts = async () => {
    try {
      const data = await projectApi.getHosts(id!);
      setHosts(data);
    } catch (error: any) {
      console.error('Failed to load hosts:', error);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleExport = async () => {
    try {
      const jsonData = await projectApi.export(id!);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project?.name || 'project'}_export.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showMessage('success', 'Project exported successfully');
    } catch (error: any) {
      showMessage('error', 'Failed to export project');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="loading" style={{ width: '2rem', height: '2rem', margin: '0 auto' }} />
        <p className="text-secondary" style={{ marginTop: '1rem' }}>Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="empty-state">
        <h3>Project Not Found</h3>
        <button onClick={() => navigate('/')} className="btn btn-primary mt-4">
          <ArrowLeft size={16} />
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => navigate('/')} className="btn btn-outline mb-4">
        <ArrowLeft size={16} />
        Back to Projects
      </button>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
          <div>
            <h1>{project.name}</h1>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <span className="badge badge-info">{project.analystInitials}</span>
              <span className={`badge ${project.eventType === 'CVI' ? 'badge-success' : 'badge-warning'}`}>
                {project.eventType}
              </span>
              {project.archived && <span className="badge badge-warning">ARCHIVED</span>}
            </div>
          </div>
          <button onClick={handleExport} className="btn btn-outline">
            <Download size={16} />
            Export
          </button>
        </div>

        <div className="grid grid-cols-2">
          <div>
            <p className="text-sm text-secondary">Start Date</p>
            <p><strong>{new Date(project.startDate).toLocaleDateString()}</strong></p>
          </div>
          <div>
            <p className="text-sm text-secondary">End Date</p>
            <p><strong>{new Date(project.endDate).toLocaleDateString()}</strong></p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>
              <Server size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem' }} />
              Hosts ({hosts.length})
            </h2>
            <button className="btn btn-primary btn-sm">
              <Plus size={16} />
              Add Host
            </button>
          </div>
        </div>

        {hosts.length === 0 ? (
          <div className="empty-state">
            <p className="text-secondary">No hosts added yet</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>IP Address</th>
                <th>Port</th>
                <th>Open Ports</th>
                <th>Containers</th>
              </tr>
            </thead>
            <tbody>
              {hosts.map((host, idx) => (
                <tr key={idx}>
                  <td><code>{host.ip}</code></td>
                  <td>{host.port || '-'}</td>
                  <td>
                    {host.openPorts && host.openPorts.length > 0
                      ? host.openPorts.join(', ')
                      : 'None'}
                  </td>
                  <td>
                    <span className="badge badge-info">
                      <Box size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.25rem' }} />
                      {host.containers?.length || 0}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailPage;
