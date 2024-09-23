// src/components/Canvas.js
import React, { useRef, useEffect, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls, TransformControls } from "@react-three/drei";
import { useAtom } from "jotai";
import { arObjectsAtom, selectedObjectAtom, transformModeAtom } from "../atoms";
import ARObject from "./ARObject";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { useThree, useFrame } from "@react-three/fiber";


function CSS2DRendererSetup() {
  const { gl, scene, camera } = useThree();
  const labelRendererRef = useRef();

  useEffect(() => {
    labelRendererRef.current = new CSS2DRenderer();
    labelRendererRef.current.setSize(window.innerWidth, window.innerHeight);
    labelRendererRef.current.domElement.style.position = 'absolute';
    labelRendererRef.current.domElement.style.top = '0px';
    labelRendererRef.current.domElement.style.left = '0px'; // Ensure it's aligned properly
    labelRendererRef.current.domElement.style.pointerEvents = 'none';
    labelRendererRef.current.domElement.style.zIndex = '1'; // Ensure it's on top
    document.body.appendChild(labelRendererRef.current.domElement);

    const onResize = () => {
      labelRendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      if (labelRendererRef.current && labelRendererRef.current.domElement) {
        labelRendererRef.current.domElement.remove();
      }
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useFrame(() => {
    if (labelRendererRef.current) {
      labelRendererRef.current.render(scene, camera);
    }
  });

  return null;
}


const ARCanvas = () => {
  const [selectedObject] = useAtom(selectedObjectAtom);
  const [arObjects, setARObjects] = useAtom(arObjectsAtom);
  const [transformMode] = useAtom(transformModeAtom);
  const [transformControlsRef, setTransformControlsRef] = useState(null); // State to store the selected object's mesh ref

  // Function to convert radians to degrees
  const radiansToDegrees = (radians) => radians * (180 / Math.PI);

  // Handle the transformation change and update state
  const handleObjectTransform = useCallback(() => {
    if (!selectedObject || !transformControlsRef) return;

    const updatedObjects = arObjects.map((obj) =>
      obj.id === selectedObject.id
        ? {
            ...obj,
            position: transformControlsRef.position.toArray(),
            rotation: transformControlsRef.rotation.toArray().map(radiansToDegrees),
            scale: transformControlsRef.scale.toArray(),
          }
        : obj
    );

    setARObjects(updatedObjects);
  }, [arObjects, transformControlsRef, setARObjects]);

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
        <directionalLight position={[5, 5, 5]}/>

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