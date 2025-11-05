import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

export default function PublicProject() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load(){
      try {
        const res = await api.get(`/projects/public/project/${id}`);
        setProject(res.data);
      } catch (err) {
        setError("Project not found or unavailable.");
      }
    }load();
  }, [id]);

  if (error) return <div className="card">{error}</div>;
  if (!project) return <div className="container"><div className="card">Loading...</div></div>;

  return (
    <div className="container">
      <div className="card">
        <h2 style={{textAlign:'center'}}>{project.title}</h2>
        
        <div style={{display:'flex', gap:12, marginTop:8, flexWrap:'wrap'}}>
          {project.tags?.map((t,i)=><span key={i} className="tag">{t}</span>)}
        </div>
        <p>{project.description}</p>

        <div style={{display:'flex',gap:12, marginTop:12, justifyContent:'center'}}>
          {project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noreferrer" className="button">Repo</a>}
          {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="button">Live</a>}
        </div>
      </div>
      <div style={{display:'flex',gap:12, marginTop:12, justifyContent:'center'}}>
      <button className="button" style={{marginTop:20}} onClick={()=>window.history.back()}>Go Back</button></div>
    </div>
  );
}
