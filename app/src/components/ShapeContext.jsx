import React, { createContext, useContext, useState, useRef, useImperativeHandle, forwardRef } from 'react';

const ShapeContext = createContext();

export const ShapeProvider = forwardRef(({ children }, ref) => {
  const [shapes, setShapes] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [transformMode, setTransformMode] = useState('translate');
  const shapeRefs = useRef([]);

  const addShape = (shape) => {
    if (shape) {
      setShapes((prevShapes) => {
        const newShape = { type: shape, id: prevShapes.length };
        shapeRefs.current.push(React.createRef());
        return [...prevShapes, newShape];
      });
    }
  };

  useImperativeHandle(ref, () => ({
    addShape,
    setSelectedObject,
    setTransformMode
  }));

  return (
    <ShapeContext.Provider
      value={{
        shapes,
        addShape,
        selectedObject,
        setSelectedObject,
        transformMode,
        setTransformMode,
        shapeRefs: shapeRefs.current
      }}
    >
      {children}
    </ShapeContext.Provider>
  );
});

export const useShapes = () => {
  return useContext(ShapeContext);
};
