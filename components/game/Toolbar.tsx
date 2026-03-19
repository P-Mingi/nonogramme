'use client';
import type { Tool } from '@/types/puzzle';

interface ToolbarProps {
  tool: Tool;
  onToolChange: (t: Tool) => void;
  hints: number;
  onHint: () => void;
}

const TOOLS: { id: Tool; label: string; icon: string }[] = [
  { id: 'fill', label: 'Remplir', icon: '■' },
  { id: 'mark', label: 'Marquer', icon: '✕' },
  { id: 'erase', label: 'Effacer', icon: '⌫' },
];

export function Toolbar({ tool, onToolChange, hints, onHint }: ToolbarProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap justify-center">
      {TOOLS.map(t => (
        <button
          key={t.id}
          aria-pressed={tool === t.id}
          onClick={() => onToolChange(t.id)}
          className="flex items-center gap-1.5 px-3 py-2 rounded text-sm font-medium transition-all"
          style={{
            backgroundColor: tool === t.id ? '#1a2540' : 'transparent',
            color: tool === t.id ? '#4ecdc4' : '#8892a4',
            border: `1px solid ${tool === t.id ? '#4ecdc4' : '#2d3f5e'}`,
          }}
        >
          <span>{t.icon}</span>
          <span>{t.label}</span>
        </button>
      ))}

      <div style={{ width: '1px', height: '28px', backgroundColor: '#2d3f5e', margin: '0 4px' }} />

      <button
        onClick={onHint}
        disabled={hints <= 0}
        className="flex items-center gap-1.5 px-3 py-2 rounded text-sm font-medium transition-all"
        style={{
          backgroundColor: 'transparent',
          color: hints > 0 ? '#f6c90e' : '#3a4a60',
          border: `1px solid ${hints > 0 ? '#f6c90e44' : '#2d3f5e'}`,
          cursor: hints > 0 ? 'pointer' : 'not-allowed',
        }}
      >
        <span>?</span>
        <span>Indice ({hints})</span>
      </button>
    </div>
  );
}
