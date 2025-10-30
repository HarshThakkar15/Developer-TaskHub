// frontend/src/pages/PublicPortfolio.js
import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useParams, useNavigate } from 'react-router-dom';
import '../components/Portfolio/portfolio.css';

export default function PublicPortfolio() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState('minimal');
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/users/public/${username}`);
        setData(res.data);
        setTheme(res.data.user?.theme || 'minimal');
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Could not load portfolio');
      }
    })();
  }, [username]);

  useEffect(() => {
    document.body.classList.remove('portfolio-dark', 'portfolio-minimal');
    document.documentElement.classList.remove('portfolio-dark', 'portfolio-minimal');

    if (theme === 'dark') {
      document.body.classList.add('portfolio-dark');
      document.documentElement.classList.add('portfolio-dark');
    } else {
      document.body.classList.add('portfolio-minimal');
      document.documentElement.classList.add('portfolio-minimal');
    }

    return () => {
      document.body.classList.remove('portfolio-dark', 'portfolio-minimal');
      document.documentElement.classList.remove('portfolio-dark', 'portfolio-minimal');
    };
  }, [theme]);

  if (error)
    return (
      <div className="container">
        <div className="card">{error}</div>
      </div>
    );

  if (!data)
    return (
      <div className="container">
        <div className="card">Loading...</div>
      </div>
    );

  const { user, projects } = data;

  return (
    <div
      className={theme === 'dark' ? 'portfolio-theme-dark' : 'portfolio-theme-minimal'}
      style={{ padding: 24, minHeight: '100vh' }}
    >
      {/* USER INFO */}
      <div
        className="card"
        style={{
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
        }}
      ><h1>{user.name}</h1>
          </div>
      <div
        className="card"
        style={{
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginBottom: 20,
        }}
      >
        <div style={{ flex: 1 }}>
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
      </div>

      {/* SUMMARY */}
      <h2 style={{ marginBottom: 12 }}>Summary:</h2>
      <div className="card" style={{ marginBottom: 20 }}>
        {user?.bio ? <p>{user.bio}</p> : <p>No summary added.</p>}
      </div>

      {/* SKILLS */}
      <h2 style={{ marginBottom: 12 }}>Skills:</h2>
      <div
        style={{
          marginBottom: 20,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        {user?.skills?.length > 0 ? (
          user.skills.map((skill, index) => (
            <span
              key={index}
              style={{
                background: '#6366f1',
                color: 'white',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              {skill}
            </span>
          ))
        ) : (
          <p>No skills added.</p>
        )}
      </div>

      {/* PROJECTS */}
      <h2 style={{ marginBottom: 12 }}>Projects:</h2>
      {projects.length === 0 ? (
        <div className="card">No projects yet.</div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(500px,1fr))',
            gap: 16,
          }}
        >
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
                    marginLeft: 'auto',
                    background: '#4f46e5',
                    color: 'white',
                    height: '40px',
                    width: '70px',
                    padding: '6px 12px',
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

      {/* CONNECT LINKS */}
      <div
        style={{
          textAlign: 'center',
          marginTop: 60,
          paddingTop: 20,
          borderTop: '1px solid #ddd',
        }}
      >
        <h2 style={{ marginBottom: 16 }}>Connect With Me</h2>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            marginBottom: 40,
          }}
        >
          {user?.linkedin && (
            <button
              className="button"
              style={{
                backgroundColor: '#0077b5',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
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
                backgroundColor: '#24292e',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
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
  );
}