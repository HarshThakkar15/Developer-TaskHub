import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import './portfolio.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PortfolioBuilder() {
  const { user, setUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem('portfolio_theme') || 'minimal');
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get('/projects');
      setProjects(res.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => localStorage.setItem('portfolio_theme', theme), [theme]);

  const togglePublish = async () => {
    if (!user) return toast.warn('Please login to publish.');
    setPublishing(true);
    try {
      await api.put('/users/me/publish', { publish: !user.published, theme });
      const me = await api.get('/auth/me');
      setUser(me.data);
      toast.info(me.data.published ? 'Portfolio published' : 'Portfolio unpublished');
    } catch (err) {
      console.error(err);
      toast.error('Publish failed');
    } finally {
      setPublishing(false);
    }
  };

  const copyShareLink = async () => {
    try {
      const me = await api.get('/auth/me');
      const freshUser = me.data;
      setUser(freshUser);

      if (!freshUser.slug) {
        toast.warn('Your account needs a shareable link. Please re-save your profile once.');
        return;
      }

      const url = `${window.location.origin}/u/${encodeURIComponent(freshUser.slug)}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.info('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error('Copy share link error:', err);
      toast.error('Failed to copy link. Try again.');
    }
  };

  return (
    <div
      className={theme === 'dark' ? 'portfolio-theme-dark' : 'portfolio-theme-minimal'}
      style={{ padding: 24, minHeight: '100vh' }}
    >
      {/* HEADER */}
      <div
        className="portfolio-header card"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}
      >
        <h1 className="animated-title">Portfolio Builder</h1>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <label>Theme</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="minimal">Minimal</option>
            <option value="dark">Dark</option>
          </select>

          <button className="button" onClick={togglePublish} disabled={publishing}>
            {publishing ? '...' : user?.published ? 'Unpublish' : 'Publish'}
          </button>

          <button className="button" onClick={copyShareLink}>
            {copied ? 'Copied!' : 'Copy Share Link'}
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ marginTop: 20 }}>

        {/* Summary */}
        <h2 style={{ marginBottom: 12 }}>Summary:</h2>
        <div className="card" style={{ marginBottom: 20 }}>
          {user?.bio ? <p>{user.bio}</p> : <p>No summary added.</p>}
        </div>

        {/* User Info */}
        {user && (
          <div className="card" style={{ marginBottom: 20 }}>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
            {user.location && <p><strong>Location:</strong> {user.location}</p>}
            {user.education?.college && (
              <p>
                <strong>Education:</strong> {user.education.college} (
                {user.education.startYear} - {user.education.endYear}) | CGPA: {user.education.cgpa}
              </p>
            )}
          </div>
        )}

        {/* Skills */}
        <h2 style={{ marginBottom: 12 }}>Skills:</h2>
        <div style={{ marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {user?.skills?.length > 0 ? (
            user.skills.map((skill, index) => (
              <span
                key={index}
                style={{
                  background: '#6366f1', color: 'white', padding: '6px 14px',
                  borderRadius: '20px', fontSize: '14px', fontWeight: '500',
                }}
              >
                {skill}
              </span>
            ))
          ) : (
            <p>No skills added.</p>
          )}
        </div>

        {/* Projects */}
        <h2 style={{ marginBottom: 12 }}>Projects:</h2>
        {loading ? (
          <div className="card">Loading projects...</div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 16,
              marginBottom: 60, 
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {projects.length === 0 && <div className="card">No projects yet.</div>}
            {projects.map((proj) => (
              <article key={proj._id} className="card portfolio-card animated-card">
                <div
                  className="portfolio-top"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div className="meta">
                    <h3>{proj.title}</h3>
                  </div>
                  <button
                    className="button"
                    onClick={() => navigate(`/projects/${proj._id}`)}
                    style={{
                      marginLeft: 'auto', background: '#4f46e5', color: 'white',
                      height: '40px', width: '70px', padding: '6px 12px',
                      borderRadius: '8px',
                    }}
                  >
                    View
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <div
          style={{
            textAlign: 'center', marginTop: 60,
            paddingTop: 20, borderTop: '1px solid #ddd',
          }}
        >
          <h2 style={{ marginBottom: 16 }}>Connect With Me</h2>
          <div
            style={{
              display: 'flex', justifyContent: 'center', gap: '16px',
              flexWrap: 'wrap', marginBottom: 40,
            }}
          >
            {user?.linkedin && (
              <button
                className="button"
                style={{
                  backgroundColor: '#0077b5', color: 'white', border: 'none',
                  padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                  fontSize: '16px',
                }}
                onClick={() => window.open(user.linkedin, '_blank')}
              >
                LinkedIn
              </button>
            )}
            {user?.github && (
              <button
                className="button"
                style={{
                  backgroundColor: '#24292e', color: 'white', border: 'none',
                  padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                  fontSize: '16px',
                }}
                onClick={() => window.open(user.github, '_blank')}
              >
                GitHub
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}