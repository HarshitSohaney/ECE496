// src/App.js
import React from 'react';
import ARCanvas from './components/Canvas';
import ARControls from './components/ARControls';
import Toolbar from './components/Toolbar';
import AssetHandler from './components/AssetViewer';
import SequenceEditor from 'components/timeline/SequenceEditor';
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
      <SequenceEditor />
    </div>
  );
};

export default App;
