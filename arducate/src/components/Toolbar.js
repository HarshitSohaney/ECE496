// src/components/Toolbar.js
import React from "react";
import { useAtom } from "jotai";
import { arObjectsAtom } from "../atoms";
import { convertSceneToAR, convertSceneToVR } from "./ARPublish";

const Toolbar = () => {
  const [arObjects, setARObjects] = useAtom(arObjectsAtom);

  const handleAddObject = () => {
    const newObject = {
      id: Date.now(),
      position: [0, 0, 0],
      scale: [1, 1, 1],
      color: "#ffa500",
      type: "box",
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
    </div>
  );
};

export default Toolbar;
