import ModelViewer from "../../components/three/ModelViewer";
import { getProjectById } from "./projectsData";
import "./projects.css";

interface ProjectDetailProps {
  windowId: string;
  props?: Record<string, unknown>;
}

export default function ProjectDetail({ props }: ProjectDetailProps) {
  const projectId = props?.projectId as string | undefined;
  const project = projectId ? getProjectById(projectId) : undefined;

  if (!project) {
    return <div className="project-detail">Project not found.</div>;
  }

  return (
    <div className="project-detail">
      <div className="project-detail__header">
        <h1>{project.title}</h1>
        <span className="project-detail__meta">
          {project.category} // {project.year}
        </span>
      </div>

      <div className="project-detail__media">
        {project.media.map((media, i) =>
          media.type === "model" ? (
            <div className="project-detail__model" key={i}>
              <ModelViewer modelPath={media.src || undefined} enableZoom />
            </div>
          ) : media.type === "image" ? (
            <img key={i} src={media.src} alt={media.alt ?? ""} />
          ) : (
            <video key={i} src={media.src} controls />
          )
        )}
      </div>

      <p className="project-detail__desc">{project.description}</p>

      <div className="project-detail__tools">
        {project.tools.map((tool) => (
          <span className="project-detail__tool" key={tool}>
            {tool}
          </span>
        ))}
      </div>
    </div>
  );
}
