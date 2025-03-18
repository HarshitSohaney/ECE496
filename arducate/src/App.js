// src/App.js
// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ARCanvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import SequenceEditor from './components/SequenceEditor/SequenceEditor';
import ARContentViewer from './components/ARContentViewer'; // Create this component in Step 3
import AssetControllers from 'components/AssetControllers';

const App = () => {
  return (
    <div className="flex flex-col items-center h-screen">
      <Toolbar className="flex-shrink-0" />
      <div className="flex flex-1 w-full">
        {/* Sidebar should stay fixed */}
        <Sidebar className="flex-none w-[15vw] min-w-[15vw]" />

        {/* ARCanvas should fill remaining space */}
        <div className="flex-1 flex h-full">
          <ARCanvas className="w-full h-full" />
        </div>

        {/* AssetControllers remains on the side */}
        <AssetControllers className="flex-none" />
      </div>
      <SequenceEditor />
    </div>
  );
};



export default App;