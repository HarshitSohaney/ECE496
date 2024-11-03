// TimeRuler.js
import React, { useRef, useEffect } from "react";

const TimeRuler = ({ start = 0, end = 10, height = 20, scale }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const pixelRatio = window.devicePixelRatio || 1;
    const width = (end - start) * scale * pixelRatio;
    canvas.width = width;
    canvas.height = height * pixelRatio;
    context.scale(pixelRatio, pixelRatio);

    drawRuler(context, (end - start) * scale, height, start, end, scale);
  }, [start, end, height, scale]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: `${(end - start) * scale}px`, height: `${height}px` }}
    />
  );
};

function drawRuler(context, width, height, start, end, scale) {
  const totalSeconds = end - start;
  const tickSpacing = scale; // Fixed at 100 pixels per second
  const majorTickHeight = height * 0.5;
  const minorTickHeight = height * 0.3;

  context.clearRect(0, 0, width, height);

  context.fillStyle = "#E2E8F0";
  context.strokeStyle = "#E2E8F0";
  context.lineWidth = 1;
  context.font = "8px Inter, sans-serif";
  context.textBaseline = "bottom";

  for (let i = Math.floor(start); i <= Math.ceil(end); i++) {
    const x = (i - start) * tickSpacing;

    // Draw major tick
    context.beginPath();
    context.moveTo(x, height);
    context.lineTo(x, height - majorTickHeight);
    context.stroke();

    // Label position adjustments
    let labelX = x;
    if (i === Math.floor(start)) labelX += 5;
    if (i === Math.ceil(end)) labelX -= 5;

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
