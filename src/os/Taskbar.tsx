import { useEffect, useState } from "react";
import { useWindowStore } from "./store/useWindowStore";
import { windowRegistry } from "./window/windowRegistry";
import WinIcon from "../components/ui/WinIcon";
import StartMenu from "./StartMenu";

export default function Taskbar() {
  const windows = useWindowStore((s) => s.windows);
  const activeWindowId = useWindowStore((s) => s.activeWindowId);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const [time, setTime] = useState(() => new Date());
  const [startOpen, setStartOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeString = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {startOpen && <StartMenu onClose={() => setStartOpen(false)} />}
      <div className="taskbar">
        <button className="taskbar__start" onClick={() => setStartOpen((v) => !v)}>
          <img src="/icons/winxp-logo.png" alt="" />
          start
        </button>
        <div className="taskbar__divider" />
        <div className="taskbar__windows">
          {windows.map((win) => {
            const entry = windowRegistry[win.appId];
            return (
              <button
                key={win.id}
                className={`taskbar__window-btn${win.id === activeWindowId && !win.isMinimized ? " active" : ""}`}
                onClick={() => {
                  if (win.id === activeWindowId && !win.isMinimized) {
                    minimizeWindow(win.id);
                  } else {
                    focusWindow(win.id);
                  }
                }}
              >
                {entry.winIcon ? (
                  <WinIcon row={entry.winIcon.row} col={entry.winIcon.col} size={16} />
                ) : (
                  win.icon && <img src={win.icon} alt="" />
                )}
                {win.title}
              </button>
            );
          })}
        </div>
        <div className="taskbar__clock">{timeString}</div>
      </div>
    </>
  );
}
