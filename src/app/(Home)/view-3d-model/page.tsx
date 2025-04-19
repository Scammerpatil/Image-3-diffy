"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";

function Model({ url }: { url: string }) {
  const gltf = useGLTF(url);
  return <primitive object={gltf.scene} />;
}

export default function Home() {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-black">
      <Canvas>
        <ambientLight />
        <Stage environment="city" intensity={0.6}>
          <Model url={"/point_cloud.glb"} />
        </Stage>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
