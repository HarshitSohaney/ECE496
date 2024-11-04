import React, { useRef, useEffect, useState } from "react";
import {
  Play, Pause, SkipBack, ChevronRight, Eye, Lock, Plus
} from "lucide-react";
import { useAtom } from "jotai";
import {
  selectedObjectAtom,
  timelineDurationAtom,
  arObjectsAtom,
  timelineScaleAtom,
  timelineWidthAtom
} from "../../atoms";
import useAnimation from "../../hooks/useAnimation";
import TimeRuler from "./TimeRuler";
import Playhead from "./Playhead";
import KeyframeBar from './KeyframeBar';
import DurationInput from "./DurationInput";

const ObjectRow = ({ object }) => (
  <div className="group flex items-center h-8 border-b border-gray-700 hover:bg-gray-750">
    <div className="flex items-center px-2 w-full">
      {object.type === "group" ? (
        <ChevronRight className="w-4 h-4 text-gray-400 mr-1" />
      ) : (
        <div className="w-4 mr-1" />
      )}
      <span className="text-sm text-gray-300 flex-grow">{object.name}</span>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <Eye className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
        <Lock className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
      </div>
    </div>
  </div>
);

const TimelineRow = ({ objectId, timeRulerStart, timeRulerEnd }) => {
  const [arObjects] = useAtom(arObjectsAtom);
  const [scale] = useAtom(timelineScaleAtom);
  const [timelineWidth] = useAtom(timelineWidthAtom);
  const object = arObjects.find(obj => obj.id === objectId);

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
  const { play, pause, stop, addKeyframe, currentTime, isPlaying } = useAnimation();
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
      <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center px-4 gap-4">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-700 rounded" onClick={stop}>
            <SkipBack className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded" onClick={isPlaying ? pause : play}>
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            className="p-2 hover:bg-gray-700 rounded"
            onClick={() => selectedObject && addKeyframe(selectedObject.id)}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="text-sm text-gray-300">
          <DurationInput currentTime={currentTime} />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-gray-400">Zoom:</span>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-24"
          />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar with original 15vw width */}
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
