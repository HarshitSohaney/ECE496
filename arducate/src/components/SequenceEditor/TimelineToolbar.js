// src/components/SequenceEditor/TimelineToolbar.js
import React from "react";
import { Play, Pause, Square, DiamondPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { selectedObjectAtom } from "../../atoms";
import useAnimation from '../../hooks/useAnimation';

const TimelineToolbar = ({ totalTime }) => {
  const { play, pause, stop, addKeyframe, currentTime, isPlaying } = useAnimation();
  const [selectedObject] = useAtom(selectedObjectAtom);

  const handleAddKeyframe = () => {
    if (!selectedObject) {
      console.log("No object selected");
      return;
    }

    addKeyframe(selectedObject.id);
  };

  const handlePlayPauseClick = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  return (
    <div className="h-10 min-h-[40px] bg-gray-800 border-b border-gray-700 w-full flex items-center justify-center">
      <div className="flex items-center gap-1 px-1 overflow-x-auto max-w-full">
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="outline"
            size="icon"
            className="navbar-button h-6 w-6 min-w-6"
            onClick={handlePlayPauseClick}
          >
            {isPlaying ? (
              <Pause size={14} strokeWidth={1.5} />
            ) : (
              <Play size={14} strokeWidth={1.5} />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="navbar-button h-6 w-6 min-w-6"
            onClick={stop}
          >
            <Square size={14} strokeWidth={1.5} />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="navbar-button h-6 w-6 min-w-6"
            onClick={handleAddKeyframe}
          >
            <DiamondPlus size={14} strokeWidth={1.5} />
          </Button>
        </div>

        <div className="border-l h-6 border-gray-400 mx-1 flex-shrink-0"></div>

        <div className="flex items-center min-w-0 flex-shrink">
          <span className="text-white font-mono text-xs truncate">
            {currentTime.toFixed(2)} / {totalTime.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TimelineToolbar;
