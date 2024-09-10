import React, { useCallback } from "react";
import { useAtom } from "jotai";
import { selectedObjectAtom, arObjectsAtom } from "../atoms";

const ARControls = () => {
  const [selectedObject, setSelectedObject] = useAtom(selectedObjectAtom);
  const [arObjects, dispatchARObjects] = useAtom(arObjectsAtom);

  const handleColorChange = (e) => {
    if (selectedObject) {
      console.log('before',selectedObject)
      dispatchARObjects({ 
        type: 'UPDATE_OBJECT', 
        payload: { 
          ...selectedObject,  // Spread all existing properties
          color: e.target.value  // Only update the color
        } 
      });
      console.log('after',selectedObject)
    }
  };

  const handleScaleChange = (e) => {
    const scaleValue = parseFloat(e.target.value);
    if (selectedObject) {
      dispatchARObjects({ 
        type: 'UPDATE_OBJECT', 
        payload: { 
          ...selectedObject,  // Spread all existing properties
          scale: [scaleValue, scaleValue, scaleValue]  // Update the scale
        } 
      });
    }
  };

  const handleDeleteAsset = useCallback(() => {
    console.log('Delete asset clicked. Current arObjects:', arObjects);
    console.log('Selected object to delete:', selectedObject);

    if (selectedObject) {
      dispatchARObjects({ type: 'REMOVE_OBJECT', payload: selectedObject.id });
      setSelectedObject(null);

      // Log the state after a short delay to allow for re-renders
      setTimeout(() => {
        console.log('arObjects after state update:', arObjects);
      }, 0);
    }
  }, [arObjects, selectedObject, dispatchARObjects, setSelectedObject]);

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
      <div>
        <button
          onClick={() => dispatchARObjects({ 
            type: 'UPDATE_OBJECT', 
            payload: { ...selectedObject, position: [0, 0, 0] } 
          })}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
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