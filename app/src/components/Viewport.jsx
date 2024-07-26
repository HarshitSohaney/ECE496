import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

const Viewport = () => {
  const canvasRef = useRef(null);
  const [renderer, setRenderer] = useState(null);
  const [camera, setCamera] = useState(null);
  const [controls, setControls] = useState(null);
  const transformModeRef = useRef('translate');

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasRef.current });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    setRenderer(renderer);
    setCamera(camera);

    camera.position.set(5, 5, 5);

    // Add a box to the scene
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // OrbitControls
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.1;

    // TransformControls
    const transformControls = new TransformControls(camera, renderer.domElement);
    transformControls.attach(cube);
    scene.add(transformControls);

    transformControls.addEventListener('change', () => {
      renderer.render(scene, camera);
    });

    transformControls.addEventListener('dragging-changed', (event) => {
      orbitControls.enabled = !event.value;
    });

    setControls({ orbitControls, transformControls });

    // Grid helper
    const gridHelper = new THREE.GridHelper(50, 50);
    scene.add(gridHelper);

    const animate = () => {
      requestAnimationFrame(animate);
      orbitControls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      orbitControls.dispose();
      transformControls.dispose();
      renderer.dispose();
    };
  }, []);

  const setCameraView = (position, lookAt) => {
    if (camera && controls) {
      camera.position.set(...position);
      camera.lookAt(...lookAt);
      controls.orbitControls.update();
    }
  };

  const setTransformMode = (mode) => {
    if (controls) {
      controls.transformControls.setMode(mode);
      transformModeRef.current = mode;
    }
  };

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
      <div style={{ position: 'absolute', zIndex: 10, padding: '10px' }}>
        <button onClick={() => setCameraView([0, 5, 0], [0, 0, 0])}>Top</button>
        <button onClick={() => setCameraView([0, 0, 5], [0, 0, 0])}>Front</button>
        <button onClick={() => setCameraView([5, 0, 0], [0, 0, 0])}>Right</button>
        <button onClick={() => setCameraView([-5, 0, 0], [0, 0, 0])}>Left</button>
        <button onClick={() => setCameraView([0, 0, -5], [0, 0, 0])}>Back</button>
        <button onClick={() => setCameraView([5, 5, 5], [0, 0, 0])}>Perspective</button>
        <button onClick={() => setTransformMode('translate')}>Translate</button>
        <button onClick={() => setTransformMode('rotate')}>Rotate</button>
        <button onClick={() => setTransformMode('scale')}>Scale</button>
      </div>
      <canvas ref={canvasRef} className="viewport-canvas" />
    </div>
  );
};

export default Viewport;
