'use client';
import { useCallback, useState } from 'react';
import type { Puzzle } from '@/types/puzzle';

interface ShareButtonProps {
  puzzle: Puzzle;
  levelNumber?: number;
  timeSeconds: number;
  score: number;
  errors: number;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function ShareButton({ puzzle, levelNumber, timeSeconds, score, errors }: ShareButtonProps) {
  const [status, setStatus] = useState<'idle' | 'working' | 'done'>('idle');

  const generateImage = useCallback((): Promise<Blob> => {
    return new Promise(resolve => {
      const n = puzzle.size;
      const cellSize = 24;
      const padding = 24;
      const headerH = 80;
      const footerH = 48;
      const gridPx = n * cellSize;
      const W = gridPx + padding * 2;
      const H = gridPx + padding * 2 + headerH + footerH;

      const canvas = document.createElement('canvas');
      canvas.width = W * 2;
      canvas.height = H * 2;
      const ctx = canvas.getContext('2d')!;
      ctx.scale(2, 2);

      // Background
      ctx.fillStyle = '#070d17';
      ctx.fillRect(0, 0, W, H);

      // Level / difficulty label
      ctx.fillStyle = '#4ecdc4';
      ctx.font = 'bold 13px -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(levelNumber ? `Niveau ${levelNumber}` : puzzle.difficulty, padding, 28);

      // Puzzle name
      ctx.fillStyle = '#e2f0ff';
      ctx.font = 'bold 22px -apple-system, sans-serif';
      ctx.fillText(puzzle.name, padding, 52);

      // Stats row
      const mm = String(Math.floor(timeSeconds / 60)).padStart(2, '0');
      const ss = String(timeSeconds % 60).padStart(2, '0');
      const errText = errors === 0 ? '✨ Sans erreur' : `${errors} erreur${errors > 1 ? 's' : ''}`;
      ctx.fillStyle = '#7aa8cc';
      ctx.font = '12px -apple-system, sans-serif';
      ctx.fillText(`⏱ ${mm}:${ss}   🏆 ${score.toLocaleString('fr')} pts   ${errText}`, padding, 72);

      // Pixel grid
      const gridX = padding;
      const gridY = padding + headerH;

      for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
          const x = gridX + c * cellSize;
          const y = gridY + r * cellSize;
          const filled = puzzle.solution[r][c] === 1;

          ctx.fillStyle = filled ? puzzle.colors.filled : '#0f1e30';
          roundRect(ctx, x + 1, y + 1, cellSize - 2, cellSize - 2, 3);
          ctx.fill();

          if (filled) {
            ctx.fillStyle = 'rgba(255,255,255,0.1)';
            roundRect(ctx, x + 1, y + 1, cellSize - 2, (cellSize - 2) / 2, 3);
            ctx.fill();
          }
        }
      }

      // Branding
      ctx.fillStyle = '#4ecdc4';
      ctx.font = 'bold 14px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('nonogramme.com', W / 2, gridY + gridPx + 32);

      canvas.toBlob(blob => resolve(blob!), 'image/png');
    });
  }, [puzzle, levelNumber, timeSeconds, score, errors]);

  const handleShare = async () => {
    setStatus('working');
    try {
      const blob = await generateImage();
      const file = new File([blob], 'nonogramme.png', { type: 'image/png' });
      const mm = String(Math.floor(timeSeconds / 60)).padStart(2, '0');
      const ss = String(timeSeconds % 60).padStart(2, '0');
      const text = `🧩 J'ai révélé "${puzzle.name}" sur Nonogramme.com !${levelNumber ? `\nNiveau ${levelNumber} • ` : '\n'}⏱ ${mm}:${ss} • 🏆 ${score.toLocaleString('fr')} pts\nhttps://nonogramme.com`;

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text });
      } else if (navigator.share) {
        await navigator.share({ text, url: 'https://nonogramme.com' });
      } else {
        await navigator.clipboard.writeText(text);
      }
      setStatus('done');
      setTimeout(() => setStatus('idle'), 3000);
    } catch {
      setStatus('idle');
    }
  };

  return (
    <button
      onClick={handleShare}
      style={{
        width: '100%',
        padding: '13px 0',
        borderRadius: '14px',
        border: '1.5px solid rgba(255,217,61,0.3)',
        background: 'rgba(255,217,61,0.1)',
        color: '#ffd93d',
        fontSize: '15px',
        fontWeight: 700,
        cursor: 'pointer',
        marginBottom: '4px',
      }}
    >
      {status === 'idle' && '📤 Partager mon résultat'}
      {status === 'working' && '⏳ Génération...'}
      {status === 'done' && '✅ Copié !'}
    </button>
  );
}
