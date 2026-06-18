import Scene3D from "./Scene3D";
import { useWindowStore } from "../../os/store/useWindowStore";
import "./home.css";

export default function HomeApp() {
  const openWindow = useWindowStore((s) => s.openWindow);

  return (
    <div className="home-app">
      <div className="home-app__scene">
        <Scene3D />
      </div>
      <div className="home-app__intro">
        <h1>WELCOME.SYS</h1>
        <p>
          AVR design student &amp; aspiring game/VR studio founder. This machine runs on chrome,
          cobalt, and a healthy amount of nostalgia. Open a folder on the desktop to explore.
        </p>
        <div className="home-app__links">
          <button className="glossy-pill accent" onClick={() => openWindow("projects")}>
            View projects
          </button>
          <button className="glossy-pill" onClick={() => openWindow("about")}>
            About me
          </button>
        </div>
      </div>
    </div>
  );
}
