// src/components/ARObject.js
import React, { useRef, useEffect } from "react";
import { useAtom } from "jotai";
import { selectedObjectAtom } from "../atoms";
import { getAsset } from "./Assets";
import { Edges } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import useAnimation from "hooks/useAnimation";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import * as THREE from 'three';

const ARObject = ({ object, isSelected, setTransformControlsRef }) => {
  const [, setSelectedObject] = useAtom(selectedObjectAtom);
  const meshRef = useRef();
  const labelRef = useRef();

  const { interpolateProperties } = useAnimation();

  // Assign the mesh reference to the transform controls when the object is selected
  useEffect(() => {
    if (isSelected && meshRef.current) {
      setTransformControlsRef(meshRef.current);
    }
  }, [isSelected, setTransformControlsRef]);

  useEffect(() => {
    if (meshRef.current && object && object.showLabel) {
      const labelDiv = document.createElement("div");
      labelDiv.className = "label";
      labelDiv.textContent = object.name || `Object ${object.id}`;
      labelDiv.style.backgroundColor = "rgba(255,255,255,0.8)";
      labelDiv.style.color = "black";
      labelDiv.style.padding = "2px 5px";
      labelDiv.style.borderRadius = "3px";
      labelDiv.style.fontSize = "10px";
      labelDiv.style.pointerEvents = "none";
      const label = new CSS2DObject(labelDiv);
      label.position.set(0, object.position[1]/object.scale[1], 0);
      meshRef.current.add(label);
      labelRef.current = label;

      return () => {
        if (meshRef.current && labelRef.current) {
          meshRef.current.remove(labelRef.current);
        }
      };
    }
  }, [object]);

  const handlePointerDown = () => {
    setSelectedObject(object);
    setTransformControlsRef(meshRef.current);
  };

  function getDarkerColor(color) {
    return color.replace(/^#(..)(..)(..)$/, (_, r, g, b) => {
      const darken = (c) =>
        Math.max(0, parseInt(c, 16) - 20)
          .toString(16)
          .padStart(2, "0");

      return `#${darken(r)}${darken(g)}${darken(b)}`;
    });
  }

  useFrame(() => {
    if (!meshRef.current) return;

    const interpolatedProps = interpolateProperties(object.id);

    if (interpolatedProps) {
      const { position, rotation, scale } = interpolatedProps;

      if (position) {
        meshRef.current.position.set(...position);
      }

      if (rotation) {
        meshRef.current.rotation.set(...rotation);
      }
      
      if (scale) {
        meshRef.current.scale.set(...scale);
      }
    }
  });

  // If the object is not visible, return null but only after all hooks have been called
  if (object.visible === false) {
    return null;
  }

  return (
    <mesh
      ref={meshRef}
      position={object.position || [0, 0, 0]}
      scale={object.scale || [1, 1, 1]}
      rotation={object.rotation.slice(0, 3).map(deg => THREE.MathUtils.degToRad(deg))}
      onPointerDown={handlePointerDown}
    >
      {/* Render the correct geometry */}
      {getAsset(object.type, { text: object.text })}
      <meshStandardMaterial color={object.color || "orange"} />
      {object.type !== "text" && object.type !== "line" && (
        <Edges lineWidth={2} color={getDarkerColor(object.color)} />
      )}
    </mesh>
  );
};

export default ARObject;