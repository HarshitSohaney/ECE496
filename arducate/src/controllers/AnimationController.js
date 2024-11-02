// src/controllers/AnimationController.js
import { useAtom } from 'jotai';
import { useEffect, useCallback } from 'react';
import {
  arObjectsAtom,
  currentTimeAtom,
  isPlayingAtom,
  timelineDurationAtom,
} from '../atoms';

const AnimationController = () => {
  const [currentTime, setCurrentTime] = useAtom(currentTimeAtom);
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);
  const [arObjects, setArObjects] = useAtom(arObjectsAtom);
  const [duration] = useAtom(timelineDurationAtom);

  useEffect(() => {
    let animationFrameId;
    let lastTimestamp;

    const animate = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      setCurrentTime((prevTime) => {
        const newTime = prevTime + deltaTime;
        // Stop playing if we reach the end of the timeline
        if (newTime >= duration) {
          setIsPlaying(false);
          return duration;
        }
        return newTime;
      });

      if (isPlaying) {
        animationFrameId = requestAnimationFrame(animate);
      }
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
  }, [isPlaying, setCurrentTime, duration, setIsPlaying]);

  // Update to check if currentTime is within duration when starting playback
  const play = () => {
    if (currentTime >= duration) {
      setCurrentTime(0);
    }
    setIsPlaying(true);
  };

  const stop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const addKeyframe = useCallback((objectId) => {
    const targetObject = arObjects.find(obj => obj.id === objectId);
    if (!targetObject) return;

    // Don't add keyframe if we're beyond the timeline duration
    if (currentTime > duration) return;

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
      };
    } else {
      // Ensure the end time doesn't exceed the timeline duration
      const endTime = Math.min(currentTime, duration);
      newKeyframe = {
        ...lastKeyframe,
        end: endTime,
        position: {
          ...lastKeyframe.position,
          end: [...(targetObject.position || [0, 0, 0])],
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
  }, [arObjects, currentTime, duration, setArObjects]);

  const updateKeyframe = useCallback((objectId, keyframeId, updatedKeyframeData) => {
    const targetObject = arObjects.find(obj => obj.id === objectId);
    if (!targetObject) return;
  
    // Ensure keyframe times don't exceed timeline duration
    const sanitizedData = { ...updatedKeyframeData };
    if (sanitizedData.start !== undefined) {
      sanitizedData.start = Math.min(sanitizedData.start, duration);
    }
    if (sanitizedData.end !== undefined) {
      sanitizedData.end = Math.min(sanitizedData.end, duration);
    }
  
    const updatedKeyframes = targetObject.keyframes.map(kf =>
      kf.id === keyframeId ? { ...kf, ...sanitizedData } : kf
    );
  
    setArObjects({
      type: 'UPDATE_OBJECT',
      payload: {
        id: objectId,
        keyframes: updatedKeyframes,
      },
    });
  }, [arObjects, setArObjects, duration]);

  // Rest of the code remains the same
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
      };
    }

    return null;
  };

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