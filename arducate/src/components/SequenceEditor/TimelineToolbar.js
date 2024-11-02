import React from "react";
import { Play, Square, DiamondPlus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAtom } from "jotai";
import { selectedObjectAtom, timelineDurationAtom } from "../../atoms";
import AnimationController from "../../controllers/AnimationController";

const TimelineToolbar = () => {
  const { play, stop, addKeyframe, currentTime } = AnimationController();
  const [selectedObject] = useAtom(selectedObjectAtom);
  const [duration, setDuration] = useAtom(timelineDurationAtom);

  const handleAddKeyframe = () => {
    if (!selectedObject) return;
    addKeyframe(selectedObject.id);
  };

  const handleDurationChange = (e) => {
    const newDuration = Math.max(1, parseInt(e.target.value) || 20);
    setDuration(newDuration);
  };

  return (
    <div className="flex items-center justify-center space-x-2 h-10 min-h-[40px] px-2 bg-gray-800 border-b border-gray-700">
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
        <Input
          type="number"
          min="1"
          value={duration}
          onChange={handleDurationChange}
          className="w-16 h-6 text-xs bg-gray-700 border-gray-600 text-white"
        />
        <span className="text-gray-400 text-xs">sec</span>
      </div>

      <div className="border-l h-6 border-gray-400 mx-2"></div>

      <span className="text-white font-mono whitespace-nowrap" style={{ fontSize: "10px" }}>
        {currentTime.toFixed(2)} / {duration.toFixed(2)}
      </span>
    </div>
  );
};

export default TimelineToolbar;