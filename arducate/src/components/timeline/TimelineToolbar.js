import React from "react";
import { useAtom } from 'jotai';
import { Play, Square, DiamondPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { currentTimeAtom, isPlayingAtom } from "../../atoms";

const TimelineToolbar = ({ totalTime }) => {
  const [currentTime] = useAtom(currentTimeAtom);
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);

  const handlePlay = () => setIsPlaying(true);
  const handleStop = () => setIsPlaying(false);

  return (
    <div className="flex items-center justify-center space-x-2 h-10 min-h-[40px] px-2 bg-gray-800 border-b border-gray-700">
      <Button
        variant="outline"
        size="icon"
        className="navbar-button h-6 w-6"
        onClick={handlePlay}
      >
        <Play size={14} strokeWidth={1.5} />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="navbar-button h-6 w-6"
        onClick={handleStop}
      >
        <Square size={14} strokeWidth={1.5} />
      </Button>

      <Button variant="outline" size="icon" className="navbar-button h-6 w-6">
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
