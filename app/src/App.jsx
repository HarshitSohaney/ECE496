import React from 'react';
import Scene from './components/Scene';
import ShapeSelector from './components/ShapeSelector';
import Toolbar from './components/Toolbar';
import { ShapeProvider } from './components/ShapeContext';
import { CameraProvider } from './components/CameraContext';
import AnimationEditor from './components/AnimationEditor';

const App = () => {
  return (
    <ShapeProvider>
      <CameraProvider>
        <div className="flex flex-col h-screen overflow-hidden">
          <Toolbar />
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-none w-48 bg-gray-200 flex flex-col items-center justify-center">
              select some shapes!
              <ShapeSelector />
            </div>
            <div className="flex-1 flex bg-white">
              <Scene />
            </div>
            <div className="flex-none w-48 bg-gray-200 flex flex-col items-center justify-center">
              <AnimationEditor />
            </div>
          </div>
          <div className="flex-none h-24 bg-gray-800 text-white flex items-center justify-center">
            Keyframe timeline goes here!
          </div>
        </div>
      </CameraProvider>
    </ShapeProvider>
  );
};

export default App;
