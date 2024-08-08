"use client";

import { useAtom } from "jotai";
import {
  arObjectsAtom,
  selectedObjectAtom,
  cameraPositionAtom,
} from "../atoms/globalAtoms";
import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Box } from "@react-three/drei";

function Cube(props) {
  const mesh = useRef();
  // useFrame((state, delta) => (mesh.current.rotation.x += delta));

  return (
    <Box args={[1, 1, 1]} {...props} ref={mesh}>
      <meshStandardMaterial color={props.color || "orange"} />
    </Box>
  );
}

export default function ARScene() {
  const [arObjects] = useAtom(arObjectsAtom);
  const [selectedObject] = useAtom(selectedObjectAtom);
  const [cameraPosition] = useAtom(cameraPositionAtom);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-2xl font-semibold mb-4">AR Scene</h2>
      <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls />
          {arObjects.map((obj, index) => (
            <Cube
              key={obj.id}
              position={[index * 2 - 2, 0, 0]}
              color={obj.color}
            />
          ))}
        </Canvas>
      </div>
      <div className="mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <p className="mt-2">
          Camera Position: {JSON.stringify(cameraPosition)}
        </p>
        <p>Objects in scene: {arObjects.length}</p>
        <p>Selected object: {selectedObject ? selectedObject.id : "None"}</p>
      </div>
    </div>
  );
}
