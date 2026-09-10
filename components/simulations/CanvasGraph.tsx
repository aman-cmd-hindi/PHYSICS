"use client";

import React, { useRef, useEffect } from "react";

interface CanvasGraphProps {
  dataPoints: { x: number; y: number }[];
  xLabel: string;
  yLabel: string;
  width?: number;
  height?: number;
}

export function CanvasGraph({
  dataPoints,
  xLabel,
  yLabel,
  width = 400,
  height = 180,
}: CanvasGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const padding = 35;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    // Draw Axes
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Labels
    ctx.font = "10px sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText(yLabel, padding - 25, padding - 10);
    ctx.fillText(xLabel, width - padding - 20, height - 10);

    if (dataPoints.length < 2) return;

    const maxX = Math.max(...dataPoints.map((p) => p.x), 1);
    const maxY = Math.max(...dataPoints.map((p) => p.y), 1);

    // Plot line graph
    ctx.strokeStyle = "#0ea5e9";
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    dataPoints.forEach((pt, idx) => {
      const px = padding + (pt.x / maxX) * graphWidth;
      const py = height - padding - (pt.y / maxY) * graphHeight;

      if (idx === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });

    ctx.stroke();
  }, [dataPoints, xLabel, yLabel, width, height]);

  return (
    <div className="bg-card border border-border rounded-xl p-2 shadow-inner inline-block">
      <canvas ref={canvasRef} width={width} height={height} className="w-full h-auto block" />
    </div>
  );
}
