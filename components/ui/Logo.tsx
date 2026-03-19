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
  wordmark:    { sm: { w: 190, h: 26 }, md: { w: 254, h: 35 }, lg: { w: 380, h: 52 } },
  icon:        { sm: { w: 32,  h: 32 }, md: { w: 52,  h: 52 }, lg: { w: 120, h: 120 } },
  'icon-mark': { sm: { w: 28,  h: 28 }, md: { w: 40,  h: 40 }, lg: { w: 52,  h: 52 } },
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
