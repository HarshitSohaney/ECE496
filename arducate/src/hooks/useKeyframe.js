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
      const lastKeyframe = existingKeyframes[existingKeyframes.length - 1];
      const currentColor = targetObject.color ? hexToRGB(targetObject.color) : [1, 1, 1];

      let newKeyframe;
      if (!lastKeyframe || lastKeyframe.end !== null) {
        newKeyframe = {
          id: existingKeyframes.length + 1,
          start: currentTime,
          end: null,
          position: { start: [...(targetObject.position || [0, 0, 0])], end: null },
          rotation: { start: [...(targetObject.rotation || [0, 0, 0])], end: null },
          scale: { start: [...(targetObject.scale || [1, 1, 1])], end: null },
          color: { start: currentColor, end: null },
        };
      } else {
        newKeyframe = {
          ...lastKeyframe,
          end: Math.min(currentTime, duration),
          position: { ...lastKeyframe.position, end: [...(targetObject.position || [0, 0, 0])] },
          rotation: { ...lastKeyframe.rotation, end: [...(targetObject.rotation || [0, 0, 0])] },
          scale: { ...lastKeyframe.scale, end: [...(targetObject.scale || [1, 1, 1])] },
          color: { ...lastKeyframe.color, end: currentColor },
        };
      }

      setArObjects({
        type: "UPDATE_OBJECT",
        payload: { id: objectId, keyframes: [...existingKeyframes.filter(k => k.id !== newKeyframe.id), newKeyframe] },
      });
    },
    [arObjects, currentTime, duration, setArObjects]
  );

  const updateKeyframe = useCallback(
    (objectId, keyframeId, updatedData) => {
      const targetObject = arObjects.find((obj) => obj.id === objectId);
      if (!targetObject) return;

      const sanitizedData = { ...updatedData };
      if (sanitizedData.start !== undefined) sanitizedData.start = Math.min(sanitizedData.start, duration);
      if (sanitizedData.end !== undefined) sanitizedData.end = Math.min(sanitizedData.end, duration);

      const updatedKeyframes = targetObject.keyframes.map(kf =>
        kf.id === keyframeId ? { ...kf, ...sanitizedData } : kf
      );

      setArObjects({
        type: "UPDATE_OBJECT",
        payload: { id: objectId, keyframes: updatedKeyframes },
      });
    },
    [arObjects, setArObjects, duration]
  );

  const deleteKeyframe = useCallback(
    (objectId, keyframeId) => {
      setArObjects({
        type: "UPDATE_OBJECT",
        payload: {
          id: objectId,
          keyframes: arObjects.find(obj => obj.id === objectId)?.keyframes.filter(kf => kf.id !== keyframeId) || [],
        },
      });
    },
    [arObjects, setArObjects]
  );

  return { addKeyframe, updateKeyframe, deleteKeyframe };
};

export default useKeyframe;
