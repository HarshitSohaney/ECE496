import React, { useRef, useEffect } from "react";
import { useAtom } from 'jotai';
import { timelineScaleAtom, timelineWidthAtom } from "../../atoms";

const TimeRuler = ({ start = 0, end = 10, height = 20 }) => {
  const canvasRef = useRef(null);
  const [, setScale] = useAtom(timelineScaleAtom);
  const [timelineWidth, setTimelineWidth] = useAtom(timelineWidthAtom);

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

    drawRuler(context, timelineWidth, height, start, end);

    // Update scale
    const newScale = timelineWidth / (end - start);
    setScale(newScale);
  }, [timelineWidth, start, end, height, setScale]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: `${height}px` }}
    />
  );
};

function drawRuler(context, width, height, start, end) {
  const totalSeconds = end - start;
  const tickSpacing = width / totalSeconds;
  const majorTickHeight = height * 0.5;
  const minorTickHeight = height * 0.3;

  context.clearRect(0, 0, width, height);

  context.fillStyle = "#E2E8F0";
  context.strokeStyle = "#E2E8F0";
  context.lineWidth = 1;
  context.font = "10px Inter, sans-serif";
  context.textBaseline = "bottom";

  // Calculate optimal step size based on available width
  const secondsPerMajorTick = calculateOptimalTickInterval(width, start, end);
  const minorTicksPerMajor = 10;

  // Draw from the first major tick before or at start to the first major tick after or at end
  const firstMajorTick = Math.floor(start / secondsPerMajorTick) * secondsPerMajorTick;
  const lastMajorTick = Math.ceil(end / secondsPerMajorTick) * secondsPerMajorTick;

  for (let time = firstMajorTick; time <= lastMajorTick; time += secondsPerMajorTick) {
    if (time < start || time > end) continue;

    const x = (time - start) * tickSpacing;

    // Draw major tick
    context.beginPath();
    context.moveTo(x, height);
    context.lineTo(x, height - majorTickHeight);
    context.stroke();

    // Draw time label
    context.textAlign = "center";
    context.fillText(`${time}s`, x, height - majorTickHeight - 2);

    // Draw minor ticks
    if (time < lastMajorTick) {
      const minorStep = secondsPerMajorTick / minorTicksPerMajor;
      for (let i = 1; i < minorTicksPerMajor; i++) {
        const minorTime = time + (i * minorStep);
        if (minorTime > end) break;
        if (minorTime < start) continue;
        
        const minorX = (minorTime - start) * tickSpacing;
        context.beginPath();
        context.moveTo(minorX, height);
        context.lineTo(minorX, height - minorTickHeight);
        context.stroke();
      }
    }
  }
}

function calculateOptimalTickInterval(width, start, end) {
  const totalSeconds = end - start;
  const pixelsPerSecond = width / totalSeconds;
  const minPixelsBetweenLabels = 80; // Minimum pixels between major ticks
  
  // Calculate minimum seconds between ticks to avoid overlap
  const minSecondsBetweenTicks = minPixelsBetweenLabels / pixelsPerSecond;
  
  // Common intervals in seconds
  const intervals = [1, 2, 5, 10, 15, 20, 30, 60];
  
  // Find the first interval that provides enough space between labels
  for (const interval of intervals) {
    if (interval >= minSecondsBetweenTicks) {
      return interval;
    }
  }
  
  // If none of the predefined intervals work, use a multiple of 60
  return Math.ceil(minSecondsBetweenTicks / 60) * 60;
}

export default TimeRuler;