import { playSound } from "../utils/sounds";

interface Props {
  onClose: () => void;
}

export default function ShutdownDialog({ onClose }: Props) {
  const handleTurnOff = () => {
    playSound("ding");
    const overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed;inset:0;background:#000;z-index:99999;opacity:0;transition:opacity 1.2s ease";
    document.body.appendChild(overlay);
    requestAnimationFrame(() => { overlay.style.opacity = "1"; });
    setTimeout(() => window.location.reload(), 1800);
  };

  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <div className="shutdown-overlay">
      <div className="shutdown-dialog">
        <div className="shutdown-dialog__header">
          <img src="/icons/winxp-logo.png" alt="Windows XP" className="shutdown-dialog__logo" />
          <span>Turn off computer</span>
        </div>
        <div className="shutdown-dialog__body">
          <div className="shutdown-dialog__btns">
            <button className="shutdown-btn" onClick={onClose} title="Stand By">
              <span className="shutdown-btn__icon">💤</span>
              <span className="shutdown-btn__label">Stand By</span>
            </button>
            <button className="shutdown-btn shutdown-btn--primary" onClick={handleTurnOff} title="Turn Off">
              <span className="shutdown-btn__icon">⏻</span>
              <span className="shutdown-btn__label">Turn Off</span>
            </button>
            <button className="shutdown-btn" onClick={handleRestart} title="Restart">
              <span className="shutdown-btn__icon">🔄</span>
              <span className="shutdown-btn__label">Restart</span>
            </button>
          </div>
        </div>
        <div className="shutdown-dialog__footer">
          <button className="shutdown-dialog__cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
