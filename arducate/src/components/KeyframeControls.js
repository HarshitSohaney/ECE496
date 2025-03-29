import React from "react";
import { useAtom } from "jotai";
import {
  selectedKeyframeAtom,
  arObjectsAtom,
  selectedObjectAtom,
} from "../atoms";
import useKeyframe from "../hooks/useKeyframe";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useObjectHandlers } from "hooks/objectHandlers";

const KeyframeControls = () => {
  const [selectedKeyframe, setSelectedKeyframe] = useAtom(selectedKeyframeAtom);
  const [selectedObject, setSelectedObject] = useAtom(selectedObjectAtom);
  const [arObjects, setARObjects] = useAtom(arObjectsAtom);
  const { updateKeyframe, deleteKeyframe } = useKeyframe();
  const { handleScaleChange, handlePositionChange, handleRotationChange } =
    useObjectHandlers();

  // Ensure selectedKeyframe contains valid data
  if (!selectedKeyframe?.keyframeId || !selectedKeyframe?.objectId) {
    return <p className="text-center text-sm">No keyframe selected.</p>;
  }

  // Find the object that contains the selected keyframe
  const parentObject = arObjects.find(
    (obj) => obj.id === selectedKeyframe.objectId
  );
  if (!parentObject) {
    console.warn(
      "No parent object found for keyframe:",
      selectedKeyframe.keyframeId
    );
    return <p className="text-center text-sm">No keyframe selected.</p>;
  }

  // Find the keyframe data inside the object
  const keyframe = parentObject.keyframes?.find(
    (kf) => kf.id === selectedKeyframe.keyframeId
  );
  if (!keyframe) {
    console.warn("Keyframe not found in object:", selectedKeyframe.keyframeId);
    return <p className="text-center text-sm">No keyframe selected.</p>;
  }

  const handleTimeChange = (e) => {
    const newTime = parseFloat(e.target.value);
    if (!isNaN(newTime)) {
      updateKeyframe(selectedKeyframe.objectId, selectedKeyframe.keyframeId, {
        time: newTime,
      });

      setARObjects({
        type: "UPDATE_OBJECT",
        payload: {
          id: selectedKeyframe.objectId,
          keyframes: parentObject.keyframes.map((kf) =>
            kf.id === selectedKeyframe.keyframeId
              ? { ...kf, time: newTime }
              : kf
          ),
        },
      });
    }
  };

  const handlePropertyChange = (type, axis, value) => {
    const updatedValues = [...(keyframe[type] || [0, 0, 0])];
    updatedValues[axis] = parseFloat(value);

    switch (type) {
      case "position":
        handlePositionChange(axis, value);
        break;
      case "rotation":
        handleRotationChange(axis, value);
        break;
      case "scale":
        handleScaleChange(axis, value);
        break;
      default:
        console.log("Type is something else");
    }

    updateKeyframe(selectedKeyframe.objectId, selectedKeyframe.keyframeId, {
      [type]: updatedValues,
    });
  };

  const handleDeleteKeyframe = () => {
    deleteKeyframe(selectedKeyframe.objectId, selectedKeyframe.keyframeId);

    // Deselect the keyframe
    setSelectedKeyframe({ keyframeId: null, objectId: null });
  };

  const InputGroup = ({ label, propType, min, max, step }) => {
    const defaultValues = propType === "scale" ? [1, 1, 1] : [0, 0, 0];
    const values = keyframe[propType] || defaultValues;

    return (
      <div className="mb-3">
        <label className="block text-xs font-medium mb-1">{label}:</label>
        <div className="flex justify-between text-white">
          {values.map((value, axis) => (
            <div key={axis} className="flex flex-row items-center">
              <Label
                htmlFor={`input-${propType}-${axis}`}
                className="text-xs px-1 font-medium border border-r-0 border-gray-200 h-full flex items-center ml-1 bg-black rounded-l-lg"
              >
                {["X", "Y", "Z"][axis]}
              </Label>
              <Input
                id={`input-${propType}-${axis}`}
                type="number"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) =>
                  handlePropertyChange(propType, axis, e.target.value)
                }
                className="text-center text-sm h-7 pl-0 border-l-0 rounded-r-lg rounded-s-none"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-2 bg-secondary rounded text-white">
      <div className="mb-3">
        <Label className="text-xs font-medium">Keyframe Time:</Label>
        <Input
          type="number"
          value={keyframe.time?.toFixed(2) || 0}
          onChange={handleTimeChange}
          className="w-full p-1 border rounded text-sm"
        />
      </div>

      <InputGroup
        label="position"
        propType="position"
        min="-10"
        max="10"
        step="0.1"
      />

      <InputGroup
        label="rotation"
        propType="rotation"
        min="-180"
        max="180"
        step="1"
      />

      <InputGroup
        label="scale"
        propType="scale"
        min="0.1"
        max="15"
        step="0.1"
      />

      <Button
        onClick={handleDeleteKeyframe}
        className="w-full px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-700 mt-2"
      >
        Delete Keyframe
      </Button>

      <Button
        onClick={() => {
          setSelectedKeyframe({ keyframeId: null, objectId: null });
          // setSelectedObject(null); // optional tbh
        }}
        className="w-full px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-700 mt-2"
      >
        Done
      </Button>
    </div>
  );
};

export default KeyframeControls;
