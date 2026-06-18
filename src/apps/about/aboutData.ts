import type { SkillGroup } from "../../types/content";

export const bio = [
  "Hey, I'm a Bachelor's student in Augmented & Virtual Reality Design. I've moved across every stage of the production pipeline — modeling, rigging, animation, shading, and the programming/tooling that holds it all together.",
  "I believe games are an art form: a medium where visuals, sound, code and systems fuse into something only interaction can deliver.",
];

export const vision =
  "My long-term goal is to start my own game / VR studio — a small team where we build the things we genuinely believe in, alongside client and collaborative work. Somewhere visions (mine and ours) get to ship.";

export const education = [
  {
    title: "B.A. Augmented & Virtual Reality Design",
    place: "Placeholder University",
    period: "2022 — 2026",
  },
];

export const skills: SkillGroup[] = [
  { label: "3D & Animation", items: ["Blender", "Maya", "Rigging", "Character & Hard-Surface Modeling"] },
  { label: "Tech Art", items: ["Substance Painter", "Marmoset Toolbag", "Shader Authoring"] },
  { label: "Programming", items: ["C#", "C++", "TypeScript", "Unity", "Unreal Engine"] },
  { label: "Web / Tools", items: ["React", "Three.js", "Git", "Node.js"] },
];
