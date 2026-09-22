'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { useRef, useState } from 'react';
import type { Group, Mesh } from 'three';

function ChatBubble({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  const group = useRef<Group>(null);
  const bodyRef = useRef<Mesh>(null);
  const coreRef = useRef<Mesh>(null);
  const dot1 = useRef<Mesh>(null);
  const dot2 = useRef<Mesh>(null);
  const dot3 = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const bodyVel = useRef(0);
  const coreVel = useRef(0);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * (isOpen ? 0.15 : 0.35);
      const targetScale = hovered ? 1.1 : 1;
      const s = group.current.scale.x + (targetScale - group.current.scale.x) * 0.12;
      group.current.scale.setScalar(s);
    }

    // Body splits open by scaling down / fading as core rises.
    const targetBodyY = isOpen ? -0.4 : 0;
    if (bodyRef.current) {
      const cur = bodyRef.current.position.y;
      const force = (targetBodyY - cur) * 10 - bodyVel.current * 5.5;
      bodyVel.current += force * delta;
      bodyRef.current.position.y += bodyVel.current * delta;
    }

    const targetCore = isOpen ? 1 : 0.001;
    if (coreRef.current) {
      const cur = coreRef.current.scale.x;
      const force = (targetCore - cur) * 9 - coreVel.current * 5;
      coreVel.current += force * delta;
      const next = Math.max(0.001, cur + coreVel.current * delta);
      const pulse = isOpen ? 1 + Math.sin(state.clock.elapsedTime * 2.4) * 0.07 : 1;
      coreRef.current.scale.setScalar(next * pulse);
      coreRef.current.position.y = 0.55;
    }

    // Three small "typing dots" float up when open.
    [dot1, dot2, dot3].forEach((d, i) => {
      if (!d.current) return;
      const s = isOpen ? 1 : 0;
      d.current.scale.lerp({ x: s, y: s, z: s } as any, 0.09);
      const t = state.clock.elapsedTime * 2 + i * 0.6;
      d.current.position.y = -0.75 + Math.sin(t) * 0.06;
      d.current.position.x = -0.35 + i * 0.35;
    });
  });

  return (
    <group
      ref={group}
      scale={1.9}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Big invisible hit-sphere so clicks register reliably everywhere on the shape */}
      <mesh onClick={(e) => { e.stopPropagation(); onToggle(); }}>
        <sphereGeometry args={[1.3, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Chat bubble body */}
      <RoundedBox ref={bodyRef as any} args={[1.6, 1.1, 0.5]} radius={0.28} smoothness={6}>
        <meshStandardMaterial
          color="#ff6363"
          emissive="#ff6363"
          emissiveIntensity={hovered ? 0.35 : 0.2}
          roughness={0.35}
          metalness={0.15}
        />
      </RoundedBox>
      {/* Bubble tail */}
      <mesh position={[-0.5, -0.75, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.32, 0.32, 0.32]} />
        <meshStandardMaterial color="#ff6363" emissive="#ff6363" emissiveIntensity={0.2} roughness={0.35} />
      </mesh>

      {/* AI core revealed inside */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.4, 1]} />
        <meshStandardMaterial color="#ffffff" emissive="#8b5cf6" emissiveIntensity={0.7} roughness={0.15} metalness={0.4} />
      </mesh>

      {/* Typing dots */}
      <mesh ref={dot1}><sphereGeometry args={[0.06, 12, 12]} /><meshStandardMaterial color="#c4b5fd" emissive="#8b5cf6" emissiveIntensity={0.5} /></mesh>
      <mesh ref={dot2}><sphereGeometry args={[0.06, 12, 12]} /><meshStandardMaterial color="#c4b5fd" emissive="#8b5cf6" emissiveIntensity={0.5} /></mesh>
      <mesh ref={dot3}><sphereGeometry args={[0.06, 12, 12]} /><meshStandardMaterial color="#c4b5fd" emissive="#8b5cf6" emissiveIntensity={0.5} /></mesh>
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
      camera={{ position: [0, 0.3, 4.2], fov: 42 }}
      className="!absolute inset-0"
      gl={{ alpha: true, antialias: true }}
      style={{ cursor: 'pointer', touchAction: 'none' }}
      onPointerMissed={onToggle}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 3, 4]} intensity={40} color="#ff6363" />
      <pointLight position={[-4, -2, 2]} intensity={30} color="#8b5cf6" />
      <ChatBubble isOpen={isOpen} onToggle={onToggle} />
    </Canvas>
  );
}