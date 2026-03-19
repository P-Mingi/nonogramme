'use client';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { CellState, Tool, Puzzle } from '@/types/puzzle';
import { calculateScore } from '@/lib/utils/xp';
import { checkSolution, getCompletedRows, getCompletedCols } from '@/lib/game/validator';
import { Toolbar } from './Toolbar';
import { GameHeader } from './GameHeader';

interface NonogramBoardProps {
  puzzle: Puzzle;
  onComplete: (score: number, time: number, errors: number, hintsUsed: number) => void;
}

export function NonogramBoard({ puzzle, onComplete }: NonogramBoardProps) {
  const n = puzzle.size;

  const [grid, setGrid] = useState<CellState[][]>(
    () => Array.from({ length: n }, () => Array(n).fill(0) as CellState[])
  );
  const [tool, setTool] = useState<Tool>('fill');
  const [seconds, setSeconds] = useState(0);
  const [errors, setErrors] = useState(0);
  const [hints, setHints] = useState(3);
  const [isComplete, setIsComplete] = useState(false);
  const [errorCells, setErrorCells] = useState<Set<string>>(new Set());

  // Refs for stale-closure-safe values inside setGrid updater
  const secondsRef = useRef(0);
  const errorsRef = useRef(0);
  const hintsUsedRef = useRef(0);
  const isDragging = useRef(false);
  const dragValue = useRef<CellState>(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const isCompleteRef = useRef(false);

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      secondsRef.current += 1;
      setSeconds(s => s + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Global mouseup to stop dragging even if pointer leaves grid
  useEffect(() => {
    const handleMouseUp = () => { isDragging.current = false; };
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  // Touch move (non-passive so we can preventDefault to block scroll)
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement | null;
      if (target?.dataset.cell) {
        const [r, c] = target.dataset.cell.split(',').map(Number);
        applyCell(r, c);
      }
    };

    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => el.removeEventListener('touchmove', handleTouchMove);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzle]);

  const applyCell = useCallback((r: number, c: number) => {
    if (isCompleteRef.current) return;

    // Error detection: filling a cell that should be empty
    if (dragValue.current === 1 && puzzle.solution[r][c] === 0) {
      errorsRef.current += 1;
      setErrors(e => e + 1);
      const key = `${r},${c}`;
      setErrorCells(prev => new Set(prev).add(key));
      setTimeout(() => setErrorCells(prev => { const s = new Set(prev); s.delete(key); return s; }), 400);
      return;
    }

    setGrid(prev => {
      if (prev[r][c] === dragValue.current) return prev;
      const next = prev.map(row => [...row]) as CellState[][];
      next[r][c] = dragValue.current;

      if (checkSolution(next as number[][], puzzle.solution)) {
        isCompleteRef.current = true;
        if (timerRef.current) clearInterval(timerRef.current);
        setIsComplete(true);
        const score = calculateScore(
          secondsRef.current,
          errorsRef.current,
          hintsUsedRef.current,
          n,
          puzzle.difficulty
        );
        // Defer to avoid state update during render
        setTimeout(() => onComplete(score, secondsRef.current, errorsRef.current, hintsUsedRef.current), 0);
      }

      return next;
    });
  }, [puzzle, n, onComplete]);

  const startDrag = useCallback((r: number, c: number) => {
    if (isCompleteRef.current) return;
    isDragging.current = true;
    const cur = grid[r][c];
    if (tool === 'fill') {
      dragValue.current = cur === 1 ? 0 : 1;
    } else if (tool === 'mark') {
      dragValue.current = cur === 2 ? 0 : 2;
    } else {
      dragValue.current = 0;
    }
    applyCell(r, c);
  }, [grid, tool, applyCell]);

  const giveHint = useCallback(() => {
    if (hints <= 0 || isCompleteRef.current) return;
    setHints(h => h - 1);
    hintsUsedRef.current += 1;

    // Find a random unfilled solution cell
    const candidates: [number, number][] = [];
    puzzle.solution.forEach((row, r) => row.forEach((cell, c) => {
      if (cell === 1 && grid[r][c] !== 1) candidates.push([r, c]);
    }));
    if (!candidates.length) return;

    const [r, c] = candidates[Math.floor(Math.random() * candidates.length)];
    dragValue.current = 1;
    applyCell(r, c);
  }, [hints, puzzle, grid, applyCell]);

  // Derived state
  const completedRows = getCompletedRows(grid as number[][], puzzle.clues.rows);
  const completedCols = getCompletedCols(grid as number[][], puzzle.clues.cols);

  const totalSolution = puzzle.solution.flat().filter(v => v === 1).length;
  const totalFilled = grid.flat().filter((v, i) => v === 1 && puzzle.solution.flat()[i] === 1).length;
  const progress = totalSolution > 0 ? Math.round((totalFilled / totalSolution) * 100) : 0;

  // Sizing
  const cellSize = n <= 5 ? 52 : n <= 10 ? 36 : 28;
  const clueSize = n <= 5 ? 44 : 64;
  const fontSize = n <= 5 ? 13 : 11;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full" style={{ maxWidth: clueSize + n * cellSize + 16 }}>
        <GameHeader
          puzzleName={puzzle.name}
          seconds={seconds}
          progress={progress}
          errors={errors}
        />
      </div>

      {/* Grid */}
      <div
        ref={gridRef}
        style={{
          display: 'grid',
          gridTemplateColumns: `${clueSize}px repeat(${n}, ${cellSize}px)`,
          gridTemplateRows: `${clueSize}px repeat(${n}, ${cellSize}px)`,
          userSelect: 'none',
          touchAction: 'none',
          gap: 0,
        }}
        onMouseLeave={() => { isDragging.current = false; }}
      >
        {/* Corner */}
        <div />

        {/* Column clues */}
        {Array.from({ length: n }, (_, c) => (
          <div
            key={`col-clue-${c}`}
            className="flex flex-col items-center justify-end pb-1 gap-0.5"
            style={{
              fontSize,
              color: completedCols[c] ? '#2d3f5e' : '#8892a4',
              fontFamily: 'monospace',
              transition: 'color 0.3s',
            }}
          >
            {puzzle.clues.cols[c].map((num, i) => (
              <span key={i}>{num}</span>
            ))}
          </div>
        ))}

        {/* Rows: clue + cells */}
        {Array.from({ length: n }, (_, r) => (
          <React.Fragment key={r}>
            {/* Row clue */}
            <div
              key={`row-clue-${r}`}
              className="flex items-center justify-end pr-2 gap-1"
              style={{
                fontSize,
                color: completedRows[r] ? '#2d3f5e' : '#8892a4',
                fontFamily: 'monospace',
                transition: 'color 0.3s',
              }}
            >
              {puzzle.clues.rows[r].map((num, i) => (
                <span key={i}>{num}</span>
              ))}
            </div>

            {/* Cells */}
            {Array.from({ length: n }, (_, c) => {
              const state = grid[r][c];
              const isError = errorCells.has(`${r},${c}`);
              return (
                <div
                  key={`cell-${r}-${c}`}
                  data-cell={`${r},${c}`}
                  onMouseDown={() => startDrag(r, c)}
                  onMouseEnter={() => { if (isDragging.current) applyCell(r, c); }}
                  onTouchStart={() => startDrag(r, c)}
                  style={{
                    cursor: isComplete ? 'default' : 'crosshair',
                    backgroundColor:
                      isError ? '#ff4444' :
                      state === 1 ? puzzle.colors.filled :
                      state === 2 ? '#1a2540' :
                      '#0d1528',
                    border: `1px solid ${isError ? '#ff4444' : '#2d3f5e'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: cellSize * 0.4,
                    transition: 'background-color 0.05s',
                    boxSizing: 'border-box',
                  }}
                >
                  {state === 2 && (
                    <span style={{ color: '#4ecdc4', lineHeight: 1 }}>✕</span>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {!isComplete && (
        <Toolbar
          tool={tool}
          onToolChange={setTool}
          hints={hints}
          onHint={giveHint}
        />
      )}

      {isComplete && (
        <p className="text-sm text-center" style={{ color: '#4ecdc4' }}>
          Puzzle terminé !
        </p>
      )}
    </div>
  );
}
