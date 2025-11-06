// frontend/src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: '', bio: '', skills: '', github: '', linkedin: '', phone: '', location: '',
    college: '', startYear: '', endYear: '', cgpa: ''
  });
  const [saving, setSaving] = useState(false);
const openLink = (url) => window.open(url, '_blank');

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || '',
      bio: user.bio || '',
      skills: (user.skills || []).join(', '),
      github: user.github || '',
      linkedin: user.linkedin || '',
      phone: user.phone || '',
      location: user.location || '',
      college: user.education?.college || '',
      startYear: user.education?.startYear || '',
      endYear: user.education?.endYear || '',
      cgpa: user.education?.cgpa || ''
    });
  }, [user]);

  const save = async () => {
    if (form.phone && !/^\d{10}$/.test(form.phone)) {
    toast.error('Please enter a valid 10-digit phone number');
    return;
  }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        bio: form.bio,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        github: form.github,
        linkedin: form.linkedin,
        phone: form.phone,
        location: form.location,
        education: {
          college: form.college,
          startYear: form.startYear,
          endYear: form.endYear,
          cgpa: form.cgpa
        }
      };

      await api.put('/users/me', payload);
      const me = await api.get('/auth/me');
      setUser(me.data);
      toast.success('Profile saved successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (!user)
    return (
      <div className="container">
        <div className="card">Please login.</div>
      </div>
    );

  return (
    <div className="container">
      <div className="card" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ minWidth: 140 }}>
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: 12,
                overflow: 'hidden',
                background: '#eef2ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`}
                alt="avatar"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 8, alignItems: 'center' }}>
              <label>Name</label>
              <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />

              <label>Email</label>
              <div style={{ padding: 8 }}>{user.email}</div>

              <label>Short summary</label>
              <textarea className="input" rows={3} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />

              <label>Skills (comma separated)</label>
              <input className="input" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} />

              <label>GitHub URL</label>
              <input className="input" value={form.github} onChange={e => setForm({ ...form, github: e.target.value })} />

              <label>LinkedIn URL</label>
              <input className="input" value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} />

              <label>Phone</label>
              <input className="input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />

              <label>Location</label>
              <input className="input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />

              <label>College name</label>
              <input className="input" value={form.college} onChange={e => setForm({ ...form, college: e.target.value })} />

              <label>Start year</label>
              <input className="input" value={form.startYear} onChange={e => setForm({ ...form, startYear: e.target.value })} placeholder="e.g. 2020" />

              <label>End year</label>
              <input className="input" value={form.endYear} onChange={e => setForm({ ...form, endYear: e.target.value })} placeholder="e.g. 2024" />

              <label>CGPA</label>
              <input className="input" value={form.cgpa} onChange={e => setForm({ ...form, cgpa: e.target.value })} placeholder="e.g. 8.7" />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
          <button className="button" onClick={save} disabled={saving} style={{
              width: '200px',
              height: '45px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>

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
          Developed by <strong>Harsh Thakkar</strong>
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

          <button
            className="button"
            style={{
              backgroundColor: '#b95b42ff',
              color: 'white',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
            onClick={() => openLink('https://developer-taskhub.onrender.com/u/harsh-thakkar-uo87')}
          >
            Portfolio
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
    </div>
  );
}