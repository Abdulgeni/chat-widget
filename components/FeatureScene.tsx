'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import type { Group, Mesh, Points } from 'three';

type SceneState = 'idle' | 'entering' | 'inside' | 'exiting';

/**
 * Respect prefers-reduced-motion.
 */
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

/**
 * Critically damped spring.
 */
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
 * Camera rig — dollies between the outer view and the inside view.
 */
function CameraRig({ state, reducedMotion }: { state: SceneState; reducedMotion: boolean }) {
  const { camera } = useThree();
  const zRef = useRef(5);
  const zVel = useRef(0);
  const lookYRef = useRef(0);
  const lookYVel = useRef(0);

  useFrame((_, delta) => {
    const insideTarget = state === 'inside' || state === 'entering' ? 0.35 : 5;
    const lookTarget = state === 'inside' || state === 'entering' ? -1.2 : 0;

    if (reducedMotion) {
      zRef.current = insideTarget;
      lookYRef.current = lookTarget;
    } else {
      const [z, zv] = springStep(zRef.current, zVel.current, insideTarget, delta, 6.5, 6.2);
      zRef.current = z;
      zVel.current = zv;
      const [ly, lyv] = springStep(lookYRef.current, lookYVel.current, lookTarget, delta, 6, 6);
      lookYRef.current = ly;
      lookYVel.current = lyv;
    }

    camera.position.set(0, lookYRef.current * 0.15, zRef.current);
    camera.lookAt(0, lookYRef.current, zRef.current - 2);
  });

  return null;
}

/**
 * Radial gradient glow behind the bubble. Fades out when inside.
 */
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
    const target = dim ? 0 : pulse;
    glowMat.uniforms.uIntensity.value += (target - glowMat.uniforms.uIntensity.value) * 0.08;
  });

  return (
    <mesh position={[0, 0, -1.4]}>
      <planeGeometry args={[6.5, 6.5]} />
      <primitive object={glowMat} attach="material" />
    </mesh>
  );
}

/**
 * Orbiting particle flecks. Fade & scatter when entering.
 */
function ParticleFlecks({ scattered, reducedMotion }: { scattered: boolean; reducedMotion: boolean }) {
  const pointsRef = useRef<Points>(null);
  const count = 26;
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
      ).normalize().multiplyScalar(1.6 + Math.random() * 1.4);

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
      const curTheta = reducedMotion ? p.theta : p.theta + t * p.speed * 0.4;
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
    mat.opacity = Math.max(0, (1 - scatterRef.current) * 0.45);
  });

  return (
    <points ref={pointsRef} geometry={geo}>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.45}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * The 3D chat bubble. In "inside" mode, the shell becomes translucent walls.
 */
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
  const innerGeo = useMemo(() => new THREE.SphereGeometry(2.6, 48, 32), []);

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

    // Group float + hover scale
    if (groupRef.current) {
      if (!reducedMotion) {
        groupRef.current.position.y = isInside ? 0 : Math.sin(t * 1.4) * 0.05;
        groupRef.current.rotation.y += delta * (isInside ? 0.02 : 0.22);
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

    // Top half lifts
    const targetTopY = isOpen ? 0.8 : 0;
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

    // Bottom half drops
    const targetBotY = isOpen ? -0.5 : 0;
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

    // Tail curls
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

    // Core
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

    // Interior walls fade in when inside
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

    // Shell opacity
    const splitProgress = Math.min(1, Math.max(0, topYRef.current / 0.8));
    const shellOpacity = THREE.MathUtils.lerp(1.0, 0.28, splitProgress);
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
      {/* Invisible hit target */}
      <mesh>
        <sphereGeometry args={[1.35, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Top half */}
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

      {/* Bottom half */}
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

      {/* Glowing core */}
      <mesh ref={coreMeshRef} geometry={coreGeo} material={coreMaterial} />

      {/* Interior walls — visible only when inside */}
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
 * Main export.
 */
export default function FeatureScene({
  state,
  onToggle,
}: {
  state: SceneState;
  onToggle: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const reducedMotion = useReducedMotion();
  const isInside = state === 'inside' || state === 'entering';

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{
        position: 'absolute',
        inset: 0,
        cursor: hovered && !isInside ? 'pointer' : 'default',
      }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <pointLight position={[4, 3, 4]} intensity={4.0} color="#ff6363" />
        <pointLight position={[-4, -2, 2]} intensity={2.5} color="#8b5cf6" />
        <directionalLight position={[0, 2, -4]} intensity={1.8} color="#c084fc" />

        <CameraRig state={state} reducedMotion={reducedMotion} />
        <BackgroundGlow dim={isInside} />
        <ParticleFlecks scattered={isInside} reducedMotion={reducedMotion} />
        <ChatBubble
          state={state}
          onToggle={onToggle}
          hovered={hovered}
          setHovered={setHovered}
          reducedMotion={reducedMotion}
        />
      </Suspense>
    </Canvas>
  );
}