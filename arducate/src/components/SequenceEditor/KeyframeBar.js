// src/components/SequenceEditor/KeyframeBar.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Draggable from 'react-draggable';
import useAnimation from '../../hooks/useAnimation';

const KeyframeBar = ({ objectId, keyframes, scale, timeRulerStart, timeRulerEnd, timelineWidth }) => {
  const { updateKeyframe } = useAnimation();
  const [isResizing, setIsResizing] = useState(null);
  const [activeKeyframe, setActiveKeyframe] = useState(null);
  const barRef = useRef(null);

  const timeToPixels = useCallback((time) => (time - timeRulerStart) * scale, [timeRulerStart, scale]);
  const pixelsToTime = useCallback((pixels) => (pixels / scale) + timeRulerStart, [timeRulerStart, scale]);

  const handleResize = useCallback(
    (e) => {
      if (!isResizing || !activeKeyframe || !barRef.current) return;

      const parentRect = barRef.current.parentNode.getBoundingClientRect();
      const mouseX = e.clientX - parentRect.left;

      const newTime = pixelsToTime(mouseX);
      let updatedKeyframeData = {};

      if (isResizing === 'left') {
        const newStart = Math.max(timeRulerStart, Math.min(activeKeyframe.end - 0.1, newTime));
        updatedKeyframeData = { start: newStart };
      } else if (isResizing === 'right') {
        const newEnd = Math.max(activeKeyframe.start + 0.1, Math.min(timeRulerEnd, newTime));
        updatedKeyframeData = { end: newEnd };
      }

      updateKeyframe(objectId, activeKeyframe.id, updatedKeyframeData);
    },
    [isResizing, activeKeyframe, pixelsToTime, updateKeyframe, objectId, timeRulerStart, timeRulerEnd]
  );

  const handleMouseDown = useCallback((e, keyframe, side) => {
    e.stopPropagation();
    setIsResizing(side);
    setActiveKeyframe(keyframe);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsResizing(null);
    setActiveKeyframe(null);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleResize, handleMouseUp]);

  const handleDragStop = useCallback(
    (keyframe, data) => {
      if (!isResizing) {
        const newStartTime = pixelsToTime(data.x);
        const duration = keyframe.end ? keyframe.end - keyframe.start : 0;
        const newEndTime = keyframe.end ? newStartTime + duration : null;

        const updatedKeyframeData = { start: newStartTime };
        if (newEndTime !== null) {
          updatedKeyframeData.end = newEndTime;
        }

        updateKeyframe(objectId, keyframe.id, updatedKeyframeData);
      }
    },
    [isResizing, pixelsToTime, updateKeyframe, objectId]
  );

  return (
    <div
      ref={barRef}
      style={{
        position: 'relative',
        height: '20px',
        width: '100%',
      }}
    >
      {keyframes.map((keyframe) => {
        const startX = timeToPixels(keyframe.start);
        const endX = keyframe.end ? timeToPixels(keyframe.end) : startX;
        const width = Math.max(endX - startX, 10);

        return (
          <Draggable
            key={keyframe.id}
            axis="x"
            bounds={{ left: 0, right: timelineWidth - width }}
            position={{ x: startX, y: 0 }}
            onStop={(e, data) => handleDragStop(keyframe, data)}
            disabled={isResizing !== null}
          >
            <div
              style={{
                position: 'absolute',
                height: '20px',
                backgroundColor: keyframe.end ? '#4A5568' : 'transparent',
                width: `${width}px`,
                borderRadius: '4px',
                cursor: isResizing ? 'ew-resize' : 'move',
              }}
            >
              <div
                style={{
                  width: '10px',
                  height: '20px',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  cursor: 'ew-resize',
                }}
                onMouseDown={(e) => handleMouseDown(e, keyframe, 'left')}
              >
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    backgroundColor: '#A0AEC0',
                    transform: 'rotate(45deg)',
                    position: 'absolute',
                    top: '50%',
                    left: '2px',
                    marginTop: '-3px',
                  }}
                />
              </div>

              {keyframe.end && (
                <div
                  style={{
                    width: '10px',
                    height: '20px',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    cursor: 'ew-resize',
                  }}
                  onMouseDown={(e) => handleMouseDown(e, keyframe, 'right')}
                >
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      backgroundColor: '#A0AEC0',
                      transform: 'rotate(45deg)',
                      position: 'absolute',
                      top: '50%',
                      right: '2px',
                      marginTop: '-3px',
                    }}
                  />
                </div>
              )}
            </div>
          </Draggable>
        );
      })}
    </div>
  );
};

export default KeyframeBar;
