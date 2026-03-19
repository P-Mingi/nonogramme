import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0d1528', color: '#e2e8f0' }}>
      <header style={{ borderBottom: '1px solid #2d3f5e', backgroundColor: '#0d1528' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo variant="wordmark" theme="dark" size="sm" />
          <Link href="/" style={{ color: '#4ecdc4', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
            ← Jouer
          </Link>
        </div>
      </header>
      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px', lineHeight: 1.8, fontSize: '1rem' }}>
        {children}
      </main>
    </div>
  );
}
