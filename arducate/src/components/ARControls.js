import React, { useEffect } from "react";
import { useAtom } from "jotai";
import { selectedObjectAtom, arObjectsAtom } from "../atoms";

const ARControls = () => {
  const [selectedObject, setSelectedObject] = useAtom(selectedObjectAtom);
  const [arObjects, setARObjects] = useAtom(arObjectsAtom);

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    updateObject({ color: newColor });
  };

  const handleScaleChange = (e, axis) => {
    const scaleValue = parseFloat(e.target.value);
    const newScale = [...selectedObject.scale];
    newScale[axis] = scaleValue;
    console.log('scale', newScale)
    updateObject({ scale: newScale });
  };

  const handlePositionChange = (e, axis) => {
    const positionValue = parseFloat(e.target.value);
    const newPosition = [...selectedObject.position];
    newPosition[axis] = positionValue;
    updateObject({ position: newPosition });
  };

  const handleRotationChange = (e, axis) => {
    const rotationValue = parseFloat(e.target.value);
    const newRotation = [...selectedObject.rotation];
    newRotation[axis] = rotationValue;
    console.log('rotation', newRotation)
    updateObject({ rotation: newRotation });
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    updateObject({ name: newName });
  };

  const updateObject = (updates) => {
    setARObjects((prev) =>
      prev.map((obj) =>
        obj.id === selectedObject?.id ? { ...obj, ...updates } : obj
      )
    );
    console.log('objects', arObjects)
    if (selectedObject) {
      setSelectedObject((prev) => ({ ...prev, ...updates }));
    }
  };

  useEffect(() => {
    if (selectedObject) {
      const nameInput = document.getElementById('asset-name');
      if (nameInput) {
        nameInput.value = selectedObject.name || '';
      }
    }
  }, [selectedObject]);

  if (!selectedObject) {
    return (
      <div className="w-[15vw] bg-secondary">
        <div className="mt-2 text-center">
          No Object Selected
        </div>
      </div>
    );
  }

  return (
    <div className="w-[15vw] p-4 bg-secondary rounded">
      {/* Name Control */}
      <div>
        <label className="block mb-2 text-sm font-medium">Name:</label>
        <input
          id="asset-name"
          type="text"
          value={selectedObject.name || ""}
          onChange={handleNameChange}
          className="w-full p-2 border-none rounded"
        />
      </div>

      {/* Color Control */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Color:</label>
        <input
          type="color"
          value={selectedObject.color || "#ffa500"}
          onChange={handleColorChange}
          className="w-full h-8 p-0 border-none"
        />
      </div>

      {/* Scale Control */}
      <div>
        <label className="block mb-2 text-sm font-medium">Scale:</label>
        <div className="flex space-x-2">
          <input
            type="number"
            min="0.1"
            max="10"
            step="0.1"
            value={selectedObject.scale[0]}
            onChange={(e) => handleScaleChange(e, 0)}
            className="w-1/3 p-2 border-none rounded"
          />
          <input
            type="number"
            min="0.1"
            max="10"
            step="0.1"
            value={selectedObject.scale[1]}
            onChange={(e) => handleScaleChange(e, 1)}
            className="w-1/3 p-2 border-none rounded"
          />
          <input
            type="number"
            min="0.1"
            max="10"
            step="0.1"
            value={selectedObject.scale[2]}
            onChange={(e) => handleScaleChange(e, 2)}
            className="w-1/3 p-2 border-none rounded"
          />
        </div>
      </div>

      {/* Position Control */}
      <div>
        <label className="block mb-2 text-sm font-medium">Position:</label>
        <div className="flex space-x-2">
          <input
            type="number"
            step="0.1"
            value={selectedObject.position[0]}
            onChange={(e) => handlePositionChange(e, 0)}
            className="w-1/3 p-2 border-none rounded"
          />
          <input
            type="number"
            step="0.1"
            value={selectedObject.position[1]}
            onChange={(e) => handlePositionChange(e, 1)}
            className="w-1/3 p-2 border-none rounded"
          />
          <input
            type="number"
            step="0.1"
            value={selectedObject.position[2]}
            onChange={(e) => handlePositionChange(e, 2)}
            className="w-1/3 p-2 border-none rounded"
          />
        </div>
      </div>

      {/* Rotation Control */}
      <div>
        <label className="block mb-2 text-sm font-medium">Rotation:</label>
        <div className="flex space-x-2">
          <input
            type="number"
            step="0.1"
            value={selectedObject.rotation[0]}
            onChange={(e) => handleRotationChange(e, 0)}
            className="w-1/3 p-2 border-none rounded"
          />
          <input
            type="number"
            step="0.1"
            value={selectedObject.rotation[1]}
            onChange={(e) => handleRotationChange(e, 1)}
            className="w-1/3 p-2 border-none rounded"
          />
          <input
            type="number"
            step="0.1"
            value={selectedObject.rotation[2]}
            onChange={(e) => handleRotationChange(e, 2)}
            className="w-1/3 p-2 border-none rounded"
          />
        </div>
      </div>

      {/* Reset Position Button */}
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
