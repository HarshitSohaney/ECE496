import React from 'react';
import { useShapes } from './ShapeContext';

const ShapeSelector = () => {
  const { addShape } = useShapes();

  const handleAddShape = (shape) => {
    addShape(shape);
  };

  return (
    <div>
      <button onClick={() => handleAddShape('cube')}>Add Cube</button>
      <button onClick={() => handleAddShape('sphere')}>Add Sphere</button>
    </div>
  );
};

export default ShapeSelector;
