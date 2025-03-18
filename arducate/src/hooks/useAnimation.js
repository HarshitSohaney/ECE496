import { useAtom } from "jotai";
import { useEffect, useCallback, useRef } from "react";
import * as THREE from "three";
import {
  currentTimeAtom,
  isPlayingAtom,
  timelineDurationAtom,
  arObjectsAtom,
} from "../atoms";


const useAnimation = () => {
  const [currentTime, setCurrentTime] = useAtom(currentTimeAtom);
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);
  const [arObjects] = useAtom(arObjectsAtom);
  const [duration] = useAtom(timelineDurationAtom);

  const animationRef = useRef({
    startTime: null,
    lastFrameTime: null,
    initialPlayTime: 0,
    frameId: null,
  });

  useEffect(() => {
    const animate = (currentFrameTime) => {
      if (!isPlaying) return;

      const anim = animationRef.current;

      if (!anim.startTime) {
        anim.startTime = currentFrameTime;
        anim.lastFrameTime = currentFrameTime;
        anim.initialPlayTime = currentTime;
      }

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

  // Use THREE.js built-in interpolation functions
  const interpolateVector = (start, end, progress) => {
    if (!start || !end) return start || end || [0, 0, 0];

    return new THREE.Vector3().fromArray(start).lerp(new THREE.Vector3().fromArray(end), progress).toArray();
  };

  const interpolateRotation = (start, end, progress) => {
    if (!start || !end || progress < 0 || progress > 1) return [0, 0, 0];

    const startQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(...start, "XYZ"));
    const endQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(...end, "XYZ"));

    const interpolatedQ = new THREE.Quaternion();
    interpolatedQ.copy(startQ).slerp(endQ, progress);

    const interpolatedEuler = new THREE.Euler().setFromQuaternion(interpolatedQ, "XYZ");

    return [interpolatedEuler.x, interpolatedEuler.y, interpolatedEuler.z];
  };

  const interpolateProperties = (objectId) => {
  const obj = arObjects.find((o) => o.id === objectId);
  if (!obj || !obj.keyframes || obj.keyframes.length === 0) return null;

  const sortedKeyframes = [...obj.keyframes].sort((a, b) => a.time - b.time);

  // 🔹 Handle edge cases where currentTime is before or after keyframes
  if (currentTime <= sortedKeyframes[0].time) {
    return {
      position: sortedKeyframes[0].position ?? [0, 0, 0],
      rotation: sortedKeyframes[0].rotation ?? [0, 0, 0],
      scale: sortedKeyframes[0].scale ?? [1, 1, 1],
    };
  }
  if (currentTime >= sortedKeyframes[sortedKeyframes.length - 1].time) {
    return {
      position: sortedKeyframes[sortedKeyframes.length - 1].position ?? [0, 0, 0],
      rotation: sortedKeyframes[sortedKeyframes.length - 1].rotation ?? [0, 0, 0],
      scale: sortedKeyframes[sortedKeyframes.length - 1].scale ?? [1, 1, 1],
    };
  }

  // 🔹 Find the two keyframes to interpolate between
  let prevKeyframe = sortedKeyframes[0];
  let nextKeyframe = sortedKeyframes[sortedKeyframes.length - 1];

  for (let i = 0; i < sortedKeyframes.length - 1; i++) {
    if (currentTime >= sortedKeyframes[i].time && currentTime < sortedKeyframes[i + 1].time) {
      prevKeyframe = sortedKeyframes[i];
      nextKeyframe = sortedKeyframes[i + 1];
      break;
    }
  }

  // 🔹 Interpolation factor (0 → start keyframe, 1 → next keyframe)
  const progress = (currentTime - prevKeyframe.time) / (nextKeyframe.time - prevKeyframe.time);

  return {
    position: interpolateVector(prevKeyframe.position, nextKeyframe.position, progress),
    rotation: interpolateRotation(prevKeyframe.rotation, nextKeyframe.rotation, progress),
    scale: interpolateVector(prevKeyframe.scale, nextKeyframe.scale, progress),
  };
};


  const setTimeAndUpdateObjects = (newTime) => {
    setCurrentTime(newTime);
  };

  return {
    play,
    pause,
    stop,
    setTimeAndUpdateObjects,
    interpolateProperties,
    currentTime,
    setCurrentTime,
    isPlaying,
  };
};


export default useAnimation;
