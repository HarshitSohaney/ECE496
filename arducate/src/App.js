// src/App.js
import React from 'react';
import ARCanvas from './components/Canvas';
import ARControls from './components/ARControls';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';

const App = () => {
  return (
    <div className="flex flex-col items-center h-screen">
      <Toolbar className="flex-shrink-0"/>
      <div className="flex flex-1">
        <Sidebar />
        <ARCanvas />
        <ARControls />
      </div>

    </div>
  );
};

export default App;
