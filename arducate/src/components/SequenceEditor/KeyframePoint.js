import React from "react";
import { useAtom } from "jotai";
import Draggable from "react-draggable";
import { selectedKeyframeAtom, arObjectsAtom, currentTimeAtom } from "atoms";
import useKeyframe from "hooks/useKeyframe";

const KeyframePoint = ({ keyframe, timeToPixels, pixelsToTime, timelineWidth }) => {
  const [selectedKeyframe, setSelectedKeyframe] = useAtom(selectedKeyframeAtom);
  const [arObjects] = useAtom(arObjectsAtom); // Get all objects
  const [, setCurrentTime] = useAtom(currentTimeAtom); // Update playhead position
  const { updateKeyframe } = useKeyframe(); // Hook to update keyframe time

  const keyframeX = timeToPixels(keyframe.time);

  const handleClick = () => {
    if (selectedKeyframe.keyframeId === keyframe.id) {
      console.log(`Deselected keyframe: ${keyframe.id}`);
      setSelectedKeyframe({ keyframeId: null, objectId: null });
      return;
    }

    const parentObject = arObjects.find(obj => obj.keyframes?.some(kf => kf.id === keyframe.id));
    if (!parentObject) {
      console.warn("No associated object found for keyframe:", keyframe.id);
      return;
    }

    console.log(`Selected keyframe at: ${keyframe.time.toFixed(2)}s (ID: ${keyframe.id}, Object ID: ${parentObject.id})`);

    // Store keyframe selection
    setSelectedKeyframe({ keyframeId: keyframe.id, objectId: parentObject.id });

    // Move the playhead
    setCurrentTime(keyframe.time);
  };

  const handleDragStop = (e, data) => {
    const newTime = pixelsToTime(data.x);
    const parentObject = arObjects.find(obj => obj.keyframes?.some(kf => kf.id === keyframe.id));

    if (!parentObject) return;

    console.log(`Moved keyframe ${keyframe.id} to ${newTime.toFixed(2)}s`);

    // Update keyframe time
    updateKeyframe(parentObject.id, keyframe.id, { time: newTime });

    // Update playhead position
    setCurrentTime(newTime);
  };

  return (
    <Draggable
      axis="x"
      bounds={{ left: 0, right: timelineWidth - 10 }}
      position={{ x: keyframeX, y: 0 }}
      onStop={handleDragStop}
    >
      <div
        style={{
          position: "absolute",
          height: "20px",
          width: "10px",
          backgroundColor: selectedKeyframe.keyframeId === keyframe.id ? "#2D3748" : "#4A5568",
          borderRadius: "4px",
          cursor: "grab",
        }}
        onClick={handleClick}
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
