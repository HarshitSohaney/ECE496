import React, { useRef, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { arObjectsAtom, timelineDurationAtom } from "../../atoms";
import TimelineRow from "./TimelineRow";
import TimeRuler from "./TimeRuler";
import Playhead from "./Playhead";
import TimelineToolbar from "./TimelineToolbar";
import useAnimation from "../../hooks/useAnimation";

const SequenceEditor = () => {
  const [arObjects] = useAtom(arObjectsAtom);
  const [duration] = useAtom(timelineDurationAtom);
  const { currentTime } = useAnimation();
  const [timelineWidth, setTimelineWidth] = useState(0);

  const containerRef = useRef(null);
  const objectListRef = useRef(null);
  const timelineRowsRef = useRef(null);

  const timeRulerStart = 0;

  useEffect(() => {
    if (containerRef.current) {
      setTimelineWidth(containerRef.current.offsetWidth);
    }
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
    <div className="relative flex flex-col w-full" style={{ minHeight: "250px", height: "250px" }}>
      {/* Main content */}
      <div className="relative flex flex-row w-full" style={{ height: "calc(100% - 24px)" }}>
        {/* Left Sidebar - Fixed width instead of viewport units */}
        <div className="border-r border-gray-700 bg-gray-800 flex flex-col" style={{ width: "250px", minWidth: "250px" }}>
          {/* Toolbar container */}
          <div className="h-10 bg-gray-800 flex items-center justify-start relative w-full">
            <TimelineToolbar />
          </div>
          {/* Object list */}
          <div className="flex-grow overflow-auto" ref={objectListRef} onScroll={handleScroll}>
            {arObjects.map((object) => (
              <div key={object.id} className="h-8 px-3 text-gray-300 flex items-center border-b border-gray-700">
                <span className="truncate text-sm">{object.name || `Object ${object.id}`}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Area */}
        <div className="flex-grow relative bg-gray-800 text-gray-300" style={{ minWidth: "400px" }}>
          <div className="relative flex items-center" style={{
            height: "40px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            zIndex: 5,
          }}>
            <TimeRuler start={timeRulerStart} end={duration} height={40} />
          </div>

          <Playhead currentTime={currentTime} containerWidth={timelineWidth} />

          <div
            className="relative overflow-y-auto"
            ref={(el) => {
              containerRef.current = el;
              timelineRowsRef.current = el;
            }}
            style={{ height: "calc(100% - 40px)" }}
            onScroll={handleScroll}
          >
            {arObjects.map((object) => (
              <TimelineRow
                key={object.id}
                objectId={object.id}
                timeRulerStart={timeRulerStart}
                timeRulerEnd={duration}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SequenceEditor;
