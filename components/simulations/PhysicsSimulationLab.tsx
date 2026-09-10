"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Sliders, Maximize2, Sparkles, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type SimulationType = "pendulum" | "projectile" | "wave" | "rotational";

interface PhysicsSimulationProps {
  initialType?: SimulationType;
}

export function PhysicsSimulationLab({ initialType = "rotational" }: PhysicsSimulationProps) {
  const [simType, setSimType] = useState<SimulationType>(initialType);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [param1, setParam1] = useState<number>(2); // e.g. mass / length / frequency
  const [param2, setParam2] = useState<number>(5); // e.g. velocity / force / amplitude

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const stateRef = useRef<{ angle: number; time: number; x: number; y: number }>({
    angle: 0,
    time: 0,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = ((now - lastTime) / 1000) * speedMultiplier;
      lastTime = now;

      if (isRunning) {
        stateRef.current.time += dt;
        stateRef.current.angle += dt * param2 * 0.8;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (simType === "rotational") {
        // Rotational Dynamics Simulation (Rigid Body / Disc Rotation & Moment of Inertia)
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const radius = Math.min(120, 40 + param1 * 15);

        // Rotating disc
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(stateRef.current.angle);

        // Disc body with radial spokes
        ctx.fillStyle = "rgba(99, 102, 241, 0.15)";
        ctx.strokeStyle = "#6366f1";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Radial markers to show spin
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          const a = (i * Math.PI) / 2;
          ctx.lineTo(radius * Math.cos(a), radius * Math.sin(a));
          ctx.strokeStyle = "rgba(99, 102, 241, 0.6)";
          ctx.stroke();
        }

        // Central pivot point
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Tangential Velocity & Centripetal Vectors
        const objX = cx + radius * Math.cos(stateRef.current.angle);
        const objY = cy + radius * Math.sin(stateRef.current.angle);

        // Tangential velocity vector
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(objX, objY);
        ctx.lineTo(
          objX - 35 * Math.sin(stateRef.current.angle),
          objY + 35 * Math.cos(stateRef.current.angle)
        );
        ctx.stroke();

        // Centripetal force vector (inward)
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(objX, objY);
        ctx.lineTo(cx, cy);
        ctx.stroke();

        // Perimeter Particle
        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.arc(objX, objY, 7, 0, Math.PI * 2);
        ctx.fill();

        // Metric overlays
        ctx.font = "bold 12px sans-serif";
        ctx.fillStyle = "#6366f1";
        ctx.fillText(`Angular Velocity (ω): ${(param2 * 0.8).toFixed(2)} rad/s`, 20, 30);
        ctx.fillStyle = "#10b981";
        ctx.fillText(`Tangential Speed (v = rω): ${(radius * 0.01 * param2 * 0.8).toFixed(2)} m/s`, 20, 50);
        ctx.fillStyle = "#f59e0b";
        ctx.fillText(`Centripetal Accel (a_c = v²/r): ${(Math.pow(param2 * 0.8, 2) * (radius * 0.01)).toFixed(2)} m/s²`, 20, 70);
      } else if (simType === "pendulum") {
        // Simple Pendulum (SHM Chapter 5)
        const originX = canvas.width / 2;
        const originY = 40;
        const length = Math.min(220, 80 + param1 * 25);
        const theta0 = (param2 * Math.PI) / 40; // initial angle
        const omega = Math.sqrt(9.8 / (length / 50));
        const currentTheta = theta0 * Math.cos(omega * stateRef.current.time);

        const bobX = originX + length * Math.sin(currentTheta);
        const bobY = originY + length * Math.cos(currentTheta);

        // Ceiling
        ctx.strokeStyle = "#64748b";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(originX - 50, originY);
        ctx.lineTo(originX + 50, originY);
        ctx.stroke();

        // String
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(bobX, bobY);
        ctx.stroke();

        // Bob
        ctx.fillStyle = "#6366f1";
        ctx.beginPath();
        ctx.arc(bobX, bobY, 14, 0, Math.PI * 2);
        ctx.fill();

        // Restoring Force Vector
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bobX, bobY);
        ctx.lineTo(bobX - 30 * Math.sin(currentTheta), bobY);
        ctx.stroke();

        // Metric overlays
        const periodT = (2 * Math.PI) / omega;
        ctx.font = "bold 12px sans-serif";
        ctx.fillStyle = "#6366f1";
        ctx.fillText(`Time Period T = 2π√(L/g): ${periodT.toFixed(2)} s`, 20, 30);
        ctx.fillStyle = "#ef4444";
        ctx.fillText(`Displacement Angle θ: ${(currentTheta * (180 / Math.PI)).toFixed(1)}°`, 20, 50);
      } else if (simType === "wave") {
        // Superposition of Waves (Chapter 6)
        const cy = canvas.height / 2;
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 3;
        ctx.beginPath();

        const freq = param1;
        const amp = param2 * 8;

        for (let x = 0; x < canvas.width; x += 3) {
          const k = 0.02;
          const y = cy + amp * Math.sin(k * x - stateRef.current.time * freq * 3);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Equilibrium line
        ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(0, cy);
        ctx.lineTo(canvas.width, cy);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.font = "bold 12px sans-serif";
        ctx.fillStyle = "#38bdf8";
        ctx.fillText(`Wave Equation: y = A sin(kx - ωt)`, 20, 30);
        ctx.fillText(`Frequency: ${freq} Hz | Amplitude: ${param2} units`, 20, 50);
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [simType, isRunning, speedMultiplier, param1, param2]);

  return (
    <Card className="border-border bg-card shadow-lg rounded-2xl overflow-hidden">
      <CardHeader className="bg-card border-b border-border pb-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="indigo" className="gap-1 px-2.5 py-0.5">
            <Sparkles className="h-3 w-3 text-indigo-400" />
            <span>Interactive 2D Simulation Engine</span>
          </Badge>
          <Badge variant="outline" className="hidden sm:inline">60 FPS Canvas</Badge>
        </div>

        {/* Sim Type Switcher */}
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant={simType === "rotational" ? "default" : "outline"}
            onClick={() => setSimType("rotational")}
            className="rounded-xl text-xs h-8"
          >
            Rotational Dynamics
          </Button>
          <Button
            size="sm"
            variant={simType === "pendulum" ? "default" : "outline"}
            onClick={() => setSimType("pendulum")}
            className="rounded-xl text-xs h-8"
          >
            Oscillations (SHM)
          </Button>
          <Button
            size="sm"
            variant={simType === "wave" ? "default" : "outline"}
            onClick={() => setSimType("wave")}
            className="rounded-xl text-xs h-8"
          >
            Wave Motion
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        {/* Canvas Display */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner flex justify-center">
          <canvas
            ref={canvasRef}
            width={720}
            height={320}
            className="w-full max-w-full h-auto block"
          />
        </div>

        {/* Simulation Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-secondary/30 border border-border">
          <div className="flex items-center gap-2">
            <Button
              variant={isRunning ? "secondary" : "default"}
              size="sm"
              onClick={() => setIsRunning(!isRunning)}
              className="gap-1.5 rounded-xl"
            >
              {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{isRunning ? "Pause" : "Play"}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                stateRef.current = { angle: 0, time: 0, x: 0, y: 0 };
              }}
              className="gap-1.5 rounded-xl"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </Button>

            <div className="flex items-center gap-1 ml-2">
              <span className="text-xs text-muted-foreground font-semibold">Speed:</span>
              {[0.5, 1, 2].map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={speedMultiplier === s ? "default" : "ghost"}
                  onClick={() => setSpeedMultiplier(s)}
                  className="h-7 px-2 text-xs rounded-lg"
                >
                  {s}x
                </Button>
              ))}
            </div>
          </div>

          {/* Dynamic Sliders */}
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                <span>{simType === "rotational" ? "Radius (r)" : simType === "pendulum" ? "Length (L)" : "Frequency (f)"}</span>
                <span className="text-primary font-mono">{param1}</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={0.5}
                value={param1}
                onChange={(e) => setParam1(parseFloat(e.target.value))}
                className="w-full accent-primary h-1.5 bg-secondary rounded-lg cursor-pointer"
              />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                <span>{simType === "rotational" ? "Angular Velocity (ω)" : simType === "pendulum" ? "Amplitude (θ)" : "Amplitude (A)"}</span>
                <span className="text-primary font-mono">{param2}</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={param2}
                onChange={(e) => setParam2(parseFloat(e.target.value))}
                className="w-full accent-primary h-1.5 bg-secondary rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
