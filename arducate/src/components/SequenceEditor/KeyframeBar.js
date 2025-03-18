import React, { useRef, useCallback } from "react";
import KeyframePoint from "./KeyframePoint";

const KeyframeBar = ({ objectId, keyframes, scale, timeRulerStart, timelineWidth }) => {
  const barRef = useRef(null);

  const timeToPixels = useCallback((time) => (time - timeRulerStart) * scale, [timeRulerStart, scale]);
  const pixelsToTime = useCallback((pixels) => pixels / scale + timeRulerStart, [timeRulerStart, scale]);

  const sortedKeyframes = [...keyframes].sort((a, b) => a.time - b.time);

  const handleBarClick = (startTime, endTime) => {
    console.log(`Clicked between keyframes: ${startTime.toFixed(2)}s - ${endTime.toFixed(2)}s`);
  };

  return (
    <div ref={barRef} style={{ position: "relative", height: "20px", width: "100%" }}>
      {sortedKeyframes.map((keyframe) => (
        <KeyframePoint
          key={keyframe.id}
          keyframe={keyframe}
          objectId={objectId}
          timeToPixels={timeToPixels}
          pixelsToTime={pixelsToTime}
          timelineWidth={timelineWidth}
        />
      ))}
    </div>
  );
};

export default KeyframeBar;
