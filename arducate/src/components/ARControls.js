import React, { useCallback, useEffect } from "react";
import { useAtom } from "jotai";
import { selectedObjectAtom, arObjectsAtom } from "../atoms";
import { Switch } from "../@/components/ui/switch";
import { useObjectHandlers } from "hooks/objectHandlers";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    handleNameChange,
  } = useObjectHandlers();

  if (!selectedObject) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-secondary text-gray-700 rounded-lg p-4">
        <div className="text-lg font-semibold text-center text-white">
          No Object Selected
        </div>
        <p className="text-sm text-gray-500 mt-1 text-center">
          Please select an object to view its details
        </p>
      </div>
    );
  }

  const InputGroup = ({ label, values, onChange, min, max, step }) => {
    const handleWheel = useCallback(
      (e, axis) => {
        e.preventDefault();
        e.stopPropagation();

        const delta = e.deltaY < 0 ? step : -step;
        const currentValue = parseFloat(isNaN(values[axis]) ? 0 : values[axis]);
        const parsedMin = parseFloat(min);
        const parsedMax = parseFloat(max);
        // Calculate new value
        const newValue = Math.min(
          parsedMax,
          Math.max(parsedMin, currentValue + delta)
        );

        console.log(
          parseFloat(values[axis]),
          newValue,
          "delta",
          delta,
          currentValue,
          Math.max(parsedMin, currentValue + delta)
        );
        const finalValue = isNaN(newValue) ? 0 : newValue;

        onChange(axis, finalValue.toString());
      },
      [onChange, min, max, step, values]
    );

    return (
      <div className="mb-3">
        <Label
          htmlFor={`input-group-${label}`}
          className="block text-xs font-medium mb-1"
        >
          {label}:
        </Label>
        <div className="flex justify-between">
          {[0, 1, 2].map((axis) => {
            const inputId = `input-${label}-${axis}`;
            return (
              <div
                key={axis}
                className="flex flex-row items-center w-[35%] overscroll-contain"
              >
                <Label
                  htmlFor={inputId}
                  className="text-xs px-1 font-medium border border-r-0 border-gray-200 h-full flex items-center ml-1 bg-black rounded-l-lg"
                >
                  {["X", "Y", "Z"][axis]}
                </Label>
                <Input
                  id={inputId}
                  type="number"
                  min={min}
                  max={max}
                  step={step}
                  value={values[axis]}
                  // onWheel={(e) => {
                  //   handleWheel(e, axis);
                  // }}
                  onChange={(e) => onChange(axis, e.target.value)}
                  className="text-center text-sm h-7 pl-0 border-l-0 rounded-r-lg rounded-s-none custom-input"
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="p-2 bg-secondary rounded h-full text-white">
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
            <label className="text-xs font-medium">Name:</label>
            <input
              type="text"
              value={selectedObject.name}
              onChange={handleNameChange}
              className="w-full p-1 border rounded text-sm bg-secondary-foreground"
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1">
            <label className="text-xs font-medium">Label:</label>
            <input
              type="text"
              value={selectedObject.label}
              onChange={handleLabelChange}
              className="w-full p-1 border rounded text-sm bg-secondary-foreground"
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
            className="w-full p-2 border rounded bg-secondary-foreground"
          />
        </div>
      )}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Color:</label>
        <input
          type="color"
          value={selectedObject.color || "#ffa500"}
          onChange={handleColorChange}
          className="w-full h-6 p-0 border-none bg-secondary-foreground"
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
