// src/App.js
import React from 'react';
import ARCanvas from './components/Canvas';
import ARControls from './components/ARControls';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import SequenceEditor from 'components/SequenceEditor/SequenceEditor';

const App = () => {
  return (
    <div className="flex flex-col items-center h-screen">
      <Toolbar className="flex-shrink-0" />
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1">
          <Sidebar />
          <ARCanvas />
          <ARControls />
        </div>
        <div className="flex-shrink-0">
          <SequenceEditor />
        </div>
      </div>
    </div>
  );
};

export default App;
