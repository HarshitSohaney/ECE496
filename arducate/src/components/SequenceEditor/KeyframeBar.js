import React, { useState, useRef, useEffect, useCallback } from 'react';
import Draggable from 'react-draggable';
import useAnimation from '../../hooks/useAnimation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Trash2, Clock } from "lucide-react";

const KeyframeBar = ({ objectId, keyframes, scale, timeRulerStart, timeRulerEnd, timelineWidth }) => {
  const { updateKeyframe, deleteKeyframe } = useAnimation();
  const [isResizing, setIsResizing] = useState(null);
  const [activeKeyframe, setActiveKeyframe] = useState(null);
  const [openPopoverId, setOpenPopoverId] = useState(null);
  const [localInputs, setLocalInputs] = useState({});
  const barRef = useRef(null);

  const timeToPixels = useCallback((time) => (time - timeRulerStart) * scale, [timeRulerStart, scale]);
  const pixelsToTime = useCallback((pixels) => (pixels / scale) + timeRulerStart, [timeRulerStart, scale]);

  const handleTimeInputChange = (field, value, keyframe) => {
    setLocalInputs(prev => ({
      ...prev,
      [keyframe.id]: { ...prev[keyframe.id], [field]: value }
    }));
  };

  const handleTimeInputBlur = (field, value, keyframe) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      if (field === 'start') {
        const newStart = Math.max(timeRulerStart, Math.min(keyframe.end ? keyframe.end - 0.1 : timeRulerEnd, numValue));
        updateKeyframe(objectId, keyframe.id, { start: newStart });
      } else if (field === 'end' && keyframe.end !== null) {
        const newEnd = Math.max(keyframe.start + 0.1, Math.min(timeRulerEnd, numValue));
        updateKeyframe(objectId, keyframe.id, { end: newEnd });
      }
    }
    setLocalInputs(prev => ({
      ...prev,
      [keyframe.id]: { ...prev[keyframe.id], [field]: undefined }
    }));
  };

  const handleKeyDown = (e, field, keyframe) => {
    if (e.key === 'Enter') {
      handleTimeInputBlur(field, e.target.value, keyframe);
      e.target.blur();
    } else if (e.key === 'Escape') {
      setLocalInputs(prev => ({
        ...prev,
        [keyframe.id]: { ...prev[keyframe.id], [field]: undefined }
      }));
      e.target.blur();
    }
  };

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

        if (newStartTime >= timeRulerStart && (!newEndTime || newEndTime <= timeRulerEnd)) {
          const updatedKeyframeData = { start: newStartTime };
          if (newEndTime !== null) {
            updatedKeyframeData.end = newEndTime;
          }
          updateKeyframe(objectId, keyframe.id, updatedKeyframeData);
        }
      }
    },
    [isResizing, pixelsToTime, updateKeyframe, objectId, timeRulerStart, timeRulerEnd]
  );

  const handleDeleteKeyframe = useCallback((keyframeId) => {
    deleteKeyframe(objectId, keyframeId);
    setOpenPopoverId(null);
  }, [deleteKeyframe, objectId]);

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
            <div>
              <Popover open={openPopoverId === keyframe.id} onOpenChange={(open) => setOpenPopoverId(open ? keyframe.id : null)}>
                <PopoverTrigger asChild>
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
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">Keyframe Times</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="text-sm w-14">Start:</label>
                        <Input
                          type="number"
                          value={localInputs[keyframe.id]?.start ?? keyframe.start.toFixed(2)}
                          onChange={(e) => handleTimeInputChange('start', e.target.value, keyframe)}
                          onBlur={(e) => handleTimeInputBlur('start', e.target.value, keyframe)}
                          onKeyDown={(e) => handleKeyDown(e, 'start', keyframe)}
                          step="0.1"
                          className="h-8"
                        />
                      </div>
                      {keyframe.end !== null && (
                        <div className="flex items-center gap-2">
                          <label className="text-sm w-14">End:</label>
                          <Input
                            type="number"
                            value={localInputs[keyframe.id]?.end ?? keyframe.end.toFixed(2)}
                            onChange={(e) => handleTimeInputChange('end', e.target.value, keyframe)}
                            onBlur={(e) => handleTimeInputBlur('end', e.target.value, keyframe)}
                            onKeyDown={(e) => handleKeyDown(e, 'end', keyframe)}
                            step="0.1"
                            className="h-8"
                          />
                        </div>
                      )}
                    </div>
                    <div className="pt-2 border-t">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        onClick={() => handleDeleteKeyframe(keyframe.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Keyframe
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </Draggable>
        );
      })}
    </div>
  );
};

export default KeyframeBar;
