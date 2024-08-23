// src/App.js
import React from 'react';
import Canvas from './components/Canvas';
import ARControls from './components/ARControls';
import Toolbar from './components/Toolbar';

const App = () => {
  return (
    <div className="flex flex-col items-center p-4">
      <Toolbar />
      <Canvas />
      <ARControls />
    </div>
  );
};

export default App;
