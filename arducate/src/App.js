// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ARCanvas from './components/Canvas';
import ARControls from './components/ARControls';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import SequenceEditor from './components/SequenceEditor/SequenceEditor';
import ARContentViewer from './components/ARContentViewer'; // Create this component in Step 3

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
          }
        />
        
        {/* Dynamic AR Content Route */}
        <Route path="/ar-content/:uniqueId" element={<ARContentViewer />} />
      </Routes>
    </Router>
  );
};

export default App;