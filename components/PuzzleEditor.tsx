'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = [
  { value: 'animaux', label: '🐾 Animaux' },
  { value: 'nature', label: '🌿 Nature' },
  { value: 'objets', label: '🔧 Objets' },
  { value: 'personnages', label: '👤 Personnages' },
  { value: 'nourriture', label: '🍕 Nourriture' },
  { value: 'symboles', label: '⭐ Symboles' },
];

const COLORS: Record<string, string> = {
  animaux: '#4ecdc4',
  nature: '#4ade80',
  objets: '#ffd93d',
  personnages: '#c084fc',
  nourriture: '#ff6b6b',
  symboles: '#45b7d1',
};

interface Props {
  userId: string;
  profile: { username: string; level: number; xp: number } | null;
}

type ValidationState = 'idle' | 'checking' | 'valid' | 'invalid';

export function PuzzleEditor({ userId, profile }: Props) {
  const router = useRouter();
  const [size, setSize] = useState<10 | 15>(10);
  const [grid, setGrid] = useState<number[][]>(() =>
    Array.from({ length: 10 }, () => Array(10).fill(0))
  );
  const [tool, setTool] = useState<'fill' | 'erase'>('fill');
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState(1);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('animaux');

  const [validation, setValidation] = useState<ValidationState>('idle');
  const [validationMessage, setValidationMessage] = useState('');
  const [rowClues, setRowClues] = useState<number[][]>([]);
  const [colClues, setColClues] = useState<number[][]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const workerRef = useRef<Worker | null>(null);
  const validationTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Init Web Worker
  useEffect(() => {
    workerRef.current = new Worker('/solver.worker.js');
    workerRef.current.onmessage = (e) => {
      const { valid, reason, rowClues: rc, colClues: cc } = e.data;
      if (valid) {
        setValidation('valid');
        setValidationMessage('✅ Puzzle valide — solution unique confirmée !');
        setRowClues(rc);
        setColClues(cc);
      } else {
        setValidation('invalid');
        setValidationMessage(`❌ ${reason}`);
      }
    };
    return () => workerRef.current?.terminate();
  }, []);

  // Resize grid when size changes
  const handleSizeChange = (newSize: 10 | 15) => {
    setSize(newSize);
    setGrid(prev =>
      Array.from({ length: newSize }, (_, r) =>
        Array.from({ length: newSize }, (_, c) => prev[r]?.[c] ?? 0)
      )
    );
    setValidation('idle');
  };

  const startDrag = useCallback((r: number, c: number) => {
    setIsDragging(true);
    setGrid(prev => {
      const newValue = tool === 'fill' ? (prev[r][c] === 1 ? 0 : 1) : 0;
      setDragValue(newValue);
      const next = prev.map(row => [...row]);
      next[r][c] = newValue;
      return next;
    });
    setValidation('idle');
  }, [tool]);

  const continueDrag = useCallback((r: number, c: number) => {
    if (!isDragging) return;
    setGrid(prev => {
      if (prev[r][c] === dragValue) return prev;
      const next = prev.map(row => [...row]);
      next[r][c] = dragValue;
      return next;
    });
  }, [isDragging, dragValue]);

  // Auto-validate after 1 second of no changes
  useEffect(() => {
    const filled = grid.flat().filter(v => v).length;
    if (filled < 3) return;
    clearTimeout(validationTimeout.current);
    setValidation('idle');
    validationTimeout.current = setTimeout(() => {
      setValidation('checking');
      workerRef.current?.postMessage({ solution: grid, size });
    }, 1000);
    return () => clearTimeout(validationTimeout.current);
  }, [grid, size]);

  function getClues(line: number[]) {
    const c: number[] = []; let count = 0;
    for (const v of line) {
      if (v) count++;
      else if (count) { c.push(count); count = 0; }
    }
    if (count) c.push(count);
    return c.length ? c : [0];
  }

  const liveRowClues = grid.map(row => getClues(row));
  const liveColClues = Array.from({ length: size }, (_, c) =>
    getClues(grid.map(r => r[c]))
  );

  const filledCount = grid.flat().filter(v => v).length;
  const color = COLORS[category] || '#4ecdc4';

  const handleSubmit = async () => {
    if (!name.trim()) { setSubmitError('Donne un nom à ton puzzle'); return; }
    if (validation !== 'valid') { setSubmitError('Le puzzle doit être valide avant de publier'); return; }
    if (name.trim().length < 2) { setSubmitError('Nom trop court (minimum 2 caractères)'); return; }
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/puzzle/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          category,
          size,
          solution: grid,
          clues: { rows: rowClues, cols: colClues },
          color,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || 'Erreur lors de la publication');
        setIsSubmitting(false);
        return;
      }
      router.push(`/puzzle/${data.slug}?created=true`);
    } catch {
      setSubmitError('Erreur réseau — réessaie');
      setIsSubmitting(false);
    }
  };

  const clearGrid = () => {
    setGrid(Array.from({ length: size }, () => Array(size).fill(0)));
    setValidation('idle');
  };

  const cellSize = size === 10 ? 36 : 26;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#e2e8f0', marginBottom: '0.25rem' }}>
          Créer un nonogramme
        </h1>
        <p style={{ fontSize: '0.8rem', color: '#4ecdc4', fontWeight: 600 }}>
          +10 XP chaque fois que quelqu'un résout ton puzzle
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'auto 240px',
        gap: '2rem',
        alignItems: 'start',
      }}>
        {/* Left — Editor */}
        <div>
          {/* Toolbar */}
          <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {([10, 15] as const).map(s => (
              <button key={s} onClick={() => handleSizeChange(s)} style={{
                padding: '8px 16px', borderRadius: '8px', border: size === s ? 'none' : '1px solid #1e3048',
                background: size === s ? '#4ecdc4' : '#0d1728',
                color: size === s ? '#070d17' : '#7aa8cc',
                fontWeight: 700, fontSize: '13px', cursor: 'pointer',
              }}>
                {s}×{s}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            <button onClick={() => setTool(t => t === 'fill' ? 'erase' : 'fill')} style={{
              padding: '8px 14px', borderRadius: '8px', border: 'none',
              background: tool === 'fill' ? '#4ecdc4' : '#ff6b6b',
              color: tool === 'fill' ? '#070d17' : '#fff',
              fontWeight: 700, fontSize: '13px', cursor: 'pointer',
            }}>
              {tool === 'fill' ? '■ Remplir' : '◻ Effacer'}
            </button>
            <button onClick={clearGrid} style={{
              padding: '8px 14px', borderRadius: '8px',
              background: 'transparent', border: '1px solid #1e3048',
              color: '#7aa8cc', fontSize: '13px', cursor: 'pointer',
            }}>
              Tout effacer
            </button>
          </div>

          {/* Grid */}
          <div
            style={{ display: 'inline-block', background: '#0d1728', borderRadius: '12px', padding: '12px', userSelect: 'none' }}
            onMouseLeave={() => setIsDragging(false)}
            onMouseUp={() => setIsDragging(false)}
          >
            {/* Col clues */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: `${cellSize + 8}px repeat(${size}, ${cellSize}px)`,
              gap: '2px',
              marginBottom: '4px',
            }}>
              <div />
              {liveColClues.map((clue, c) => (
                <div key={c} style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'flex-end',
                  gap: '1px', paddingBottom: '4px', minHeight: '32px',
                }}>
                  {clue.map((n, i) => (
                    <span key={i} style={{
                      fontSize: '10px', fontWeight: 800,
                      color: n === 0 ? '#3d6080' : '#4ecdc4', lineHeight: 1,
                    }}>{n}</span>
                  ))}
                </div>
              ))}
            </div>

            {/* Rows */}
            {grid.map((row, r) => (
              <div key={r} style={{
                display: 'grid',
                gridTemplateColumns: `${cellSize + 8}px repeat(${size}, ${cellSize}px)`,
                gap: '2px',
                marginBottom: '2px',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'flex-end', paddingRight: '6px', gap: '3px',
                }}>
                  {liveRowClues[r].map((n, i) => (
                    <span key={i} style={{
                      fontSize: '10px', fontWeight: 800,
                      color: n === 0 ? '#3d6080' : '#4ecdc4',
                    }}>{n}</span>
                  ))}
                </div>
                {row.map((cell, c) => (
                  <div
                    key={c}
                    onMouseDown={() => startDrag(r, c)}
                    onMouseEnter={() => continueDrag(r, c)}
                    onTouchStart={(e) => { e.preventDefault(); startDrag(r, c); }}
                    onTouchMove={(e) => {
                      e.preventDefault();
                      const touch = e.touches[0];
                      const el = document.elementFromPoint(touch.clientX, touch.clientY);
                      if (el instanceof HTMLElement && el.dataset.r && el.dataset.c) {
                        continueDrag(Number(el.dataset.r), Number(el.dataset.c));
                      }
                    }}
                    data-r={r}
                    data-c={c}
                    style={{
                      width: `${cellSize}px`, height: `${cellSize}px`,
                      borderRadius: '3px',
                      background: cell === 1 ? color : '#0f1e30',
                      border: `1px solid ${cell === 1 ? 'rgba(255,255,255,0.1)' : '#1e3048'}`,
                      cursor: 'pointer', transition: 'background 0.05s',
                    }}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1rem', fontSize: '12px', color: '#7aa8cc', flexWrap: 'wrap' }}>
            <span>{filledCount} cases ({(filledCount / size / size * 100).toFixed(0)}%)</span>
            <span style={{
              color: validation === 'valid' ? '#4ade80' : validation === 'invalid' ? '#ff6b6b' : validation === 'checking' ? '#ffd93d' : '#7aa8cc',
              fontWeight: validation !== 'idle' ? 700 : 400,
            }}>
              {validation === 'idle' && 'Dessine pour commencer'}
              {validation === 'checking' && '⏳ Vérification...'}
              {(validation === 'valid' || validation === 'invalid') && validationMessage}
            </span>
          </div>
        </div>

        {/* Right — Settings + publish */}
        <div>
          {/* Name */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '11px', color: '#7aa8cc', fontWeight: 700, display: 'block', marginBottom: '6px', letterSpacing: '0.05em' }}>
              NOM DU PUZZLE
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Mon chat Mimi"
              maxLength={50}
              style={{
                width: '100%', padding: '10px 12px', boxSizing: 'border-box',
                background: '#0d1728', border: '1px solid #1e3048',
                borderRadius: '8px', color: '#e2f0ff', fontSize: '14px', outline: 'none',
              }}
            />
            <span style={{ fontSize: '11px', color: '#3d6080' }}>{name.length}/50</span>
          </div>

          {/* Category */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '11px', color: '#7aa8cc', fontWeight: 700, display: 'block', marginBottom: '6px', letterSpacing: '0.05em' }}>
              CATÉGORIE
            </label>
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                style={{
                  width: '100%', padding: '9px 12px', marginBottom: '4px',
                  background: category === cat.value ? `${COLORS[cat.value]}22` : '#0d1728',
                  border: `1px solid ${category === cat.value ? COLORS[cat.value] : '#1e3048'}`,
                  borderRadius: '8px',
                  color: category === cat.value ? COLORS[cat.value] : '#7aa8cc',
                  fontSize: '13px', fontWeight: category === cat.value ? 700 : 400,
                  cursor: 'pointer', textAlign: 'left',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Color preview */}
          <div style={{
            marginBottom: '1.25rem', padding: '10px 12px',
            background: '#0d1728', border: '1px solid #1e3048', borderRadius: '8px',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <div style={{ width: 20, height: 20, borderRadius: 4, background: color, flexShrink: 0 }} />
            <span style={{ fontSize: '12px', color: '#7aa8cc' }}>Couleur des cases</span>
          </div>

          {/* Error */}
          {submitError && (
            <div style={{
              padding: '10px 12px', marginBottom: '10px',
              background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)',
              borderRadius: '8px', fontSize: '13px', color: '#ff6b6b',
            }}>
              {submitError}
            </div>
          )}

          {/* Publish */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || validation !== 'valid' || !name.trim()}
            style={{
              width: '100%', padding: '14px', border: 'none', borderRadius: '12px',
              background: validation === 'valid' && name.trim()
                ? 'linear-gradient(135deg, #4ecdc4, #45b7d1)' : '#1e3048',
              color: validation === 'valid' && name.trim() ? '#070d17' : '#3d6080',
              fontSize: '15px', fontWeight: 800,
              cursor: validation === 'valid' && name.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
            }}
          >
            {isSubmitting ? '⏳ Publication...' : '🚀 Publier le puzzle'}
          </button>

          <p style={{ fontSize: '11px', color: '#3d6080', textAlign: 'center', marginTop: '10px', lineHeight: 1.5 }}>
            Publié immédiatement. +10 XP à chaque completion par un autre joueur.
          </p>
        </div>
      </div>
    </div>
  );
}
