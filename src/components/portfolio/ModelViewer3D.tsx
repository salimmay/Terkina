'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ThreeDProjectItem } from '@/lib/mockData';

interface ModelViewer3DProps {
  project: ThreeDProjectItem;
}

export default function ModelViewer3D({ project }: ModelViewer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x09090b);
    scene.fog = new THREE.FogExp2(0x09090b, 0.05);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 4.5);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // 4. Lighting Setup with Dynamic Sweep Effect
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const mainLight = new THREE.SpotLight(project.color || 0x3b82f6, 15);
    mainLight.position.set(5, 8, 5);
    mainLight.castShadow = true;
    mainLight.angle = Math.PI / 4;
    mainLight.penumbra = 0.8;
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 4);
    rimLight.position.set(-5, -2, -5);
    scene.add(rimLight);

    const sweepLight = new THREE.PointLight(0x8b5cf6, 10, 10);
    sweepLight.position.set(0, 3, 0);
    scene.add(sweepLight);

    // 5. Shadow Floor Plane
    const floorGeo = new THREE.PlaneGeometry(20, 20);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.4 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.2;
    floor.receiveShadow = true;
    scene.add(floor);

    // 6. Geometry Selection
    let geometry: THREE.BufferGeometry;
    switch (project.geometryType) {
      case 'sphere':
        geometry = new THREE.IcosahedronGeometry(1.2, 4);
        break;
      case 'octahedron':
        geometry = new THREE.OctahedronGeometry(1.3, 0);
        break;
      case 'dodecahedron':
        geometry = new THREE.DodecahedronGeometry(1.2, 0);
        break;
      case 'cube':
        geometry = new THREE.BoxGeometry(1.6, 1.6, 1.6);
        break;
      case 'torusKnot':
      default:
        geometry = new THREE.TorusKnotGeometry(0.9, 0.32, 128, 32);
        break;
    }

    // 7. PBR Metallic/Glass Material
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(project.color || '#3b82f6'),
      metalness: 0.6,
      roughness: 0.2,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
      transmission: 0.2, // Subtle glass refraction effect
      ior: 1.5,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 0.1;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    // Wireframe Outer Cage Accent
    const wireframeGeo = new THREE.WireframeGeometry(geometry);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.15,
    });
    const wireframe = new THREE.LineSegments(wireframeGeo, wireframeMat);
    mesh.add(wireframe);

    // 8. Mouse Drag Interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      mesh.rotation.y += deltaX * 0.01;
      mesh.rotation.x += deltaY * 0.01;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // 9. Animation Loop with Dynamic Lighting Sweep
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow Idle Rotation
      if (!isDragging) {
        mesh.rotation.y = elapsedTime * 0.4;
        mesh.rotation.x = Math.sin(elapsedTime * 0.3) * 0.2;
      }

      // Dynamic Light Sweep Movement
      sweepLight.position.x = Math.sin(elapsedTime * 1.5) * 3;
      sweepLight.position.z = Math.cos(elapsedTime * 1.5) * 3;

      renderer.render(scene, camera);
    };

    animate();

    // 10. Resize Listener
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [project]);

  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center overflow-hidden">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute bottom-4 left-4 bg-zinc-900/80 border border-zinc-800 rounded-full px-3 py-1 text-xs text-zinc-400 pointer-events-none flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span>Drag to rotate • WebGL Realtime Engine</span>
      </div>
    </div>
  );
}
