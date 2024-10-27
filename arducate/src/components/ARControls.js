// src/components/ARControls.js
import React, { useCallback } from "react";
import { useAtom } from "jotai";
import { selectedObjectAtom, arObjectsAtom } from "../atoms";
import { Switch } from "../@/components/ui/switch";

const ARControls = () => {
  const [selectedObject] = useAtom(selectedObjectAtom);
  const [, setARObjects] = useAtom(arObjectsAtom);

  const handleColorChange = (e) => {
    if (selectedObject) {
      setARObjects({  //Actual update handled in the atom
        type: 'UPDATE_OBJECT', 
        payload: { 
          ...selectedObject,
          color: e.target.value
        } 
      });
    }
  };

  const handleScaleChange = (axis, scaleValue) => {
    if (selectedObject) {
      const newScale = [...selectedObject.scale];
  
      // If axis is -1, scale all axes uniformly
      if (axis === -1) {
        newScale[0] = parseFloat(scaleValue);
        newScale[1] = parseFloat(scaleValue);
        newScale[2] = parseFloat(scaleValue);
      } else {
        // Scale individual axis (0 = X, 1 = Y, 2 = Z)
        newScale[axis] = parseFloat(scaleValue);
      }
  
      setARObjects({
        type: 'UPDATE_OBJECT',
        payload: {
          ...selectedObject,
          scale: newScale,
        },
      });
    }
  };

  const handlePositionChange = (axis, value) => {
    if (selectedObject) {    
      const newPos = [...selectedObject.position];
      newPos[axis] = parseFloat(value);
      setARObjects({ 
        type: 'UPDATE_OBJECT', 
        payload: { 
          ...selectedObject,
          position: newPos
        } 
      });
    }
  };

  const handleDeleteAsset = useCallback(() => {
    if (selectedObject) {
      setARObjects({ type: 'REMOVE_OBJECT', payload: selectedObject.id });
    }
  }, [selectedObject, setARObjects]);

  const handleLabelChange = (e) => {
    setARObjects({
      type: 'UPDATE_OBJECT',
      payload: {
        id: selectedObject.id,
        name: e.target.value
      }
    });
  };
  
  const handleLabelVisibilityChange = (checked) => {
    setARObjects({
      type: 'UPDATE_OBJECT',
      payload: {
        id: selectedObject.id,
        showLabel: checked
      }
    });
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
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Show Label:</label>
        <Switch
          checked={selectedObject.showLabel || false}
          onCheckedChange={handleLabelVisibilityChange}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Label:</label>
        <input
          type="text"
          value={selectedObject.name}
          onChange={handleLabelChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Color:</label>
        <input
          type="color"
          value={selectedObject.color || "#ffa500"}
          onChange={handleColorChange}
          className="w-full h-8 p-0 border-none"
        />
      </div>

  <div className="mb-4">
  <label className="block mb-2 text-sm font-medium">Scale:</label>

  {/* Uniform Scale Control */}
  <input
    type="range"
    min="0.1"
    max="15"
    step="0.1"
    value={selectedObject.scale[0]} // Assuming uniform scale applies same value to all axes
    onChange={(e) => handleScaleChange(-1, e.target.value)}
    className="w-full"
  />

        {/* Individual Axis Scale Controls */}
        <div className="flex space-x-4 mt-4">
          <div className="flex flex-col items-center">
            <input
              type="number"
              min="0.1"
              max="15"
              step="0.1"
              value={selectedObject.scale[0]}
              onChange={(e) => handleScaleChange(0, e.target.value)}
              className="w-full text-center"
            />
            <label className="mt-2 text-sm font-medium">X</label>
          </div>

          <div className="flex flex-col items-center">
            <input
              type="number"
              min="0.1"
              max="15"
              step="0.1"
              value={selectedObject.scale[1]}
              onChange={(e) => handleScaleChange(1, e.target.value)}
              className="w-full text-center"
            />
            <label className="mt-2 text-sm font-medium">Y</label>
          </div>

          <div className="flex flex-col items-center">
            <input
              type="number"
              min="0.1"
              max="15"
              step="0.1"
              value={selectedObject.scale[2]}
              onChange={(e) => handleScaleChange(2, e.target.value)}
              className="w-full text-center"
            />
            <label className="mt-2 text-sm font-medium">Z</label>
          </div>
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
    </div>

      {/* control for changing position, rotation, etc. */}
      <div>
        <button
          onClick={() => setARObjects({ 
            type: 'UPDATE_OBJECT', 
            payload: { ...selectedObject, position: [0, 0, 0] } 
          })}          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Reset Position
        </button>
      </div>
      <div>
        <button
          onClick={handleDeleteAsset}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
        >
          Delete Asset
        </button>
      </div>
    </div>
  );
};

export default ARControls;
