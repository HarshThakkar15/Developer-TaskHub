import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import KanbanBoard from './KanbanBoard';
import ProjectForm from './ProjectForm';
import ProjectEditModal from './ProjectEditModal';
import ConfirmDialog from '../UI/ConfirmDialog';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const loadProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
      if (!activeProject && res.data.length) setActiveProject(res.data[0]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreated = (proj) => {
    setProjects((prev) => [...prev, proj]);
    setActiveProject(proj);
  };

  const confirmDeleteProject = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/projects/${deleteId}`);
      setProjects((prev) => prev.filter((p) => p._id !== deleteId));
      if (activeProject?._id === deleteId) setActiveProject(projects[0] || null);
    } catch (err) {
      console.error(err);
    } finally {
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  const startEdit = (proj) => setEditing(proj);

  const onUpdated = (proj) => {
    setProjects((prev) => prev.map((p) => (p._id === proj._id ? proj : p)));
    setActiveProject(proj);
    setEditing(null);
  };

  return (
    <div className="container" style={{ paddingBottom: '40px' }}>
      <h1>Dashboard</h1>

      <ProjectForm onCreated={handleCreated} />

      {/* PROJECT GRID */}
      <div className="card" style={{ marginTop: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>Your Projects</h3>

        {projects.length === 0 ? (
          <div>No projects yet.</div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '16px',
            }}
          >
            {projects.map((p) => (
              <div
                key={p._id}
                className="card"
                style={{
                  padding: '16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: '#fff',
                }}
              >
                <div onClick={() => setActiveProject(p)} style={{ cursor: 'pointer' }}>
                  <h4 style={{ marginBottom: '8px', color: '#4f46e5' }}>{p.title}</h4>
                  {p.description && (
                    <p style={{ fontSize: '14px', color: '#6b7280' }}>
                      {p.description.length > 100
                        ? p.description.slice(0, 100) + '...'
                        : p.description}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                  <button className="button" onClick={() => startEdit(p)}>
                    Edit
                  </button>
                  <button
                    className="button"
                    style={{ backgroundColor: '#ef4444', color: '#fff' }}
                    onClick={() => confirmDeleteProject(p._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ACTIVE PROJECT TASKS */}
      {activeProject && (
        <div className="card" style={{ marginTop: 24 }}>
          <h3>{activeProject.title} - Tasks</h3>
          <KanbanBoard projects={[activeProject]} />
        </div>
      )}

      {/* EDIT MODAL */}
      {editing && (
        <ProjectEditModal
          project={editing}
          onClose={() => setEditing(null)}
          onSaved={onUpdated}
        />
      )}

      {/* DELETE CONFIRMATION */}
      {showConfirm && (
        <ConfirmDialog
          message="Are you sure you want to delete this project?"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}