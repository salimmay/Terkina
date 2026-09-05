'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ContactShadows, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Vertical travel of the build plane, in world units.
const BUILD_MIN = -1.15;
const BUILD_MAX = 1.15;
const CYCLE_SECONDS = 9;
// Portion of the cycle spent printing; the remainder holds the finished piece.
const PRINT_PHASE = 0.82;
const TOTAL_LAYERS = 1240;

interface PrintRigProps {
  // Written to directly from the render loop to avoid re-rendering React 60x/sec.
  layerRef?: React.RefObject<HTMLSpanElement | null>;
  progressRef?: React.RefObject<HTMLDivElement | null>;
}

export default function PrintRig({ layerRef, progressRef }: PrintRigProps) {
  const group = useRef<THREE.Group>(null);
  const sweep = useRef<THREE.Group>(null);

  // Clipping is world-space, so the build plane stays level while the piece spins.
  // solidClip keeps y < h (already printed), ghostClip keeps y > h (still just CAD).
  const solidClip = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), BUILD_MIN), []);
  const ghostClip = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), -BUILD_MIN), []);

  const geometry = useMemo(() => new THREE.TorusKnotGeometry(0.72, 0.24, 260, 36), []);

  // Fine horizontal banding so the printed surface reads as stacked layers.
  const layerTexture = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 4;
    c.height = 256;
    const ctx = c.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 4, 256);
      ctx.fillStyle = '#8b8b8b';
      for (let y = 0; y < 256; y += 4) ctx.fillRect(0, y, 4, 2);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 26);
    return tex;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const cycle = (t % CYCLE_SECONDS) / CYCLE_SECONDS;
    const progress = Math.min(1, cycle / PRINT_PHASE);
    const h = BUILD_MIN + (BUILD_MAX - BUILD_MIN) * progress;

    solidClip.constant = h;
    ghostClip.constant = -h;

    if (sweep.current) {
      sweep.current.position.y = h;
      // The laser plate fades out once the piece is finished.
      const done = progress >= 1;
      sweep.current.visible = !done;
    }

    if (group.current) group.current.rotation.y = t * 0.22;

    if (layerRef?.current) {
      layerRef.current.textContent = String(Math.round(progress * TOTAL_LAYERS)).padStart(4, '0');
    }
    if (progressRef?.current) {
      progressRef.current.style.width = `${progress * 100}%`;
    }
  });

  return (
    <group position={[0, 0.1, 0]}>
      <group ref={group}>
        {/* Already printed — solid, physical, layered */}
        <mesh geometry={geometry} castShadow receiveShadow>
          <meshStandardMaterial
            color="#b9a7d6"
            roughness={0.55}
            metalness={0.35}
            roughnessMap={layerTexture}
            emissive="#4c1d95"
            emissiveIntensity={0.25}
            clippingPlanes={[solidClip]}
            clipShadows
          />
        </mesh>

        {/* Not yet printed — the CAD model, still just data */}
        <mesh geometry={geometry}>
          <meshBasicMaterial
            color="#a855f7"
            wireframe
            transparent
            opacity={0.28}
            clippingPlanes={[ghostClip]}
          />
        </mesh>
      </group>

      {/* The build plane sweeping upward */}
      <group ref={sweep}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.55, 64]} />
          <meshBasicMaterial
            color="#c084fc"
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 1.56, 96]} />
          <meshBasicMaterial
            color="#f3e8ff"
            transparent
            opacity={0.9}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <pointLight color="#c084fc" intensity={6} distance={4} />
      </group>

      {/* Build platform */}
      <ContactShadows position={[0, BUILD_MIN - 0.02, 0]} opacity={0.5} scale={7} blur={2.6} far={3} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, BUILD_MIN - 0.03, 0]}>
        <ringGeometry args={[1.75, 1.79, 96]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>

      {/* Resin dust in the chamber */}
      <Sparkles count={45} scale={[4.5, 3.2, 4.5]} size={1.6} speed={0.25} opacity={0.5} color="#d8b4fe" />
    </group>
  );
}
