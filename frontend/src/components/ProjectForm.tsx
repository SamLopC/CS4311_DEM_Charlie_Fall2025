import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { ProjectCreate, EventType } from '../types';

interface ProjectFormProps {
  onSubmit: (project: ProjectCreate) => Promise<void>;
  onCancel: () => void;
  initialData?: ProjectCreate;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState<ProjectCreate>(
    initialData || {
      name: '',
      analystInitials: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      eventType: 'CVI',
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Project name is required');
      return;
    }
    if (!formData.analystInitials.trim()) {
      setError('Analyst initials are required');
      return;
    }
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError('End date must be after start date');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initialData ? 'Edit Project' : 'Create New Project'}</h2>
          <button
            onClick={onCancel}
            className="btn btn-outline btn-sm"
            style={{ padding: '0.25rem' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Project Name *</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter project name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Analyst Initials *</label>
              <input
                type="text"
                name="analystInitials"
                className="form-control"
                value={formData.analystInitials}
                onChange={handleChange}
                required
                maxLength={10}
                placeholder="e.g., JD"
              />
            </div>

            <div className="grid grid-cols-2">
              <div className="form-group">
                <label className="form-label">Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  className="form-control"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Date *</label>
                <input
                  type="date"
                  name="endDate"
                  className="form-control"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Event Type *</label>
              <select
                name="eventType"
                className="form-control"
                value={formData.eventType}
                onChange={handleChange}
                required
              >
                <option value="CVI">CVI - Cyber Vulnerability Investigation</option>
                <option value="CVPA">CVPA - Cyber Vulnerability Penetration Assessment</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-outline"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading" />
                  Saving...
                </>
              ) : (
                initialData ? 'Update Project' : 'Create Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
