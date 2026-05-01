"use client";

/**
 * GridBackground.tsx
 *
 * Animated dark-grid background with traveling light trails.
 * Drop into a Next.js (App Router) page as a fixed full-viewport
 * background:
 *
 *   import GridBackground from "@/components/GridBackground";
 *
 *   export default function Home() {
 *     return (
 *       <main className="relative min-h-screen bg-[#0a0a0a] text-white">
 *         <GridBackground />
 *         <section className="relative z-10"> ...your hero... </section>
 *       </main>
 *     );
 *   }
 *
 * The component renders a <canvas> absolutely positioned to fill its
 * parent (so make sure the parent is `relative`). It is `pointer-events: none`
 * so it never interferes with content above it.
 */

import { useEffect, useRef } from "react";

type ColorMode =
  | "cyan"
  | "violet"
  | "magenta"
  | "green"
  | "amber"
  | "white"
  | "multi";

export interface GridBackgroundProps {
  /** Grid cell size in px. Default 80. */
  cellSize?: number;
  /** Number of simultaneous light trails. Default 10. */
  trailCount?: number;
  /** Length of each trail in points. Default 90. */
  trailLength?: number;
  /** Color palette for the lights. Default "cyan". */
  colorMode?: ColorMode;
  /** Bloom intensity multiplier. 0 = no glow, 1 = default, 2 = max. */
  bloom?: number;
  /** Base opacity of the static grid lines. Default 0.12. */
  gridOpacity?: number;
  /** Probability a trail turns at each intersection. 0–1. Default 0.45. */
  turnChance?: number;
  /** Whether the grid drifts subtly with the mouse. Default true. */
  parallax?: boolean;
  /** Optional className passed to the canvas. */
  className?: string;
}

const PALETTES: Record<ColorMode, string[]> = {
  cyan: ["#00e5ff", "#22d3ee", "#67e8f9"],
  violet: ["#a78bfa", "#8b5cf6", "#c4b5fd"],
  magenta: ["#f472b6", "#ec4899", "#f0abfc"],
  green: ["#4ade80", "#22c55e", "#86efac"],
  amber: ["#fbbf24", "#f59e0b", "#fcd34d"],
  white: ["#ffffff", "#e5e7eb", "#cbd5e1"],
  multi: ["#00e5ff", "#a78bfa", "#f472b6", "#4ade80", "#fbbf24"],
};

type TrailPoint = { x: number; y: number; gap?: false } | { gap: true; x?: number; y?: number };

interface Trail {
  gx: number;
  gy: number;
  dir: 0 | 1 | 2 | 3; // 0=right, 1=down, 2=left, 3=up
  t: number;
  speed: number;
  color: string;
  history: TrailPoint[];
  maxHistory: number;
  phase: number;
}

const dirVec = (d: number): [number, number] => {
  if (d === 0) return [1, 0];
  if (d === 1) return [0, 1];
  if (d === 2) return [-1, 0];
  return [0, -1];
};

export default function GridBackground({
  cellSize = 80,
  trailCount = 10,
  trailLength = 180,
  colorMode = "cyan",
  bloom = 1,
  gridOpacity = 0.12,
  turnChance = 0.45,
  parallax = false,
  className,
}: GridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let W = 0;
    let H = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const cell = cellSize;

    const resize = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.floor(W * DPR);
      canvas.height = Math.floor(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const colors = PALETTES[colorMode];
    const cols = () => Math.ceil(W / cell) + 2;
    const rows = () => Math.ceil(H / cell) + 2;

    const makeTrail = (i: number): Trail => ({
      gx: Math.floor(Math.random() * cols()),
      gy: Math.floor(Math.random() * rows()),
      dir: Math.floor(Math.random() * 4) as 0 | 1 | 2 | 3,
      t: Math.random(),
      speed: 0.35 + Math.random() * 0.35,
      color: colors[i % colors.length],
      history: [],
      maxHistory: trailLength,
      phase: Math.random() * Math.PI * 2,
    });

    const trails: Trail[] = Array.from({ length: trailCount }, (_, i) =>
      makeTrail(i),
    );

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - rect.left) / rect.width - 0.5;
      mouse.ty = (e.clientY - rect.top) / rect.height - 0.5;
    };
    if (parallax) window.addEventListener("mousemove", onMove);

    const drawGrid = (offX: number, offY: number) => {
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(120, 160, 220, ${gridOpacity})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = "rgba(80, 130, 200, 0.35)";
      const startX = Math.floor(-offX / cell) * cell + offX;
      const startY = Math.floor(-offY / cell) * cell + offY;
      ctx.beginPath();
      for (let x = startX; x <= W + cell; x += cell) {
        const xx = Math.round(x) + 0.5;
        ctx.moveTo(xx, 0);
        ctx.lineTo(xx, H);
      }
      for (let y = startY; y <= H + cell; y += cell) {
        const yy = Math.round(y) + 0.5;
        ctx.moveTo(0, yy);
        ctx.lineTo(W, yy);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    let last = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      const p = parallax ? 18 : 0;
      const offX = mouse.x * p;
      const offY = mouse.y * p;

      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, W, H);

      const grad = ctx.createRadialGradient(
        W / 2,
        H / 2,
        Math.min(W, H) * 0.2,
        W / 2,
        H / 2,
        Math.max(W, H) * 0.75,
      );
      grad.addColorStop(0, "rgba(20, 22, 32, 0)");
      grad.addColorStop(1, "rgba(0,0,0,0.85)");

      drawGrid(offX, offY);

      for (const tr of trails) {
        tr.t += tr.speed * dt;
        let wrapped = false;
        while (tr.t >= 1) {
          tr.t -= 1;
          const [dx, dy] = dirVec(tr.dir);
          tr.gx += dx;
          tr.gy += dy;
          const C = cols();
          const R = rows();
          if (tr.gx < -1) { tr.gx = C; wrapped = true; }
          if (tr.gx > C + 1) { tr.gx = -1; wrapped = true; }
          if (tr.gy < -1) { tr.gy = R; wrapped = true; }
          if (tr.gy > R + 1) { tr.gy = -1; wrapped = true; }
          if (Math.random() < turnChance) {
            const perp: (0 | 1 | 2 | 3)[] =
              tr.dir % 2 === 0 ? [1, 3] : [0, 2];
            tr.dir = perp[Math.random() < 0.5 ? 0 : 1];
          }
        }
        const [dx, dy] = dirVec(tr.dir);
        const px = (tr.gx + dx * tr.t) * cell + offX;
        const py = (tr.gy + dy * tr.t) * cell + offY;
        if (wrapped) tr.history.push({ gap: true });
        tr.history.push({ x: px, y: py });
        if (tr.history.length > tr.maxHistory) tr.history.shift();
        tr.phase += dt * 2;
      }

      ctx.globalCompositeOperation = "lighter";
      // Slim soft halo
      for (const tr of trails) {
        const h = tr.history;
        if (h.length < 2) continue;
        for (let i = 1; i < h.length; i++) {
          const a0 = h[i - 1], b0 = h[i];
          if (a0.gap || b0.gap) continue;
          const t = i / h.length;
          const a = Math.pow(t, 2.4);
          ctx.strokeStyle = tr.color;
          ctx.globalAlpha = a * 0.10 * bloom;
          ctx.lineWidth = 4 * a + 0.8;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(a0.x as number, a0.y as number);
          ctx.lineTo(b0.x as number, b0.y as number);
          ctx.stroke();
        }
      }
      // Thin bright core
      for (const tr of trails) {
        const h = tr.history;
        if (h.length < 2) continue;
        for (let i = 1; i < h.length; i++) {
          const a0 = h[i - 1], b0 = h[i];
          if (a0.gap || b0.gap) continue;
          const t = i / h.length;
          const a = Math.pow(t, 2.6);
          ctx.strokeStyle = tr.color;
          ctx.globalAlpha = a * 0.9;
          ctx.lineWidth = 0.9;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(a0.x as number, a0.y as number);
          ctx.lineTo(b0.x as number, b0.y as number);
          ctx.stroke();
        }
        const head = h[h.length - 1];
        if (head && !head.gap) {
          const pulse = 0.85 + 0.15 * Math.sin(tr.phase);
          ctx.globalAlpha = 1;
          ctx.fillStyle = tr.color;
          ctx.shadowBlur = 10 * bloom;
          ctx.shadowColor = tr.color;
          ctx.beginPath();
          ctx.arc(head.x as number, head.y as number, 1.4 * pulse, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (parallax) window.removeEventListener("mousemove", onMove);
    };
  }, [
    cellSize,
    trailCount,
    trailLength,
    colorMode,
    bloom,
    gridOpacity,
    turnChance,
    parallax,
  ]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        pointerEvents: "none",
      }}
    />
  );
}
