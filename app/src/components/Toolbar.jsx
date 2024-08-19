import React from 'react';
import { useShapes } from './ShapeContext';
import { useCamera } from './CameraContext';

const Toolbar = () => {
  const { setTransformMode } = useShapes();
  const { setCameraView } = useCamera();

  return (
    <div className="flex-none h-12 bg-gray-800 text-white flex items-center justify-center space-x-2">
      <button onClick={() => setCameraView([0, 5, 0], [0, 0, 0])}>Top</button>
      <button onClick={() => setCameraView([0, 0, 5], [0, 0, 0])}>Front</button>
      <button onClick={() => setCameraView([5, 0, 0], [0, 0, 0])}>Right</button>
      <button onClick={() => setCameraView([-5, 0, 0], [0, 0, 0])}>Left</button>
      <button onClick={() => setCameraView([0, 0, -5], [0, 0, 0])}>Back</button>
      <button onClick={() => setCameraView([5, 5, 5], [0, 0, 0])}>Perspective</button>
      <button onClick={() => setTransformMode('translate')}>Translate</button>
      <button onClick={() => setTransformMode('rotate')}>Rotate</button>
      <button onClick={() => setTransformMode('scale')}>Scale</button>
    </div>
  );
};

export default Toolbar;
