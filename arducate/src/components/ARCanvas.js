// src/components/ARCanvas.js
import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, DragControls } from "@react-three/drei";
import { useAtom } from "jotai";
import { arObjectsAtom } from "../atoms";
import ARObject from "./ARObject";

const ARCanvas = () => {
  const [arObjects] = useAtom(arObjectsAtom);
  const meshRefs = useRef([]);

  return (
    <div className="w-full h-[60vh] border border-gray-300 my-4">
      <Canvas camera={{ position: [0, 2, 5] }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />

        {/* Grid and Axes */}
        <gridHelper args={[10, 10]} position={[0, 0, 0]} />
        <axesHelper args={[6]} />

        {/* Render AR objects */}
        {arObjects.map((object, index) => (
          <ARObject
            key={object.id}
            object={object}
            ref={(el) => (meshRefs.current[index] = el)} // Reference to the mesh
          />
        ))}

        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default ARCanvas;
