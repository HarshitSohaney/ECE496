import React, { useRef, useEffect } from "react";
import { useAtom } from "jotai";
import { selectedObjectAtom, selectedObjectsAtom } from "../atoms";
import { getAsset } from "./Assets";
import { Edges } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import useAnimation from "hooks/useAnimation";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import * as THREE from "three";

const ARObject = ({
  object,
  isSelected,
  setTransformControlsRef,
  isInGroup,
}) => {
  const [selectedObjects, setSelectedObjects] = useAtom(selectedObjectsAtom);
  const [, setSelectedObject] = useAtom(selectedObjectAtom);
  const meshRef = useRef();
  const labelRef = useRef();
  const { interpolateProperties } = useAnimation();

  // Update transform controls reference when selection changes
  useEffect(() => {
    if (isSelected && meshRef.current && !isInGroup) {
      setTransformControlsRef(meshRef.current);
    }
  }, [isSelected, setTransformControlsRef, isInGroup]);

  // Store mesh reference for parent components
  useEffect(() => {
    if (meshRef.current) {
      object.meshRef = meshRef;
    }

    return () => {
      if (object.meshRef === meshRef) {
        object.meshRef = null;
      }
    };
  }, [meshRef, object]);

  // Handle label creation and cleanup
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
      label.position.set(0, object.position[1] / object.scale[1], 0);
      meshRef.current.add(label);
      labelRef.current = label;

      return () => {
        if (meshRef.current && labelRef.current) {
          meshRef.current.remove(labelRef.current);
          labelRef.current = null;
        }
      };
    }
  }, [object]);

  const handlePointerDown = (e) => {
    e.stopPropagation();

    if (e.shiftKey) {
      setSelectedObjects((prev) => {
        const newSelection = prev.includes(object) ? prev : [...prev, object];
        return newSelection;
      });
    } else {
      setSelectedObjects([object]);
      setSelectedObject(object);
    }
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

  // Handle continuous updates of object transform
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

      // Update label position if it exists
      if (labelRef.current) {
        labelRef.current.position.set(
          0,
          object.position[1] / object.scale[1],
          0
        );
      }
    }
  });

  if (object.visible === false) {
    return null;
  }

  return (
    <mesh
      ref={meshRef}
      position={object.position}
      scale={object.scale}
      rotation={object.rotation.map((deg) => THREE.MathUtils.degToRad(deg))}
      onPointerDown={handlePointerDown}
    >
      {getAsset(object.type, { text: object.text })}
      <meshStandardMaterial color={object.color} />
      <Edges
        lineWidth={isSelected ? 3 : 1}
        color={isSelected ? "#6de846" : getDarkerColor(object.color)}
      />
    </mesh>
  );
};

export default ARObject;
