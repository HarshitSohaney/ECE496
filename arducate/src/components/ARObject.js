// src/components/ARObject.js
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { useAtom } from "jotai";
import { selectedObjectAtom } from "../atoms";
import { getAsset } from "./Assets"

const ARObject = forwardRef(({ object, isSelected, setTransformControlsRef }, ref) => {
  const [, setSelectedObject] = useAtom(selectedObjectAtom);
  const meshRef = useRef();

  // Update the transform controls ref when selected
  useImperativeHandle(ref, () => ({
    getTransformControlsRef: () => meshRef.current,
  }), []);

  const handlePointerDown = () => {
    setSelectedObject(object);
    setTransformControlsRef(meshRef.current);
  };

  return (
    <mesh
      ref={meshRef}
      position={object.position || [0, 0, 0]}
      scale={object.scale || [1, 1, 1]}
      rotation={object.rotation || [0, 0, 0]}
      onPointerDown={handlePointerDown}
    >
      {/* Add any geometry you want, e.g., a box */}
      {getAsset(object.type)}
      <meshStandardMaterial color={object.color || "orange"} />
    </mesh>
  );
});

export default ARObject;