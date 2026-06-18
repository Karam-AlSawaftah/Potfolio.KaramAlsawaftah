import { useState } from "react";
import { projects } from "./projectsData";
import { useWindowStore } from "../../os/store/useWindowStore";
import "./projects.css";

const ALL = "All";
const CATEGORIES = [ALL, ...Array.from(new Set(projects.map((p) => p.category)))];

type ViewMode = "icons" | "details";

export default function ProjectsApp() {
  const openWindow = useWindowStore((s) => s.openWindow);
  const [category, setCategory] = useState(ALL);
  const [view, setView] = useState<ViewMode>("icons");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = category === ALL ? projects : projects.filter((p) => p.category === category);
  const selectedProject = projects.find((p) => p.id === selected);
  const statusText = selected && selectedProject
    ? `1 object selected  (${selectedProject.category}, ${selectedProject.year})`
    : `${filtered.length} object${filtered.length !== 1 ? "s" : ""}`;

  return (
    <div className="explorer-app">
      {/* Toolbar */}
      <div className="explorer-toolbar">
        <button className="explorer-toolbar__btn" disabled title="Back">◀</button>
        <button className="explorer-toolbar__btn" disabled title="Forward">▶</button>
        <div className="explorer-toolbar__sep" />
        <button
          className={`explorer-toolbar__view${view === "icons" ? " active" : ""}`}
          onClick={() => setView("icons")}
          title="Icons"
        >⊞ Icons</button>
        <button
          className={`explorer-toolbar__view${view === "details" ? " active" : ""}`}
          onClick={() => setView("details")}
          title="Details"
        >≡ Details</button>
      </div>

      <div className="explorer-body">
        {/* Left sidebar — folder tree */}
        <div className="explorer-sidebar">
          <div className="explorer-sidebar__heading">Folders</div>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`explorer-sidebar__item${category === cat ? " active" : ""}`}
              onClick={() => { setCategory(cat); setSelected(null); }}
            >
              <span className="explorer-sidebar__icon">📁</span>
              <span className="explorer-sidebar__label">{cat}</span>
            </button>
          ))}
        </div>

        {/* Right pane */}
        <div
          className="explorer-pane"
          onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
        >
          {view === "icons" ? (
            <div className="explorer-icons">
              {filtered.map((project) => (
                <button
                  key={project.id}
                  className={`explorer-icon-item${selected === project.id ? " selected" : ""}`}
                  onClick={(e) => { e.stopPropagation(); setSelected(project.id); }}
                  onDoubleClick={() => openWindow("project-detail", { projectId: project.id })}
                >
                  <img src={project.thumbnail} alt="" />
                  <span className="explorer-icon-item__title">{project.title}</span>
                  <span className="explorer-icon-item__cat">{project.category}</span>
                </button>
              ))}
            </div>
          ) : (
            <table className="explorer-details">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Year</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((project) => (
                  <tr
                    key={project.id}
                    className={selected === project.id ? "selected" : ""}
                    onClick={() => setSelected(project.id)}
                    onDoubleClick={() => openWindow("project-detail", { projectId: project.id })}
                  >
                    <td>
                      <img src={project.thumbnail} alt="" className="explorer-details__thumb" />
                      {project.title}
                    </td>
                    <td>{project.category}</td>
                    <td>{project.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="explorer-statusbar">{statusText}</div>
    </div>
  );
}
