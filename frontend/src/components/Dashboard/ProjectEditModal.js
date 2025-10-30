// frontend/src/components/Dashboard/ProjectEditModal.js
import React, { useState } from 'react';
import api from '../../api/api';
import { toast } from 'react-toastify';

export default function ProjectEditModal({ project, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: project.title || '',
    description: project.description || '',
    technologies: (project.tags || []).join(', '),
    repoUrl: project.repoUrl || '',
    liveUrl: project.liveUrl || '',
    status: project.status || 'ongoing'
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const res = await api.put(`/projects/${project._id}`, {
        title: form.title && 'undefined' ? form.title : 'Untitled Project',
        description: form.description,
        tags: form.technologies.split(',').map(s=>s.trim()).filter(Boolean),
        repoUrl: form.repoUrl,
        liveUrl: form.liveUrl,
        status: form.status
      });
      onSaved(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Update failed');
    } finally { setSaving(false); }
  };

  return (
    <div style={{
      position:'fixed', left:0, top:0, right:0, bottom:0, display:'flex', alignItems:'center', justifyContent:'center',
      background:'rgba(0,0,0,0.4)', zIndex:2000
    }}>
      <div className="card" style={{width:600, maxWidth:'95%'}}>
        <h3>Edit Project</h3>
        <input className="input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/>
        <textarea className="input" rows={4} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
        <input className="input" placeholder="Technologies" value={form.technologies} onChange={e=>setForm({...form,technologies:e.target.value})}/>
        <input className="input" placeholder="GitHub repo URL" value={form.repoUrl} onChange={e=>setForm({...form,repoUrl:e.target.value})}/>
        <input className="input" placeholder="Deployed site URL" value={form.liveUrl} onChange={e=>setForm({...form,liveUrl:e.target.value})}/>
        <div style={{display:'flex', gap:8, marginTop:8, justifyContent:'flex-end'}}>
          <button className="button" onClick={onClose}>Cancel</button>
          <button className="button" onClick={save} disabled={saving}>{saving? 'Saving...':'Save'}</button>
        </div>
      </div>
    </div>
  );
}