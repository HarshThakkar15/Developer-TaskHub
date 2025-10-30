// frontend/src/components/Dashboard/TaskModal.js
import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { confirmDialog } from '../../utils/dialogs';
import { toast } from 'react-toastify';

export default function TaskModal({ mode='add', projectId, task=null, onClose, onSaved, onDeleted }) {
  const [form, setForm] = useState({ title:'', description:'' });
  const [saving, setSaving] = useState(false);

  useEffect(()=> {
    if (mode === 'edit' && task) {
      setForm({ title: task.title || '', description: task.description || '' });
    } else {
      setForm({ title:'', description:'' });
    }
  }, [mode, task]);

  const save = async () => {
    if (!form.title) return toast.error('Title required');
    setSaving(true);
    try {
      if (mode === 'add') {
        const res = await api.post('/tasks', { title: form.title, description: form.description, project: projectId });
        onSaved(res.data);
      } else {
        const res = await api.put(`/tasks/${task._id}`, { title: form.title, description: form.description });
        onSaved(res.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Save failed');
    } finally { setSaving(false); }
  };

  const del = async () => {
    // eslint-disable-next-line no-restricted-globals
if (!confirmDialog('Delete task?')) return;
try {
      await api.delete(`/tasks/${task._id}`);
      onDeleted(task._id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{position:'fixed', left:0, top:0, right:0, bottom:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.4)', zIndex:3000}}>
      <div className="card" style={{width:560, maxWidth:'95%'}}>
        <h3>{mode === 'add' ? 'Add Task' : 'Edit Task'}</h3>
        <input className="input" value={form.title} placeholder="Task title" onChange={e=>setForm({...form,title:e.target.value})}/>
        <textarea className="input" value={form.description} placeholder="Task description" rows={4} onChange={e=>setForm({...form,description:e.target.value})}/>
        <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:8}}>
          <button className="button" onClick={onClose}>Cancel</button>
          {mode === 'edit' && <button className="button" onClick={del}>Delete</button>}
          <button className="button" onClick={save} disabled={saving}>{saving? 'Saving...':'Save'}</button>
        </div>
      </div>
    </div>
  );
}