import React from "react";
import { useAtom } from "jotai";
import { selectedKeyframeAtom, arObjectsAtom, selectedObjectAtom } from "../atoms";
import useKeyframe from "../hooks/useKeyframe";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useObjectHandlers } from "hooks/objectHandlers";


const KeyframeControls = () => {
  const [selectedKeyframe, setSelectedKeyframe] = useAtom(selectedKeyframeAtom);
  const [selectedObject, setSelectedObject] = useAtom(selectedObjectAtom);
  const [arObjects, setARObjects] = useAtom(arObjectsAtom);
  const { updateKeyframe, deleteKeyframe } = useKeyframe();
  const {
    handleScaleChange,
    handlePositionChange,
    handleRotationChange,
  } = useObjectHandlers();

  // Ensure selectedKeyframe contains valid data
  if (!selectedKeyframe?.keyframeId || !selectedKeyframe?.objectId) {
    return <p className="text-center text-sm">No keyframe selected.</p>;
  }

  // Find the object that contains the selected keyframe
  const parentObject = arObjects.find((obj) => obj.id === selectedKeyframe.objectId);
  if (!parentObject) {
    console.warn("No parent object found for keyframe:", selectedKeyframe.keyframeId);
    return <p className="text-center text-sm">No keyframe selected.</p>;
  }

  // Find the keyframe data inside the object
  const keyframe = parentObject.keyframes?.find((kf) => kf.id === selectedKeyframe.keyframeId);
  if (!keyframe) {
    console.warn("Keyframe not found in object:", selectedKeyframe.keyframeId);
    return <p className="text-center text-sm">No keyframe selected.</p>;
  }

  const handleTimeChange = (e) => {
    const newTime = parseFloat(e.target.value);
    if (!isNaN(newTime)) {
      updateKeyframe(selectedKeyframe.objectId, selectedKeyframe.keyframeId, { time: newTime });

      setARObjects({
        type: "UPDATE_OBJECT",
        payload: {
          id: selectedKeyframe.objectId,
          keyframes: selectedObject.keyframes.map((kf) =>
            kf.id === selectedKeyframe.keyframeId ? { ...kf, time: newTime } : kf
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
        handlePositionChange(axis, value)
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

    // Remove keyframe from arObjects
    setARObjects({
      type: "UPDATE_OBJECT",
      payload: {
        id: selectedKeyframe.objectId,
        keyframes: selectedObject.keyframes.filter((kf) => kf.id !== selectedKeyframe.keyframeId),
      },
    });

    // Deselect the keyframe
    setSelectedKeyframe({ keyframeId: null, objectId: null });
  };

  const InputGroup = ({ label, propType, min, max, step }) => (
    <div className="mb-3">
      <label className="block text-xs font-medium mb-1">{label}:</label>
      <div className="flex justify-between">
        {(keyframe[propType] || [0, 0, 0]).map((value, axis) => (
          <div key={axis} className="flex flex-col items-center w-[28%]">
            <input
              type="number"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => handlePropertyChange(propType, axis, e.target.value)}
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
      <div className="mb-3">
        <label className="text-xs font-medium">Keyframe Time:</label>
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
    </div>
  );
};

export default KeyframeControls;
