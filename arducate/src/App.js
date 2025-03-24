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

    <Router>
    <Routes>
      {/* Main AR Editor Interface */}
      <Route
        path="/"
        element={
          <div className="flex flex-col items-center h-screen">
          <Toolbar className="flex-shrink-0" />
          <div className="flex flex-1 w-full relative">
            {/* Sidebar should stay fixed */}
    
            {/* ARCanvas should fill remaining space */}
            <div className="flex flex-1 h-full">
                  <ARCanvas className="w-full h-full" />
                  {/* Sidebar overlays on top with absolute positioning */}
                  <Sidebar className="absolute top-0 left-0" />
                </div>
    
            {/* AssetControllers remains on the side */}
            <AssetControllers className="min-w-[20vw] flex-none" />
          </div>
          <SequenceEditor />
        </div>
        }
      />
      
      {/* Dynamic AR Content Route */}
      <Route path="/ar-content/:uniqueId" element={<ARContentViewer />} />
    </Routes>
  </Router>


  );
};



export default App;