import "./system-app.css";

export default function MyComputerApp() {
  return (
    <div className="system-app">
      <div className="system-app__header">
        <div className="system-app__logo">
          <span className="system-app__logo-mark">⊞</span>
          <div>
            <div className="system-app__logo-name">CHROME // COBALT OS</div>
            <div className="system-app__logo-sub">Portfolio Edition</div>
          </div>
        </div>
      </div>

      <div className="system-app__body">
        <div className="system-app__section">
          <div className="system-app__label">System:</div>
          <div className="system-app__value">
            CHROME // COBALT OS<br />
            Portfolio Edition<br />
            <span className="system-app__dim">© 2025 Karam Ali. All Rights Reserved.</span>
          </div>
        </div>

        <div className="system-app__divider" />

        <div className="system-app__section">
          <div className="system-app__label">Computer:</div>
          <div className="system-app__value">
            <table className="system-app__specs">
              <tbody>
                <tr><td>CPU</td><td>Human Brain (3AM OC Mode) @ ∞ GHz</td></tr>
                <tr><td>GPU</td><td>Imagination Engine v∞</td></tr>
                <tr><td>RAM</td><td>∞ Creative Ideas Installed</td></tr>
                <tr><td>Storage</td><td>A Lifetime of Projects</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="system-app__divider" />

        <div className="system-app__section">
          <div className="system-app__label">Registered to:</div>
          <div className="system-app__value">
            Karam Ali<br />
            <span className="system-app__dim">Game &amp; VR Designer · 3D Artist · Developer</span>
          </div>
        </div>
      </div>

      <div className="system-app__footer">
        <button className="system-app__btn">OK</button>
      </div>
    </div>
  );
}
