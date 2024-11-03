import React, { useRef, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { arObjectsAtom, timelineDurationAtom, totalDurationAtom } from "../../atoms";
import TimelineRow from "./TimelineRow";
import TimeRuler from "./TimeRuler";
import Playhead from "./Playhead";
import TimelineToolbar from "./TimelineToolbar";
import AnimationController from "../../controllers/AnimationController";

const SIDEBAR_WIDTH = 350;

const SequenceEditor = () => {
  const [arObjects] = useAtom(arObjectsAtom);
  const [visibleDuration] = useAtom(timelineDurationAtom);
  const [totalDuration] = useAtom(totalDurationAtom);
  const { currentTime } = AnimationController();
  const [timelineWidth, setTimelineWidth] = useState(0);
  const [viewportStart, setViewportStart] = useState(0);
  
  const containerRef = useRef(null);
  const objectListRef = useRef(null);
  const timelineRowsRef = useRef(null);
  const horizontalScrollRef = useRef(null);
  const timelineAreaRef = useRef(null);

  const timeRulerStart = viewportStart;
  const timeRulerEnd = Math.min(viewportStart + visibleDuration, totalDuration);
  const shouldScroll = totalDuration > visibleDuration;

  // Update timeline width when container resizes
  useEffect(() => {
    const updateWidth = () => {
      if (timelineAreaRef.current) {
        setTimelineWidth(timelineAreaRef.current.offsetWidth);
      }
    };

    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    if (timelineAreaRef.current) {
      resizeObserver.observe(timelineAreaRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Reset viewport when durations change
  useEffect(() => {
    setViewportStart(0);
    if (horizontalScrollRef.current) {
      horizontalScrollRef.current.scrollLeft = 0;
    }
  }, [totalDuration, visibleDuration]);

  const handleVerticalScroll = (event) => {
    const { target } = event;
    if (target === objectListRef.current) {
      timelineRowsRef.current.scrollTop = target.scrollTop;
    } else if (target === timelineRowsRef.current) {
      objectListRef.current.scrollTop = target.scrollTop;
    }
  };

  const handleHorizontalScroll = (event) => {
    const { scrollLeft } = event.target;
    const maxScroll = horizontalScrollRef.current.scrollWidth - horizontalScrollRef.current.clientWidth;
    const scrollRatio = scrollLeft / maxScroll;
    const maxViewportStart = Math.max(0, totalDuration - visibleDuration);
    const newViewportStart = scrollRatio * maxViewportStart;
    setViewportStart(Math.min(newViewportStart, maxViewportStart));
  };

  // Calculate the minimum width needed to represent the total duration
  const getScrollWidth = () => {
    if (!shouldScroll) return '100%';
    const minWidth = timelineWidth * (totalDuration / visibleDuration);
    return `${minWidth}px`;
  };

  return (
    <div className="relative flex flex-col w-full" style={{ minHeight: "250px", height: "250px" }}>
      {/* Timer row */}
      <div className="w-full h-6 bg-gray-800 flex items-center justify-center border-b border-gray-700">
        <span className="text-white font-mono text-xs">
          {currentTime.toFixed(2)} / {totalDuration.toFixed(2)}
        </span>
      </div>

      {/* Main content */}
      <div className="relative flex flex-col w-full" style={{ height: "calc(100% - 24px)" }}>
        <div className="flex flex-row w-full h-full">
          {/* Left Sidebar */}
          <div className="border-r border-gray-700 bg-gray-800 flex flex-col" 
               style={{ width: `${SIDEBAR_WIDTH}px`, minWidth: `${SIDEBAR_WIDTH}px` }}>
            <div className="h-10 bg-gray-800 flex items-center justify-start relative w-full">
              <TimelineToolbar />
            </div>
            <div className="flex-grow overflow-auto" ref={objectListRef} onScroll={handleVerticalScroll}>
              {arObjects.map((object) => (
                <div key={object.id} className="h-8 px-3 text-gray-300 flex items-center border-b border-gray-700">
                  <span className="truncate text-sm">{object.name || `Object ${object.id}`}</span>
                </div>
              ))}
              {/* Add an empty row if no objects to maintain scrollability */}
              {arObjects.length === 0 && (
                <div className="h-8 px-3 text-gray-300 flex items-center border-b border-gray-700">
                  <span className="truncate text-sm">No objects</span>
                </div>
              )}
            </div>
          </div>

          {/* Timeline Area */}
          <div 
            ref={timelineAreaRef}
            className="flex-grow flex flex-col relative bg-gray-800 text-gray-300" 
            style={{ minWidth: "400px" }}
          >
            {/* Scrollable container for timeline content */}
            <div className="relative flex-grow flex flex-col overflow-hidden">
              {/* Time ruler container - fixed position */}
              <div className="sticky top-0 z-10" style={{
                height: "40px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              }}>
                <TimeRuler 
                  start={timeRulerStart} 
                  end={timeRulerEnd} 
                  height={40}
                  totalDuration={totalDuration}
                />
              </div>

              {/* Scrollable content area */}
              <div className="relative flex-grow overflow-hidden">
                <div 
                  ref={horizontalScrollRef}
                  className="absolute inset-0 overflow-x-auto overflow-y-hidden"
                  onScroll={handleHorizontalScroll}
                >
                  <div style={{ width: getScrollWidth(), height: "100%" }}>
                    <Playhead 
                      currentTime={currentTime} 
                      containerWidth={timelineWidth}
                      viewportStart={viewportStart}
                      visibleDuration={visibleDuration}
                    />

                    <div
                      className="h-full overflow-y-auto"
                      ref={timelineRowsRef}
                      onScroll={handleVerticalScroll}
                    >
                      {arObjects.map((object) => (
                        <TimelineRow
                          key={object.id}
                          objectId={object.id}
                          timeRulerStart={timeRulerStart}
                          timeRulerEnd={timeRulerEnd}
                          totalDuration={totalDuration}
                        />
                      ))}
                      {/* Add an empty row if no objects */}
                      {arObjects.length === 0 && (
                        <div className="h-8 border-b border-gray-700" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SequenceEditor;