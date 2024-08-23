// src/components/Toolbar.js
import React from "react";
import { useAtom } from "jotai";
import { arObjectsAtom, transformModeAtom } from "../atoms";
import { convertSceneToAR, convertSceneToVR } from "./ARPublish";

const Toolbar = () => {
  const [, setTransformMode] = useAtom(transformModeAtom);
  const [arObjects, setARObjects] = useAtom(arObjectsAtom);

  const handleAddObject = () => {
    const newObject = {
      id: Date.now(),
      position: [0, 0, 0],
      scale: [1, 1, 1],
      color: "#ffa500",
      type: "box",
      entity: "a-box",
    };
    setARObjects((prev) => [...prev, newObject]);
  };

  const handlePreview = () => {
    const htmlContent = convertSceneToVR(arObjects);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handlePublish = () => {
    const htmlContent = convertSceneToAR(arObjects);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="p-4">
      <button
        onClick={handleAddObject}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 mr-4"
      >
        Add Box
      </button>
      <button
        onClick={handlePreview}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 mr-4"
      >
        Preview
      </button>
      <button
        onClick={handlePublish}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 mr-4"
      >
        Publish
      </button>
      <button
        onClick={() => setTransformMode('translate')}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 mr-4"
      >
        Translate
      </button>
      <button
        onClick={() => setTransformMode('rotate')}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 mr-4"
      >
        Rotate
      </button>
      <button
        onClick={() => setTransformMode('scale')}
        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700 mr-4"
      >
        Scale
      </button>
    </div>
  );
};

export default Toolbar;
