import React, { useState } from "react";
import { Play, Square, DiamondPlus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { selectedObjectAtom, timelineDurationAtom, totalDurationAtom, TIMELINE_DURATION_PRESETS } from "../../atoms";
import AnimationController from "../../controllers/AnimationController";

const TimelineToolbar = () => {
  const { play, stop, addKeyframe } = AnimationController();
  const [selectedObject] = useAtom(selectedObjectAtom);
  const [visibleDuration, setVisibleDuration] = useAtom(timelineDurationAtom);
  const [totalDuration, setTotalDuration] = useAtom(totalDurationAtom);
  const [inputValue, setInputValue] = useState(totalDuration.toString());

  const handleAddKeyframe = () => {
    if (!selectedObject) return;
    addKeyframe(selectedObject.id);
  };

  const getCurrentPresetIndex = () => {
    return TIMELINE_DURATION_PRESETS.indexOf(visibleDuration);
  };

  const handleVisibleDurationChange = (e) => {
    const newIndex = parseInt(e.target.value);
    setVisibleDuration(newIndex);
  };

  const handleTotalDurationChange = (e) => {
    setInputValue(e.target.value);
    const newDuration = parseFloat(e.target.value);
    if (!isNaN(newDuration) && newDuration > 0) {
      setTotalDuration(Math.max(TIMELINE_DURATION_PRESETS[0], newDuration));
    }
  };

  const handleTotalDurationBlur = () => {
    const newDuration = parseFloat(inputValue);
    if (isNaN(newDuration) || newDuration <= 0) {
      setInputValue(totalDuration.toString());
    }
  };

  return (
    <div className="flex items-center h-10 min-h-[40px] px-2 bg-gray-800 border-b border-gray-700">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="navbar-button h-6 w-6"
          onClick={play}
        >
          <Play size={14} strokeWidth={1.5} />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="navbar-button h-6 w-6"
          onClick={stop}
        >
          <Square size={14} strokeWidth={1.5} />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="navbar-button h-6 w-6"
          onClick={handleAddKeyframe}
        >
          <DiamondPlus size={14} strokeWidth={1.5} />
        </Button>
      </div>

      <div className="border-l h-6 border-gray-400 mx-2"></div>

      {/* Duration Controls Container */}
      <div className="flex items-center space-x-4">
        {/* Visible Duration Control */}
        <div className="flex items-center space-x-2">
          <Clock size={14} strokeWidth={1.5} className="text-gray-400" />
          <div className="relative w-16 flex items-center">
            <input
              type="range"
              min="0"
              max="4"
              value={getCurrentPresetIndex()}
              onChange={handleVisibleDurationChange}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              style={{
                background: 'linear-gradient(to right, #4A5568 0%, #4A5568 100%)',
                WebkitAppearance: 'none',
              }}
            />
          </div>
          <span className="text-gray-400 text-xs w-8">{visibleDuration}s</span>
        </div>

        {/* Total Duration Input */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 text-xs whitespace-nowrap">Total:</span>
          <input
            type="number"
            min={TIMELINE_DURATION_PRESETS[0]}
            step="1"
            value={inputValue}
            onChange={handleTotalDurationChange}
            onBlur={handleTotalDurationBlur}
            className="w-16 h-6 text-xs px-2 bg-gray-700 text-gray-200 rounded border border-gray-600 focus:outline-none focus:border-gray-500"
          />
          <span className="text-gray-400 text-xs">s</span>
        </div>
      </div>
    </div>
  );
};

export default TimelineToolbar;