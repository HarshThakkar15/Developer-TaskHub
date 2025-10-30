// frontend/src/components/Dashboard/ProjectForm.js
import React, { useState } from 'react';
import api from '../../api/api';
import { toast } from 'react-toastify';

export default function ProjectForm({ onCreated }) {
  const [form, setForm] = useState({ title:'', description:'', technologies:'' , repoUrl:'', liveUrl:'', status:'ongoing' });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post('/projects', {
        title: form.title,
        description: form.description,
        technologies: form.technologies.split(',').map(s=>s.trim()).filter(Boolean),
        repoUrl: form.repoUrl,
        liveUrl: form.liveUrl,
        status: form.status
      });
      onCreated(res.data);
      setForm({ title:'', description:'', technologies:'', repoUrl:'', liveUrl:'', status:'ongoing' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to save project');
    } finally { setSaving(false); }
  };

  return (
    <div className="card" style={{marginBottom:16}}>
      <h3>Create Project</h3>
      <form className="form" onSubmit={submit}>
        <input className="input" placeholder="Project Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/>
        <textarea className="input" placeholder="Short Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={3} required/>
        <input className="input" placeholder="Tech Stack used (comma separated)" value={form.technologies} onChange={e=>setForm({...form,technologies:e.target.value})}/>
        <input className="input" placeholder="GitHub repo URL" value={form.repoUrl} onChange={e=>setForm({...form,repoUrl:e.target.value})}/>
        <input className="input" placeholder="Deployed site URL" value={form.liveUrl} onChange={e=>setForm({...form,liveUrl:e.target.value})}/>
        <div style={{display:'flex', gap:8}}>
          <select className="input" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <button className="button" type="submit" disabled={saving}>{saving? 'Saving...':'Create Project'}</button>
      </form>
    </div>
  );
}