/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window { gtag: (...args: any[]) => void }
}

function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
}

export const Analytics = {
  puzzleStarted: (slug: string, level: number) =>
    trackEvent('puzzle_started', 'game', slug, level),

  puzzleCompleted: (slug: string, score: number) =>
    trackEvent('puzzle_completed', 'game', slug, score),

  puzzleAbandoned: (slug: string, progress: number) =>
    trackEvent('puzzle_abandoned', 'game', slug, progress),

  hintUsed: (slug: string) =>
    trackEvent('hint_used', 'game', slug),

  shareClicked: (method: 'native' | 'copy' | 'twitter' | 'download') =>
    trackEvent('share_clicked', 'engagement', method),

  languageSwitched: (from: string, to: string) =>
    trackEvent('language_switched', 'i18n', `${from}_to_${to}`),

  dailyPuzzlePlayed: () =>
    trackEvent('daily_puzzle_played', 'engagement'),

  signupCompleted: (method: 'google' | 'discord') =>
    trackEvent('signup_completed', 'auth', method),
};
