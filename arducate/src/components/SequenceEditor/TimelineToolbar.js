import React from "react";
import { Play, Pause, Square, DiamondPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { selectedObjectAtom } from "../../atoms";
import useAnimation from '../../hooks/useAnimation';

const TimeDisplay = ({ currentTime, totalTime }) => {
  // Format time values to ensure consistent width
  const formatTime = (time) => time.toFixed(2).padStart(6, ' ');

  return (
    <div className="flex items-center space-x-1 min-w-0">
      <span className="font-mono text-xs md:text-sm whitespace-nowrap overflow-hidden text-ellipsis">
        {formatTime(currentTime)}
      </span>
      <span className="font-mono text-xs md:text-sm">/</span>
      <span className="font-mono text-xs md:text-sm whitespace-nowrap overflow-hidden text-ellipsis">
        {formatTime(totalTime)}
      </span>
    </div>
  );
};

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
    <div className="h-10 min-h-[40px] bg-gray-800 border-b border-gray-700 w-full flex items-center justify-between px-2">
      <div className="flex items-center gap-1 flex-grow">
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

        <div className="flex items-center">
          <span className="text-white font-mono text-[10px] sm:text-[12px]">
            {currentTime.toFixed(2)} / {totalTime.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TimelineToolbar;
