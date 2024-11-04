import React, { useCallback, useRef, useEffect } from 'react';
import Draggable from "react-draggable";
import { Tally3 } from "lucide-react";
import { useAtom } from 'jotai';
import { timelineScaleAtom } from '../../atoms';
import useAnimation from '../../hooks/useAnimation';

const Playhead = ({ containerWidth }) => {
  const { currentTime, setCurrentTime, isPlaying, pause } = useAnimation();
  const [scale] = useAtom(timelineScaleAtom);
  const dragRef = useRef(false);

  // Memoize the position calculation
  const positionX = Math.min(currentTime * scale, containerWidth);

  // Handle drag start
  const handleStart = useCallback(() => {
    dragRef.current = true;
    if (isPlaying) {
      pause(); // Pause animation while dragging
    }
  }, [isPlaying, pause]);

  // Handle drag
  const handleDrag = useCallback((e, data) => {
    const newTime = Math.max(0, data.x / scale);
    setCurrentTime(newTime);
  }, [scale, setCurrentTime]);

  // Handle drag end
  const handleStop = useCallback(() => {
    dragRef.current = false;
  }, []);

  // Clean up drag state on unmount
  useEffect(() => {
    return () => {
      dragRef.current = false;
    };
  }, []);

  return (
    <Draggable
      axis="x"
      bounds={{ left: 0, right: containerWidth }}
      position={{ x: positionX, y: 0 }}
      onStart={handleStart}
      onDrag={handleDrag}
      onStop={handleStop}
    >
      <div
        className="playhead-container group"
        style={{
          position: "absolute",
          top: 0,
          height: "100%",
          cursor: "ew-resize",
          zIndex: 1000,
          pointerEvents: "none",
          transform: `translateZ(0)` // Force GPU acceleration
        }}
      >
        <div
          className="playhead-tab"
          style={{
            width: "12px",
            height: "16px",
            backgroundColor: "#FFA500",
            borderRadius: "0 0 8px 8px",
            position: "absolute",
            left: "-5.25px",
            top: "0",
            zIndex: 1001,
            pointerEvents: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "10px",
            color: "#FFFFFF",
            willChange: "transform" // Optimize for animations
          }}
        >
          <Tally3
            size={12}
            strokeWidth={1.5}
            style={{ transform: "rotate(90deg) translateX(1px)" }}
          />
        </div>
        <div
          className="playhead-line"
          style={{
            width: "2px",
            height: "100%",
            backgroundColor: "#FF4500",
            position: "absolute",
            left: 0,
            zIndex: 1000,
            pointerEvents: "none",
            willChange: "transform" // Optimize for animations
          }}
        />
      </div>
    </Draggable>
  );
};

export default React.memo(Playhead);
