import React, { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import Draggable from "react-draggable";
import { Diamond } from "lucide-react";
import {
  selectedKeyframeAtom,
  arObjectsAtom,
  currentTimeAtom,
  timelineWidthAtom,
  timelineScaleAtom,
} from "atoms";
import useKeyframe from "hooks/useKeyframe";

const KeyframePoint = ({ objectId, keyframe, timeToPixels, pixelsToTime }) => {
  const [selectedKeyframe, setSelectedKeyframe] = useAtom(selectedKeyframeAtom);
  const [arObjects] = useAtom(arObjectsAtom);
  const [, setCurrentTime] = useAtom(currentTimeAtom);
  const { updateKeyframe } = useKeyframe();
  const [timelineWidth] = useAtom(timelineWidthAtom);
  const [scale] = useAtom(timelineScaleAtom);

  // Store keyframe X position in a ref (avoids unnecessary re-renders)
  const tempXRef = useRef(timeToPixels(keyframe.time));

  // Force re-render when resizing happens
  const [resizeTrigger, setResizeTrigger] = useState(0);

  const [isDraggingAllowed, setIsDraggingAllowed] = useState(false);

  // Detect when Cmd (⌘) or Ctrl is held
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey) {
        setIsDraggingAllowed(true);
      }
    };

    const handleKeyUp = (e) => {
      if (!e.metaKey && !e.ctrlKey) {
        setIsDraggingAllowed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    tempXRef.current = timeToPixels(keyframe.time);
    setResizeTrigger((prev) => prev + 1); // Force re-render when resizing
  }, [timelineWidth, scale, keyframe.time, timeToPixels]);

  const handleLeftClick = () => {
    const isSelected =
      selectedKeyframe.keyframeId === keyframe.id &&
      selectedKeyframe.objectId === objectId;
    setSelectedKeyframe(
      isSelected
        ? { keyframeId: null, objectId: null }
        : { keyframeId: keyframe.id, objectId }
    );
    setCurrentTime(keyframe.time);
  };

  const handleDrag = (e, data) => {
    tempXRef.current = data.x;
  };

  const handleDragStop = (e, data) => {
    const newTime = pixelsToTime(data.x);
    updateKeyframe(objectId, keyframe.id, { time: newTime });
    setCurrentTime(newTime);
  };

  return (
    <Draggable
      key={resizeTrigger} // Forces re-render on resize
      axis="x"
      bounds={{ left: 0, right: timelineWidth - 10 }}
      defaultPosition={{ x: tempXRef.current - 4, y: 0 }}
      onDrag={handleDrag}
      onStop={handleDragStop}
      disabled={!isDraggingAllowed}
    >
      <div
        style={{
          position: "absolute",
          height: "20px",
          width: "10px",
          cursor: isDraggingAllowed ? "grabbing" : "pointer",
        }}
        onClick={handleLeftClick}
      >
        <Diamond
          size={14}
          fill={
            selectedKeyframe.keyframeId === keyframe.id &&
            selectedKeyframe.objectId === objectId
              ? "#2D3748"
              : "#ffa500"
          }
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
    </Draggable>
  );
};

export default KeyframePoint;
