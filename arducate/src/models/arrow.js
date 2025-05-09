import React from "react";
import { useGLTF } from "@react-three/drei";
import { MeshStandardMaterial } from "three";

export function Arrow(props) {
  const { nodes } = useGLTF("https://mixiplycontent.blob.core.windows.net/usefulstuff/b886ee02-15e0-451a-c594-08d6d1d77884/arrow.gltf");
  const customMaterial = new MeshStandardMaterial({ color: "#ffa500" }); // Red color

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube001_Cube002.geometry}
        material={customMaterial}
        scale={0.1}
      />
    </group>
  );
}