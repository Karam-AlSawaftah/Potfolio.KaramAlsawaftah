import { useEffect, useRef } from "react";

export const WALLPAPERS = [
  { name: "Bliss", file: "Bliss.png" },
  { name: "Azul", file: "Azul.png" },
  { name: "Crystal", file: "Crystal.png" },
  { name: "Vortec Space", file: "Vortec_space.png" },
  { name: "Radiance", file: "Radiance.png" },
  { name: "Ascent", file: "Ascent.png" },
  { name: "Autumn", file: "Autumn.png" },
  { name: "Moon Flower", file: "Moon_flower.png" },
  { name: "Peace", file: "Peace.png" },
  { name: "Ripple", file: "Ripple.png" },
  { name: "Tulips", file: "Tulips.png" },
  { name: "Wind", file: "Wind.png" },
  { name: "None (Solid Blue)", file: "" },
];

interface Props {
  x: number;
  y: number;
  current: string;
  onSelect: (file: string) => void;
  onClose: () => void;
}

export default function DesktopContextMenu({ x, y, current, onSelect, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("mousedown", handle, true);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("mousedown", handle, true);
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const clampedX = Math.min(x, window.innerWidth - 190);
  const clampedY = Math.min(y, window.innerHeight - WALLPAPERS.length * 32 - 60);

  return (
    <div
      ref={ref}
      className="desktop-ctx-menu"
      style={{ left: clampedX, top: clampedY }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="desktop-ctx-menu__label">Wallpaper</div>
      {WALLPAPERS.map((wp) => (
        <button
          key={wp.file}
          className={`desktop-ctx-menu__item${current === wp.file ? " desktop-ctx-menu__item--active" : ""}`}
          onClick={() => { onSelect(wp.file); onClose(); }}
        >
          {wp.file && (
            <div style={{
              width: 24, height: 16, flexShrink: 0,
              backgroundImage: `url(${import.meta.env.BASE_URL}wallpapers/${wp.file})`,
              backgroundSize: "cover", backgroundPosition: "center",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 2,
            }} />
          )}
          {wp.name}
        </button>
      ))}
    </div>
  );
}
