import { useEffect, useRef, useState, useCallback } from "react";
import DesktopIcon from "./DesktopIcon";
import Taskbar from "./Taskbar";
import WindowManager from "./window/WindowManager";
import CustomCursor from "./CustomCursor";
import Clippy from "./Clippy";
import DesktopContextMenu from "./DesktopContextMenu";
import { useWindowStore } from "./store/useWindowStore";
import { windowRegistry } from "./window/windowRegistry";
import { playSound } from "../utils/sounds";
import type { AppId } from "../types/window";
import "./os.css";

interface CtxMenu { x: number; y: number }

// Derived from windowRegistry — add desktop: { label } to any registry entry
// to make it appear here. No need to edit this file when adding a new app.
const DESKTOP_ICONS = (Object.entries(windowRegistry) as [AppId, typeof windowRegistry[AppId]][])
  .filter(([, e]) => e.desktop != null)
  .map(([appId, e]) => ({ appId, label: e.desktop!.label }));

export default function Desktop() {
  const openWindow = useWindowStore((s) => s.openWindow);
  const hasOpened = useRef(false);
  const [wallpaper, setWallpaper] = useState("Bliss.png");
  const [ctxMenu, setCtxMenu] = useState<CtxMenu | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  useEffect(() => {
    if (!hasOpened.current) {
      hasOpened.current = true;
      openWindow("home");
      playSound("logon", 0.5);
    }
  }, [openWindow]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".window-chrome, .taskbar, .start-menu, .desktop-ctx-menu")) return;
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY });
  }, []);

  const handleDesktopClick = useCallback((e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest(".desktop-icon, .window-chrome, .taskbar, .start-menu")) {
      setSelectedIcon(null);
    }
  }, []);

  const desktopBg: React.CSSProperties = wallpaper
    ? { backgroundImage: `url(/wallpapers/${wallpaper})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: "#3A6EA5" };

  return (
    <div className="desktop" id="desktop-root" style={desktopBg} onContextMenu={handleContextMenu} onClick={handleDesktopClick}>
      <div className="desktop__icons">
        {DESKTOP_ICONS.map(({ appId, label }) => (
          <DesktopIcon
            key={appId}
            appId={appId}
            label={label}
            selected={selectedIcon === appId}
            onSelect={() => setSelectedIcon(appId)}
          />
        ))}
      </div>
      <WindowManager />
      <Taskbar />
      <Clippy size={64} />
      <CustomCursor />
      {ctxMenu && (
        <DesktopContextMenu
          x={ctxMenu.x}
          y={ctxMenu.y}
          current={wallpaper}
          onSelect={setWallpaper}
          onClose={() => setCtxMenu(null)}
        />
      )}
    </div>
  );
}
