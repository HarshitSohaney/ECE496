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
  const transformRefs = useRef({});

  // Function to convert radians to degrees
  const radiansToDegrees = (radians) => radians * (180 / Math.PI);

  // Handle the transformation change and update state
  const handleObjectTransform = (id) => {
    if (!selectedObject || !transformRefs.current[id]) return;
    const updatedObjects = arObjects.map((obj) =>
      obj.id === id
        ? {
            ...obj,
            position: transformRefs.current[id].position.toArray(),
            rotation: transformRefs.current[id]
              .rotation.toArray()
              .slice(0, 3)
              .map(radiansToDegrees),
            scale: transformRefs.current[id].scale.toArray(),
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
    cellColor: "#6f6f6f",
    sectionSize: 3.3,
    sectionThickness: 1.5,
    sectionColor: "#9d4b4b",
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
            ref={(ref) => (transformRefs.current[object.id] = ref)}
          />
        ))}

        {/* TransformControls for selected object */}
        {selectedObject && transformRefs.current[selectedObject.id] && (
          <TransformControls
            object={transformRefs.current[selectedObject.id]}
            mode={transformMode}
            onObjectChange={() => handleObjectTransform(selectedObject.id)}
          />
        )}

        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
};

export default ARCanvas;