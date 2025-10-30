import React from 'react';
import { Edit, Trash2, Archive, ArchiveRestore, FolderOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Project } from '../types';

interface ProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onArchive: (project: Project) => void;
  onRestore?: (project: Project) => void;
  showArchived?: boolean;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onEdit,
  onDelete,
  onArchive,
  onRestore,
  showArchived = false,
}) => {
  const navigate = useNavigate();

  if (projects.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <Archive size={64} />
        </div>
        <h3>No {showArchived ? 'Archived ' : ''}Projects Found</h3>
        <p className="text-secondary">
          {showArchived
            ? 'No archived projects available'
            : 'Create your first project to get started'}
        </p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Analyst</th>
            <th>Event Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Hosts</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <tr key={project.id}>
              <td>
                <strong>{project.name}</strong>
              </td>
              <td>
                <span className="badge badge-info">{project.analystInitials}</span>
              </td>
              <td>
                <span className={`badge ${project.eventType === 'CVI' ? 'badge-success' : 'badge-warning'}`}>
                  {project.eventType}
                </span>
              </td>
              <td className="text-sm text-secondary">
                {new Date(project.startDate).toLocaleDateString()}
              </td>
              <td className="text-sm text-secondary">
                {new Date(project.endDate).toLocaleDateString()}
              </td>
              <td className="text-sm">
                {project.hostCount || 0} hosts
              </td>
              <td>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="btn btn-outline btn-sm"
                    title="View Details"
                  >
                    <FolderOpen size={16} />
                  </button>
                  
                  {!showArchived && (
                    <>
                      <button
                        onClick={() => onEdit(project)}
                        className="btn btn-outline btn-sm"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onArchive(project)}
                        className="btn btn-outline btn-sm"
                        title="Archive"
                      >
                        <Archive size={16} />
                      </button>
                    </>
                  )}
                  
                  {showArchived && onRestore && (
                    <button
                      onClick={() => onRestore(project)}
                      className="btn btn-success btn-sm"
                      title="Restore"
                    >
                      <ArchiveRestore size={16} />
                    </button>
                  )}
                  
                  <button
                    onClick={() => onDelete(project)}
                    className="btn btn-danger btn-sm"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectList;
