import React, { useRef, useEffect, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  ChevronRight,
  Eye,
  Lock,
  Plus,
  Settings2,
} from "lucide-react";
import { useAtom } from "jotai";
import {
  selectedObjectAtom,
  timelineDurationAtom,
  arObjectsAtom,
  timelineScaleAtom,
  timelineWidthAtom,
} from "../../atoms";
import useAnimation from "../../hooks/useAnimation";
import TimeRuler from "./TimeRuler";
import Playhead from "./Playhead";
import KeyframeBar from "./KeyframeBar";
import DurationInput from "./DurationInput";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}:${ms.toString().padStart(2, "0")}`;
};

const ObjectRow = ({ object }) => (
  <div className="group flex items-center h-8 border-b border-gray-700 hover:bg-gray-750">
    <div className="flex items-center px-2 w-full">
      {object.type === "group" ? (
        <ChevronRight className="w-4 h-4 text-gray-400 mr-1" />
      ) : (
        <div className="w-4 mr-1" />
      )}
      <span className="text-sm text-gray-300 flex-grow">{object.name}</span>
    </div>
  </div>
);

const TimelineRow = ({ objectId, timeRulerStart, timeRulerEnd }) => {
  const [arObjects] = useAtom(arObjectsAtom);
  const [scale] = useAtom(timelineScaleAtom);
  const [timelineWidth] = useAtom(timelineWidthAtom);
  const object = arObjects.find((obj) => obj.id === objectId);

  return (
    <div className="flex items-center h-8 relative border-b border-gray-700">
      <div className="flex-grow relative h-full flex items-center">
        <KeyframeBar
          objectId={objectId}
          keyframes={object.keyframes || []}
          scale={scale}
          timeRulerStart={timeRulerStart}
          timeRulerEnd={timeRulerEnd}
          timelineWidth={timelineWidth}
        />
      </div>
    </div>
  );
};

const SequenceEditor = () => {
  const { play, pause, stop, addKeyframe, currentTime, isPlaying } =
    useAnimation();
  const [selectedObject] = useAtom(selectedObjectAtom);
  const [duration] = useAtom(timelineDurationAtom);
  const [zoom, setZoom] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const [arObjects] = useAtom(arObjectsAtom);
  const timelineRef = useRef(null);
  const objectListRef = useRef(null);
  const timelineContentRef = useRef(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    if (timelineRef.current) {
      resizeObserver.observe(timelineRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  // Synchronize scrolling between object list and timeline
  const handleScroll = (event) => {
    const target = event.target;
    if (target === objectListRef.current) {
      timelineContentRef.current.scrollTop = target.scrollTop;
    } else if (target === timelineContentRef.current) {
      objectListRef.current.scrollTop = target.scrollTop;
    }
  };

  return (
    <div className="flex flex-col h-60 w-full bg-gray-900 text-white rounded-lg overflow-hidden">
      {/* Fixed-height header */}
      <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center px-4">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-700 rounded" onClick={stop}>
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            className="p-2 hover:bg-gray-700 rounded"
            onClick={isPlaying ? pause : play}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
          <button
            className="p-2 hover:bg-gray-700 rounded"
            onClick={() => selectedObject && addKeyframe(selectedObject.id)}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1" /> {/* Left spacer */}
        <div className="text-sm text-gray-300 flex-shrink-0">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        <div className="flex items-center gap-2 flex-1 justify-end">
          <Popover>
            <PopoverTrigger>
              <button className="p-2 hover:bg-gray-700 rounded">
                <Settings2 className="w-4 h-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto border-gray-700 bg-gray-800">
              <DurationInput />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden relative">
        <div className="w-[15vw] bg-gray-800 border-r border-gray-700 flex flex-col">
          <div className="h-8 border-b border-gray-700 bg-gray-800 flex items-center px-3">
            <span className="text-xs text-gray-400">Elements</span>
          </div>
          <div
            ref={objectListRef}
            onScroll={handleScroll}
            className="overflow-y-auto flex-1"
          >
            {arObjects.map((object) => (
              <ObjectRow key={object.id} object={object} />
            ))}
          </div>
        </div>

        {/* Timeline area */}
        <div className="flex-1 flex flex-col overflow-hidden" ref={timelineRef}>
          <div className="h-8">
            <TimeRuler />
          </div>
          <div
            ref={timelineContentRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto overflow-x-hidden"
          >
            {arObjects.map((object) => (
              <TimelineRow
                key={object.id}
                objectId={object.id}
                timeRulerStart={0}
                timeRulerEnd={duration}
              />
            ))}
          </div>
        </div>

        {/* Playhead overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 9999,
            left: "15vw",
            right: 0,
          }}
        >
          <Playhead containerWidth={containerWidth} />
        </div>
      </div>
    </div>
  );
};

export default SequenceEditor;
