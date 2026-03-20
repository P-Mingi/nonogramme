'use client';
import { useState, useEffect } from 'react';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}

export function PushSubscription() {
  const [status, setStatus] = useState<'idle' | 'subscribed' | 'denied' | 'unsupported'>('idle');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setStatus('unsupported');
      return;
    }
    if (Notification.permission === 'denied') {
      setStatus('denied');
      return;
    }
    navigator.serviceWorker.ready.then(reg =>
      reg.pushManager.getSubscription().then(sub => {
        if (sub) setStatus('subscribed');
      })
    );
  }, []);

  const subscribe = async () => {
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
      const json = sub.toJSON();
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: json.endpoint, keys: json.keys }),
      });
      setStatus('subscribed');
    } catch {
      if (Notification.permission === 'denied') setStatus('denied');
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async () => {
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch('/api/push/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setStatus('idle');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'unsupported') return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {status === 'subscribed' ? (
        <button
          onClick={unsubscribe}
          disabled={loading}
          title="Désactiver les rappels"
          style={{
            background: 'none', border: '1px solid #2d3f5e', borderRadius: '0.5rem',
            padding: '0.375rem 0.75rem', cursor: 'pointer', color: '#4ecdc4',
            fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem',
          }}
        >
          🔔 Rappels activés
        </button>
      ) : status === 'denied' ? (
        <span style={{ fontSize: '0.75rem', color: '#8892a4' }}>
          🔕 Notifications bloquées
        </span>
      ) : (
        <button
          onClick={subscribe}
          disabled={loading}
          title="Recevoir un rappel quotidien"
          style={{
            background: 'none', border: '1px solid #2d3f5e', borderRadius: '0.5rem',
            padding: '0.375rem 0.75rem', cursor: 'pointer', color: '#8892a4',
            fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem',
          }}
        >
          🔔 Me rappeler chaque jour
        </button>
      )}
    </div>
  );
}
