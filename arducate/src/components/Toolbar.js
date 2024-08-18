// src/components/Toolbar.js
import React from "react";
import { useAtom } from "jotai";
import { arObjectsAtom } from "../atoms";

const Toolbar = () => {
  const [, setARObjects] = useAtom(arObjectsAtom);

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

  return (
    <div className="p-4">
      <button
        onClick={handleAddObject}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Add Box
      </button>
    </div>
  );
};

export default Toolbar;
