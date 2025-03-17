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
      {sortedKeyframes.map((keyframe, index) => {
        if (index === sortedKeyframes.length - 1) return null;

        const startX = timeToPixels(keyframe.time);
        const endX = timeToPixels(sortedKeyframes[index + 1].time);
        const barWidth = endX - startX;

        return (
          <div
            key={`bar-${keyframe.id}`}
            style={{
              position: "absolute",
              height: "4px",
              width: `${barWidth}px`,
              backgroundColor: "#4A5568",
              top: "50%",
              left: `${startX}px`,
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
            onClick={() => handleBarClick(keyframe.time, sortedKeyframes[index + 1].time)}
          />
        );
      })}

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
