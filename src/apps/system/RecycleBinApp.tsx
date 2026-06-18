import "./system-app.css";

export default function RecycleBinApp() {
  return (
    <div className="system-app system-app--recycle">
      <div className="system-app__recycle-icon">🗑</div>
      <div className="system-app__recycle-msg">Recycle Bin is empty.</div>
      <div className="system-app__recycle-sub">No deleted files. Nothing to restore.</div>
    </div>
  );
}
