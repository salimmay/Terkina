'use client';

import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Center, 
  Bounds, 
  Float, 
  Environment, 
  ContactShadows,
  Sparkles,
  useGLTF 
} from '@react-three/drei';
import * as THREE from 'three';
import CanvasLoader from './CanvasLoader';

export function CursorLight() {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!lightRef.current) return;
    // Map mouse [-1, 1] screen coords to 3D space
    const targetX = (state.pointer.x * state.viewport.width) / 2;
    const targetY = (state.pointer.y * state.viewport.height) / 2;

    lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, targetX, 0.1);
    lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, targetY, 0.1);
    lightRef.current.position.z = 2.5;
  });

  return (
    <>
      {/* Mouse reactive point light */}
      <pointLight ref={lightRef} intensity={2.5} distance={10} color="#a855f7" />
      {/* Floating dust/sparks */}
      <Sparkles count={50} scale={5} size={2} speed={0.4} opacity={0.6} color="#c084fc" />
    </>
  );
}

// Helper component if you are loading a GLB/GLTF model
function Model({ url }: { url?: string }) {
  if (!url) {
    // Fallback wireframe / mesh if no GLB URL is passed
    return (
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color="#1e1035"
          emissive="#4c1d95"
          emissiveIntensity={0.3}
          roughness={0.2}
          metalness={0.8}
          wireframe={true}
        />
      </mesh>
    );
  }

  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

interface ThreeDViewerProps {
  modelUrl?: string;
}

export default function ThreeDViewer({ modelUrl }: ThreeDViewerProps) {
  return (
    <div className="relative w-full h-full min-h-[380px] lg:min-h-[600px] flex items-center justify-center bg-radial from-[#120f1d] via-[#08080c] to-black overflow-hidden rounded-2xl">
      {/* 3D Canvas with touchAction pan-y for smooth mobile page scrolling */}
      <Canvas
        style={{ touchAction: 'pan-y' }}
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full"
      >
        {/* Ambient & Studio Lighting */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#c084fc" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#3b82f6" />
        <pointLight position={[0, 2, 2]} intensity={2} color="#ec4899" />

        {/* Dynamic Cursor Light & Dust Particles */}
        <CursorLight />

        <Suspense fallback={<CanvasLoader />}>
          {/* Bounds & Center automatically fix any off-center / oversized models */}
          <Bounds fit clip observe margin={1.2}>
            <Center>
              <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.4}>
                <Model url={modelUrl} />
              </Float>
            </Center>
          </Bounds>

          {/* Realistic contact shadow beneath the object */}
          <ContactShadows
            position={[0, -1.8, 0]}
            opacity={0.6}
            scale={10}
            blur={2}
            far={4}
            color="#000000"
          />
          
          <Environment preset="city" />
        </Suspense>

        {/* Orbit Controls restricted with mobile gesture optimization */}
        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={true}
          minDistance={2.5}
          maxDistance={9}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.8}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN,
          }}
        />
      </Canvas>

      {/* Floating Status Badge (Bottom-Left) */}
      <div className="absolute bottom-5 left-5 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-white/70 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Drag to rotate • WebGL Realtime Engine</span>
      </div>
    </div>
  );
}
