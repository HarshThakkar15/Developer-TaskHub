import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import "../components/Portfolio/portfolio.css";

export default function PublicProject() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/projects/public/project/${id}`);
        setProject(res.data);
      } catch (err) {
        setError("Project not found or unavailable.");
      }
    })();
  }, [id]);

  if (error) return <div className="card">{error}</div>;
  if (!project) return <div className="card">Loading...</div>;

  return (
    <div className="portfolio-theme-minimal" style={{ padding: 24, minHeight: "100vh" }}>
      <div className="card">
        <h1>{project.title}</h1>
        <p>{project.description}</p>
        {project.tech && (
          <p><strong>Tech Stack:</strong> {project.tech.join(", ")}</p>
        )}
        {project.link && (
          <p>
            <a href={project.link} target="_blank" rel="noreferrer">View Live</a>
          </p>
        )}
      </div>
    </div>
  );
}
