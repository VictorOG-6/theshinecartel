"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Bounds,
  Center,
  Environment,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import type { Group } from "three";

const MODEL_PATH = "/shade-cartel.glb";

/** R3F sizes the <canvas> from this wrapper; without height it falls back to 150px. */
const CANVAS_HEIGHT_PX = 400;

function CartelModel() {
  const { scene } = useGLTF(MODEL_PATH);

  return (
    <Bounds fit clip observe margin={1.25}>
      <Center>
        <primitive object={scene as Group} />
      </Center>
    </Bounds>
  );
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight intensity={1.1} position={[4, 6, 5]} />
      <directionalLight intensity={0.35} position={[-4, 2, -3]} />
    </>
  );
}

function ShineCartelScene() {
  return (
    <>
      <SceneLights />
      <Environment preset="studio" background={false} />
      <Suspense fallback={null}>
        <CartelModel />
      </Suspense>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
        rotateSpeed={0.85}
        touches={{
          ONE: 0,
          TWO: 0,
        }}
      />
    </>
  );
}

useGLTF.preload(MODEL_PATH);

const ShineCartelViewer = () => {
  return (
    <div className="w-full max-w-[1280px]" style={{ height: CANVAS_HEIGHT_PX }}>
      <Canvas
        className="h-full w-full touch-none"
        style={{ height: CANVAS_HEIGHT_PX, width: "100%" }}
        camera={{ position: [0, 0, 4], fov: 42, near: 0.01, far: 100 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0xffffff, 0);
        }}
      >
        <ShineCartelScene />
      </Canvas>
    </div>
  );
};

export default ShineCartelViewer;
