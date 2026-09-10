export function isReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function drawTorqueDiagram(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  r: number,
  F: number,
  thetaDeg: number
) {
  ctx.clearRect(0, 0, width, height);

  const pivotX = width * 0.25;
  const pivotY = height * 0.5;

  // Draw Pivot / Axis of rotation
  ctx.fillStyle = "#6366f1";
  ctx.beginPath();
  ctx.arc(pivotX, pivotY, 10, 0, Math.PI * 2);
  ctx.fill();

  // Position vector r arm length (scaled for canvas)
  const armLengthPx = Math.min(250, r * 45);
  const armEndX = pivotX + armLengthPx;
  const armEndY = pivotY;

  // Draw Arm (Lever)
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(pivotX, pivotY);
  ctx.lineTo(armEndX, armEndY);
  ctx.stroke();

  // Force vector arrow F
  const forceMagPx = Math.min(100, F * 3);
  const thetaRad = (thetaDeg * Math.PI) / 180;
  const forceEndX = armEndX + forceMagPx * Math.cos(-thetaRad);
  const forceEndY = armEndY + forceMagPx * Math.sin(-thetaRad);

  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(armEndX, armEndY);
  ctx.lineTo(forceEndX, forceEndY);
  ctx.stroke();

  // Force Arrowhead
  const headLen = 10;
  const angle = Math.atan2(forceEndY - armEndY, forceEndX - armEndX);
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.moveTo(forceEndX, forceEndY);
  ctx.lineTo(
    forceEndX - headLen * Math.cos(angle - Math.PI / 6),
    forceEndY - headLen * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    forceEndX - headLen * Math.cos(angle + Math.PI / 6),
    forceEndY - headLen * Math.sin(angle + Math.PI / 6)
  );
  ctx.fill();

  // Labels
  ctx.font = "bold 12px sans-serif";
  ctx.fillStyle = "#38bdf8";
  ctx.fillText(`r = ${r} m`, pivotX + armLengthPx / 2 - 15, pivotY + 20);

  ctx.fillStyle = "#ef4444";
  ctx.fillText(`F = ${F} N (θ = ${thetaDeg}°)`, forceEndX + 5, forceEndY);
}

export function drawCentripetalDiagram(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  m: number,
  v: number,
  r: number
) {
  ctx.clearRect(0, 0, width, height);

  const centerX = width / 2;
  const centerY = height / 2;
  const radiusPx = Math.min(120, r * 25);

  // Circular Orbit Path
  ctx.strokeStyle = "#94a3b8";
  ctx.setLineDash([4, 4]);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radiusPx, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Mass object on orbit
  const angle = Math.PI / 4;
  const objX = centerX + radiusPx * Math.cos(angle);
  const objY = centerY + radiusPx * Math.sin(angle);

  // Inward Radial Centripetal Force Vector
  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(objX, objY);
  ctx.lineTo(centerX, centerY);
  ctx.stroke();

  // Mass Object
  ctx.fillStyle = "#3b82f6";
  ctx.beginPath();
  ctx.arc(objX, objY, Math.min(18, 6 + m * 2), 0, Math.PI * 2);
  ctx.fill();

  ctx.font = "bold 12px sans-serif";
  ctx.fillStyle = "#10b981";
  ctx.fillText(`F_c = Fc`, centerX - 20, centerY - 10);
}
