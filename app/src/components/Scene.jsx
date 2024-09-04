import React, { useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Grid, GizmoHelper, GizmoViewport, OrbitControls, Environment, Box, Sphere, TransformControls } from '@react-three/drei';
import { useShapes } from './ShapeContext';
import { useCamera } from './CameraContext';

const SceneContent = () => {
  const { shapes, selectedObject, setSelectedObject, transformMode, shapeRefs } = useShapes();
  const { cameraRef, orbitControlsRef, setCameraView } = useCamera();
  const { camera } = useThree();

  const transformControlsRef = useRef();

  useEffect(() => {
    cameraRef.current = camera;
    setCameraView([10, 12, 12], [0, 0, 0]); // Default view
  }, [camera, cameraRef, setCameraView]);

  // Log rotation changes
  useEffect(() => {
    if (selectedObject && transformControlsRef.current) {
      const handleChange = () => {
        const rotation = transformControlsRef.current.object.rotation;
        console.log("Rotation Changed:", rotation);
      };

      const transformControls = transformControlsRef.current;
      transformControls.addEventListener('change', handleChange);

      return () => {
        transformControls.removeEventListener('change', handleChange);
      };
    }
  }, [selectedObject]);

  const gridConfig = {
    args: [10.5, 10.5],
    cellSize: 0.6,
    cellThickness: 1,
    cellColor: '#6f6f6f',
    sectionSize: 3.3,
    sectionThickness: 1.5,
    sectionColor: '#9d4b4b',
    fadeDistance: 25,
    fadeStrength: 1,
    followCamera: false,
    infiniteGrid: true,
  };

  return (
    <>
      <group position={[0, -0.5, 0]}>
        <Grid {...gridConfig} />
      </group>
      {shapes.map((shape, index) => {
        const Component = shape.type === 'cube' ? Box : Sphere;
        return (
          <Component
            key={shape.id}
            ref={shapeRefs[index]}
            position={[0, 0, 0]}
            args={shape.type === 'cube' ? [1, 1, 1] : [1, 32, 32]}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedObject(shapeRefs[index].current);
            }}
          />
        );
      })}
      {selectedObject && (
        <TransformControls
          ref={transformControlsRef}
          object={selectedObject}
          mode={transformMode}
        />
      )}
      <OrbitControls
        ref={orbitControlsRef}
        makeDefault
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={0}
        minDistance={5}
        maxDistance={50}
        enablePan={true}
        maxAzimuthAngle={Math.PI / 4}
        minAzimuthAngle={-Math.PI / 4}
      />
      <Environment preset="city" />
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport axisColors={['#9d4b4b', '#2f7f4f', '#3b5b9d']} labelColor="white" />
      </GizmoHelper>
    </>
  );
};

const Scene = () => {
  return (
    <div className="w-full h-full">
      <Canvas shadows camera={{ position: [10, 12, 12], fov: 25 }}>
        <SceneContent />
      </Canvas>
    </div>
  );
};

export default Scene;