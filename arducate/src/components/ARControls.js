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

  const handleScaleChange = (e) => {
    const scaleValue = parseFloat(e.target.value);
    if (selectedObject) {
      setARObjects({ 
        type: 'UPDATE_OBJECT', 
        payload: { 
          ...selectedObject,
          scale: [scaleValue, scaleValue, scaleValue]
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
