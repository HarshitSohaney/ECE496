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

  // Determine the geometry type based on object.type Plane, Box, Sphere, Circle, Cone, Cylinder, Tube, Torus, Ring, Polyhedron, Line 
  const renderGeometry = () => {
    switch (object.type) {
      case 'box':
        return <boxGeometry args={[1, 1, 1]} />;
      case 'sphere':
        return <sphereGeometry args={[1, 32, 32]} />;
      case 'cylinder':
        return <cylinderGeometry args={[1, 1, 1]} />;
      case 'plane':
        return <planeGeometry args={[1, 1]} />;
      case 'circle':
        return <circleGeometry args={[1, 32]} />;
      case 'cone':
        return <coneGeometry args={[1, 2, 32]} />;
      case 'torus':
        return <torusGeometry args={[1, 0.3, 2, 100]} />;
      case 'ring':
        return <ringGeometry args={[0.3, 1, 32]} />;
      // case 'line':
      //     return <lineBasicMaterial args={[0x0000ff]} />;
      default:
        // Fallback geometry
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={object.position || [0, 0, 0]}
      scale={object.scale || [1, 1, 1]}
      onPointerDown={handlePointerDown}
    >
      {/* Add any geometry you want, e.g., a box */}
      {renderGeometry()}
      <meshStandardMaterial color={object.color || "orange"} />
    </mesh>
  );
};

export default ARObject;
