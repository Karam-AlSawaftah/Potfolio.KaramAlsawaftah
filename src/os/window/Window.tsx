import { useEffect } from "react";
import { Rnd } from "react-rnd";
import { useWindowStore } from "../store/useWindowStore";
import { windowRegistry } from "./windowRegistry";
import WindowTitleBar from "./WindowTitleBar";
import { playSound } from "../../utils/sounds";
import type { WindowState } from "../../types/window";

interface WindowProps {
  win: WindowState;
}

export default function Window({ win }: WindowProps) {
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const toggleMaximize = useWindowStore((s) => s.toggleMaximize);
  const updatePosition = useWindowStore((s) => s.updatePosition);
  const updateSize = useWindowStore((s) => s.updateSize);
  const isActive = useWindowStore((s) => s.activeWindowId === win.id);

  const entry = windowRegistry[win.appId];
  const Content = entry.component;

  useEffect(() => { playSound("restore"); }, []);

  useEffect(() => {
    if (!isActive) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "F4") {
        e.preventDefault();
        closeWindow(win.id);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, win.id, closeWindow]);

  if (win.isMinimized) return null;

  return (
    <Rnd
      key={win.isMaximized ? "maximized" : "windowed"}
      size={win.isMaximized ? { width: "100%", height: "100%" } : win.size}
      position={win.isMaximized ? { x: 0, y: 0 } : win.position}
      onDragStop={(_e, d) => updatePosition(win.id, { x: d.x, y: d.y })}
      onResizeStop={(_e, _dir, ref, _delta, position) => {
        updateSize(win.id, { width: ref.offsetWidth, height: ref.offsetHeight });
        updatePosition(win.id, position);
      }}
      onMouseDown={() => focusWindow(win.id)}
      dragHandleClassName="window-titlebar"
      disableDragging={win.isMaximized}
      enableResizing={!win.isMaximized}
      minWidth={280}
      minHeight={180}
      bounds="parent"
      style={{ zIndex: win.zIndex }}
    >
      <div className={`window-chrome${isActive ? " active" : ""}`} style={{ width: "100%", height: "100%" }}>
        <WindowTitleBar
          win={win}
          isActive={isActive}
          onClose={() => closeWindow(win.id)}
          onMinimize={() => minimizeWindow(win.id)}
          onToggleMaximize={() => toggleMaximize(win.id)}
        />
        <div className="window-body">
          <Content windowId={win.id} props={win.props} />
        </div>
      </div>
    </Rnd>
  );
}
