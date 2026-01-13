"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Mesh } from "three";
import { Environment, ContactShadows } from "@react-three/drei";

import { ThreeElements } from "@react-three/fiber";

function Box(props: ThreeElements['mesh']) {
  const mesh = useRef<Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x += delta * 0.2;
      mesh.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.2 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color={hovered ? "#2563EB" : "#10B981"} />
    </mesh>
  );
}

export default function JobThumbnail3D() {
  return (
    <div className="w-full h-40 relative rounded-lg overflow-hidden bg-gray-50">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Box position={[0, 0, 0]} />
        <Environment preset="city" />
        <ContactShadows position={[0, -1.4, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
      </Canvas>
    </div>
  );
}
