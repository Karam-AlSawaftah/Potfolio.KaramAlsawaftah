import ModelViewer from "../../components/three/ModelViewer";
import "./home.css";

export default function Scene3D() {
  return (
    <div className="scene3d-wrap">
      <ModelViewer autoRotate enableZoom={false} />
      <div className="scene3d-hint">DRAG TO ROTATE // CHROME SENTINEL v1.0</div>
    </div>
  );
}
