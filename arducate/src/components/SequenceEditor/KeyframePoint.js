import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import Draggable from "react-draggable";
import { Diamond } from "lucide-react";
import {
  selectedKeyframeAtom,
  arObjectsAtom,
  currentTimeAtom,
  timelineWidthAtom,
  timelineScaleAtom,
  selectedObjectAtom
} from "atoms";
import useKeyframe from "hooks/useKeyframe";

const KeyframePoint = ({ objectId, keyframe, timeToPixels, pixelsToTime }) => {
  const [selectedKeyframe, setSelectedKeyframe] = useAtom(selectedKeyframeAtom);
  const [, setCurrentTime] = useAtom(currentTimeAtom);
  const { updateKeyframe } = useKeyframe();
  const [timelineWidth] = useAtom(timelineWidthAtom);
  const [scale] = useAtom(timelineScaleAtom);
  const [selectedObject, setSelectedObject] = useAtom(selectedObjectAtom);

  // Use state to store the keyframe's X position (for re-rendering)
  const [keyframeX, setKeyframeX] = useState(timeToPixels(keyframe.time));

  // Update keyframeX when timeline dimensions or the keyframe's time change
  useEffect(() => {
    setKeyframeX(timeToPixels(keyframe.time));
  }, [timelineWidth, scale, keyframe.time, timeToPixels]);

  const [isDraggingAllowed, setIsDraggingAllowed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Detect Cmd (⌘) or Ctrl key press to allow dragging
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey) setIsDraggingAllowed(true);
    };

    const handleKeyUp = (e) => {
      if (!e.metaKey && !e.ctrlKey) setIsDraggingAllowed(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Only select if not dragging
  const handleLeftClick = (e) => {
    if (isDragging || isDraggingAllowed) return;

    const isSelected =
      selectedKeyframe.keyframeId === keyframe.id &&
      selectedKeyframe.objectId === objectId;

    const newSelection = isSelected
      ? { keyframeId: null, objectId: null }
      : { keyframeId: keyframe.id, objectId };

    setSelectedKeyframe(newSelection);
    setSelectedObject(isSelected ? null : objectId);
    setCurrentTime(keyframe.time);
  };

  const handleDragStart = () => {
    if (!isDraggingAllowed) return;
    setIsDragging(true);
  };

  const handleDrag = (e, data) => {
    // Update state so that Draggable re-renders immediately
    setKeyframeX(data.x);
  };

  const handleDragStop = (e, data) => {
    if (!isDraggingAllowed) return;

    const newTime = pixelsToTime(data.x);
    updateKeyframe(objectId, keyframe.id, { time: newTime });
    setCurrentTime(newTime);
    setIsDragging(false);
  };

  return (
    <Draggable
      axis="x"
      bounds={{ left: 0, right: timelineWidth - 10 }}
      // Use the state variable for controlled position
      position={{ x: keyframeX - 4, y: 0 }}
      onStart={handleDragStart}
      onDrag={handleDrag}
      onStop={handleDragStop}
      disabled={!isDraggingAllowed}
    >
      <div
        style={{
          position: "absolute",
          height: "20px",
          width: "10px",
          cursor: isDraggingAllowed ? "grabbing" : "pointer"
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
            transform: "translate(-50%, -50%)"
          }}
        />
      </div>
    </Draggable>
  );
};

export default KeyframePoint;
