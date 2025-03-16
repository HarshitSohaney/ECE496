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

  // Interpolation functions
  const interpolate = (start, end, progress) =>
    start.map((s, i) => s + (end[i] - s) * progress);

  const interpolateRotation = (start, end, progress) => {
    if (!start || !end || progress < 0 || progress > 1) return [0, 0, 0];

    const startQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(...start, "XYZ"));
    const endQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(...end, "XYZ"));

    const interpolatedQ = startQ.clone().slerp(endQ, progress);
    const interpolatedEuler = new THREE.Euler().setFromQuaternion(interpolatedQ, "XYZ");

    return [interpolatedEuler.x, interpolatedEuler.y, interpolatedEuler.z];
  };

  const interpolateProperties = (objectId) => {
    const obj = arObjects.find((o) => o.id === objectId);
    if (!obj) return null;

    const keyframe = obj.keyframes?.find(kf => currentTime >= kf.start && kf.end !== null && currentTime <= kf.end);
    if (!keyframe || !keyframe.position.end) return null;

    const progress = (currentTime - keyframe.start) / (keyframe.end - keyframe.start);
    return {
      position: interpolate(keyframe.position.start, keyframe.position.end, progress),
      rotation: interpolateRotation(keyframe.rotation.start, keyframe.rotation.end, progress),
      scale: interpolate(keyframe.scale.start, keyframe.scale.end, progress),
    };
  };

  return {
    play,
    pause,
    stop,
    interpolateProperties,
    currentTime,
    setCurrentTime,
    isPlaying,
  };
};

export default useAnimation;
