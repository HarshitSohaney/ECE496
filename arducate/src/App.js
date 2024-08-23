// src/App.js
import React from 'react';
import ARCanvas from './components/Canvas';
import ARControls from './components/ARControls';
import Toolbar from './components/Toolbar';

const App = () => {
  return (
    <div className="flex flex-col items-center p-4">
      <Toolbar />
      <ARCanvas />
      <ARControls />
    </div>
  );
};

export default App;
