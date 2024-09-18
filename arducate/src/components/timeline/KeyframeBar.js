import React, { useState, useRef, useEffect, useCallback } from 'react';
import Draggable from 'react-draggable';

const KeyframeBar = ({ start, end, onUpdate, scale, timeRulerStart, timeRulerEnd, timelineWidth }) => {
  const [isResizing, setIsResizing] = useState(null);
  const [barWidth, setBarWidth] = useState((end - start) * scale);
  const [dragX, setDragX] = useState((start - timeRulerStart) * scale);
  const barRef = useRef(null);

  const timeToPixels = useCallback((time) => (time - timeRulerStart) * scale, [timeRulerStart, scale]);
  const pixelsToTime = useCallback((pixels) => (pixels / scale) + timeRulerStart, [timeRulerStart, scale]);

  const handleResize = useCallback((e) => {
    if (!isResizing || !barRef.current) return;

    const parentRect = barRef.current.parentNode.getBoundingClientRect();
    const mouseX = e.clientX - parentRect.left;

    if (isResizing === 'left') {
      const newStartPixels = Math.max(0, Math.min(dragX + barWidth - 10, mouseX));
      const newWidth = dragX + barWidth - newStartPixels;
      setBarWidth(newWidth);
      setDragX(newStartPixels);
      onUpdate({ start: pixelsToTime(newStartPixels), end: pixelsToTime(newStartPixels + newWidth) });
    } else if (isResizing === 'right') {
      const newEndPixels = Math.max(dragX + 10, Math.min(timelineWidth, mouseX));
      const newWidth = newEndPixels - dragX;
      setBarWidth(newWidth);
      onUpdate({ start: pixelsToTime(dragX), end: pixelsToTime(newEndPixels) });
    }
  }, [isResizing, dragX, barWidth, timelineWidth, onUpdate, pixelsToTime]);

  const handleMouseDown = useCallback((e, side) => {
    e.stopPropagation();
    setIsResizing(side);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsResizing(null);
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

  useEffect(() => {
    const newWidth = (end - start) * scale;
    setBarWidth(newWidth);
    setDragX(timeToPixels(start));
  }, [start, end, scale, timeToPixels]);

  const handleDragStop = useCallback((e, data) => {
    if (!isResizing) {
      const newStartTime = pixelsToTime(data.x);
      const newEndTime = newStartTime + (barWidth / scale);
      setDragX(data.x);
      onUpdate({ start: newStartTime, end: newEndTime });
    }
  }, [isResizing, barWidth, scale, pixelsToTime, onUpdate]);

  return (
    <Draggable
      axis="x"
      bounds={{left: 0, right: timelineWidth - barWidth}}
      position={{ x: dragX, y: 0 }}
      onStop={handleDragStop}
      disabled={isResizing !== null}
    >
      <div
        ref={barRef}
        style={{
          position: 'absolute',
          height: '20px',
          backgroundColor: '#4A5568',
          width: `${barWidth}px`,
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
          onMouseDown={(e) => handleMouseDown(e, 'left')}
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

        <div
          style={{
            width: '10px',
            height: '20px',
            position: 'absolute',
            top: 0,
            right: 0,
            cursor: 'ew-resize',
          }}
          onMouseDown={(e) => handleMouseDown(e, 'right')}
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
      </div>
    </Draggable>
  );
};

export default KeyframeBar;
