// src/components/ARObject.js
import React, { useRef, useEffect } from "react";
import { useAtom } from "jotai";
import { selectedObjectAtom, currentTimeAtom } from "../atoms";
import { getAsset } from "./Assets";
import { Edges } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import useAnimation from "hooks/useAnimation";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import * as THREE from "three";

const ARObject = ({ object, isSelected, setTransformControlsRef }) => {
  const [, setSelectedObject] = useAtom(selectedObjectAtom);
  const meshRef = useRef();
  const labelRef = useRef();
  const edgeRef = useRef();
  const [currentTime] = useAtom(currentTimeAtom);

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
      labelDiv.textContent = object.label || `Object ${object.id}`;
      labelDiv.style.backgroundColor = "rgba(255,255,255,0.8)";
      labelDiv.style.color = "black";
      labelDiv.style.padding = "2px 5px";
      labelDiv.style.borderRadius = "3px";
      labelDiv.style.fontSize = "10px";
      labelDiv.style.pointerEvents = "none";
      const label = new CSS2DObject(labelDiv);
      label.position.set(-1, object.position[1] - 0.3, 0);
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

  useEffect(() => {
    if (!meshRef.current) return;

    const interpolatedProps = interpolateProperties(object.id);

    if (interpolatedProps) {
      const { position, rotation, scale, color } = interpolatedProps;

      if (Array.isArray(position) && position.length === 3) {
        meshRef.current.position.set(...position);
      } else {
        console.warn(`Invalid position for object ${object.id}:`, position);
      }

      if (Array.isArray(rotation) && rotation.length === 3) {
        meshRef.current.rotation.set(...rotation);
      } else {
        console.warn(`Invalid rotation for object ${object.id}:`, rotation);
      }

      if (Array.isArray(scale) && scale.length === 3) {
        meshRef.current.scale.set(...scale);
      } else {
        console.warn(`Invalid scale for object ${object.id}:`, scale);
      }

      if (color && Array.isArray(color) && color.length === 3) {
        // Convert to hex for reference if needed
        const hexColor = `#${color
          .map((c) =>
            Math.floor(c * 255)
              .toString(16)
              .padStart(2, "0")
          )
          .join("")}`;
        
        // Use THREE.Color with interpolated color values directly
        meshRef.current.material.color.set(hexColor);

        if (edgeRef.current) {
          // Convert interpolated color to a slightly darker version for edges
          const darkerColor = color.map((c) => Math.max(0, c - 0.2));
          edgeRef.current.material.color.setRGB(
            darkerColor[0],
            darkerColor[1],
            darkerColor[2]
          );
        }

        // Store the last applied color on the ref
        meshRef.current.lastAppliedColor = hexColor;
      } else {
        console.warn(`Invalid color for object ${object.id}:`, color);
      }
    }
  }, [currentTime]);

  // If the object is not visible, return null but only after all hooks have been called
  if (object.visible === false) {
    return null;
  }

  return (
    <mesh
      ref={meshRef}
      position={object.position || [0, 0, 0]}
      scale={object.scale || [1, 1, 1]}
      rotation={object.rotation
        .slice(0, 3)
        .map((deg) => THREE.MathUtils.degToRad(deg))}
      onPointerDown={handlePointerDown}
      castShadow
      receiveShadow
    >
      {/* Render the correct geometry */}
      {getAsset(object.type, { text: object.text, color: object.color })}
      <meshMatcapMaterial color={object.color} toneMapped={false} />
      {object.type !== "text" && object.type !== "line" && (
        <Edges
          ref={edgeRef}
          lineWidth={2}
          color={getDarkerColor(object.color)}
        />
      )}
    </mesh>
  );
};

export default ARObject;
