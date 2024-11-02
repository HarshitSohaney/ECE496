// src/components/SequenceEditor/TimelineToolbar.js
import React from "react";
import { Play, Square, DiamondPlus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { selectedObjectAtom, timelineDurationAtom, TIMELINE_DURATION_PRESETS } from "../../atoms";
import AnimationController from "../../controllers/AnimationController";

const TimelineToolbar = () => {
  const { play, stop, addKeyframe } = AnimationController();
  const [selectedObject] = useAtom(selectedObjectAtom);
  const [duration, setDuration] = useAtom(timelineDurationAtom);

  const handleAddKeyframe = () => {
    if (!selectedObject) return;
    addKeyframe(selectedObject.id);
  };

  const getCurrentPresetIndex = () => {
    return TIMELINE_DURATION_PRESETS.indexOf(duration);
  };

  const handleDurationChange = (e) => {
    const newIndex = parseInt(e.target.value);
    setDuration(newIndex);
  };

  return (
    <div className="flex items-center space-x-2 h-10 min-h-[40px] px-2 bg-gray-800 border-b border-gray-700">
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

      <div className="border-l h-6 border-gray-400 mx-2"></div>

      <div className="flex items-center space-x-2">
        <Clock size={14} strokeWidth={1.5} className="text-gray-400" />
        <div className="relative w-20 flex items-center">
          <input
            type="range"
            min="0"
            max="4"
            value={getCurrentPresetIndex()}
            onChange={handleDurationChange}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            style={{
              background: 'linear-gradient(to right, #4A5568 0%, #4A5568 100%)',
              WebkitAppearance: 'none',
            }}
          />
          <style jsx>{`
            input[type='range']::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 12px;
              height: 12px;
              background: #A0AEC0;
              border-radius: 50%;
              cursor: pointer;
              transition: background .3s ease-in-out;
            }
            input[type='range']::-webkit-slider-thumb:hover {
              background: #CBD5E0;
            }
            input[type='range']::-moz-range-thumb {
              width: 12px;
              height: 12px;
              background: #A0AEC0;
              border: none;
              border-radius: 50%;
              cursor: pointer;
              transition: background .3s ease-in-out;
            }
            input[type='range']::-moz-range-thumb:hover {
              background: #CBD5E0;
            }
          `}</style>
        </div>
        <span className="text-gray-400 text-xs">{duration}s</span>
      </div>
    </div>
  );
};

export default TimelineToolbar;