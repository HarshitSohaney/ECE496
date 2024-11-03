// src/components/SequenceEditor/SequenceEditor.js
import React, { useRef, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { arObjectsAtom } from "../../atoms";
import TimelineRow from "./TimelineRow";
import TimeRuler from "./TimeRuler";
import Playhead from "./Playhead";
import TimelineToolbar from "./TimelineToolbar";
import useAnimationController from "../../controllers/AnimationController";
import { FixedSizeList as List } from "react-window";
import { debounce } from "lodash"; // Ensure lodash is installed

const ROW_HEIGHT = 40; // Adjust based on design
const MAX_TIME = 1000; // Maximum timeline length in seconds
const BUFFER_OFFSET = 100; // pixels

const SequenceEditor = () => {
  const [arObjects] = useAtom(arObjectsAtom);
  const { currentTime, isPlaying, play, pause, stop, addKeyframe, updateKeyframe } = useAnimationController();
  const scale = 100; // 100 pixels per second (constant)
  const [timeRange, setTimeRange] = useState({ start: 0, end: 20 });
  const [isExtending, setIsExtending] = useState(false);

  const objectListRef = useRef(null);
  const timelineRowsRef = useRef(null);
  const timelineContainerRef = useRef(null); // Ref for container width

  // Function to extend timeline
  const extendTimeline = () => {
    if (isExtending || timeRange.end >= MAX_TIME) return;
    setIsExtending(true);
    setTimeRange((prev) => ({ ...prev, end: prev.end + 10 }));

    // Shift the timeline view left by BUFFER_OFFSET after extending
    setTimeout(() => {
      const container = timelineRowsRef.current;
      if (container) {
        container.scrollLeft += BUFFER_OFFSET;
      }
      setIsExtending(false);
    }, 0); // Ensures this runs after state update
  };

  // Debounced scroll handler
  const handleScroll = debounce((event) => {
    const { target } = event;
    if (target === objectListRef.current) {
      timelineRowsRef.current.scrollTop = target.scrollTop;
    } else if (target === timelineRowsRef.current) {
      objectListRef.current.scrollTop = target.scrollTop;

      // Check if scrolled near the end to extend timeline
      if (
        target.scrollLeft + target.clientWidth >=
          target.scrollWidth - 100 && // 100 pixels buffer
        !isExtending
      ) {
        extendTimeline();
      }
    }
  }, 100); // 100ms debounce delay

  useEffect(() => {
    if (isExtending) {
      // Reset the flag after extending
      setIsExtending(false);
    }
  }, [timeRange.end, isExtending]);

  // Extend timeline based on playhead position
  useEffect(() => {
    const bufferTime = 5; // seconds
    if (currentTime >= timeRange.end - bufferTime && !isExtending) {
      extendTimeline();
    }
  }, [currentTime, timeRange.end, isExtending]);

  // Ensure playhead visibility and adjust scroll
  useEffect(() => {
    const playheadPosition = currentTime * scale;
    const container = timelineRowsRef.current;

    if (container) {
      // If playhead is beyond the visible area (right side)
      if (playheadPosition + BUFFER_OFFSET > container.scrollLeft + container.clientWidth) {
        // Shift the view left to accommodate the buffer
        container.scrollLeft = playheadPosition - container.clientWidth + BUFFER_OFFSET;
      }
      // Optional: Prevent excessive left scrolling
      if (playheadPosition - BUFFER_OFFSET < container.scrollLeft) {
        container.scrollLeft = Math.max(playheadPosition - BUFFER_OFFSET, 0);
      }
    }
  }, [currentTime, scale]);

  // Row renderer for react-window
  const Row = ({ index, style }) => {
    const object = arObjects[index];
    return (
      <div style={style}>
        <TimelineRow
          objectId={object.id}
          start={timeRange.start}
          end={timeRange.end}
          scale={scale}
        />
      </div>
    );
  };

  // Get container width for Playhead bounds
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (timelineContainerRef.current) {
        setContainerWidth(timelineContainerRef.current.clientWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <div className="relative flex flex-col w-full h-60 bg-gray-900">
      <div className="relative flex flex-row w-full h-full">
        {/* Sidebar */}
        <div className="w-[15vw] border-r border-gray-700 bg-gray-800 flex flex-col">
          <div
            className="h-10 bg-gray-800 flex items-center justify-center relative"
            style={{
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              zIndex: 10,
            }}
          >
            <TimelineToolbar totalTime={timeRange.end} />
          </div>
          <div
            className="flex-grow overflow-auto"
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

        {/* Timeline */}
        <div
          className="flex-grow relative bg-gray-800 text-gray-300 overflow-x-auto overflow-y-hidden"
          onScroll={handleScroll}
          ref={timelineRowsRef}
        >
          <div
            className="relative"
            style={{ width: `${(timeRange.end - timeRange.start) * scale}px` }}
            ref={timelineContainerRef}
          >
            {/* Time Ruler */}
            <div
              className="relative flex items-center"
              style={{
                height: "40px",
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                zIndex: 5,
              }}
            >
              <TimeRuler
                start={timeRange.start}
                end={timeRange.end}
                height={40}
                scale={scale}
              />
            </div>

            {/* Virtualized Timeline Rows */}
            <div className="relative" style={{ height: "calc(100% - 40px)" }}>
              <List
                height={Math.min(arObjects.length * ROW_HEIGHT, 400)} // Adjust based on layout
                itemCount={arObjects.length}
                itemSize={ROW_HEIGHT}
                width="100%"
                style={{ zIndex: 1 }}
              >
                {Row}
              </List>
            </div>
          </div>

          {/* Playhead Overlay */}
          <div
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1000 }}
          >
            <Playhead
              scale={scale}
              currentTime={currentTime}
              containerWidth={(timeRange.end - timeRange.start) * scale}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SequenceEditor;
