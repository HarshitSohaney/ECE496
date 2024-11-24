import React, { useRef, useEffect } from "react";
import { useAtom } from 'jotai';
import { timelineScaleAtom, timelineWidthAtom, timelineDurationAtom } from "../../atoms";

const TimeRuler = ({ height = 32 }) => {
  const canvasRef = useRef(null);
  const [, setScale] = useAtom(timelineScaleAtom);
  const [timelineWidth, setTimelineWidth] = useAtom(timelineWidthAtom);
  const [duration] = useAtom(timelineDurationAtom);

  // Calculate optimal tick intervals based on duration
  const calculateTickInterval = (duration) => {
    if (duration <= 10) return 1; // 1 second intervals
    if (duration <= 30) return 2; // 2 second intervals
    if (duration <= 60) return 5; // 5 second intervals
    if (duration <= 300) return 15; // 15 second intervals
    return Math.ceil(duration / 20); // Aim for about 20 major ticks for longer durations
  };

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        setTimelineWidth(canvasRef.current.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setTimelineWidth]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const pixelRatio = window.devicePixelRatio || 1;
    const width = timelineWidth * pixelRatio;
    canvas.width = width;
    canvas.height = height * pixelRatio;
    context.scale(pixelRatio, pixelRatio);

    drawRuler(context, timelineWidth, height, 0, duration);

    // Update scale
    const newScale = timelineWidth / duration;
    setScale(newScale);
  }, [timelineWidth, duration, height, setScale]);

  return (
    <canvas
      ref={canvasRef}
      className="bg-gray-800"
      style={{ width: "100%", height: `${height}px` }}
    />
  );
};

function drawRuler(context, width, height, start, end) {
  const totalDuration = end - start;
  const majorTickInterval = calculateTickInterval(totalDuration);
  const tickSpacing = width / totalDuration;
  const majorTickHeight = height * 0.5;
  const minorTickHeight = height * 0.3;

  context.clearRect(0, 0, width, height);

  // Updated colors to match dark theme
  context.fillStyle = "#9CA3AF"; // text-gray-400
  context.strokeStyle = "#4B5563"; // border-gray-600
  context.lineWidth = 1;
  context.font = "10px Inter, sans-serif";
  context.textBaseline = "bottom";

  // Draw major ticks and labels
  for (let i = 0; i <= totalDuration; i += majorTickInterval) {
    const x = i * tickSpacing;

    // Draw major tick
    context.beginPath();
    context.moveTo(x, height);
    context.lineTo(x, height - majorTickHeight);
    context.stroke();

    // Position label
    let labelX = x;
    if (i === 0) labelX += 5;
    if (i === totalDuration) labelX -= 5;

    // Draw time label
    context.textAlign = "center";
    context.fillText(`${i}s`, labelX, height - majorTickHeight - 2);

    // Draw minor ticks (if space permits)
    if (i < totalDuration && tickSpacing * majorTickInterval > 30) {
      const minorTickCount = majorTickInterval >= 5 ? 4 : 9; // Fewer subdivisions for larger intervals
      for (let j = 1; j <= minorTickCount; j++) {
        const minorX = x + (j * tickSpacing * majorTickInterval) / (minorTickCount + 1);
        context.beginPath();
        context.moveTo(minorX, height);
        context.lineTo(minorX, height - minorTickHeight);
        context.stroke();
      }
    }
  }
}

function calculateTickInterval(duration) {
  if (duration <= 10) return 1;
  if (duration <= 30) return 2;
  if (duration <= 60) return 5;
  if (duration <= 300) return 15;
  return Math.ceil(duration / 20);
}

export default TimeRuler;
