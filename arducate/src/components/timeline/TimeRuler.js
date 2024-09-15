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
  context.font = "8px Inter, sans-serif";
  context.textBaseline = "bottom";

  for (let i = start; i <= end; i++) {
    const x = (i - start) * tickSpacing;

    // Draw major tick
    context.beginPath();
    context.moveTo(x, height);
    context.lineTo(x, height - majorTickHeight);
    context.stroke();

    // Default label position (centered)
    let labelX = x;

    // Offset the 0s label slightly to the right
    if (i === 0) {
      labelX += 5; // Move the "0s" label to the right
    }

    // Offset the last label (end label) slightly to the left
    if (i === end) {
      labelX -= 5; // Move the last label to the left
    }

    // Draw time label
    context.textAlign = "center";
    context.fillText(`${i}s`, labelX, height - majorTickHeight - 2);

    // Draw minor ticks
    if (i < end) {
      for (let j = 1; j < 10; j++) {
        const minorX = x + (j * tickSpacing) / 10;
        context.beginPath();
        context.moveTo(minorX, height);
        context.lineTo(minorX, height - minorTickHeight);
        context.stroke();
      }
    }
  }
}



export default TimeRuler;
