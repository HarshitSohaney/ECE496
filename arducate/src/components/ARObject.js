// src/components/ARObject.js
import React, { useRef, useEffect } from "react";
import { useAtom } from "jotai";
import { selectedObjectAtom } from "../atoms";
import { getAsset } from "./Assets"; // Make sure getAsset returns correct geometry
import { Edges } from "@react-three/drei";

const ARObject = ({ object, isSelected, setTransformControlsRef }) => {
  const [, setSelectedObject] = useAtom(selectedObjectAtom);
  const meshRef = useRef();

  // Assign the mesh reference to the transform controls when the object is selected
  useEffect(() => {
    if (isSelected && meshRef.current) {
      setTransformControlsRef(meshRef.current); // Provide the mesh ref to the parent
    }
  }, [isSelected, setTransformControlsRef]);

  // Handle selecting the object and assigning the mesh ref
  const handlePointerDown = () => {
    setSelectedObject(object); // Update selected object in state
    setTransformControlsRef(meshRef.current); // Pass the mesh ref to the parent for transform controls
  };

  /*
    This code creates darker edges for the object, based on the object color:
      1. It takes the object's color and converts it to a darker shade
      2. The color is first converted from hex to RGB
      3. Each RGB component is darkened by subtracting 20 (clamped to 0)
      4. The darkened RGB is then converted back to hex
  */
  function getDarkerColor(color) {
    return color.replace(/^#(..)(..)(..)$/, (_, r, g, b) => {
      const darken = (c) => Math.max(0, parseInt(c, 16) - 20).toString(16).padStart(2, '0');
      
      // Return as hex string "#RRGGBB"
      return `#${darken(r)}${darken(g)}${darken(b)}`;
    });
  }

  return (
      <mesh
        ref={meshRef}
        position={object.position || [0, 0, 0]}
        scale={object.scale || [1, 1, 1]}
        rotation={object.rotation || [0, 0, 0]}
        onPointerDown={handlePointerDown} // Detect object selection
      >
        {/* Render the correct geometry */}
        {getAsset(object.type)}
        <meshStandardMaterial color={object.color || "orange"}/>
        {object.type !== "line" && (
        <Edges lineWidth={2} color={getDarkerColor(object.color)} />
      )}
      </mesh>
  );
};

export default ARObject;
