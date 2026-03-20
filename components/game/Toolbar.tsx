'use client';
import type { Tool } from '@/types/puzzle';
import { getTranslations } from '@/i18n';
import type { Locale } from '@/i18n/config';

interface ToolbarProps {
  tool: Tool;
  onToolChange: (t: Tool) => void;
  hints: number;
  onHint: () => void;
  locale?: Locale;
}

export function Toolbar({ tool, onToolChange, hints, onHint, locale = 'fr' }: ToolbarProps) {
  const t = getTranslations(locale);
  const TOOLS: { id: Tool; label: string; icon: string }[] = [
    { id: 'fill', label: t.game.fill, icon: '■' },
    { id: 'mark', label: t.game.mark, icon: '✕' },
    { id: 'erase', label: t.game.erase, icon: '⌫' },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap justify-center">
      {TOOLS.map(tt => (
        <button
          key={tt.id}
          aria-pressed={tool === tt.id}
          onClick={() => onToolChange(tt.id)}
          className="flex items-center gap-1.5 px-3 py-2 rounded text-sm font-medium transition-all"
          style={{
            backgroundColor: tool === tt.id ? '#1a2540' : 'transparent',
            color: tool === tt.id ? '#4ecdc4' : '#8892a4',
            border: `1px solid ${tool === tt.id ? '#4ecdc4' : '#2d3f5e'}`,
          }}
        >
          <span>{tt.icon}</span>
          <span>{tt.label}</span>
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
        <span>{t.game.hint} ({hints})</span>
      </button>
    </div>
  );
}
