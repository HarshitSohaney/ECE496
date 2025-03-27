import { useAtom } from "jotai";
import { useCallback } from "react";
import { arObjectsAtom, currentTimeAtom, timelineDurationAtom } from "../atoms";
import { generateUUID } from "three/src/math/MathUtils";

const useKeyframe = () => {
  const [currentTime] = useAtom(currentTimeAtom);
  const [arObjects, setArObjects] = useAtom(arObjectsAtom);
  const [duration] = useAtom(timelineDurationAtom);

  const hexToRGB = (hex) => {
    // Remove the hash if present
    hex = hex.replace(/^#/, '');
  
    // Handle 3-digit hex codes
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
  
    // Validate hex code length
    if (hex.length !== 6) {
      console.warn(`Invalid hex color: ${hex}. Defaulting to white.`);
      return [1, 1, 1];
    }
  
    try {
      return [
        parseInt(hex.substring(0, 2), 16) / 255,
        parseInt(hex.substring(2, 4), 16) / 255,
        parseInt(hex.substring(4, 6), 16) / 255
      ];
    } catch (error) {
      console.warn(`Error converting hex to RGB: ${hex}. Defaulting to white.`);
      return [1, 1, 1];
    }
  };


  const addKeyframe = useCallback(
    (objectId, params = {}) => {
      const targetObject = arObjects.find((obj) => obj.id === objectId);
      if (!targetObject || (params.time !== undefined && params.time > duration)) return;
      const existingKeyframes = targetObject.keyframes || [];

      // Ensure a unique ID that does NOT overwrite existing keyframes
      const newId = crypto.randomUUID();
      let newKeyframe = {
        id: newId,
        time: params.time !== undefined ? params.time : currentTime,
        position: params.position || [...(targetObject.position || [0, 0, 0])],
        rotation: params.rotation || [...(targetObject.rotation || [0, 0, 0])],
        scale: params.scale || [...(targetObject.scale || [1, 1, 1])],
        color: hexToRGB(targetObject.color || "#ffa500"),
      };

      // Include all existing object properties in the update
      setArObjects({
        type: "UPDATE_OBJECT",
        payload: {
          ...targetObject,  // Include all existing properties
          id: objectId,
          keyframes: [newKeyframe, ...existingKeyframes],
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
