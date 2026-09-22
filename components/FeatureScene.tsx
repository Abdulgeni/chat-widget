'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useMemo, useRef, useState, useEffect } from 'react';
import type { Group, Mesh } from 'three';
import * as THREE from 'three';

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

// Critically-damped spring toward a scalar target. Returns updated value+velocity.
function springStep(current: number, velocity: number, target: number, delta: number, stiffness = 10, damping = 5.5) {
  const force = (target - current) * stiffness - velocity * damping;
  const nextVel = velocity + force * delta;
  const next = current + nextVel * delta;
  return [next, nextVel] as const;
}

function ChatBubble({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  const reducedMotion = useReducedMotion();
  const group = useRef<Group>(null);
  const topHalf = useRef<Mesh>(null);
  const bottomHalf = useRef<Mesh>(null);
  const tail = useRef<Mesh>(null);
  const core = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const topVel = useRef(0);
  const botVel = useRef(0);
  const coreVel = useRef(0);
  const scaleVel = useRef(0);

  // Top/bottom hemisphere geometries (built once).
  const topGeo = useMemo(() => new THREE.SphereGeometry(1, 48, 32, 0, Math.PI * 2, 0, Math.PI / 2), []);
  const botGeo = useMemo(() => new THREE.SphereGeometry(1, 48, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (group.current) {
      if (!reducedMotion) {
        group.current.rotation.y += delta * (isOpen ? 0.1 : 0.28);
        group.current.position.y = Math.sin(t * 0.9) * 0.06; // gentle float
      }
      const targetScale = (hovered ? 1.08 : 1) * 1.7;
      const [s, sv] = springStep(group.current.scale.x, scaleVel.current, targetScale, delta, 12, 6);
      scaleVel.current = sv;
      group.current.scale.setScalar(s);
    }

    const splitAmount = isOpen ? 0.55 : 0.02;
    if (topHalf.current) {
      if (reducedMotion) {
        topHalf.current.position.y = splitAmount;
        topHalf.current.rotation.z = isOpen ? -0.25 : 0;
      } else {
        const [y, v] = springStep(topHalf.current.position.y, topVel.current, splitAmount, delta, 9, 5);
        topVel.current = v;
        topHalf.current.position.y = y;
        topHalf.current.rotation.z = (y - 0.02) * -0.5;
      }
    }
    if (bottomHalf.current) {
      if (reducedMotion) {
        bottomHalf.current.position.y = -splitAmount;
        bottomHalf.current.rotation.z = isOpen ? 0.2 : 0;
      } else {
        const [y, v] = springStep(bottomHalf.current.position.y, botVel.current, -splitAmount, delta, 9, 5);
        botVel.current = v;
        bottomHalf.current.position.y = y;
        bottomHalf.current.rotation.z = (y + 0.02) * 0.5;
      }
    }
    if (tail.current) {
      const targetRot = isOpen ? 1.4 : 0;
      tail.current.rotation.z = reducedMotion
        ? targetRot
        : tail.current.rotation.z + (targetRot - tail.current.rotation.z) * Math.min(1, delta * 6);
    }

    const targetCore = isOpen ? 1 : 0.0001;
    if (core.current) {
      if (reducedMotion) {
        core.current.scale.setScalar(targetCore);
      } else {
        const [s, v] = springStep(core.current.scale.x, coreVel.current, targetCore, delta, 8, 4.5);
        coreVel.current = v;
        const clamped = Math.max(0.0001, s);
        const pulse = isOpen ? 1 + Math.sin(t * 2.4) * 0.08 : 1;
        core.current.scale.setScalar(clamped * pulse);
      }
      (core.current.material as THREE.MeshStandardMaterial).emissiveIntensity = isOpen ? 0.8 : 0;
    }
  });

  return (
    <group
      ref={group}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Reliable large invisible hit target */}
      <mesh onClick={(e) => { e.stopPropagation(); onToggle(); }}>
        <sphereGeometry args={[1.35, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Glass body — top half */}
      <mesh ref={topHalf} geometry={topGeo}>
        <meshPhysicalMaterial
          color="#ff6363"
          transmission={0.55}
          thickness={0.6}
          roughness={0.15}
          metalness={0}
          ior={1.3}
          emissive="#ff6363"
          emissiveIntensity={hovered ? 0.22 : 0.12}
        />
      </mesh>
      {/* Wireframe overlay on top half */}
      <mesh geometry={topGeo} scale={1.008}>
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.12} />
      </mesh>

      {/* Glass body — bottom half */}
      <mesh ref={bottomHalf} geometry={botGeo}>
        <meshPhysicalMaterial
          color="#8b5cf6"
          transmission={0.55}
          thickness={0.6}
          roughness={0.15}
          metalness={0}
          ior={1.3}
          emissive="#8b5cf6"
          emissiveIntensity={hovered ? 0.22 : 0.12}
        />
      </mesh>
      <mesh geometry={botGeo} scale={1.008}>
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.12} />
      </mesh>

      {/* Tail */}
      <mesh ref={tail} position={[-0.55, -0.85, 0]}>
        <coneGeometry args={[0.28, 0.42, 4]} />
        <meshPhysicalMaterial
          color="#ff6363"
          transmission={0.5}
          roughness={0.2}
          emissive="#ff6363"
          emissiveIntensity={0.12}
        />
      </mesh>

      {/* Glowing AI core, revealed when open */}
      <mesh ref={core}>
        <icosahedronGeometry args={[0.42, 1]} />
        <meshStandardMaterial color="#ffffff" emissive="#8b5cf6" emissiveIntensity={0} roughness={0.15} metalness={0.4} />
      </mesh>
    </group>
  );
}

function Fallback() {
  return (
    <mesh>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color="#ff6363" transparent opacity={0.15} />
    </mesh>
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
      camera={{ position: [0, 0.2, 4.4], fov: 42 }}
      dpr={[1, 2]}
      className="!absolute inset-0"
      gl={{ alpha: true, antialias: true }}
      style={{ cursor: 'pointer', touchAction: 'none' }}
      onPointerMissed={onToggle}
    >
      <ambientLight intensity={0.55} />
      <pointLight position={[4, 3, 4]} intensity={45} color="#ff6363" />
      <pointLight position={[-4, -2, 2]} intensity={35} color="#8b5cf6" />
      <pointLight position={[0, -3, 3]} intensity={15} color="#ffffff" />
      <Suspense fallback={<Fallback />}>
        <ChatBubble isOpen={isOpen} onToggle={onToggle} />
      </Suspense>
    </Canvas>
  );
}