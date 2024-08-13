// src/components/ARCanvas.js
import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls, DragControls, TransformControls } from "@react-three/drei";
import { useAtom } from "jotai";
import { arObjectsAtom, selectedObjectAtom } from "../atoms";
import ARObject from "./ARObject";

const ARCanvas = () => {
  const [selectedObject] = useAtom(selectedObjectAtom);
  const [arObjects, setARObjects] = useAtom(arObjectsAtom);
  const meshRefs = useRef([]);
  
  /*Grid Configuration Settings */
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
    <div className="w-full h-[60vh] border border-gray-300 my-4">
      <Canvas camera={{ position: [0, 2, 5] }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />

        {/* Grid and Axes */}
        <Grid {...gridConfig}/>

        {/* Render AR objects */}
        {arObjects.map((object, index) => (
          <ARObject
            key={object.id}
            object={object}
            ref={(el) => (meshRefs.current[index] = el)} // Reference to the mesh
          />
        ))}

        {/* Transform + Drag Objects */}
        {
          selectedObject && (
            <TransformControls object={selectedObject} mode="translate" />
          )
        }
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
};

export default ARCanvas;
