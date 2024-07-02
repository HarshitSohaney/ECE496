import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export interface ModelProps {
  url: string;
  id: string;
  scale: number;
  position: [number, number, number];
  rotation: [number, number, number];
}

const Model: React.FC<ModelProps> = ({
  url,
  id,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) => {
  const { scene } = useGLTF(url);
  const ref = useRef<THREE.Group>(null);

  return (
    <primitive
      ref={ref}
      object={scene.clone()}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
};

export default Model;
