import { useEffect, useState } from "react";

const LINES = [
  "CHROMEBIOS (C) RETRO SYSTEMS — REV 2.0K",
  "CPU: GAME/VR DESIGN CORE @ UNLIMITED MHz",
  "MEMORY TEST..................... OK",
  "DETECTING RENDER PIPELINE........ OK",
  "MOUNTING 3D MODELING SUBSYSTEM.... OK",
  "LOADING ANIMATION RIGS........... OK",
  "INITIALIZING SHADER CORE......... OK",
  "CALIBRATING COBALT DISPLAY ARRAY.. OK",
  "STUDIO VISION MODULE.............. READY",
  "",
  "PRESS ANY KEY TO CONTINUE...",
];

export default function PostScreen() {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount >= LINES.length) return;
    const timer = setTimeout(() => setVisibleCount((c) => c + 1), 150);
    return () => clearTimeout(timer);
  }, [visibleCount]);

  return (
    <div className="boot-post">
      {LINES.slice(0, visibleCount).map((line, i) => (
        <div key={i} className="boot-post__line">
          {line || " "}
        </div>
      ))}
      <span className="boot-post__cursor">_</span>
    </div>
  );
}
