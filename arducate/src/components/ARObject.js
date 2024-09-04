// src/components/ARObject.js
import React, { forwardRef } from "react";
import { useAtom } from "jotai";
import { selectedObjectAtom } from "../atoms";
import { getAsset } from "./Assets"

const ARObject = forwardRef(({ object, isSelected }, ref) => {
  const [, setSelectedObject] = useAtom(selectedObjectAtom);

  const handlePointerDown = () => {
    setSelectedObject(object);
  };

  return (
    <mesh
      ref={ref}
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
