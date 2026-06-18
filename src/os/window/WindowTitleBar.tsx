import type { WindowState } from "../../types/window";
import { windowRegistry } from "./windowRegistry";
import WinIcon from "../../components/ui/WinIcon";
import { playSound } from "../../utils/sounds";

interface WindowTitleBarProps {
  win: WindowState;
  isActive: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
}

export default function WindowTitleBar({ win, isActive, onClose, onMinimize, onToggleMaximize }: WindowTitleBarProps) {
  const entry = windowRegistry[win.appId];

  return (
    <div
      className={`window-titlebar${isActive ? "" : " inactive"}`}
      onDoubleClick={() => { playSound("restore"); onToggleMaximize(); }}
    >
      <div className="window-titlebar-title">
        {entry.winIcon ? (
          <WinIcon row={entry.winIcon.row} col={entry.winIcon.col} size={16} />
        ) : (
          win.icon && <img src={win.icon} alt="" />
        )}
        <span>{win.title}</span>
      </div>
      <div className="window-titlebar-controls">
        <button
          className="glossy-button"
          onClick={(e) => { e.stopPropagation(); playSound("minimize"); onMinimize(); }}
          onDoubleClick={(e) => e.stopPropagation()}
          aria-label="Minimize"
          title="Minimize"
        >
          –
        </button>
        <button
          className="glossy-button"
          onClick={(e) => { e.stopPropagation(); playSound("restore"); onToggleMaximize(); }}
          onDoubleClick={(e) => e.stopPropagation()}
          aria-label="Maximize"
          title="Maximize"
        >
          {win.isMaximized ? "❐" : "□"}
        </button>
        <button
          className="glossy-button close"
          onClick={(e) => { e.stopPropagation(); playSound("ding"); onClose(); }}
          onDoubleClick={(e) => e.stopPropagation()}
          aria-label="Close"
          title="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
