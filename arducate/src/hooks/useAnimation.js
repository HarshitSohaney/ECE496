import { useAtom } from 'jotai';
import { useEffect, useCallback, useRef } from 'react';
import {
  arObjectsAtom,
  currentTimeAtom,
  isPlayingAtom,
} from '../atoms';

const useAnimation = () => {
  const [currentTime, setCurrentTime] = useAtom(currentTimeAtom);
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);
  const [arObjects, setArObjects] = useAtom(arObjectsAtom);

  const animationRef = useRef({
    startTime: null,
    lastFrameTime: null,
    initialPlayTime: 0,
    frameId: null
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
        frameId: null
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
    pause,
    stop,
    addKeyframe,
    updateKeyframe,
    interpolateProperties,
    currentTime,
    setCurrentTime,
    isPlaying,
  };
};

export default useAnimation;
