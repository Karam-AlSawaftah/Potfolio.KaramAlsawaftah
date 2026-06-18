import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF, ContactShadows } from "@react-three/drei";

interface GltfModelProps {
  path: string;
}

function GltfModel({ path }: GltfModelProps) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} />;
}

function ChromePlaceholder() {
  return (
    <group>
      <mesh rotation={[0.4, 0.6, 0]}>
        <torusKnotGeometry args={[0.9, 0.28, 200, 32]} />
        <meshStandardMaterial color="#aebdd2" metalness={1} roughness={0.12} envMapIntensity={1.6} />
      </mesh>
    </group>
  );
}

interface ModelViewerProps {
  modelPath?: string;
  autoRotate?: boolean;
  enableZoom?: boolean;
  background?: string;
}

export default function ModelViewer({
  modelPath,
  autoRotate = true,
  enableZoom = false,
  background = "transparent",
}: ModelViewerProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.6, 3.4], fov: 40 }}
      style={{ background }}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={[background === "transparent" ? "#0a2a6e" : background]} />
      <ambientLight intensity={0.6} color="#8ab4ff" />
      <directionalLight position={[3, 4, 2]} intensity={1.4} color="#cfe8ff" />
      <directionalLight position={[-3, -1, -2]} intensity={0.5} color="#00d4ff" />
      <Suspense fallback={null}>
        {modelPath ? <GltfModel path={modelPath} /> : <ChromePlaceholder />}
        <Environment preset="city" />
        <ContactShadows position={[0, -1.2, 0]} opacity={0.5} scale={6} blur={2.5} far={4} color="#03102b" />
      </Suspense>
      <OrbitControls
        enableZoom={enableZoom}
        enablePan={false}
        autoRotate={autoRotate}
        autoRotateSpeed={1.2}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.7}
      />
    </Canvas>
  );
}
