'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';

function Knot() {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.12;
    ref.current.rotation.y += delta * 0.18;
  });
  return (
    <mesh ref={ref}>
      <torusKnotGeometry args={[1.1, 0.32, 180, 24]} />
      <meshStandardMaterial
        color="#ff6363"
        emissive="#8b5cf6"
        emissiveIntensity={0.25}
        wireframe
        roughness={0.3}
      />
    </mesh>
  );
}

export default function FeatureScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      className="!absolute inset-0 pointer-events-none"
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 3, 4]} intensity={40} color="#ff6363" />
      <pointLight position={[-4, -2, 2]} intensity={25} color="#8b5cf6" />
      <Knot />
    </Canvas>
  );
}