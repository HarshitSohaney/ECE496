import React from "react";
import { useAtom } from "jotai";
import { selectedKeyframeAtom, arObjectsAtom } from "../atoms";
import useKeyframe from "../hooks/useKeyframe";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const KeyframeControls = () => {
  const [selectedKeyframe, setSelectedKeyframe] = useAtom(selectedKeyframeAtom);
  const [arObjects, setArObjects] = useAtom(arObjectsAtom);
  const { updateKeyframe, deleteKeyframe } = useKeyframe();

  // Ensure selectedKeyframe contains valid data
  if (!selectedKeyframe?.keyframeId || !selectedKeyframe?.objectId) {
    return <p className="text-center text-sm">No keyframe selected.</p>;
  }

  // 🔹 Find the object that contains the selected keyframe
  const parentObject = arObjects.find((obj) => obj.id === selectedKeyframe.objectId);
  if (!parentObject) {
    console.warn("No parent object found for keyframe:", selectedKeyframe.keyframeId);
    return <p className="text-center text-sm">No keyframe selected.</p>;
  }

  // 🔹 Find the keyframe data inside the object
  const keyframe = parentObject.keyframes?.find((kf) => kf.id === selectedKeyframe.keyframeId);
  if (!keyframe) {
    console.warn("Keyframe not found in object:", selectedKeyframe.keyframeId);
    return <p className="text-center text-sm">No keyframe selected.</p>;
  }

  // 🔹 Handle changes
  const handleTimeChange = (e) => {
    const newTime = parseFloat(e.target.value);
    if (!isNaN(newTime)) {
      updateKeyframe(selectedKeyframe.objectId, selectedKeyframe.keyframeId, { time: newTime });

      // Update arObjectsAtom to reflect the change
      setArObjects((prevObjects) =>
        prevObjects.map((obj) =>
          obj.id === selectedKeyframe.objectId
            ? {
                ...obj,
                keyframes: obj.keyframes.map((kf) =>
                  kf.id === selectedKeyframe.keyframeId ? { ...kf, time: newTime } : kf
                ),
              }
            : obj
        )
      );
    }
  };

  const handlePropertyChange = (type, axis, value) => {
    const updatedValues = [...(keyframe[type] || [0, 0, 0])];
    updatedValues[axis] = parseFloat(value);

    updateKeyframe(selectedKeyframe.objectId, selectedKeyframe.keyframeId, {
      [type]: updatedValues,
    });

    // Update arObjectsAtom so ARObject re-renders
    setArObjects((prevObjects) =>
      prevObjects.map((obj) =>
        obj.id === selectedKeyframe.objectId
          ? {
              ...obj,
              keyframes: obj.keyframes.map((kf) =>
                kf.id === selectedKeyframe.keyframeId ? { ...kf, [type]: updatedValues, } : kf
              ),
            }
          : obj
      )
    );
  };

  const handleDeleteKeyframe = () => {
    deleteKeyframe(selectedKeyframe.objectId, selectedKeyframe.keyframeId);

    // Remove keyframe from arObjects
    setArObjects((prevObjects) =>
      prevObjects.map((obj) =>
        obj.id === selectedKeyframe.objectId
          ? { ...obj, keyframes: obj.keyframes.filter((kf) => kf.id !== selectedKeyframe.keyframeId) }
          : obj
      )
    );

    // Deselect the keyframe
    setSelectedKeyframe({ keyframeId: null, objectId: null });
  };

  const InputGroup = ({ label, type }) => (
    <div className="mb-3">
      <label className="block text-xs font-medium mb-1">{label}:</label>
      <div className="flex justify-between">
        {(keyframe[type] || [0, 0, 0]).map((value, axis) => (
          <div key={axis} className="flex flex-col items-center w-[28%]">
            <input
              type="number"
              value={value}
              onChange={(e) => handlePropertyChange(type, axis, e.target.value)}
              className="w-full text-center text-sm p-1 h-7"
            />
            <label className="mt-1 text-xs font-medium">{["X", "Y", "Z"][axis]}</label>
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

      <InputGroup label="Position" type="position" />
      <InputGroup label="Rotation" type="rotation" />
      <InputGroup label="Scale" type="scale" />

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
