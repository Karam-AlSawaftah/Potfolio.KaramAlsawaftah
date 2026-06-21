import type { Project } from "../../types/content";

const B = import.meta.env.BASE_URL;

export const projects: Project[] = [
  {
    id: "neon-drift",
    title: "Neon Drift",
    category: "Game / Level Design",
    year: "2025",
    thumbnail: `${B}icons/proj-neon-drift.svg`,
    summary: "Arcade racer prototype with a synth-lit cityscape and drift-based scoring.",
    description:
      "A vertical-slice arcade racer built solo to explore drift mechanics, dynamic camera framing and a stylised neon-city environment. Covers level layout, lighting pass, and a custom drift scoring system.",
    tools: ["Unity", "C#", "Blender", "Substance Painter"],
    media: [
      { type: "image", src: `${B}icons/placeholder-wide.svg`, alt: "Neon Drift screenshot" },
      { type: "image", src: `${B}icons/placeholder-wide.svg`, alt: "Neon Drift screenshot 2" },
    ],
  },
  {
    id: "chrome-sentinel",
    title: "Chrome Sentinel",
    category: "3D Modeling / Animation",
    year: "2024",
    thumbnail: `${B}icons/proj-chrome-sentinel.svg`,
    summary: "Hard-surface robot character, rigged and animated for a short cinematic.",
    description:
      "Full pipeline piece: high-poly hard-surface model, retopology, rig, and a short idle/attack animation cycle rendered in a cool cobalt-lit studio setup. Used as the centerpiece model for this very site.",
    tools: ["Blender", "Substance Painter", "Marmoset Toolbag"],
    media: [
      { type: "model", src: "", alt: "Chrome Sentinel 3D model (placeholder until .glb is added)" },
      { type: "image", src: `${B}icons/placeholder-wide.svg`, alt: "Turntable render" },
    ],
  },
  {
    id: "signal-loop",
    title: "Signal Loop",
    category: "Programming / Tools",
    year: "2024",
    thumbnail: `${B}icons/proj-signal-loop.svg`,
    summary: "A node-based VFX scripting tool built for rapid in-engine prototyping.",
    description:
      "An editor extension that lets technical artists wire up VFX behaviours via a node graph, with live preview inside the engine viewport. Focus was on developer experience and fast iteration loops.",
    tools: ["C++", "ImGui", "Python"],
    media: [{ type: "image", src: `${B}icons/placeholder-wide.svg`, alt: "Signal Loop editor UI" }],
  },
];

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
