// src/components/ARCanvas.js
import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls, TransformControls } from "@react-three/drei";
import { useAtom } from "jotai";
import { arObjectsAtom, selectedObjectAtom, transformModeAtom } from "../atoms";
import ARObject from "./ARObject";

const ARCanvas = () => {
  const [selectedObject, setSelectedObject] = useAtom(selectedObjectAtom);
  const [arObjects, setARObjects] = useAtom(arObjectsAtom);
  const [transformMode] = useAtom(transformModeAtom);
  const transformRef = useRef();

  // Function to convert radians to degrees
  const radiansToDegrees = (radians) => {
    return radians * (180 / Math.PI);
  };

  // Handle the transformation change and update state
  const handleObjectTransform = () => {
    if (!selectedObject || !transformRef.current) return;
    console.log("rotate", transformRef.current.rotation.toArray().slice(0, 3));
    const updatedObjects = arObjects.map((obj) =>
      obj.id === selectedObject.id
        ? {
            ...obj,
            position: transformRef.current.position.toArray(),
            // Array for rotation returns [x-position, y-position, z-position, 'xyz'].
            // Slice as only coordinates are needed. 
            rotation: transformRef.current.rotation.toArray().slice(0, 3).map(radiansToDegrees),
            scale: transformRef.current.scale.toArray(),
          }
        : obj
    );

    setARObjects(updatedObjects);
  };

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

  return (
    <div className="w-[70vw] border border-gray-300">
      <Canvas camera={{ position: [0, 2, 5] }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />

        {/* Grid */}
        <Grid {...gridConfig} />

        {/* Render AR objects */}
        {arObjects.map((object) => (
          <ARObject
            key={object.id}
            object={object}
            isSelected={object.id === selectedObject?.id}
            ref={transformRef}
          />
        ))}

        {/* TransformControls for selected object */}
        {selectedObject && (
          <TransformControls
            object={transformRef.current}
            mode={transformMode}
            onObjectChange={handleObjectTransform}
          />
        )}

        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
};

export default ARCanvas;
