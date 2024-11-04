// src/App.js.
import React from 'react';
import ARCanvas from './components/Canvas';
import ARControls from './components/ARControls';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import SequenceEditor from 'components/SequenceEditor/SequenceEditor';

const App = () => {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Toolbar className="flex-shrink-0" />
      <div className="flex flex-1 min-h-0 w-full overflow-hidden">
        <Sidebar />
        <ARCanvas />
        <ARControls />
      </div>
      <div className="flex-shrink-0 w-full ">
        <SequenceEditor />
      </div>
    </div>
  );
};

export default App;
