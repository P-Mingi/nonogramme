# nonogramme.com — Logo Implementation
## Complete guide for Claude Code

---

## STEP 1 — Copy logo files into your project

Place these files in `public/`:
```
public/
├── icon.svg              ← Logo 1 (app icon, 120×120)
├── icon-mark.svg         ← Logo 5 mark only (52×52, for small uses)
├── wordmark-dark.svg     ← Logo 5 full (dark bg, 380×52)
├── wordmark-light.svg    ← Logo 5 full (light bg, 380×52)
├── og-image.svg          ← Social share card (1200×630)
├── favicon.ico           ← Generated from icon.svg (see Step 2)
├── apple-touch-icon.png  ← Generated from icon.svg (see Step 2)
└── site.webmanifest      ← PWA manifest (see Step 3)
```

---

## STEP 2 — Generate favicon + apple icon

Run in terminal (requires ImageMagick or use cloudconvert.com):

```bash
# Option A: using ImageMagick
brew install imagemagick
convert public/icon.svg -resize 32x32 public/favicon-32.png
convert public/icon.svg -resize 16x16 public/favicon-16.png
convert public/icon.svg -resize 180x180 public/apple-touch-icon.png
convert public/icon.svg -resize 192x192 public/icon-192.png
convert public/icon.svg -resize 512x512 public/icon-512.png

# Option B: online — go to https://realfavicongenerator.net
# Upload public/icon.svg → download package → extract to public/
```

---

## STEP 3 — site.webmanifest (PWA)

Create `public/site.webmanifest`:

```json
{
  "name": "Nonogramme.com — Jeux de logique",
  "short_name": "Nonogramme",
  "description": "Révèle des dessins cachés en résolvant des puzzles de logique japonais",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#070d17",
  "theme_color": "#4ecdc4",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["games", "entertainment"],
  "lang": "fr"
}
```

---

## STEP 4 — Update layout.tsx metadata (full SEO + icons)

Replace your current `src/app/layout.tsx` with:

```tsx
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  themeColor: '#4ecdc4',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://nonogramme.com'),
  title: {
    default: 'Nonogramme.com — Jeux de logique gratuits',
    template: '%s | Nonogramme.com',
  },
  description: 'Révèle des dessins cachés en résolvant des puzzles de logique japonais. Nonogrammes, picross et logimages gratuits en ligne — facile, moyen, difficile, expert.',
  keywords: [
    'nonogramme', 'picross', 'logimage', 'hanjie', 'griddler',
    'jeu de logique', 'puzzle gratuit', 'jeu en ligne', 'casse-tête',
    'nonogramme facile', 'nonogramme difficile', 'picross en ligne'
  ],
  authors: [{ name: 'Nonogramme.com' }],
  creator: 'Nonogramme.com',
  publisher: 'Nonogramme.com',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://nonogramme.com',
    siteName: 'Nonogramme.com',
    title: 'Nonogramme.com — Jeux de logique gratuits',
    description: 'Révèle des dessins cachés. Puzzles de logique gratuits — nonogramme, picross, logimage.',
    images: [{
      url: '/og-image.svg',
      width: 1200,
      height: 630,
      alt: 'Nonogramme.com — Jeux de logique gratuits',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nonogramme.com — Jeux de logique gratuits',
    description: 'Révèle des dessins cachés. Puzzles de logique gratuits.',
    images: ['/og-image.svg'],
  },
  icons: {
    icon: [
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/icon.svg', color: '#4ecdc4' },
    ],
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://nonogramme.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
```

---

## STEP 5 — Logo component (reusable)

Create `src/components/ui/Logo.tsx`:

```tsx
import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  variant?: 'wordmark' | 'icon' | 'icon-mark'
  theme?: 'dark' | 'light'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  className?: string
}

const sizes = {
  wordmark: { sm: { w: 190, h: 26 }, md: { w: 254, h: 35 }, lg: { w: 380, h: 52 } },
  icon:     { sm: { w: 32,  h: 32 }, md: { w: 52,  h: 52 }, lg: { w: 120, h: 120 } },
  'icon-mark': { sm: { w: 28, h: 28 }, md: { w: 40, h: 40 }, lg: { w: 52, h: 52 } },
}

export function Logo({
  variant = 'wordmark',
  theme = 'dark',
  size = 'md',
  href = '/',
  className = '',
}: LogoProps) {
  const { w, h } = sizes[variant][size]

  const src =
    variant === 'icon'      ? '/icon.svg' :
    variant === 'icon-mark' ? '/icon-mark.svg' :
    theme === 'dark'        ? '/wordmark-dark.svg' :
                              '/wordmark-light.svg'

  const img = (
    <Image
      src={src}
      alt="Nonogramme.com"
      width={w}
      height={h}
      priority
      className={className}
    />
  )

  if (!href) return img

  return (
    <Link href={href} aria-label="Nonogramme.com — Accueil">
      {img}
    </Link>
  )
}
```

---

## STEP 6 — CLAUDE CODE PROMPT
## Copy-paste this entire block into Claude Code

```
I need you to integrate the nonogramme.com logo system into the entire Next.js app.

LOGO FILES (already in public/):
- /icon.svg — app icon 120x120, dark bg (#0d1728), teal grid pixels (#4ecdc4)
- /icon-mark.svg — small mark 52x52, teal background
- /wordmark-dark.svg — full logo 380x52 for dark backgrounds
- /wordmark-light.svg — full logo 380x52 for light backgrounds
- /og-image.svg — social card 1200x630
- /site.webmanifest — PWA manifest

LOGO COMPONENT (already created at src/components/ui/Logo.tsx)

TASKS:

1. UPDATE src/app/layout.tsx
   - Replace with the full metadata config from the implementation guide
   - Add viewport export
   - All icons, OG, Twitter card, manifest configured

2. UPDATE the game header (wherever the site title is shown)
   - Replace any text "nonogramme" or "nonogramme.com" with:
     <Logo variant="wordmark" theme="dark" size="sm" />
   - Import from '@/components/ui/Logo'

3. UPDATE the home screen hero section
   - Replace the current logo/title area with:
     <Logo variant="icon" theme="dark" size="md" />  (the grid icon, centered)
     Keep the tagline text below it

4. UPDATE the win screen
   - Add <Logo variant="icon-mark" size="sm" /> in the top-right of the win card
   - Subtle branding without being intrusive

5. ADD structured data (JSON-LD) to layout.tsx body:
   Add this script tag inside <body> before {children}:
   
   <script
     type="application/ld+json"
     dangerouslySetInnerHTML={{
       __html: JSON.stringify({
         "@context": "https://schema.org",
         "@type": "WebSite",
         "name": "Nonogramme.com",
         "url": "https://nonogramme.com",
         "description": "Jeux de nonogramme gratuits en ligne",
         "inLanguage": "fr-FR",
         "potentialAction": {
           "@type": "SearchAction",
           "target": "https://nonogramme.com/puzzle/{search_term_string}",
           "query-input": "required name=search_term_string"
         }
       })
     }}
   />

6. CREATE src/app/puzzle/[slug]/page.tsx metadata
   Each puzzle page needs its own OG image reference:
   
   export async function generateMetadata({ params }): Promise<Metadata> {
     const puzzle = PUZZLES.find(p => p.slug === params.slug)
     if (!puzzle) return {}
     return {
       title: puzzle.name,
       description: `Jouez au nonogramme "${puzzle.name}" — ${puzzle.difficulty}, ${puzzle.size}×${puzzle.size}. Révèle l'image cachée gratuitement.`,
       openGraph: {
         title: `${puzzle.name} — Nonogramme ${puzzle.size}×${puzzle.size}`,
         description: `Puzzle de logique gratuit — ${puzzle.difficulty}`,
         images: [{ url: '/og-image.svg', width: 1200, height: 630 }],
       },
       alternates: { canonical: `https://nonogramme.com/puzzle/${puzzle.slug}` },
     }
   }

7. UPDATE next.config.js to allow SVG:
   
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     images: {
       dangerouslyAllowSVG: true,
       contentDispositionType: 'attachment',
       contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
     },
   }
   module.exports = nextConfig

DESIGN TOKENS to stay consistent everywhere:
- Primary color: #4ecdc4 (teal)
- Gold accent: #ffd93d
- Dark bg: #070d17
- Card bg: #0d1728
- Text: #e2f0ff
- Text muted: #7aa8cc

After all changes, run: npm run build
Fix any TypeScript errors. The build must pass clean.
```

---

## STEP 7 — Verify everything

After running the Claude Code prompt, check:

```bash
npm run build
# Should compile with 0 errors

# Then open:
# http://localhost:3000 — logo in header ✓
# http://localhost:3000/puzzle/chat-mignon — og metadata ✓
# View source → <link rel="icon"> present ✓
# View source → JSON-LD script present ✓
```

Open Chrome DevTools → Application → Manifest
→ Should show nonogramme icon + name + theme color ✓

---

## QUICK REFERENCE — Logo usage rules

| Where | Component | Props |
|-------|-----------|-------|
| Site header (nav) | Logo | variant="wordmark" theme="dark" size="sm" |
| Home hero center | Logo | variant="icon" theme="dark" size="md" |
| Win screen card | Logo | variant="icon-mark" size="sm" |
| Email / social | wordmark-dark.svg | direct SVG |
| Favicon browser | icon.svg | via metadata |
| App icon (PWA) | icon-512.png | via manifest |
| OG / Twitter card | og-image.svg | via metadata |
| Light background | Logo | variant="wordmark" theme="light" |

---

*Logo system v1.0 — nonogramme.com*
