import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FolderKanban, Archive } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        boxShadow: '0 1px 3px var(--shadow)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link to="/" style={{
              textDecoration: 'none',
              color: 'var(--text)',
              fontSize: '1.25rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <FolderKanban size={24} />
              SUBSYSTEM
            </Link>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link
                to="/"
                className={`btn btn-sm ${isActive('/') ? 'btn-primary' : 'btn-outline'}`}
              >
                <FolderKanban size={16} />
                Projects
              </Link>
              <Link
                to="/archived"
                className={`btn btn-sm ${isActive('/archived') ? 'btn-primary' : 'btn-outline'}`}
              >
                <Archive size={16} />
                Archived
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main style={{
        flex: 1,
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: '2rem 1.5rem'
      }}>
        {children}
      </main>

      <footer style={{
        backgroundColor: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        padding: '1.5rem',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        fontSize: '0.875rem'
      }}>
        <p>Cybersecurity Assessment Platform</p>
      </footer>
    </div>
  );
};

export default Layout;
