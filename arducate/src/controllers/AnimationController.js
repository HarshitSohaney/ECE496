// src/controllers/useAnimationController.js
import { useAtom } from 'jotai';
import { useEffect, useCallback, useRef } from 'react';
import {
  arObjectsAtom,
  currentTimeAtom,
  isPlayingAtom,
} from '../atoms';

const useAnimationController = () => {
  const [currentTime, setCurrentTime] = useAtom(currentTimeAtom);
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);
  const [arObjects, setArObjects] = useAtom(arObjectsAtom);

  // Refs to keep track of timing
  const startTimeRef = useRef(null);
  const accumulatedTimeRef = useRef(0);
  const animationFrameIdRef = useRef(null);

  const animate = useCallback((timestamp) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = (timestamp - startTimeRef.current) / 1000;
    const newCurrentTime = accumulatedTimeRef.current + elapsed;

    setCurrentTime(newCurrentTime);

    animationFrameIdRef.current = requestAnimationFrame(animate);
  }, [setCurrentTime]);

  useEffect(() => {
    if (isPlaying) {
      startTimeRef.current = performance.now() - accumulatedTimeRef.current * 1000;
      animationFrameIdRef.current = requestAnimationFrame(animate);
    } else if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;

      if (startTimeRef.current) {
        const now = performance.now();
        accumulatedTimeRef.current += (now - startTimeRef.current) / 1000;
        startTimeRef.current = null;
      }
    }

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isPlaying, animate]);

  const play = useCallback(() => {
    if (!isPlaying) {
      setIsPlaying(true);
    }
  }, [isPlaying, setIsPlaying]);

  const pause = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
    }
  }, [isPlaying, setIsPlaying]);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    accumulatedTimeRef.current = 0;
    startTimeRef.current = null;
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
  }, [setIsPlaying, setCurrentTime]);

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
      };
    } else {
      newKeyframe = {
        ...lastKeyframe,
        end: currentTime,
        position: {
          ...lastKeyframe.position,
          end: [...(targetObject.position || [0, 0, 0])],
        },
      };
    }

    setArObjects((prevArObjects) =>
      prevArObjects.map(obj => {
        if (obj.id !== objectId) return obj;
        return {
          ...obj,
          keyframes: [
            ...obj.keyframes.filter(k => k.id !== newKeyframe.id),
            newKeyframe,
          ],
        };
      })
    );
  }, [arObjects, currentTime, setArObjects]);

  const updateKeyframe = useCallback((objectId, keyframeId, updatedKeyframeData) => {
    setArObjects((prevArObjects) =>
      prevArObjects.map(obj => {
        if (obj.id !== objectId) return obj;

        const updatedKeyframes = obj.keyframes.map(kf => {
          if (kf.id !== keyframeId) return kf;
          return { ...kf, ...updatedKeyframeData };
        });

        return {
          ...obj,
          keyframes: updatedKeyframes,
        };
      })
    );
  }, [setArObjects]);

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

  const interpolateProperties = useCallback((objectId) => {
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
  }, [arObjects, currentTime]);

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

export default useAnimationController;
