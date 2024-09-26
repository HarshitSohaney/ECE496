import React, { useRef, useEffect } from "react";
import { useAtom } from "jotai";
import {
  arObjectsAtom,
  currentTimeAtom,
  isPlayingAtom,
  timelineWidthAtom,
} from "../../atoms";
import TimelineRow from "./TimelineRow";
import TimeRuler from "./TimeRuler";
import Playhead from "./Playhead";
import TimelineToolbar from "./TimelineToolbar";

const SequenceEditor = () => {
  const [arObjects, setArObjects] = useAtom(arObjectsAtom);
  const [currentTime, setCurrentTime] = useAtom(currentTimeAtom);
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);
  const [timelineWidth, setTimelineWidth] = useAtom(timelineWidthAtom);

  const containerRef = useRef(null);
  const objectListRef = useRef(null);
  const timelineRowsRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastUpdateTimeRef = useRef(0);

  const timeRulerStart = 0;
  const timeRulerEnd = 20;

  useEffect(() => {
    if (containerRef.current) {
      setTimelineWidth(containerRef.current.offsetWidth);
    }
  }, [setTimelineWidth]);

  useEffect(() => {
    if (isPlaying) {
      const animate = (timestamp) => {
        if (!lastUpdateTimeRef.current) lastUpdateTimeRef.current = timestamp;
        const deltaTime = (timestamp - lastUpdateTimeRef.current) / 1000; // Convert to seconds
        lastUpdateTimeRef.current = timestamp;

        setCurrentTime((prevTime) => {
          const newTime = prevTime + deltaTime;
          return newTime > timeRulerEnd ? timeRulerStart : newTime;
        });

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      lastUpdateTimeRef.current = 0;
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, setCurrentTime, timeRulerStart, timeRulerEnd]);

  useEffect(() => {
    // Interpolate object positions based on current time
    setArObjects((prevObjects) =>
      prevObjects.map((obj) => {
        const activeKeyframe = obj.keyframes?.find(
          (kf) =>
            currentTime >= kf.start && kf.end !== null && currentTime <= kf.end
        );

        if (activeKeyframe) {
          const progress =
            (currentTime - activeKeyframe.start) /
            (activeKeyframe.end - activeKeyframe.start);

          // Use the updated keyframe structure here
          const interpolatedPosition = interpolatePosition(
            activeKeyframe.position.start,
            activeKeyframe.position.end,
            progress
          );

          return { ...obj, position: interpolatedPosition };
        }

        return obj;
      })
    );
  }, [currentTime, setArObjects]);

  const interpolatePosition = (start, end, progress) => {
    if (!start || !end) {
      console.error("Start or end positions are undefined");
      return start || end || [0, 0, 0]; // Fallback to start or end position
    }

    return start.map((startValue, index) => {
      const endValue = end[index];
      return startValue + (endValue - startValue) * progress;
    });
  };

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
