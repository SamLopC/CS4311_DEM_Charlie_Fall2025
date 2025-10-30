import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import ProjectList from '../components/ProjectList';
import ProjectForm from '../components/ProjectForm';
import { projectApi } from '../services/api';
import type { Project, ProjectCreate } from '../types';

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectApi.getAll(false);
      setProjects(data);
    } catch (error: any) {
      showMessage('error', 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleCreate = async (projectData: ProjectCreate) => {
    try {
      await projectApi.create(projectData);
      showMessage('success', 'Project created successfully');
      setShowForm(false);
      loadProjects();
    } catch (error: any) {
      throw error;
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleUpdate = async (projectData: ProjectCreate) => {
    if (!editingProject) return;

    try {
      await projectApi.update(editingProject.id, projectData);
      showMessage('success', 'Project updated successfully');
      setShowForm(false);
      setEditingProject(null);
      loadProjects();
    } catch (error: any) {
      throw error;
    }
  };

  const handleDelete = async (project: Project) => {
    if (!confirm(`Are you sure you want to delete "${project.name}"? This cannot be undone.`)) {
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

  const handleArchive = async (project: Project) => {
    if (!confirm(`Archive "${project.name}"?`)) {
      return;
    }

    try {
      await projectApi.archive(project.id);
      showMessage('success', 'Project archived successfully');
      loadProjects();
    } catch (error: any) {
      showMessage('error', 'Failed to archive project');
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Active Projects</h1>
          <p className="text-secondary">Manage your cybersecurity assessment projects</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={loadProjects}
            className="btn btn-outline"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'loading' : ''} />
            Refresh
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            <Plus size={16} />
            New Project
          </button>
        </div>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="loading" style={{ width: '2rem', height: '2rem', margin: '0 auto' }} />
          <p className="text-secondary" style={{ marginTop: '1rem' }}>Loading projects...</p>
        </div>
      ) : (
        <ProjectList
          projects={projects}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onArchive={handleArchive}
        />
      )}

      {showForm && (
        <ProjectForm
          onSubmit={editingProject ? handleUpdate : handleCreate}
          onCancel={handleCloseForm}
          initialData={editingProject ? {
            name: editingProject.name,
            analystInitials: editingProject.analystInitials,
            startDate: editingProject.startDate,
            endDate: editingProject.endDate,
            eventType: editingProject.eventType,
          } : undefined}
        />
      )}
    </div>
  );
};

export default ProjectsPage;
