import Link from 'next/link';

export function DeepSpaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#0d1528', color: '#e2e8f0' }}
    >
      <header style={{ borderBottom: '1px solid #2d3f5e', backgroundColor: '#0d1528' }}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span className="font-bold text-xl tracking-widest" style={{ color: '#4ecdc4' }}>
              NONOGRAMME
            </span>
          </Link>
          <span className="text-sm" style={{ color: '#8892a4' }}>
            Pixel art logic puzzle
          </span>
        </div>
      </header>
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        {children}
      </main>
    </div>
  );
}
