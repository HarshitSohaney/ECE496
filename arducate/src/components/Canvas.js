// src/components/Canvas.js
import React, { useRef, useEffect, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls, TransformControls } from "@react-three/drei";
import { useAtom } from "jotai";
import { arObjectsAtom, selectedObjectAtom, transformModeAtom } from "../atoms";
import ARObject from "./ARObject";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from 'three';
// This function sets up and manages the CSS2DRenderer for rendering 2D labels in a 3D scene
function CSS2DRendererSetup() {
  const { gl, scene, camera } = useThree();
  // Create a ref to store the CSS2DRenderer instance
  const labelRendererRef = useRef();

  useEffect(() => {
    labelRendererRef.current = new CSS2DRenderer();
    // Set the renderer size to match the window dimensions
    labelRendererRef.current.setSize(window.innerWidth, window.innerHeight);
    // Configure the renderer's DOM element styles
    labelRendererRef.current.domElement.style.position = 'absolute';
    labelRendererRef.current.domElement.style.top = '0px';
    labelRendererRef.current.domElement.style.left = '0px'; // Ensure it's aligned properly
    labelRendererRef.current.domElement.style.pointerEvents = 'none';
    labelRendererRef.current.domElement.style.zIndex = '1'; // Ensure it's on top

    document.body.appendChild(labelRendererRef.current.domElement);

    // Function to handle window resize events
    const onResize = () => {
      labelRendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // Cleanup function to remove the renderer and event listener when component unmounts
    return () => {
      if (labelRendererRef.current && labelRendererRef.current.domElement) {
        labelRendererRef.current.domElement.remove();
      }
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Use the useFrame hook to render the CSS2DRenderer every frame
  useFrame(() => {
    if (labelRendererRef.current) {
      labelRendererRef.current.render(scene, camera);
    }
  });

  // This component doesn't render anything directly, so return null
  return null;
}


const ARCanvas = () => {
  const [selectedObject] = useAtom(selectedObjectAtom);
  const [arObjects, setARObjects] = useAtom(arObjectsAtom);
  const [transformMode] = useAtom(transformModeAtom);
  const [transformControlsRef, setTransformControlsRef] = useState(null); // State to store the selected object's mesh ref

  // Handle the transformation change and update state
const handleObjectTransform = useCallback(() => {
  if (!selectedObject || !transformControlsRef) return;

  // Create a new Euler from the TransformControls' quaternion
  const euler = new THREE.Euler().setFromQuaternion(transformControlsRef.quaternion);
  const transformedRotation = [
    radiansToDegrees(euler.x),
    radiansToDegrees(euler.y), 
    radiansToDegrees(euler.z)
  ]; // Only keep 3 values, no NaN

  setARObjects({
    type: 'UPDATE_OBJECT',
    payload: {
      id: selectedObject.id,
      position: transformControlsRef.position.toArray(),
      rotation: transformedRotation,
      scale: transformControlsRef.scale.toArray(),
    }
  });
  }, [transformControlsRef, setARObjects]);

  
  // Grid configuration
  const gridConfig = {
    args: [10.5, 10.5],
    cellSize: 0.6,
    cellThickness: 1,
    cellColor: '#6f6f6f',
    sectionSize: 3.3,
    sectionThickness: 1.5,
    sectionColor: '#9d4b4b',
    fadeDistance: 25,
    fadeStrength: 1,
    followCamera: false,
    infiniteGrid: true,
  };

  // Attach event listener for TransformControls changes
  useEffect(() => {
    if (transformControlsRef) {
      transformControlsRef.addEventListener('change', handleObjectTransform);
      return () => {
        transformControlsRef.removeEventListener('change', handleObjectTransform);
      };
    }
  }, [transformControlsRef, handleObjectTransform]);

  return (
    <div className="w-[70vw] border border-gray-300">
      <Canvas camera={{ position: [0, 2, 5], fov: 60  }}>
        <CSS2DRendererSetup />

        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />

        {/* Grid */}
        <Grid {...gridConfig} />

        {/* Render AR objects */}
        {arObjects.map((object) => (
          <ARObject
            key={object.id}
            object={object}
            isSelected={object.id === selectedObject?.id}
            setTransformControlsRef={setTransformControlsRef} // Pass setter for mesh ref
          />
        ))}

        {/* TransformControls for selected object */}
        {selectedObject && transformControlsRef && (
          <TransformControls
            object={transformControlsRef} // Attach transform controls to the selected object's mesh
            mode={transformMode}
            onChange={handleObjectTransform}
          />
        )}

        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
};

export default ARCanvas;
