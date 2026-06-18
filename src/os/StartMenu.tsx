import { useEffect, useRef, useState } from "react";
import type { AppId } from "../types/window";
import { useWindowStore } from "./store/useWindowStore";
import { windowRegistry } from "./window/windowRegistry";
import WinIcon from "../components/ui/WinIcon";
import { playSound } from "../utils/sounds";
import ShutdownDialog from "./ShutdownDialog";

interface StartMenuProps {
  onClose: () => void;
}

// Derived from windowRegistry — set startMenu.left / startMenu.right on any
// registry entry to control what appears here. No need to edit this file.
const LEFT_APPS = (Object.entries(windowRegistry) as [AppId, typeof windowRegistry[AppId]][])
  .filter(([, e]) => e.startMenu?.left != null)
  .map(([appId, e]) => ({ appId, label: e.startMenu!.left! }));

const RIGHT_PLACES = (Object.entries(windowRegistry) as [AppId, typeof windowRegistry[AppId]][])
  .filter(([, e]) => e.startMenu?.right != null)
  .map(([appId, e]) => ({ appId, ...e.startMenu!.right! }));

export default function StartMenu({ onClose }: StartMenuProps) {
  const openWindow = useWindowStore((s) => s.openWindow);
  const [showShutdown, setShowShutdown] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        const target = e.target as HTMLElement;
        if (!target.closest(".taskbar__start")) onClose();
      }
    };
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("mousedown", handle, true);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("mousedown", handle, true);
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const handleOpen = (appId: AppId) => {
    playSound("menuCommand");
    openWindow(appId);
    onClose();
  };

  return (
    <>
      <div className="start-menu-xp" ref={menuRef}>
        <div className="start-menu-xp__header">
          <div className="start-menu-xp__avatar">K</div>
          <div className="start-menu-xp__username">Karam Ali</div>
        </div>

        <div className="start-menu-xp__body">
          <div className="start-menu-xp__left">
            {LEFT_APPS.map((app) => {
              const entry = windowRegistry[app.appId];
              return (
                <button key={app.appId} className="start-menu-xp__item" onClick={() => handleOpen(app.appId)}>
                  <div className="start-menu-xp__item-icon">
                    {entry.winIcon ? (
                      <WinIcon row={entry.winIcon.row} col={entry.winIcon.col} size={24} />
                    ) : (
                      <img src={entry.icon} alt="" width={24} height={24} />
                    )}
                  </div>
                  <span>{app.label}</span>
                </button>
              );
            })}
            <div className="start-menu-xp__separator" />
          </div>

          <div className="start-menu-xp__right">
            {RIGHT_PLACES.map((place) => (
              <button key={place.appId + place.label} className="start-menu-xp__place" onClick={() => handleOpen(place.appId)}>
                <span className="start-menu-xp__place-icon">{place.emoji}</span>
                <span>{place.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="start-menu-xp__footer">
          <button className="start-menu-xp__turnoff" onClick={() => setShowShutdown(true)}>
            <span>⏻</span>
            Turn Off Computer
          </button>
        </div>
      </div>

      {showShutdown && (
        <ShutdownDialog onClose={() => { setShowShutdown(false); onClose(); }} />
      )}
    </>
  );
}
