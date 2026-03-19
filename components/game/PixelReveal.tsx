'use client';
import { useEffect, useRef } from 'react';

interface PixelRevealProps {
  solution: number[][];
  color?: string;
  size?: number; // canvas px per cell
}

// Reveals filled cells one by one in random order over ~1.5s
export function PixelReveal({ solution, color = '#4ecdc4', size = 200 }: PixelRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const grid = solution.length;
    const cellPx = Math.floor(size / grid);
    const totalPx = cellPx * grid;
    canvas.width = totalPx;
    canvas.height = totalPx;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Collect filled cells
    const cells: [number, number][] = [];
    for (let r = 0; r < grid; r++) {
      for (let c = 0; c < grid; c++) {
        if (solution[r][c] === 1) cells.push([r, c]);
      }
    }

    // Fisher-Yates shuffle
    for (let i = cells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cells[i], cells[j]] = [cells[j], cells[i]];
    }

    const TOTAL_FRAMES = 30;
    const FRAME_MS = 50;
    const batchSize = Math.ceil(cells.length / TOTAL_FRAMES);
    let revealed = 0;

    // Draw background
    ctx.fillStyle = '#0d1528';
    ctx.fillRect(0, 0, totalPx, totalPx);

    // Draw faint grid
    ctx.strokeStyle = 'rgba(45, 63, 94, 0.5)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= grid; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellPx, 0);
      ctx.lineTo(i * cellPx, totalPx);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellPx);
      ctx.lineTo(totalPx, i * cellPx);
      ctx.stroke();
    }

    ctx.fillStyle = color;

    const timer = setInterval(() => {
      const end = Math.min(revealed + batchSize, cells.length);
      for (let i = revealed; i < end; i++) {
        const [r, c] = cells[i];
        ctx.fillRect(c * cellPx + 1, r * cellPx + 1, cellPx - 1, cellPx - 1);
      }
      revealed = end;
      if (revealed >= cells.length) clearInterval(timer);
    }, FRAME_MS);

    return () => clearInterval(timer);
  }, [solution, color, size]);

  const grid = solution.length;
  const cellPx = Math.floor(size / grid);
  const totalPx = cellPx * grid;

  return (
    <canvas
      ref={canvasRef}
      width={totalPx}
      height={totalPx}
      style={{ borderRadius: 4, display: 'block' }}
    />
  );
}
