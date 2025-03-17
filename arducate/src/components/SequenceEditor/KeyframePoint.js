import React, { useState } from "react";
import { useAtom } from "jotai";
import Draggable from "react-draggable";
import { selectedKeyframeAtom, arObjectsAtom, currentTimeAtom } from "atoms";
import useKeyframe from "hooks/useKeyframe";

const KeyframePoint = ({ objectId, keyframe, timeToPixels, pixelsToTime, timelineWidth }) => {
  const [selectedKeyframe, setSelectedKeyframe] = useAtom(selectedKeyframeAtom);
  const [arObjects] = useAtom(arObjectsAtom); // Get all objects
  const [, setCurrentTime] = useAtom(currentTimeAtom); // Update playhead position
  const { updateKeyframe } = useKeyframe(); // Hook to update keyframe time

  // Store temporary position to prevent jittery behavior
  const [tempX, setTempX] = useState(timeToPixels(keyframe.time));

  const handleRightClick = (event) => {
    event.preventDefault(); // Prevents the default browser context menu

    const isSelected =
      selectedKeyframe.keyframeId === keyframe.id &&
      selectedKeyframe.objectId === objectId;

    if (isSelected) {
      console.log(`Deselected keyframe: ${keyframe.id}`);
      setSelectedKeyframe({ keyframeId: null, objectId: null });
      return;
    }

    console.log(`Right-clicked keyframe at: ${keyframe.time.toFixed(2)}s (ID: ${keyframe.id}, Object ID: ${objectId})`);

    // Select only the keyframe belonging to this object
    setSelectedKeyframe({ keyframeId: keyframe.id, objectId });

    // Move the playhead
    setCurrentTime(keyframe.time);
  };

  const handleDrag = (e, data) => {
    setTempX(data.x); // Temporarily update position while dragging
  };

  const handleDragStop = (e, data) => {
    const newTime = pixelsToTime(data.x);

    console.log(`Moved keyframe ${keyframe.id} to ${newTime.toFixed(2)}s`);

    // Update keyframe time
    updateKeyframe(objectId, keyframe.id, { time: newTime });

    // Update playhead position
    setCurrentTime(newTime);
  };

  return (
    <Draggable
      axis="x"
      bounds={{ left: 0, right: timelineWidth - 10 }}
      defaultPosition={{ x: tempX, y: 0 }} // Let Draggable handle updates
      onDrag={handleDrag} // Update temporary position during drag
      onStop={handleDragStop} // Save position on stop
    >
      <div
        style={{
          position: "absolute",
          height: "20px",
          width: "10px",
          backgroundColor:
            selectedKeyframe.keyframeId === keyframe.id &&
            selectedKeyframe.objectId === objectId
              ? "#2D3748"  // Selected color
              : "#4A5568", // Default color
          borderRadius: "4px",
          cursor: "grab",
        }}
        onContextMenu={handleRightClick} // Right-click event
      >
        <div
          style={{
            width: "6px",
            height: "6px",
            backgroundColor: "#A0AEC0",
            borderRadius: "50%",
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
