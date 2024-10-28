import React from 'react';
import Draggable from "react-draggable";
import { Tally3 } from "lucide-react";
import { useAtom } from 'jotai';
import { currentTimeAtom, timelineScaleAtom } from '../../atoms';

const Playhead = ({ containerWidth }) => {
  const [currentTime, setCurrentTime] = useAtom(currentTimeAtom);
  const [scale] = useAtom(timelineScaleAtom);

  // Calculate the current x position based on currentTime and scale
  const positionX = currentTime * scale;

  const handlePlayheadDrag = (e, data) => {
    const newTime = data.x / scale;
    setCurrentTime(newTime);
  };

  return (
    <Draggable
      axis="x"
      bounds={{ left: 0, right: containerWidth }}
      position={{ x: positionX, y: 0 }}
      onDrag={handlePlayheadDrag}
    >
      <div
        className="playhead-container"
        style={{
          position: "absolute",
          top: 0,
          height: "100%",
          cursor: "ew-resize",
          zIndex: 1000,
          pointerEvents: "none",
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
          }}
        />
      </div>
    </Draggable>
  );
};

export default Playhead;
