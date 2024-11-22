import * as THREE from "three";
import { useAtom } from "jotai";
import { useEffect, useCallback, useRef } from "react";
import {
  arObjectsAtom,
  currentTimeAtom,
  isPlayingAtom,
  timelineDurationAtom,
} from "../atoms";

const useAnimation = () => {
  const [currentTime, setCurrentTime] = useAtom(currentTimeAtom);
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);
  const [arObjects, setArObjects] = useAtom(arObjectsAtom);
  const [duration] = useAtom(timelineDurationAtom);

  const animationRef = useRef({
    startTime: null,
    lastFrameTime: null,
    initialPlayTime: 0,
    frameId: null,
  });

  useEffect(() => {
    const animate = (currentFrameTime) => {
      const anim = animationRef.current;

      if (!isPlaying) return;

      // Initialize animation timing on first frame
      if (!anim.startTime) {
        anim.startTime = currentFrameTime;
        anim.lastFrameTime = currentFrameTime;
        anim.initialPlayTime = currentTime;
      }

      // Calculate precise elapsed time since animation started
      const elapsedTime = (currentFrameTime - anim.startTime) / 1000;
      const newTime = anim.initialPlayTime + elapsedTime;

      setCurrentTime(newTime);

      anim.frameId = requestAnimationFrame(animate);
    };

    if (isPlaying) {
      animationRef.current.frameId = requestAnimationFrame(animate);
    } else {
      if (animationRef.current.frameId) {
        cancelAnimationFrame(animationRef.current.frameId);
      }
      // Reset animation state
      animationRef.current = {
        startTime: null,
        lastFrameTime: null,
        initialPlayTime: currentTime,
        frameId: null,
      };
    }

    return () => {
      if (animationRef.current.frameId) {
        cancelAnimationFrame(animationRef.current.frameId);
      }
    };
  }, [isPlaying, setCurrentTime, currentTime]);

  const play = useCallback(() => {
    // Store the current time as the starting point for playback
    animationRef.current.initialPlayTime = currentTime;
    setIsPlaying(true);
  }, [currentTime, setIsPlaying]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, [setIsPlaying]);

  const stop = useCallback(() => {
    setIsPlaying(false);
    requestAnimationFrame(() => {
      setCurrentTime(0);
    });
  }, [setIsPlaying, setCurrentTime]);

  const hexToRGB = (hex) => {
    // Remove the hash (#) if present
    hex = hex.replace(/^#/, "");

    // Parse hex values
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    return [r, g, b];
  };

  const addKeyframe = useCallback(
    (objectId) => {
      const targetObject = arObjects.find((obj) => obj.id === objectId);
      if (!targetObject) return;

      if (currentTime > duration) return;

      const existingKeyframes = targetObject.keyframes || [];
      const lastKeyframe = existingKeyframes[existingKeyframes.length - 1];

      const currentColor = targetObject.color
        ? hexToRGB(targetObject.color)
        : [1, 1, 1]; // Default white

      let newKeyframe;
      if (!lastKeyframe || lastKeyframe.end !== null) {
        newKeyframe = {
          id: existingKeyframes.length + 1,
          start: currentTime,
          end: null,
          position: {
            start: [...(targetObject.position || [0, 0, 0])],
            end: null,
          },
          rotation: {
            start: [...(targetObject.rotation || [0, 0, 0])],
            end: null,
          },
          scale: {
            start: [...(targetObject.scale || [1, 1, 1])],
            end: null,
          },
          color: {
            start: currentColor,
            end: null,
          },
        };
      } else {
        const endTime = Math.min(currentTime, duration);
        newKeyframe = {
          ...lastKeyframe,
          end: endTime,
          position: {
            ...lastKeyframe.position,
            end: [...(targetObject.position || [0, 0, 0])],
          },
          rotation: {
            ...lastKeyframe.rotation,
            end: [...(targetObject.rotation || [0, 0, 0])],
          },
          scale: {
            ...lastKeyframe.scale,
            end: [...(targetObject.scale || [1, 1, 1])],
          },
          color: {
            ...lastKeyframe.color,
            end: currentColor,
          },
        };
      }

      const updatedKeyframes = [
        ...existingKeyframes.filter((k) => k.id !== newKeyframe.id),
        newKeyframe,
      ];

      setArObjects({
        type: "UPDATE_OBJECT",
        payload: {
          id: objectId,
          keyframes: updatedKeyframes,
        },
      });
    },
    [arObjects, currentTime, duration, setArObjects]
  );

  const updateKeyframe = useCallback(
    (objectId, keyframeId, updatedKeyframeData) => {
      const targetObject = arObjects.find((obj) => obj.id === objectId);
      if (!targetObject) return;

      const sanitizedData = { ...updatedKeyframeData };
      if (sanitizedData.start !== undefined) {
        sanitizedData.start = Math.min(sanitizedData.start, duration);
      }
      if (sanitizedData.end !== undefined) {
        sanitizedData.end = Math.min(sanitizedData.end, duration);
      }

      const updatedKeyframes = targetObject.keyframes.map((kf) =>
        kf.id === keyframeId ? { ...kf, ...sanitizedData } : kf
      );

      setArObjects({
        type: "UPDATE_OBJECT",
        payload: {
          id: objectId,
          keyframes: updatedKeyframes,
        },
      });
    },
    [arObjects, setArObjects, duration]
  );

  const deleteKeyframe = useCallback(
    (objectId, keyframeId) => {
      const targetObject = arObjects.find((obj) => obj.id === objectId);
      if (!targetObject) return;

      const updatedKeyframes = targetObject.keyframes.filter(
        (kf) => kf.id !== keyframeId
      );

      setArObjects({
        type: "UPDATE_OBJECT",
        payload: {
          id: objectId,
          keyframes: updatedKeyframes,
        },
      });
    },
    [arObjects, setArObjects]
  );

  const interpolateColor = (start, end, progress) => {
    if (!start || !end || start.length !== 3 || end.length !== 3) {
      console.error("Invalid color interpolation input");
      return start || [1, 1, 1]; // Default to white
    }

    return start.map((startValue, index) => {
      const endValue = end[index];
      return startValue + (endValue - startValue) * progress;
    });
  };

  // Rest of the code remains the same
  const interpolatePosition = (start, end, progress) => {
    if (!start || !end) {
      console.error("Start or end positions are undefined");
      return start || end || [0, 0, 0];
    }

    return start.map((startValue, index) => {
      const endValue = end[index];
      return startValue + (endValue - startValue) * progress;
    });
  };

  const interpolateRotation = (start, end, progress) => {
    if (!start || !end || progress < 0 || progress > 1) {
      console.error("Invalid input parameters");
      return [0, 0, 0];
    }

    // Create Euler objects with the correct order
    const startEuler = new THREE.Euler(...start, "XYZ");
    const endEuler = new THREE.Euler(...end, "XYZ");

    // Convert to quaternions
    const startQuaternion = new THREE.Quaternion();
    const endQuaternion = new THREE.Quaternion();
    startQuaternion.setFromEuler(startEuler);
    endQuaternion.setFromEuler(endEuler);

    // Perform spherical interpolation (slerp)
    const interpolatedQuaternion = startQuaternion.clone();
    interpolatedQuaternion.slerp(endQuaternion, progress);

    // Convert back to Euler angles
    const interpolatedEuler = new THREE.Euler().setFromQuaternion(
      interpolatedQuaternion,
      "XYZ"
    );

    return [interpolatedEuler.x, interpolatedEuler.y, interpolatedEuler.z];
  };

  const interpolateScale = (start, end, progress) => {
    if (!start || !end) {
      console.error("Start or end scale are undefined");
      return start || end || [1, 1, 1];
    }

    return start.map((startValue, index) => {
      const endValue = end[index];
      return startValue + (endValue - startValue) * progress;
    });
  };

  const interpolateProperties = (objectId) => {
    const obj = arObjects.find((o) => o.id === objectId);
    if (!obj) return null;

    const activeKeyframe = obj.keyframes?.find(
      (kf) =>
        currentTime >= kf.start && kf.end !== null && currentTime <= kf.end
    );

    if (activeKeyframe && activeKeyframe.position.end) {
      const progress =
        (currentTime - activeKeyframe.start) /
        (activeKeyframe.end - activeKeyframe.start);

      const interpolatedPosition = interpolatePosition(
        activeKeyframe.position.start,
        activeKeyframe.position.end,
        progress
      );

      const interpolatedRotation = interpolateRotation(
        activeKeyframe.rotation.start,
        activeKeyframe.rotation.end,
        progress
      );

      const interpolatedScale = interpolateScale(
        activeKeyframe.scale.start,
        activeKeyframe.scale.end,
        progress
      );

      // const interpolatedColor = interpolateColor(
      //   activeKeyframe.color.start,
      //   activeKeyframe.color.end,
      //   progress
      // );

      return {
        position: interpolatedPosition,
        rotation: interpolatedRotation,
        scale: interpolatedScale,
        // color: interpolatedColor,
      };
    }

    return null;
  };

  return {
    play,
    pause,
    stop,
    addKeyframe,
    updateKeyframe,
    deleteKeyframe,
    interpolateProperties,
    currentTime,
    setCurrentTime,
    isPlaying,
  };
};

export default useAnimation;
