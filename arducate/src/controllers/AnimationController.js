// src/controllers/AnimationController.js
import * as THREE from 'three';
import { useAtom } from 'jotai';
import { useEffect, useCallback } from 'react';
import {
  arObjectsAtom,
  currentTimeAtom,
  isPlayingAtom,
} from '../atoms';

const AnimationController = () => {
  const [currentTime, setCurrentTime] = useAtom(currentTimeAtom);
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);
  const [arObjects, setArObjects] = useAtom(arObjectsAtom);

  useEffect(() => {
    let animationFrameId;
    let lastTimestamp;

    const animate = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      setCurrentTime((prevTime) => prevTime + deltaTime);
      animationFrameId = requestAnimationFrame(animate);
    };

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(animate);
    } else if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPlaying, setCurrentTime]);

  const play = () => setIsPlaying(true);
  
  const pause = () => setIsPlaying(false);

  const stop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const addKeyframe = useCallback((objectId) => {
    const targetObject = arObjects.find(obj => obj.id === objectId);
    if (!targetObject) return;

    const existingKeyframes = targetObject.keyframes || [];
    const lastKeyframe = existingKeyframes[existingKeyframes.length - 1];

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
      };
    } else {
      newKeyframe = {
        ...lastKeyframe,
        end: currentTime,
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
      };
    }

    const updatedKeyframes = [
      ...existingKeyframes.filter((k) => k.id !== newKeyframe.id),
      newKeyframe,
    ];

    setArObjects({
      type: 'UPDATE_OBJECT',
      payload: {
        id: objectId,
        keyframes: updatedKeyframes,
      },
    });
  }, [arObjects, currentTime, setArObjects]);

  const updateKeyframe = useCallback((objectId, keyframeId, updatedKeyframeData) => {
    const targetObject = arObjects.find(obj => obj.id === objectId);
    if (!targetObject) return;
  
    const updatedKeyframes = targetObject.keyframes.map(kf =>
      kf.id === keyframeId ? { ...kf, ...updatedKeyframeData } : kf
    );
  
    setArObjects({
      type: 'UPDATE_OBJECT',
      payload: {
        id: objectId,
        keyframes: updatedKeyframes,
      },
    });
  }, [arObjects, setArObjects]);

  const interpolatePosition = (start, end, progress) => {
    if (!start || !end) {
      console.error('Start or end positions are undefined');
      return start || end || [0, 0, 0];
    }

    return start.map((startValue, index) => {
      const endValue = end[index];
      return startValue + (endValue - startValue) * progress;
    });
  };

  const interpolateRotation = (start, end, progress) => {
    if (!start || !end) {
      console.error('Start or end rotations are undefined');
      return start || end || [0, 0, 0];
    }
    
    const startQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(...start));
    const endQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(...end));
  
    const interpolatedQuaternion = new THREE.Quaternion().slerp(startQuaternion, endQuaternion, progress);
  
    // Convert back to Euler angles if needed
    const euler = new THREE.Euler().setFromQuaternion(interpolatedQuaternion);
    return [euler.x, euler.y, euler.z];
  };

  const interpolateScale = (start, end, progress) => {
    if (!start || !end) {
      console.error('Start or end scale are undefined');
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
        currentTime >= kf.start &&
        kf.end !== null &&
        currentTime <= kf.end
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

      return {
        position: interpolatedPosition,
        rotation: interpolatedRotation,
        scale: interpolatedScale,
      };
    }

    return null;
  };

  useEffect(() => {
    // Optionally update arObjects here if needed
  }, [currentTime, isPlaying]);

  return {
    play,
    pause,
    stop,
    addKeyframe,
    updateKeyframe,
    interpolateProperties,
    currentTime,
    isPlaying,
  };
};

export default AnimationController;
