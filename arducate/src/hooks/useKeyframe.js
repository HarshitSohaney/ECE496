import { useAtom } from "jotai";
import { useCallback } from "react";
import { arObjectsAtom, currentTimeAtom, timelineDurationAtom } from "../atoms";

const useKeyframe = () => {
  const [currentTime] = useAtom(currentTimeAtom);
  const [arObjects, setArObjects] = useAtom(arObjectsAtom);
  const [duration] = useAtom(timelineDurationAtom);

  const hexToRGB = (hex) => {
    hex = hex.replace(/^#/, "");
    return [
      parseInt(hex.substring(0, 2), 16) / 255,
      parseInt(hex.substring(2, 4), 16) / 255,
      parseInt(hex.substring(4, 6), 16) / 255,
    ];
  };


  const addKeyframe = useCallback(
    (objectId) => {
      const targetObject = arObjects.find((obj) => obj.id === objectId);
      if (!targetObject || currentTime > duration) return;

      const existingKeyframes = targetObject.keyframes || [];

      // Ensure a unique ID that does NOT overwrite existing keyframes
      const newId = existingKeyframes.length > 0
        ? Math.max(...existingKeyframes.map(kf => kf.id)) + 1 // Get max ID and increment
        : 1;

      let newKeyframe = {
        id: newId, // ✅ Unique ID
        time: currentTime,
        position: { time: [...(targetObject.position || [0, 0, 0])] },
        rotation: { time: [...(targetObject.rotation || [0, 0, 0])] },
        scale: { time: [...(targetObject.scale || [1, 1, 1])] },
      };

      setArObjects({
        type: "UPDATE_OBJECT",
        payload: {
          id: objectId,
          keyframes: [...existingKeyframes, newKeyframe].sort((a, b) => a.time - b.time), // Keep sorted
        },
      });
    },
    [arObjects, currentTime, duration, setArObjects]
  );

  const updateKeyframe = useCallback(
    (objectId, keyframeId, updatedData) => {
      const targetObject = arObjects.find((obj) => obj.id === objectId);
      if (!targetObject) return;

      let updatedKeyframes = [...targetObject.keyframes];
      const keyframeIndex = updatedKeyframes.findIndex(kf => kf.id === keyframeId);
      if (keyframeIndex === -1) return;

      // Update the selected keyframe's time
      if (updatedData.time !== undefined) {
        updatedData.time = Math.min(Math.max(updatedData.time, 0), duration); // Clamp within timeline
      }

      updatedKeyframes[keyframeIndex] = { ...updatedKeyframes[keyframeIndex], ...updatedData };

      // Ensure keyframes remain sorted
      updatedKeyframes.sort((a, b) => a.time - b.time);

      // Adjust previous and next keyframes
      const newIndex = updatedKeyframes.findIndex(kf => kf.id === keyframeId);

      if (newIndex > 0) {
        updatedKeyframes[newIndex - 1].end = updatedKeyframes[newIndex].time; // Previous keyframe's end updates
      }

      if (newIndex < updatedKeyframes.length - 1) {
        updatedKeyframes[newIndex + 1].start = updatedKeyframes[newIndex].time; // Next keyframe's start updates
      }

      setArObjects({
        type: "UPDATE_OBJECT",
        payload: { id: objectId, keyframes: updatedKeyframes },
      });
    },
    [arObjects, setArObjects, duration]
  );


  const deleteKeyframe = useCallback(
    (objectId, keyframeId) => {
      const targetObject = arObjects.find((obj) => obj.id === objectId);
      if (!targetObject) return;

      let updatedKeyframes = targetObject.keyframes.filter(kf => kf.id !== keyframeId);

      setArObjects({
        type: "UPDATE_OBJECT",
        payload: { id: objectId, keyframes: updatedKeyframes },
      });
    },
    [arObjects, setArObjects]
  );
  return { addKeyframe, updateKeyframe, deleteKeyframe };

};

export default useKeyframe;
