import React, { useCallback } from "react";
import { useAtom } from "jotai";
import { selectedObjectAtom, arObjectsAtom } from "../atoms";
import { Switch } from "../@/components/ui/switch";
import { useObjectHandlers } from "hooks/objectHandlers";

const ARControls = () => {
  const [selectedObject, setSelectedObject] = useAtom(selectedObjectAtom);
  const [, setARObjects] = useAtom(arObjectsAtom);
  const {
    handleScaleChange,
    handlePositionChange,
    handleRotationChange,
    handleColorChange,
    handleDeleteAsset,
    handleLabelChange,
    handleLabelVisibilityChange,
    handleTextChange,
    handleVisibilityChange,
  } = useObjectHandlers();

  if (!selectedObject) {
    return (
      <div className="w-[15vw] h-full flex flex-col items-center justify-center bg-secondary text-gray-700 rounded-lg p-4">
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
            <label className="mt-1 text-xs font-medium">
              {["X", "Y", "Z"][axis]}
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-[15vw] p-2 bg-secondary rounded h-full">
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

      {selectedObject.type == "text" && (
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Text Input:</label>
          <input
            type="text"
            value={selectedObject.text}
            onChange={handleTextChange}
            className="w-full p-2 border rounded"
          />
        </div>
      )}
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
        label="Position"
        values={selectedObject.position || [0, 0, 0]}
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

      <InputGroup
        label="Scale"
        values={selectedObject.scale || [1, 1, 1]}
        onChange={handleScaleChange}
        min="0.1"
        max="15"
        step="0.1"
      />

      <button
        onClick={() =>
          setARObjects({
            type: "UPDATE_OBJECT",
            payload: { ...selectedObject, position: [0, 0, 0] },
          })
        }
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
