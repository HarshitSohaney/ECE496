import React from "react";
import { useAtom } from 'jotai';
import { Play, Square, DiamondPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { currentTimeAtom, isPlayingAtom, arObjectsAtom, selectedObjectAtom } from "../../atoms";

const TimelineToolbar = ({ totalTime }) => {
  const [currentTime, setCurrentTime] = useAtom(currentTimeAtom);
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);
  const [arObjects, setArObjects] = useAtom(arObjectsAtom);
  const [selectedObject] = useAtom(selectedObjectAtom);

  const handlePlay = () => setIsPlaying(true);
  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Inside TimelineToolbar.js
const addKeyframe = () => {
  if (!selectedObject) {
    console.log("No object selected");
    return;
  }

  setArObjects((prevObjects) => {
    return prevObjects.map((obj) => {
      if (obj.id === selectedObject.id) {
        console.log("Adding keyframe for object:", obj.id);
        const existingKeyframes = obj.keyframes || [];
        const lastKeyframe = existingKeyframes[existingKeyframes.length - 1];

        let newKeyframe;
        if (!lastKeyframe || lastKeyframe.end !== null) {
          // Start a new keyframe pair
          newKeyframe = {
            id: existingKeyframes.length + 1,
            start: currentTime,
            end: null,
            position: {
              start: [...(obj.position || [0, 0, 0])],
              end: null,
            },
          };
          console.log("New start keyframe:", newKeyframe);
        } else {
          // End the current keyframe pair
          newKeyframe = {
            ...lastKeyframe,
            end: currentTime,
            position: {
              ...lastKeyframe.position,
              end: [...(obj.position || [0, 0, 0])],
            },
          };
          console.log("Updated end keyframe:", newKeyframe);
        }

        const updatedKeyframes = [
          ...existingKeyframes.filter((k) => k.id !== newKeyframe.id),
          newKeyframe,
        ];
        console.log("Updated keyframes:", updatedKeyframes);

        return {
          ...obj,
          keyframes: updatedKeyframes,
        };
      }
      return obj;
    });
  });
};


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

      <Button
        variant="outline"
        size="icon"
        className="navbar-button h-6 w-6"
        onClick={addKeyframe}
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
