'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  currentUsername: string;
  currentAvatarUrl: string | null;
}

export function ProfileEditForm({ currentUsername, currentAvatarUrl }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState(currentUsername);
  const [preview, setPreview] = useState<string | null>(currentAvatarUrl);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  }

  async function handleSave() {
    setLoading(true);
    const formData = new FormData();
    formData.append('username', username);
    const file = fileRef.current?.files?.[0];
    if (file) formData.append('avatar', file);

    await fetch('/api/profile', { method: 'PATCH', body: formData });
    setLoading(false);
    setIsOpen(false);
    router.refresh();
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          fontSize: '0.75rem', color: '#8892a4',
          backgroundColor: 'transparent', border: '1px solid #2d3f5e',
          borderRadius: '0.25rem', padding: '0.25rem 0.6rem', cursor: 'pointer',
        }}
      >
        Modifier le profil
      </button>
    );
  }

  return (
    <div style={{
      backgroundColor: '#1a2540', border: '1px solid #2d3f5e',
      borderRadius: '0.5rem', padding: '1.25rem',
      display: 'flex', flexDirection: 'column', gap: '1rem',
    }}>
      <h3 style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>
        Modifier le profil
      </h3>

      {/* Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {preview ? (
          <img src={preview} alt="avatar" width={56} height={56}
            style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
        ) : (
          <div style={{
            width: 56, height: 56, borderRadius: '50%', backgroundColor: '#2d3f5e',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#8892a4', fontWeight: 700, fontSize: '1.5rem', flexShrink: 0,
          }}>
            {username[0]?.toUpperCase()}
          </div>
        )}
        <div>
          <input
            ref={fileRef} type="file" accept="image/*"
            onChange={handleFileChange} style={{ display: 'none' }} id="avatar-upload"
          />
          <label htmlFor="avatar-upload" style={{
            fontSize: '0.8rem', color: '#4ecdc4', cursor: 'pointer', textDecoration: 'underline',
          }}>
            Changer la photo
          </label>
          <div style={{ fontSize: '0.7rem', color: '#8892a4', marginTop: '0.2rem' }}>
            JPG, PNG, max 2 Mo
          </div>
        </div>
      </div>

      {/* Username */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <label style={{ fontSize: '0.8rem', color: '#8892a4' }}>Nom d'utilisateur</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          maxLength={30}
          style={{
            backgroundColor: '#0d1528', border: '1px solid #2d3f5e',
            borderRadius: '0.375rem', padding: '0.5rem 0.75rem',
            color: '#e2e8f0', fontSize: '0.875rem', outline: 'none',
          }}
        />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            flex: 1, padding: '0.5rem', borderRadius: '0.375rem',
            backgroundColor: '#4ecdc4', color: '#0d1528', fontWeight: 700,
            fontSize: '0.875rem', border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            padding: '0.5rem 1rem', borderRadius: '0.375rem',
            backgroundColor: 'transparent', color: '#8892a4',
            fontSize: '0.875rem', border: '1px solid #2d3f5e', cursor: 'pointer',
          }}
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
