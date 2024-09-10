import React, { useRef, useEffect, useState, useCallback } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Grid, OrbitControls, TransformControls } from "@react-three/drei";
import { useAtom } from "jotai";
import { arObjectsAtom, selectedObjectAtom, transformModeAtom } from "../atoms";
import ARObject from "./ARObject";

const ARCanvas = () => {
  const [selectedObject, setSelectedObject] = useAtom(selectedObjectAtom);
  const [arObjects, dispatchARObjects] = useAtom(arObjectsAtom);
  const [transformMode] = useAtom(transformModeAtom);
  const [transformControlsRef, setTransformControlsRef] = useState(null); //variable that references the TransformControls
  
  // Function to convert radians to degrees
  const radiansToDegrees = (radians) => {
    return radians * (180 / Math.PI);
  };

    // Handle the transformation change and update state
  const handleObjectTransform = useCallback(() => {
    if (!selectedObject || !transformControlsRef) return;

    dispatchARObjects({
      type: 'UPDATE_OBJECT',
      payload: {
        ...selectedObject,
        position: transformControlsRef.position.toArray(),
        rotation: transformControlsRef.rotation.toArray().map(radiansToDegrees),
        scale: transformControlsRef.scale.toArray(),
      }
    });
  }, [selectedObject, transformControlsRef, dispatchARObjects]);

  //grid configuration
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
      <Canvas camera={{ position: [0, 2, 5] }}>
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
            setTransformControlsRef={setTransformControlsRef}
          />
        ))}
        {/* TransformControls for selected object */}
        {selectedObject && (
          <TransformControls
            object={transformControlsRef}
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