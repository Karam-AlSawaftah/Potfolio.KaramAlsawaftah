// ── content.ts ─────────────────────────────────────────────────────────────
// Data-shape types for portfolio content (not OS/window types).
// Edit content in: projectsData.ts, aboutData.ts, contactData.ts
// ───────────────────────────────────────────────────────────────────────────

export type MediaType = "image" | "video" | "model";

export interface ProjectMedia {
  type: MediaType;
  src: string;
  alt?: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  thumbnail: string;
  summary: string;
  description: string;
  tools: string[];
  media: ProjectMedia[];
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface ContactLink {
  label: string;
  value: string;
  href: string;
  icon: string;
}
