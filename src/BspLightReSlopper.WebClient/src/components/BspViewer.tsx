import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { Job } from '../services/api';

interface Props {
  job: Job | null;
}

export default function BspViewer({ job }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const w = el.clientWidth;
    const h = el.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f0f12);
    const camera = new THREE.PerspectiveCamera(60, w / h, 1, 4096);
    camera.position.set(0, 128, 256);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    el.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const grid = new THREE.GridHelper(512, 64, 0x444444, 0x222222);
    scene.add(grid);

    const ambient = new THREE.AmbientLight(0x404040);
    scene.add(ambient);

    // Placeholder for BSP geometry - will be replaced with actual mesh loading.
    const geom = new THREE.BoxGeometry(64, 64, 64);
    const mat = new THREE.MeshStandardMaterial({ color: 0x336699, roughness: 0.8 });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.y = 32;
    scene.add(mesh);

    const dir = new THREE.DirectionalLight(0xffffff, 1);
    dir.position.set(100, 200, 100);
    scene.add(dir);

    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      mesh.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const nw = el.clientWidth;
      const nh = el.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>
        {job ? job.name : 'No job selected'}
      </div>
    </div>
  );
}
