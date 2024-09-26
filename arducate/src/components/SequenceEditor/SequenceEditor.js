// src/components/SequenceEditor/SequenceEditor.js
import React, { useRef, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { arObjectsAtom } from "../../atoms";
import TimelineRow from "./TimelineRow";
import TimeRuler from "./TimeRuler";
import Playhead from "./Playhead";
import TimelineToolbar from "./TimelineToolbar";
import AnimationController from "../../controllers/AnimationController";

const SequenceEditor = () => {
  const [arObjects] = useAtom(arObjectsAtom);
  const { currentTime } = AnimationController();
  const [timelineWidth, setTimelineWidth] = useState(0);

  const containerRef = useRef(null);
  const objectListRef = useRef(null);
  const timelineRowsRef = useRef(null);

  const timeRulerStart = 0;
  const timeRulerEnd = 20;

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
    <div className="relative flex flex-col w-full h-60 bg-gray-900">
      <div className="relative flex flex-row w-full h-full">
        <div className="w-[15vw] border-r border-gray-700 bg-gray-800 flex flex-col">
          <div
            className="h-10 bg-gray-800 flex items-center justify-center relative"
            style={{
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              zIndex: 10,
            }}
          >
            <TimelineToolbar totalTime={timeRulerEnd} />
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

        <div className="flex-grow relative bg-gray-800 text-gray-300">
          <div
            className="relative flex items-center"
            style={{
              height: "40px",
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              zIndex: 5,
            }}
          >
            <TimeRuler start={timeRulerStart} end={timeRulerEnd} height={40} />
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
