import React, { useCallback } from "react";
import { useAtom } from "jotai";
import { selectedObjectAtom, arObjectsAtom } from "../atoms";
import { Switch } from "../@/components/ui/switch";

const ARControls = () => {
  const [selectedObject, setSelectedObject] = useAtom(selectedObjectAtom);
  const [, setARObjects] = useAtom(arObjectsAtom);

  const handleColorChange = (e) => {
    if (selectedObject) {
      setARObjects({
        //Actual update handled in the atom
        type: "UPDATE_OBJECT",
        payload: {
          ...selectedObject,
          color: e.target.value,
        },
      });
    }
  };

  const handleScaleChange = (axis, scaleValue) => {
    if (selectedObject) {
      const newScale = [...selectedObject.scale];
      newScale[axis] = parseFloat(scaleValue);
  
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
      setARObjects({ type: "REMOVE_OBJECT", payload: selectedObject.id });
    }
  }, [selectedObject, setARObjects]);

  const handleLabelChange = (e) => {
    setARObjects({
      type: "UPDATE_OBJECT",
      payload: {
        id: selectedObject.id,
        name: e.target.value,
      },
    });
  };

  const handleLabelVisibilityChange = (checked) => {
    setARObjects({
      type: "UPDATE_OBJECT",
      payload: {
        id: selectedObject.id,
        showLabel: checked,
      },
    });
  };

  const handleTextChange = (e) => {
    setARObjects({
      type: "UPDATE_OBJECT",
      payload: {
        id: selectedObject.id,
        text: e.target.value,
      },
    });
  };

  const handleRotationChange = (axis, value) => {
    if (selectedObject) {
      const currentRotation = Array.isArray(selectedObject.rotation) 
        ? selectedObject.rotation.slice(0, 3) 
        : [0, 0, 0];
      
      const newRotation = [...currentRotation];
      newRotation[axis] = parseFloat(value);
      
      setARObjects({
        type: 'UPDATE_OBJECT',
        payload: {
          id: selectedObject.id,
          rotation: newRotation
        }
      });
    }
  };

  const handleVisibilityChange = (checked) => {
    if (selectedObject) {
      // If turning visibility off, clear the selected object
      if (!checked) {
        setSelectedObject(null);
      }
      
      setARObjects({
        type: 'UPDATE_OBJECT',
        payload: {
          ...selectedObject,
          visible: checked
        }
      });
    }
  };

  if (!selectedObject) {
    return (
      <div className="w-[15vw] h-full flex flex-col items-center justify-center bg-secondary text-gray-700 rounded-lg shadow-lg p-4">
        <div className="text-lg font-semibold">No Object Selected</div>
        <p className="text-sm text-gray-500 mt-1 text-center">
          Please select an object to view its details.
        </p>
      </div>
    );
  }

  const InputGroup = ({ label, values, onChange, min, max, step }) => (
    <div className="mb-3">
      <label className="block text-xs font-medium mb-1">{label}:</label>
      <div className="flex justify-between">
        {[0, 1, 2].map((axis) => (
          <div key={axis} className="flex flex-col items-center w-[28%]">
            <input
              type="number"
              min={min}
              max={max}
              step={step}
              value={values[axis]}
              onChange={(e) => onChange(axis, e.target.value)}
              className="w-full text-center text-sm p-1 h-7"
            />
            <label className="mt-1 text-xs font-medium">{['X', 'Y', 'Z'][axis]}</label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-[15vw] p-2 bg-secondary rounded">
      <div className="mb-3 flex items-center justify-between">
        <label className="text-xs font-medium">Visible:</label>
        <Switch
          checked={selectedObject.visible !== false}
          onCheckedChange={handleVisibilityChange}
          className="scale-75"
        />
      </div>
      <div className="mb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1">
            <label className="text-xs font-medium">Label:</label>
            <input
              type="text"
              value={selectedObject.name}
              onChange={handleLabelChange}
              className="w-full p-1 border rounded text-sm"
            />
          </div>
          <div className="flex flex-col items-center">
            <label className="text-xs font-medium">Show</label>
            <Switch
              checked={selectedObject.showLabel || false}
              onCheckedChange={handleLabelVisibilityChange}
              className="scale-75"
            />
          </div>
        </div>
      </div>


      {selectedObject.type == 'text' && 
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Text Input:</label>
          <input
            type="text"
            value={selectedObject.text}
            onChange={handleTextChange}
            className="w-full p-2 border rounded"
          />
        </div>
      }
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Color:</label>
        <input
          type="color"
          value={selectedObject.color || "#ffa500"}
          onChange={handleColorChange}
          className="w-full h-6 p-0 border-none"
        />
      </div>

      <InputGroup
        label="Scale"
        values={selectedObject.scale}
        onChange={handleScaleChange}
        min="0.1"
        max="15"
        step="0.1"
      />

      <InputGroup
        label="Position"
        values={selectedObject.position}
        onChange={handlePositionChange}
        min="-10"
        max="10"
        step="0.1"
      />

      <InputGroup
        label="Rotation"
        values={selectedObject.rotation || [0, 0, 0]}
        onChange={handleRotationChange}
        min="-180"
        max="180"
        step="1"
      />

      <button
        onClick={() => setARObjects({ 
          type: 'UPDATE_OBJECT', 
          payload: { ...selectedObject, position: [0, 0, 0] } 
        })}
        className="w-full px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-700 mb-2"
      >
        Reset Position
      </button>
      
      <button
        onClick={handleDeleteAsset}
        className="w-full px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-700"
      >
        Delete Asset
      </button>
    </div>
  );
};

export default ARControls;