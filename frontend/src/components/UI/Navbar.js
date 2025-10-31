// frontend/src/components/UI/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="brand">Developer TaskHub</Link>
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/portfolio" className="nav-link">Portfolio</Link>
      </div>

      <div className="nav-right" style={{ display: 'flex', alignItems: 'center' }}>
        {user ? (
          <>
            <Link to="/profile" className="user-avatar-link">
              <img
                className="avatar"
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`}
                alt="user avatar"
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3.1px solid #fff',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                }}
              />
            </Link>
            <button
              className="nav-button logout-btn"
              onClick={logout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-button" style={{border: '1.8px solid'}}>Login</Link>
            <Link to="/signup" className="nav-button" style={{border: '1.8px solid'}}>Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}