import React, { useState } from "react";
import { useAtom } from "jotai";
import Draggable from "react-draggable";
import { Diamond } from "lucide-react";
import { selectedKeyframeAtom, arObjectsAtom, currentTimeAtom } from "atoms";
import useKeyframe from "hooks/useKeyframe";

const KeyframePoint = ({ objectId, keyframe, timeToPixels, pixelsToTime, timelineWidth }) => {
  const [selectedKeyframe, setSelectedKeyframe] = useAtom(selectedKeyframeAtom);
  const [arObjects] = useAtom(arObjectsAtom);
  const [, setCurrentTime] = useAtom(currentTimeAtom);
  const { updateKeyframe } = useKeyframe();

  const [tempX, setTempX] = useState(timeToPixels(keyframe.time));

  const handleRightClick = (event) => {
    event.preventDefault();

    const isSelected =
      selectedKeyframe.keyframeId === keyframe.id &&
      selectedKeyframe.objectId === objectId;

    if (isSelected) {
      console.log(`Deselected keyframe: ${keyframe.id}`);
      setSelectedKeyframe({ keyframeId: null, objectId: null });
      return;
    }

    console.log(
      `Right-clicked keyframe at: ${keyframe.time.toFixed(2)}s (ID: ${keyframe.id}, Object ID: ${objectId})`
    );

    setSelectedKeyframe({ keyframeId: keyframe.id, objectId });
    setCurrentTime(keyframe.time);
  };

  const handleDrag = (e, data) => {
    setTempX(data.x);
  };

  const handleDragStop = (e, data) => {
    const newTime = pixelsToTime(data.x);
    console.log(`Moved keyframe ${keyframe.id} to ${newTime.toFixed(2)}s`);
    updateKeyframe(objectId, keyframe.id, { time: newTime });
    setCurrentTime(newTime);
  };

  return (
    <Draggable
      axis="x"
      bounds={{ left: 0, right: timelineWidth - 10 }}
      defaultPosition={{ x: tempX-5, y: 0 }}
      onDrag={handleDrag}
      onStop={handleDragStop}
    >
      <div
        style={{
          position: "absolute",
          height: "20px",
          width: "10px",
          cursor: "grab",
        }}
        onContextMenu={handleRightClick} // Right-click event
      >
        <Diamond
          size={14}
          fill={
            selectedKeyframe.keyframeId === keyframe.id &&
            selectedKeyframe.objectId === objectId
              ? "#2D3748" // Selected color
              : "#4A5568" // Default color
          }
          style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        />
      </div>
    </Draggable>
  );
};

export default KeyframePoint;
