import React from "react";
import { useAtom } from "jotai";
import { selectedObjectAtom, arObjectsAtom } from "../atoms";

const ARControls = () => {
  const [selectedObject, setSelectedObject] = useAtom(selectedObjectAtom);
  const [arObjects, setARObjects] = useAtom(arObjectsAtom);

  // Update object and ensure immutability
  const updateObject = (updates) => {
    // Update the global arObjects array
    setARObjects((prev) =>
      prev.map((obj) =>
        obj.id === selectedObject.id ? { ...obj, ...updates } : obj
      )
    );

    // Update the selected object atom
    setSelectedObject((prevObj) => ({
      ...prevObj,
      ...updates,
    }));
  };

  const handlePositionChange = (axis, value) => {
    const newPos = [...selectedObject.position];
    newPos[axis] = parseFloat(value);
    updateObject({ position: newPos });
  };

  const handleScaleChange = (e) => {
    const scaleValue = parseFloat(e.target.value);
    updateObject({ scale: [scaleValue, scaleValue, scaleValue] });
  };

  const handleRotationChange = (axis, value) => {
    const newRotation = [...selectedObject.rotation];
    newRotation[axis] = parseFloat(value);
    updateObject({ rotation: newRotation });
  };

  if (!selectedObject) {
    return (
      <div className="w-[15vw] bg-secondary">
        <div className="mt-2 text-center">No Object Selected</div>
      </div>
    );
  }

  return (
    <div className="w-[15vw] p-4 bg-secondary rounded">
      {/* Color Control */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Color:</label>
        <input
          type="color"
          value={selectedObject.color || "#ffa500"}
          onChange={(e) => updateObject({ color: e.target.value })}
          className="w-full h-8 p-0 border-none"
        />
      </div>

      {/* Scale Control */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Scale:</label>
        <input
          type="number"
          min="0.1"
          max="10"
          step="0.1"
          value={selectedObject.scale[0]} // Assumes uniform scaling
          onChange={handleScaleChange}
          className="w-full"
        />
      </div>

      {/* Position Controls */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Position:</label>
        <div className="flex space-x-4">
          <div className="flex flex-col items-center">
            <input
              type="number"
              min="-10"
              max="10"
              step="0.1"
              value={selectedObject.position[0]}
              onChange={(e) => handlePositionChange(0, e.target.value)}
              className="w-full text-center"
            />
            <label className="mt-2 text-sm font-medium">X</label>
          </div>

          <div className="flex flex-col items-center">
            <input
              type="number"
              min="-10"
              max="10"
              step="0.1"
              value={selectedObject.position[1]}
              onChange={(e) => handlePositionChange(1, e.target.value)}
              className="w-full text-center"
            />
            <label className="mt-2 text-sm font-medium">Y</label>
          </div>

          <div className="flex flex-col items-center">
            <input
              type="number"
              min="-10"
              max="10"
              step="0.1"
              value={selectedObject.position[2]}
              onChange={(e) => handlePositionChange(2, e.target.value)}
              className="w-full text-center"
            />
            <label className="mt-2 text-sm font-medium">Z</label>
          </div>
        </div>
      </div>

      {/* Rotation Controls */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Rotation:</label>
        <div className="flex space-x-4">
          <div className="flex flex-col items-center">
            <input
              type="number"
              min="-180"
              max="180"
              step="1"
              value={selectedObject.rotation[0]}
              onChange={(e) => handleRotationChange(0, e.target.value)}
              className="w-full text-center"
            />
            <label className="mt-2 text-sm font-medium">X</label>
          </div>

          <div className="flex flex-col items-center">
            <input
              type="number"
              min="-180"
              max="180"
              step="1"
              value={selectedObject.rotation[1]}
              onChange={(e) => handleRotationChange(1, e.target.value)}
              className="w-full text-center"
            />
            <label className="mt-2 text-sm font-medium">Y</label>
          </div>

          <div className="flex flex-col items-center">
            <input
              type="number"
              min="-180"
              max="180"
              step="1"
              value={selectedObject.rotation[2]}
              onChange={(e) => handleRotationChange(2, e.target.value)}
              className="w-full text-center"
            />
            <label className="mt-2 text-sm font-medium">Z</label>
          </div>
        </div>
      </div>

      {/* Button to reset position to origin */}
      <button
        onClick={() => updateObject({ position: [0, 0, 0] })}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Reset Position
      </button>
    </div>
  );
};

export default ARControls;
