import React, { createContext, useContext, useRef } from 'react';

const CameraContext = createContext();

export const CameraProvider = ({ children }) => {
  const cameraRef = useRef();
  const orbitControlsRef = useRef();

  const setCameraView = (position, target) => {
    if (cameraRef.current && orbitControlsRef.current) {
      cameraRef.current.position.set(...position);
      orbitControlsRef.current.target.set(...target);
      orbitControlsRef.current.update();
    }
  };

  return (
    <CameraContext.Provider value={{ cameraRef, orbitControlsRef, setCameraView }}>
      {children}
    </CameraContext.Provider>
  );
};

export const useCamera = () => {
  return useContext(CameraContext);
};
