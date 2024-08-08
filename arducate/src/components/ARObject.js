// src/components/ARObject.js
import React, { useRef } from "react";
import { extend } from "@react-three/fiber";
import { useAtom } from "jotai";
import { selectedObjectAtom, arObjectsAtom } from "../atoms";
import { DragControls } from "@react-three/drei";

extend({ DragControls });

const ARObject = ({ object }) => {
  const meshRef = useRef();
  const [, setSelectedObject] = useAtom(selectedObjectAtom);

  const handlePointerDown = () => {
    setSelectedObject(object);
  };

  return (
    <mesh
      ref={meshRef}
      position={object.position || [0, 0, 0]}
      scale={object.scale || [1, 1, 1]}
      onPointerDown={handlePointerDown}
    >
      {/* Add any geometry you want, e.g., a box */}
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={object.color || "orange"} />
    </mesh>
  );
};

export default ARObject;
