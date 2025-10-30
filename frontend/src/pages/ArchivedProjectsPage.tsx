import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import ProjectList from '../components/ProjectList';
import { projectApi } from '../services/api';
import type { Project } from '../types';

const ArchivedProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectApi.getAll(true);
      const archived = data.filter(p => p.archived);
      setProjects(archived);
    } catch (error: any) {
      showMessage('error', 'Failed to load archived projects');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleRestore = async (project: Project) => {
    if (!confirm(`Restore "${project.name}" to active projects?`)) {
      return;
    }

    try {
      await projectApi.restore(project.id);
      showMessage('success', 'Project restored successfully');
      loadProjects();
    } catch (error: any) {
      showMessage('error', 'Failed to restore project');
    }
  };

  const handleDelete = async (project: Project) => {
    if (!confirm(`Are you sure you want to permanently delete "${project.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      await projectApi.delete(project.id);
      showMessage('success', 'Project deleted successfully');
      loadProjects();
    } catch (error: any) {
      showMessage('error', 'Failed to delete project');
    }
  };

  const handleArchive = async () => {
    // This shouldn't be called for archived projects
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Archived Projects</h1>
          <p className="text-secondary">View and manage archived projects</p>
        </div>
        <button
          onClick={loadProjects}
          className="btn btn-outline"
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? 'loading' : ''} />
          Refresh
        </button>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="loading" style={{ width: '2rem', height: '2rem', margin: '0 auto' }} />
          <p className="text-secondary" style={{ marginTop: '1rem' }}>Loading archived projects...</p>
        </div>
      ) : (
        <ProjectList
          projects={projects}
          onEdit={() => {}}
          onDelete={handleDelete}
          onArchive={handleArchive}
          onRestore={handleRestore}
          showArchived={true}
        />
      )}
    </div>
  );
};

export default ArchivedProjectsPage;
