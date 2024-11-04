// src/components/SequenceEditor/SequenceEditor.js
import React, { useRef, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { arObjectsAtom } from "../../atoms";
import TimelineRow from "./TimelineRow";
import TimeRuler from "./TimeRuler";
import Playhead from "./Playhead";
import TimelineToolbar from "./TimelineToolbar";
import useAnimation from "../../hooks/useAnimation";

const SequenceEditor = () => {
  const [arObjects] = useAtom(arObjectsAtom);
  const { currentTime } = useAnimation();
  const [timelineWidth, setTimelineWidth] = useState(0);

  const containerRef = useRef(null);
  const objectListRef = useRef(null);
  const timelineRowsRef = useRef(null);

  const timeRulerStart = 0;
  const timeRulerEnd = 20;

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setTimelineWidth(containerRef.current.offsetWidth);
      }
    };

    // Initial width
    updateWidth();

    // Add resize listener
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleScroll = (event) => {
    const { target } = event;
    if (target === objectListRef.current) {
      timelineRowsRef.current.scrollTop = target.scrollTop;
    } else if (target === timelineRowsRef.current) {
      objectListRef.current.scrollTop = target.scrollTop;
    }
  };

  return (
    <div className="flex flex-col w-full h-[35vh] bg-gray-900">
      <div className="flex flex-row w-full h-full min-w-0">
        <div className="w-40 md:w-48 lg:w-56 border-r border-gray-700 bg-gray-800 flex flex-col flex-shrink-0">
          <div
            className="h-10 bg-gray-800 flex items-center justify-center relative"
            style={{
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              zIndex: 10,
            }}
          >
            <TimelineToolbar totalTime={timeRulerEnd} />
          </div>
          <div
            className="flex-1 overflow-y-auto"
            ref={objectListRef}
            onScroll={handleScroll}
          >
            {arObjects.map((object) => (
              <div
                key={object.id}
                className="h-8 px-3 text-gray-300 flex items-center border-b border-gray-700"
              >
                <span className="truncate text-sm">
                  {object.name || `Object ${object.id}`}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 relative bg-gray-800 text-gray-300 min-w-0">
          <div
            className="relative flex items-center h-10"
            style={{
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              zIndex: 5,
            }}
          >
            <TimeRuler start={timeRulerStart} end={timeRulerEnd} height={40} />
          </div>

          <Playhead currentTime={currentTime} containerWidth={timelineWidth} />

          <div
            className="absolute inset-0 top-10 overflow-y-auto"
            ref={(el) => {
              containerRef.current = el;
              timelineRowsRef.current = el;
            }}
            onScroll={handleScroll}
          >
            {arObjects.map((object) => (
              <TimelineRow
                key={object.id}
                objectId={object.id}
                timeRulerStart={timeRulerStart}
                timeRulerEnd={timeRulerEnd}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SequenceEditor;
