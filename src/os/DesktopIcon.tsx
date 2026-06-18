import type { AppId } from "../types/window";
import { useWindowStore } from "./store/useWindowStore";
import { windowRegistry } from "./window/windowRegistry";
import WinIcon from "../components/ui/WinIcon";
import { playSound } from "../utils/sounds";

interface DesktopIconProps {
  appId: AppId;
  label: string;
  selected?: boolean;
  onSelect?: () => void;
}

export default function DesktopIcon({ appId, label, selected, onSelect }: DesktopIconProps) {
  const openWindow = useWindowStore((s) => s.openWindow);
  const entry = windowRegistry[appId];

  return (
    <button
      className={`desktop-icon${selected ? " desktop-icon--selected" : ""}`}
      onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
      onDoubleClick={() => { playSound("restore"); openWindow(appId); }}
    >
      {entry.winIcon ? (
        <WinIcon row={entry.winIcon.row} col={entry.winIcon.col} size={40} />
      ) : (
        <img src={entry.icon} alt="" />
      )}
      <span>{label}</span>
    </button>
  );
}
