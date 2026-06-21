import { useEffect, useRef } from "react";

type CursorType = "default" | "pointer" | "text" | "move";

const BASE = import.meta.env.BASE_URL;
const CURSOR_SRCS: Record<CursorType, string> = {
  default: `${BASE}icons/cursor-default.png`,
  pointer: `${BASE}icons/cursor-pointer.png`,
  text:    `${BASE}icons/default_ibeam.png`,
  move:    `${BASE}icons/default_move.png`,
};

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const typeRef = useRef<CursorType>("default");

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const cursor = cursorRef.current;
      if (cursor) {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }

      const target = e.target as HTMLElement | null;
      let next: CursorType = "default";

      if (target?.closest("input, textarea, [contenteditable]")) {
        next = "text";
      } else if (target?.closest(".window-titlebar")) {
        next = "move";
      } else if (target?.closest("button, a, [role='button'], .desktop-icon, .projects-app__item")) {
        next = "pointer";
      }

      if (next !== typeRef.current) {
        typeRef.current = next;
        if (imgRef.current) imgRef.current.src = CURSOR_SRCS[next];
      }
    };

    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <div ref={cursorRef} className="custom-cursor" style={{ transform: "translate(-50px, -50px)" }}>
      <img ref={imgRef} src={CURSOR_SRCS.default} alt="" />
    </div>
  );
}
