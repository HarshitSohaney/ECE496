// src/components/SequenceEditor/TimelineToolbar.js
import React from "react";
import { Play, Square, DiamondPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { selectedObjectAtom } from "../../atoms";
import AnimationController from "../../controllers/AnimationController";

const TimelineToolbar = ({ totalTime }) => {
  const { play, stop, addKeyframe, currentTime } = AnimationController();
  const [selectedObject] = useAtom(selectedObjectAtom);

  const handleAddKeyframe = () => {
    if (!selectedObject) {
      console.log("No object selected");
      return;
    }

    addKeyframe(selectedObject.id);
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

      <span
        className="text-white font-mono whitespace-nowrap"
        style={{ fontSize: "10px" }}
      >
        {currentTime.toFixed(2)} / {totalTime.toFixed(2)}
      </span>
    </div>
  );
};

export default TimelineToolbar;
