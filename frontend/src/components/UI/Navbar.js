// frontend/src/components/UI/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
export default function Navbar(){
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
 width: '55px',
 height: '55px',
 borderRadius: '50%', // Makes it a circle
 objectFit: 'cover',
 border: '3px solid #ffffff', 
 color:'white',
boxShadow: '8px 8px 8px rgba(0, 0, 0, 0.8)', 
position: 'relative',
zIndex: 100
 }}
/>
 </Link>
 <button className="button" onClick={logout} style={{padding: '15px 15px', borderRadius:'30%', border:'solid', boxShadow: '8px 8px 8px rgba(0, 0, 0, 0.8)', 
zIndex: 100}}>Logout</button>
 </>
) : (
 <>
 <Link to="/login" className="nav-link" style={{padding: '15px 15px', borderRadius:'30%', border:'solid', color:'white', boxShadow: '8px 8px 8px rgba(0, 0, 0, 0.8)', 
zIndex: 100}}>Login</Link>
 <Link to="/signup" className="nav-link" style={{padding: '13px 15px', borderRadius:'30%', border:'solid', color:'white', boxShadow: '8px 8px 8px rgba(0, 0, 0, 0.8)', 
zIndex: 100}}>Signup</Link>
 </>
 )}
</div>
        </nav>
    );
}