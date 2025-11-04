import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const openLink = (url) => window.open(url, '_blank');
  const navigate = useNavigate();

  return (
    <div className="container" style={{ textAlign: 'center' }}>
      <div className="card" style={{ marginTop: '50px', padding: '30px' }}>
        <h1>Welcome to Developer TaskHub</h1>
        <p>Manage projects, track tasks, and export your developer portfolio.</p>
      </div>

      <button
        className="button"
        onClick={() => navigate('/dashboard')}
        style={{
          display: 'block',
          margin: '40px auto',
          width: '250px',
          height: '60px',
          fontSize: '18px',
        }}
      >
        Go to Dashboard
      </button>

      {/* Footer Section */}
      <footer
        style={{
          marginTop: '150px',
          padding: '20px',
          textAlign: 'center',
          color: '#555',
          borderTop: '1px solid #ddd',
        }}
      >
        <div style={{ fontSize: '16px', marginBottom: '10px' }}>
          Developed <strong>Harsh Thakkar</strong>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            className="button"
            style={{
              backgroundColor: '#0077b5',
              color: 'white',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
            onClick={() => openLink('https://www.linkedin.com/in/harsh-thakkar1508/')}
          >
            LinkedIn
          </button>

          <button
            className="button"
            style={{
              backgroundColor: '#24292e',
              color: 'white',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
            onClick={() => openLink('https://github.com/HarshThakkar15')}
          >
            GitHub
          </button>

          <a
            href="mailto:thakkarharsh1508@gmail.com"
            style={{
              display: 'inline-block',
              backgroundColor: '#10b981',
              color: 'white',
              padding: '8px 14px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500',
            }}
          >
            Email Me
          </a>
        </div>
      </footer>
    </div>
  );
}