import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProjectsPage from './pages/ProjectsPage';
import ArchivedProjectsPage from './pages/ArchivedProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import './styles/index.css';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<ProjectsPage />} />
          <Route path="/archived" element={<ArchivedProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
