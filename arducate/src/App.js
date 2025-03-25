// src/App.js
// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ARCanvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";
import Sidebar from "./components/Sidebar";
import SequenceEditor from "./components/SequenceEditor/SequenceEditor";
import ARContentViewer from "./components/ARContentViewer"; // Create this component in Step 3
import AssetControllers from "./components/AssetControllers";
import { copyBufferAtom, selectedObjectAtom, arObjectsAtom, historyAtom } from "./atoms";
import { useAtom } from "jotai";

const App = () => {
  const [arObjects, setARObjects] = useAtom(arObjectsAtom);
  const [selectedObject] = useAtom(selectedObjectAtom);
  const [copyBuffer, setCopyBuffer] = useAtom(copyBufferAtom);
  const [historyLog, setHistory] = useAtom(historyAtom);

  // lets listen for any control c or control v events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        console.log(selectedObject, selectedObjectAtom, arObjectsAtom);

        const objectToCopy = selectedObject
          ? arObjects.find((obj) => obj.id === selectedObject.id)
          : null;
        // if an object is selected, copy it into the copy buffer
        if (objectToCopy && objectToCopy.id) {
          setCopyBuffer(objectToCopy);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === "v") {
        // if there is an object in the copy buffer, paste it into the scene
        if (copyBuffer) {
          const newObject = {
            ...copyBuffer,
            id: Date.now(),
            name: `${copyBuffer.name} Copy`,
            label: `${copyBuffer.label} Copy`,
            position: [
              copyBuffer.position[0] + 0.1,
              copyBuffer.position[1] + 0.1,
              copyBuffer.position[2] + 0.1,
            ],
          };
          setARObjects({ type: "ADD_OBJECT", payload: newObject });
        }
      } else if((e.ctrlKey || e.metaKey) && e.key === "z") {
        if (historyLog.length === 0) return;
        // check the last history object and undo it
        const history = historyLog[historyLog.length - 1];
        
        if (!history) return;

        const { action, from, to, timestamp } = history;

        switch (action) {
          case 'ADD_OBJECT':
            setARObjects({ type: 'REMOVE_OBJECT', payload: to.id });

            break;
          case 'REMOVE_OBJECT':
            setARObjects({ type: 'ADD_OBJECT', payload: from });
            break;
          case 'UPDATE_OBJECT':
            setARObjects({ type: 'UPDATE_OBJECT', payload: from });
            break;
          default:
            console.error('Unknown action type:', action);
        }
        // slice twice since each revert will add a new history object
        setHistory(historyLog.slice(0, -1));
        setHistory(historyLog.slice(0, -1));
      }
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedObject, arObjects, copyBuffer, setCopyBuffer, setARObjects, historyLog, setHistory]);

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
                  {/* AssetControllers remains on the side */}
                  <AssetControllers className="min-w-[20vw] flex-none absolute top-5 right-0" />
                </div>

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
