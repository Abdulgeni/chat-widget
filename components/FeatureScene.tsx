'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Billboard, Text, RoundedBox, OrbitControls } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import type { Group, Mesh, Points } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

export type SceneState = 'idle' | 'entering' | 'inside' | 'exiting';

export interface FeatureItem {
  title: string;
  body: string;
  icon?: unknown;
}

export interface FeatureSceneProps {
  state: SceneState;
  onToggle: () => void;
  features: FeatureItem[];
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

function springStep(
  current: number,
  velocity: number,
  target: number,
  delta: number,
  stiffness = 11,
  damping = 5.8
) {
  const dt = Math.min(delta, 0.064);
  const force = (target - current) * stiffness - velocity * damping;
  const nextVel = velocity + force * dt;
  const next = current + nextVel * dt;
  return [next, nextVel] as const;
}

/**
 * Manages smooth dolly-in when entering the bubble and seamless return when exiting.
 */
function CameraRig({
  state,
  reducedMotion,
  controlsRef,
}: {
  state: SceneState;
  reducedMotion: boolean;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}) {
  const { camera } = useThree();
  const posX = useRef(0);
  const posY = useRef(0);
  const posZ = useRef(5);
  const velX = useRef(0);
  const velY = useRef(0);
  const velZ = useRef(0);

  const lookX = useRef(0);
  const lookY = useRef(0);
  const lookZ = useRef(0);
  const velLookX = useRef(0);
  const velLookY = useRef(0);
  const velLookZ = useRef(0);

  const prevInside = useRef(false);

  useFrame((_, delta) => {
    if (state === 'inside') {
      // Cache current camera coordinates so exiting smoothly interpolates from user's orbit position
      posX.current = camera.position.x;
      posY.current = camera.position.y;
      posZ.current = camera.position.z;
      velX.current = 0;
      velY.current = 0;
      velZ.current = 0;
      prevInside.current = true;
      return;
    }

    if (prevInside.current && state === 'exiting') {
      prevInside.current = false;
      if (controlsRef.current) {
        controlsRef.current.reset();
      }
    }

    const targetZ = state === 'entering' ? 1.35 : 5;
    const targetY = 0;
    const targetX = 0;

    if (reducedMotion) {
      posX.current = targetX;
      posY.current = targetY;
      posZ.current = targetZ;
      lookX.current = 0;
      lookY.current = 0;
      lookZ.current = 0;
    } else {
      const [nx, vx] = springStep(posX.current, velX.current, targetX, delta, 7, 5.6);
      const [ny, vy] = springStep(posY.current, velY.current, targetY, delta, 7, 5.6);
      const [nz, vz] = springStep(posZ.current, velZ.current, targetZ, delta, 7, 5.6);
      posX.current = nx;
      posY.current = ny;
      posZ.current = nz;
      velX.current = vx;
      velY.current = vy;
      velZ.current = vz;

      const [lx, vlx] = springStep(lookX.current, velLookX.current, 0, delta, 7, 5.6);
      const [ly, vly] = springStep(lookY.current, velLookY.current, 0, delta, 7, 5.6);
      const [lz, vlz] = springStep(lookZ.current, velLookZ.current, 0, delta, 7, 5.6);
      lookX.current = lx;
      lookY.current = ly;
      lookZ.current = lz;
      velLookX.current = vlx;
      velLookY.current = vly;
      velLookZ.current = vlz;
    }

    camera.position.set(posX.current, posY.current, posZ.current);
    camera.lookAt(lookX.current, lookY.current, lookZ.current);
  });

  return null;
}

function BackgroundGlow({ dim }: { dim: boolean }) {
  const glowMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uCoral: { value: new THREE.Color('#ff6363') },
        uViolet: { value: new THREE.Color('#8b5cf6') },
        uIntensity: { value: 0.6 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec3 uCoral;
        uniform vec3 uViolet;
        uniform float uIntensity;
        void main() {
          float dist = distance(vUv, vec2(0.5));
          float alpha = smoothstep(0.5, 0.05, dist);
          vec3 col = mix(uCoral, uViolet, smoothstep(0.05, 0.45, dist));
          gl_FragColor = vec4(col, alpha * 0.38 * uIntensity);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useEffect(() => () => glowMat.dispose(), [glowMat]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = 1.0 + Math.sin(t * 2.0) * 0.12;
    const target = dim ? 0.12 : pulse;
    glowMat.uniforms.uIntensity.value += (target - glowMat.uniforms.uIntensity.value) * 0.08;
  });

  return (
    <mesh position={[0, 0, -1.4]}>
      <planeGeometry args={[6.5, 6.5]} />
      <primitive object={glowMat} attach="material" />
    </mesh>
  );
}

function ParticleFlecks({ scattered, reducedMotion }: { scattered: boolean; reducedMotion: boolean }) {
  const pointsRef = useRef<Points>(null);
  const count = 32;
  const scatterRef = useRef(0);
  const scatterVel = useRef(0);

  const [geo, particles] = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const data: { radius: number; theta: number; phi: number; speed: number; scatterDir: THREE.Vector3 }[] = [];

    const coral = new THREE.Color('#ff6363');
    const violet = new THREE.Color('#a78bfa');

    for (let i = 0; i < count; i++) {
      const radius = 1.35 + Math.random() * 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.75;
      const speed = (0.35 + Math.random() * 0.45) * (Math.random() > 0.5 ? 1 : -1);
      const scatterDir = new THREE.Vector3(
        Math.cos(phi) * Math.cos(theta),
        Math.sin(phi) + (Math.random() - 0.5) * 0.4,
        Math.cos(phi) * Math.sin(theta)
      ).normalize().multiplyScalar(1.8 + Math.random() * 1.5);

      const color = coral.clone().lerp(violet, Math.random());
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      data.push({ radius, theta, phi, speed, scatterDir });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return [geometry, data] as const;
  }, []);

  useEffect(() => () => geo.dispose(), [geo]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    const target = scattered ? 1 : 0;

    if (reducedMotion) {
      scatterRef.current = target;
    } else {
      const [s, v] = springStep(scatterRef.current, scatterVel.current, target, delta, 8.5, 5.2);
      scatterRef.current = s;
      scatterVel.current = v;
    }

    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const p = particles[i];
      const curTheta = reducedMotion ? p.theta : p.theta + t * p.speed * 0.35;
      const baseR = p.radius + (reducedMotion ? 0 : Math.sin(t * 1.6 + i) * 0.05);
      const bx = baseR * Math.cos(p.phi) * Math.cos(curTheta);
      const by = baseR * Math.sin(p.phi);
      const bz = baseR * Math.cos(p.phi) * Math.sin(curTheta);
      const s = scatterRef.current;
      arr[i * 3] = bx + p.scatterDir.x * s;
      arr[i * 3 + 1] = by + p.scatterDir.y * s;
      arr[i * 3 + 2] = bz + p.scatterDir.z * s;
    }
    posAttr.needsUpdate = true;

    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.opacity = Math.max(0.08, (1 - scatterRef.current * 0.7) * 0.45);
  });

  return (
    <points ref={pointsRef} geometry={geo}>
      <pointsMaterial
        size={0.055}
        vertexColors
        transparent
        opacity={0.45}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function ChatBubble({
  state,
  onToggle,
  hovered,
  setHovered,
  reducedMotion,
}: {
  state: SceneState;
  onToggle: () => void;
  hovered: boolean;
  setHovered: (h: boolean) => void;
  reducedMotion: boolean;
}) {
  const groupRef = useRef<Group>(null);
  const topGroupRef = useRef<Group>(null);
  const bottomGroupRef = useRef<Group>(null);
  const tailGroupRef = useRef<Group>(null);
  const coreMeshRef = useRef<Mesh>(null);
  const innerShellRef = useRef<Group>(null);

  const topMatRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const botMatRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const tailMatRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const innerMatRef = useRef<THREE.MeshBasicMaterial>(null);

  const topYRef = useRef(0);
  const topYVel = useRef(0);
  const botYRef = useRef(0);
  const botYVel = useRef(0);
  const coreScaleRef = useRef(0.0001);
  const coreScaleVel = useRef(0);
  const tailScaleRef = useRef(1);
  const tailScaleVel = useRef(0);
  const hoverScaleRef = useRef(1);
  const hoverScaleVel = useRef(0);
  const innerOpacityRef = useRef(0);
  const innerOpacityVel = useRef(0);

  const topGeo = useMemo(() => new THREE.SphereGeometry(1, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), []);
  const botGeo = useMemo(() => new THREE.SphereGeometry(1, 48, 24, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), []);
  const tailGeo = useMemo(() => new THREE.ConeGeometry(0.22, 0.45, 16), []);
  const coreGeo = useMemo(() => new THREE.SphereGeometry(0.38, 32, 32), []);
  const innerGeo = useMemo(() => new THREE.SphereGeometry(2.7, 48, 32), []);

  const coreMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uCoral: { value: new THREE.Color('#ff6363') },
        uViolet: { value: new THREE.Color('#8b5cf6') },
        uIntensity: { value: 0.0 },
        uOpacity: { value: 0.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uCoral;
        uniform vec3 uViolet;
        uniform float uIntensity;
        uniform float uOpacity;
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vec3 grad = mix(uCoral, uViolet, vUv.y);
          float fresnel = pow(1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.2);
          vec3 color = grad * uIntensity + vec3(1.0, 0.85, 0.95) * fresnel * uIntensity * 0.75;
          gl_FragColor = vec4(color, uOpacity);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useEffect(() => {
    return () => {
      topGeo.dispose();
      botGeo.dispose();
      tailGeo.dispose();
      coreGeo.dispose();
      innerGeo.dispose();
      coreMaterial.dispose();
    };
  }, [topGeo, botGeo, tailGeo, coreGeo, innerGeo, coreMaterial]);

  useFrame((_, delta) => {
    const t = performance.now() / 1000;
    const isOpen = state === 'entering' || state === 'inside';
    const isInside = state === 'inside';

    if (groupRef.current) {
      if (!reducedMotion) {
        groupRef.current.position.y = isInside ? 0 : Math.sin(t * 1.4) * 0.05;
        groupRef.current.rotation.y += delta * (isInside ? 0.015 : 0.22);
      } else {
        groupRef.current.position.y = 0;
      }

      const breath = !isOpen && !reducedMotion
        ? 1.0 + (Math.sin(t * ((Math.PI * 2) / 3.0)) * 0.5 + 0.5) * 0.02
        : 1.0;

      const targetHover = hovered && !isOpen ? 1.06 : 1.0;
      if (reducedMotion) {
        hoverScaleRef.current = targetHover;
      } else {
        const [s, v] = springStep(hoverScaleRef.current, hoverScaleVel.current, targetHover, delta, 12, 6);
        hoverScaleRef.current = s;
        hoverScaleVel.current = v;
      }
      const cs = hoverScaleRef.current * breath;
      groupRef.current.scale.set(cs, cs, cs);
    }

    const targetTopY = isInside ? 1.15 : isOpen ? 0.8 : 0;
    if (reducedMotion) topYRef.current = targetTopY;
    else {
      const [y, v] = springStep(topYRef.current, topYVel.current, targetTopY, delta, 10, 5.5);
      topYRef.current = y;
      topYVel.current = v;
    }
    if (topGroupRef.current) {
      topGroupRef.current.position.y = topYRef.current;
      topGroupRef.current.rotation.x = (topYRef.current / 0.8) * -0.28;
    }

    const targetBotY = isInside ? -0.85 : isOpen ? -0.5 : 0;
    if (reducedMotion) botYRef.current = targetBotY;
    else {
      const [y, v] = springStep(botYRef.current, botYVel.current, targetBotY, delta, 10, 5.5);
      botYRef.current = y;
      botYVel.current = v;
    }
    if (bottomGroupRef.current) {
      bottomGroupRef.current.position.y = botYRef.current;
      bottomGroupRef.current.rotation.x = (botYRef.current / -0.5) * 0.16;
    }

    const targetTailScale = isOpen ? 0.0001 : 1;
    if (reducedMotion) tailScaleRef.current = targetTailScale;
    else {
      const [s, v] = springStep(tailScaleRef.current, tailScaleVel.current, targetTailScale, delta, 11, 5.8);
      tailScaleRef.current = s;
      tailScaleVel.current = v;
    }
    if (tailGroupRef.current) {
      tailGroupRef.current.scale.setScalar(tailScaleRef.current);
    }

    const targetCoreScale = isOpen ? 1 : 0.0001;
    if (reducedMotion) coreScaleRef.current = targetCoreScale;
    else {
      const [s, v] = springStep(coreScaleRef.current, coreScaleVel.current, targetCoreScale, delta, 9.5, 5.2);
      coreScaleRef.current = s;
      coreScaleVel.current = v;
    }
    if (coreMeshRef.current) {
      const pulse = isInside ? 1.0 + Math.sin(t * 2.8) * 0.06 : 1.0;
      coreMeshRef.current.scale.setScalar(Math.max(0.0001, coreScaleRef.current * pulse));
      coreMaterial.uniforms.uOpacity.value = Math.min(1.0, coreScaleRef.current * 1.3);
      coreMaterial.uniforms.uIntensity.value = isOpen ? 1.5 : 0.0;
    }

    const targetInnerOpacity = isInside ? 0.22 : 0;
    if (reducedMotion) innerOpacityRef.current = targetInnerOpacity;
    else {
      const [o, v] = springStep(innerOpacityRef.current, innerOpacityVel.current, targetInnerOpacity, delta, 5, 6);
      innerOpacityRef.current = o;
      innerOpacityVel.current = v;
    }
    if (innerMatRef.current) {
      innerMatRef.current.opacity = innerOpacityRef.current;
    }
    if (innerShellRef.current) {
      innerShellRef.current.visible = innerOpacityRef.current > 0.005;
    }

    const splitProgress = Math.min(1, Math.max(0, topYRef.current / 0.8));
    const shellOpacity = THREE.MathUtils.lerp(1.0, 0.24, splitProgress);
    const emissiveInt = hovered && !isOpen ? 0.25 : 0.12;

    if (topMatRef.current) {
      topMatRef.current.opacity = shellOpacity;
      topMatRef.current.emissiveIntensity = emissiveInt;
    }
    if (botMatRef.current) {
      botMatRef.current.opacity = shellOpacity;
      botMatRef.current.emissiveIntensity = emissiveInt;
    }
    if (tailMatRef.current) {
      tailMatRef.current.opacity = Math.max(0, 1 - splitProgress * 1.2);
    }
  });

  const isOpen = state === 'entering' || state === 'inside';

  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        if (isOpen) return;
        e.stopPropagation();
        onToggle();
      }}
      onPointerOver={(e) => {
        if (isOpen) return;
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => {
        setHovered(false);
      }}
    >
      {/* Large invisible hit sphere */}
      <mesh>
        <sphereGeometry args={[1.35, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Top half shell */}
      <group ref={topGroupRef} scale={[1, 0.85, 0.9]}>
        <mesh geometry={topGeo}>
          <meshPhysicalMaterial
            ref={topMatRef}
            color="#ff6363"
            transmission={0.9}
            roughness={0.15}
            thickness={0.5}
            ior={1.4}
            emissive="#8b5cf6"
            emissiveIntensity={0.12}
            transparent
            opacity={1.0}
          />
        </mesh>
        <mesh geometry={topGeo} scale={1.002}>
          <meshBasicMaterial color="#ff6363" wireframe transparent opacity={0.15} depthWrite={false} />
        </mesh>
      </group>

      {/* Bottom half shell */}
      <group ref={bottomGroupRef} scale={[1, 0.85, 0.9]}>
        <mesh geometry={botGeo}>
          <meshPhysicalMaterial
            ref={botMatRef}
            color="#ff6363"
            transmission={0.9}
            roughness={0.15}
            thickness={0.5}
            ior={1.4}
            emissive="#8b5cf6"
            emissiveIntensity={0.12}
            transparent
            opacity={1.0}
          />
        </mesh>
        <mesh geometry={botGeo} scale={1.002}>
          <meshBasicMaterial color="#ff6363" wireframe transparent opacity={0.15} depthWrite={false} />
        </mesh>
      </group>

      {/* Tail */}
      <group ref={tailGroupRef} position={[-0.66, -0.62, 0]} rotation={[0, 0, Math.PI * 0.75]}>
        <mesh geometry={tailGeo}>
          <meshPhysicalMaterial
            ref={tailMatRef}
            color="#ff6363"
            transmission={0.9}
            roughness={0.15}
            thickness={0.5}
            emissive="#8b5cf6"
            emissiveIntensity={0.12}
            transparent
            opacity={1.0}
          />
        </mesh>
      </group>

      {/* Interior glowing core */}
      <mesh ref={coreMeshRef} geometry={coreGeo} material={coreMaterial} />

      {/* Subtle interior wireframe sphere seen when camera is inside */}
      <group ref={innerShellRef} visible={false}>
        <mesh geometry={innerGeo}>
          <meshBasicMaterial
            ref={innerMatRef}
            color="#ff6363"
            wireframe
            transparent
            opacity={0}
            side={THREE.BackSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Computes a balanced 3D distribution of the 12 panels wrapped across all three axes.
 */
function useLayoutPositions(count: number, radius = 2.15) {
  return useMemo(() => {
    const positions: [number, number, number][] = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~2.39996 rad

    for (let i = 0; i < count; i++) {
      const yNorm = 1 - (i / Math.max(1, count - 1)) * 2; // +1 to -1
      const y = yNorm * 0.95;
      const r = Math.sqrt(Math.max(0.18, 1 - yNorm * yNorm * 0.7)) * radius;
      const theta = goldenAngle * i;

      // Deterministic jitter to break rigid mathematical symmetry
      const jx = Math.sin(i * 12.9898) * 0.16;
      const jy = Math.cos(i * 78.233) * 0.12;
      const jz = Math.sin(i * 45.164) * 0.16;

      const x = Math.cos(theta) * r + jx;
      const yy = y + jy;
      const z = Math.sin(theta) * r + jz;

      positions.push([x, yy, z]);
    }
    return positions;
  }, [count, radius]);
}

function FeaturePanel({
  feature,
  position,
  index,
  visible,
  reducedMotion,
}: {
  feature: FeatureItem;
  position: [number, number, number];
  index: number;
  visible: boolean;
  reducedMotion: boolean;
}) {
  const groupRef = useRef<Group>(null);
  const panelRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [started, setStarted] = useState(false);

  const scaleRef = useRef(0.0001);
  const scaleVel = useRef(0);
  const hoverRef = useRef(1);
  const hoverVel = useRef(0);

  useEffect(() => {
    if (!visible) {
      setStarted(false);
      return;
    }
    const delay = reducedMotion ? 0 : 100 + index * 45;
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [visible, index, reducedMotion]);

  const phase = useMemo(() => index * 0.52 + Math.PI * 0.25, [index]);
  const driftSpeed = useMemo(() => 0.38 + (index % 3) * 0.12, [index]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const targetScale = visible && started ? 1 : 0.0001;

    if (reducedMotion) {
      scaleRef.current = targetScale;
    } else {
      const [s, v] = springStep(scaleRef.current, scaleVel.current, targetScale, delta, 8.5, 5.4);
      scaleRef.current = s;
      scaleVel.current = v;
    }

    const targetHover = hovered ? 1.08 : 1.0;
    if (reducedMotion) {
      hoverRef.current = targetHover;
    } else {
      const [s, v] = springStep(hoverRef.current, hoverVel.current, targetHover, delta, 14, 6.5);
      hoverRef.current = s;
      hoverVel.current = v;
    }

    if (groupRef.current) {
      const finalScale = Math.max(0.0001, scaleRef.current) * hoverRef.current;
      groupRef.current.scale.setScalar(finalScale);

      if (!reducedMotion) {
        groupRef.current.position.set(
          position[0] + Math.sin(t * driftSpeed + phase) * 0.08,
          position[1] + Math.cos(t * driftSpeed * 0.85 + phase) * 0.07,
          position[2] + Math.sin(t * driftSpeed * 0.65 + phase * 1.3) * 0.08
        );
      } else {
        groupRef.current.position.set(...position);
      }
    }

    if (panelRef.current && !reducedMotion) {
      panelRef.current.rotation.z = Math.sin(t * 0.35 + phase) * 0.03;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Billboard follow lockX={false} lockY={false} lockZ={false}>
        <group
          ref={panelRef}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => setHovered(false)}
        >
          {/* Glassmorphic Rounded 3D Tablet */}
          <RoundedBox args={[1.54, 0.72, 0.025]} radius={0.06} smoothness={4}>
            <meshPhysicalMaterial
              color={hovered ? '#1a1020' : '#0c0914'}
              transmission={0.42}
              roughness={0.22}
              thickness={0.35}
              transparent
              opacity={0.88}
              emissive={hovered ? '#ff6363' : '#8b5cf6'}
              emissiveIntensity={hovered ? 0.3 : 0.08}
            />
          </RoundedBox>

          {/* Subtle luminous border outline */}
          <lineSegments position={[0, 0, 0.015]}>
            <edgesGeometry args={[new THREE.BoxGeometry(1.54, 0.72, 0.025)]} />
            <lineBasicMaterial
              color={hovered ? '#ff6363' : '#a78bfa'}
              transparent
              opacity={hovered ? 0.8 : 0.22}
              depthWrite={false}
            />
          </lineSegments>

          {/* Feature Number Pill */}
          <Text
            position={[-0.62, 0.22, 0.022]}
            fontSize={0.042}
            color={hovered ? '#ff8a8a' : '#8b5cf6'}
            anchorX="left"
            anchorY="middle"
            letterSpacing={0.12}
          >
            {`// ${(index + 1).toString().padStart(2, '0')}`}
          </Text>

          {/* Feature Title */}
          <Text
            position={[-0.62, 0.09, 0.022]}
            fontSize={0.076}
            color="#ffffff"
            anchorX="left"
            anchorY="middle"
            maxWidth={1.24}
          >
            {feature.title}
          </Text>

          {/* Feature Description */}
          <Text
            position={[-0.62, -0.11, 0.022]}
            fontSize={0.048}
            color={hovered ? '#e2e8f0' : '#9ca3af'}
            anchorX="left"
            anchorY="top"
            maxWidth={1.24}
            lineHeight={1.35}
          >
            {feature.body}
          </Text>
        </group>
      </Billboard>
    </group>
  );
}

function FeaturePanels({
  features,
  visible,
  reducedMotion,
}: {
  features: FeatureItem[];
  visible: boolean;
  reducedMotion: boolean;
}) {
  const positions = useLayoutPositions(features.length, 2.15);
  return (
    <group>
      {features.map((f, i) => (
        <FeaturePanel
          key={f.title}
          feature={f}
          position={positions[i] || [0, 0, 0]}
          index={i}
          visible={visible}
          reducedMotion={reducedMotion}
        />
      ))}
    </group>
  );
}

/**
 * Interior Orbit Controls allowing the user to rotate camera around the scene.
 * Clamped pitch prevents disorientation; clamped distance keeps the camera inside the bubble.
 */
function InteriorOrbit({
  enabled,
  controlsRef,
}: {
  enabled: boolean;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}) {
  useEffect(() => {
    if (controlsRef.current && enabled) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [enabled, controlsRef]);

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={enabled}
      enablePan={false}
      enableZoom={true}
      minDistance={0.7}
      maxDistance={2.2}
      minPolarAngle={Math.PI * 0.15}
      maxPolarAngle={Math.PI * 0.85}
      rotateSpeed={0.55}
      zoomSpeed={0.65}
      enableDamping={true}
      dampingFactor={0.06}
    />
  );
}

export default function FeatureScene({
  state,
  onToggle,
  features,
}: FeatureSceneProps) {
  const [hovered, setHovered] = useState(false);
  const reducedMotion = useReducedMotion();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const isInside = state === 'inside';
  const isEnteringOrInside = state === 'inside' || state === 'entering';
  const panelsVisible = state === 'inside' || state === 'entering';

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{
        position: 'absolute',
        inset: 0,
        cursor: isInside ? 'grab' : hovered && !isEnteringOrInside ? 'pointer' : 'default',
        touchAction: 'none',
      }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.45} />
        <pointLight position={[4, 3, 4]} intensity={4.0} color="#ff6363" />
        <pointLight position={[-4, -2, 2]} intensity={2.5} color="#8b5cf6" />
        <directionalLight position={[0, 2, -4]} intensity={1.8} color="#c084fc" />

        {/* Smooth camera transitions between idle, enter, and exit */}
        <CameraRig state={state} reducedMotion={reducedMotion} controlsRef={controlsRef} />

        {/* Soft radial glow behind bubble */}
        <BackgroundGlow dim={isEnteringOrInside} />

        {/* Star-like floating particles that disperse on enter */}
        <ParticleFlecks scattered={isEnteringOrInside} reducedMotion={reducedMotion} />

        {/* Chat bubble that splits open to reveal the interior */}
        <ChatBubble
          state={state}
          onToggle={onToggle}
          hovered={hovered}
          setHovered={setHovered}
          reducedMotion={reducedMotion}
        />

        {/* 3D Feature Panels floating inside the bubble */}
        <FeaturePanels features={features} visible={panelsVisible} reducedMotion={reducedMotion} />

        {/* Drag-to-orbit controls active once fully inside */}
        <InteriorOrbit enabled={isInside} controlsRef={controlsRef} />
      </Suspense>
    </Canvas>
  );
}