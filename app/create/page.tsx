import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { PuzzleEditor } from '@/components/PuzzleEditor';

export const metadata: Metadata = {
  title: 'Créer un nonogramme - Nonogramme.com',
  description: "Dessine et publie ton propre nonogramme. Partage-le avec tes amis et gagne de l'XP quand ils le résolvent.",
  alternates: { canonical: 'https://nonogramme.com/create' },
};

export default async function CreatePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '60vh', gap: '1rem', textAlign: 'center',
      }}>
        <div style={{ fontSize: '3rem' }}>✏️</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#e2e8f0' }}>
          Connecte-toi pour créer un puzzle
        </h1>
        <p style={{ color: '#8892a4', fontSize: '0.95rem', maxWidth: 340 }}>
          Tu dois être connecté pour créer et publier des nonogrammes.
          Utilise le bouton de connexion en haut à droite.
        </p>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, level, xp')
    .eq('id', user.id)
    .single();

  return <PuzzleEditor userId={user.id} profile={profile} />;
}
