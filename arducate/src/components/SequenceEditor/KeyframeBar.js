import React, { useRef, useCallback } from "react";
import KeyframePoint from "./KeyframePoint";

const KeyframeBar = ({ objectId, keyframes, scale, timeRulerStart, timelineWidth }) => {
  const barRef = useRef(null);

  const timeToPixels = useCallback((time) => (time - timeRulerStart) * scale, [timeRulerStart, scale]);
  const pixelsToTime = useCallback((pixels) => pixels / scale + timeRulerStart, [timeRulerStart, scale]);

  const sortedKeyframes = [...keyframes].sort((a, b) => a.time - b.time);

  return (
    <div ref={barRef} style={{ position: "relative", height: "20px", width: "100%" }}>
      {/* Bars connecting keyframes */}
      {sortedKeyframes.map((keyframe, index) => {
        if (index === sortedKeyframes.length - 1) return null; // Skip last keyframe

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
              backgroundColor: "#718096", // Grayish color for visibility
              top: "50%",
              left: `${startX}px`,
              transform: "translateY(-50%)",
              transition: "left 0.1s linear, width 0.1s linear", // Smooth movement
            }}
          />
        );
      })}

      {/* Keyframe points */}
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
