// src/controllers/AnimationController.js
import { useAtom } from 'jotai';
import { useEffect } from 'react';
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

  const stop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const addKeyframe = (objectId) => {
    setArObjects((prevObjects) =>
      prevObjects.map((obj) => {
        if (obj.id === objectId) {
          const existingKeyframes = obj.keyframes || [];
          const lastKeyframe = existingKeyframes[existingKeyframes.length - 1];

          let newKeyframe;
          if (!lastKeyframe || lastKeyframe.end !== null) {
            newKeyframe = {
              id: existingKeyframes.length + 1,
              start: currentTime,
              end: null,
              position: {
                start: [...(obj.position || [0, 0, 0])],
                end: null,
              },
            };
          } else {
            newKeyframe = {
              ...lastKeyframe,
              end: currentTime,
              position: {
                ...lastKeyframe.position,
                end: [...(obj.position || [0, 0, 0])],
              },
            };
          }

          const updatedKeyframes = [
            ...existingKeyframes.filter((k) => k.id !== newKeyframe.id),
            newKeyframe,
          ];

          return {
            ...obj,
            keyframes: updatedKeyframes,
          };
        }
        return obj;
      })
    );
  };

  const updateKeyframe = (objectId, keyframeId, updatedKeyframeData) => {
    setArObjects((prevObjects) =>
      prevObjects.map((obj) => {
        if (obj.id === objectId) {
          const updatedKeyframes = obj.keyframes.map((kf) =>
            kf.id === keyframeId ? { ...kf, ...updatedKeyframeData } : kf
          );
          return { ...obj, keyframes: updatedKeyframes };
        }
        return obj;
      })
    );
  };

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

      return {
        position: interpolatedPosition,
        // Include rotation and scale if needed
      };
    }

    return null;
  };

  useEffect(() => {
    // Optionally update arObjects here if needed
  }, [currentTime, isPlaying]);

  return {
    play,
    stop,
    addKeyframe,
    updateKeyframe,
    interpolateProperties,
    currentTime,
    isPlaying,
  };
};

export default AnimationController;