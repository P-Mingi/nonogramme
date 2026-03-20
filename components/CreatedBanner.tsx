'use client';
import { useState } from 'react';

export function CreatedBanner({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    const url = `https://nonogramme.com/puzzle/${slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div style={{
      background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.3)',
      borderRadius: '0.75rem', padding: '1rem 1.25rem', textAlign: 'center',
    }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '0.375rem' }}>🎉</div>
      <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#4ade80', margin: '0 0 0.25rem' }}>
        Ton puzzle est en ligne !
      </p>
      <p style={{ fontSize: '0.8rem', color: '#7aa8cc', margin: '0 0 0.75rem' }}>
        Partage ce lien pour que tes amis puissent le résoudre. Tu gagneras +10 XP à chaque completion.
      </p>
      <button
        onClick={copyLink}
        style={{
          padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: 'none',
          background: copied ? '#4ade80' : '#22c55e',
          color: '#070d17', fontWeight: 700, fontSize: '0.825rem', cursor: 'pointer',
          transition: 'background 0.2s',
        }}
      >
        {copied ? '✓ Copié !' : '📋 Copier le lien'}
      </button>
    </div>
  );
}
