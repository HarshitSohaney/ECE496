// src/components/ARControls.js
import React from "react";
import { useAtom } from "jotai";
import { selectedObjectAtom, arObjectsAtom } from "../atoms";

const ARControls = () => {
  const [selectedObject] = useAtom(selectedObjectAtom);
  const [arObjects, setARObjects] = useAtom(arObjectsAtom);

  const handleColorChange = (e) => {
    updateObject({ color: e.target.value });
    selectedObject.color = e.target.value;
  };

  const handleScaleChange = (e) => {
    const scaleValue = parseFloat(e.target.value);
    updateObject({ scale: [scaleValue, scaleValue, scaleValue] });
    selectedObject.scale = [scaleValue, scaleValue, scaleValue];
  };

  const updateObject = (updates) => {
    setARObjects((prev) =>
      prev.map((obj) =>
        obj.id === selectedObject.id ? { ...obj, ...updates } : obj
      )
    );
  };

  if (!selectedObject) return <div className="w-[15vw] mt-2 text-center bg-secondary">No object selected</div>;

  return (
    <div className="w-[15vw] p-4 bg-secondary rounded">
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Color:</label>
        <input
          type="color"
          value={selectedObject.color || "#ffa500"}
          onChange={handleColorChange}
          className="w-full h-8 p-0 border-none"
        />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium">Scale:</label>
        <input
          type="range"
          min="0.1"
          max="2"
          step="0.1"
          value={selectedObject.scale[0]}
          onChange={handleScaleChange}
          className="w-full"
        />
      </div>
      {/* control for changing position, rotation, etc. */}
      <div>
        <button
          onClick={() => updateObject({ position: [0, 0, 0] })}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Reset Position
        </button>
      </div>
    </div>
  );
};

export default ARControls;
