'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import type { Group, Mesh } from 'three';

function Container({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  const group = useRef<Group>(null);
  const topRef = useRef<Mesh>(null);
  const bottomRef = useRef<Mesh>(null);
  const coreRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);
  const bubbleA = useRef<Mesh>(null);
  const bubbleB = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const topVel = useRef(0);
  const botVel = useRef(0);
  const coreScaleVel = useRef(0);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * (isOpen ? 0.08 : 0.22);
      const targetScale = hovered && !isOpen ? 1.08 : 1;
      group.current.scale.lerp({ x: targetScale, y: targetScale, z: targetScale } as any, 0.1);
    }

    // Simple critically-damped spring for the shell halves.
    const targetOffset = isOpen ? 0.85 : 0.02;
    if (topRef.current) {
      const cur = topRef.current.position.y;
      const force = (targetOffset - cur) * 12 - topVel.current * 6;
      topVel.current += force * delta;
      topRef.current.position.y += topVel.current * delta;
      topRef.current.rotation.z = (targetOffset - 0.02) * 0.4;
    }
    if (bottomRef.current) {
      const cur = bottomRef.current.position.y;
      const force = (-targetOffset - cur) * 12 - botVel.current * 6;
      botVel.current += force * delta;
      bottomRef.current.position.y += botVel.current * delta;
      bottomRef.current.rotation.z = -(targetOffset - 0.02) * 0.4;
    }

    // Core pulses in once open.
    const targetCoreScale = isOpen ? 1 : 0.001;
    if (coreRef.current) {
      const cur = coreRef.current.scale.x;
      const force = (targetCoreScale - cur) * 10 - coreScaleVel.current * 5;
      coreScaleVel.current += force * delta;
      const next = cur + coreScaleVel.current * delta;
      coreRef.current.scale.setScalar(Math.max(0.001, next));
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.2) * 0.06;
      if (isOpen) coreRef.current.scale.multiplyScalar(pulse);
    }

    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 0.6;
      ringRef.current.rotation.y += delta * 0.3;
      const s = isOpen ? 1 : 0;
      ringRef.current.scale.lerp({ x: s, y: s, z: s } as any, 0.08);
    }
    if (bubbleA.current && bubbleB.current) {
      const t = state.clock.elapsedTime;
      const s = isOpen ? 1 : 0;
      bubbleA.current.scale.lerp({ x: s, y: s, z: s } as any, 0.08);
      bubbleB.current.scale.lerp({ x: s, y: s, z: s } as any, 0.08);
      bubbleA.current.position.set(Math.cos(t * 0.7) * 1.4, 0.3 + Math.sin(t * 1.1) * 0.15, Math.sin(t * 0.7) * 1.4);
      bubbleB.current.position.set(Math.cos(t * 0.7 + Math.PI) * 1.4, -0.2 + Math.sin(t * 1.3) * 0.15, Math.sin(t * 0.7 + Math.PI) * 1.4);
    }
  });

  return (
    <group
      ref={group}
      onClick={onToggle}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Top shell half */}
      <mesh ref={topRef} position={[0, 0.02, 0]}>
        <boxGeometry args={[1.8, 0.9, 1.8]} />
        <meshStandardMaterial color="#ff6363" emissive="#ff6363" emissiveIntensity={0.15} wireframe roughness={0.4} />
      </mesh>
      {/* Bottom shell half */}
      <mesh ref={bottomRef} position={[0, -0.02, 0]}>
        <boxGeometry args={[1.8, 0.9, 1.8]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.15} wireframe roughness={0.4} />
      </mesh>

      {/* AI core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshStandardMaterial color="#ffffff" emissive="#ff6363" emissiveIntensity={0.6} roughness={0.2} metalness={0.3} />
      </mesh>

      {/* Connection ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.15, 0.015, 8, 64]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.5} />
      </mesh>

      {/* Two chat-bubble shapes orbiting the core */}
      <mesh ref={bubbleA}>
        <boxGeometry args={[0.34, 0.22, 0.05]} />
        <meshStandardMaterial color="#ff8a8a" emissive="#ff6363" emissiveIntensity={0.4} roughness={0.3} />
      </mesh>
      <mesh ref={bubbleB}>
        <boxGeometry args={[0.28, 0.2, 0.05]} />
        <meshStandardMaterial color="#c4b5fd" emissive="#8b5cf6" emissiveIntensity={0.4} roughness={0.3} />
      </mesh>
    </group>
  );
}

export default function FeatureScene({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0.6, 5], fov: 45 }}
      className="!absolute inset-0"
      gl={{ alpha: true, antialias: true }}
      style={{ cursor: 'pointer' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 3, 4]} intensity={35} color="#ff6363" />
      <pointLight position={[-4, -2, 2]} intensity={25} color="#8b5cf6" />
      <Container isOpen={isOpen} onToggle={onToggle} />
    </Canvas>
  );
}