import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const BANNED_WORDS = ['fuck', 'shit', 'merde', 'putain', 'bite', 'cul', 'con', 'connard'];

function containsBannedWord(text: string): boolean {
  const lower = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return BANNED_WORDS.some(word => lower.includes(word));
}

function generateSlug(name: string, userId: string): string {
  const base = name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 40);
  const suffix = userId.substring(0, 6);
  return `${base}-${suffix}`;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  const body = await request.json();
  const { name, category, size, solution, clues, color } = body;

  // Validate input
  if (!name?.trim() || name.trim().length < 2 || name.trim().length > 50) {
    return NextResponse.json({ error: 'Nom invalide (2–50 caractères)' }, { status: 400 });
  }
  if (containsBannedWord(name)) {
    return NextResponse.json({ error: 'Nom non autorisé' }, { status: 400 });
  }
  if (![10, 15].includes(size)) {
    return NextResponse.json({ error: 'Taille invalide' }, { status: 400 });
  }
  if (!['animaux', 'nature', 'objets', 'personnages', 'nourriture', 'symboles'].includes(category)) {
    return NextResponse.json({ error: 'Catégorie invalide' }, { status: 400 });
  }
  if (!solution || !Array.isArray(solution) || solution.length !== size) {
    return NextResponse.json({ error: 'Solution invalide' }, { status: 400 });
  }

  const filled = (solution as number[][]).flat().filter(v => v === 1).length;
  const fillRate = filled / (size * size);
  if (fillRate < 0.08 || fillRate > 0.92) {
    return NextResponse.json({ error: 'Trop vide ou trop rempli' }, { status: 400 });
  }

  // Rate limit: max 10 community puzzles per user
  const { count } = await supabase
    .from('puzzles')
    .select('id', { count: 'exact', head: true })
    .eq('created_by', user.id)
    .eq('is_community', true);

  if ((count ?? 0) >= 10) {
    return NextResponse.json({
      error: "Limite de 10 puzzles communautaires atteinte pour l'instant",
    }, { status: 429 });
  }

  const slug = generateSlug(name.trim(), user.id);

  const { data: existing } = await supabase
    .from('puzzles')
    .select('id')
    .eq('slug', slug)
    .single();

  if (existing) {
    return NextResponse.json({
      error: 'Un puzzle avec ce nom existe déjà — essaie un autre nom',
    }, { status: 409 });
  }

  const difficulty = fillRate < 0.35 ? 'difficile' : fillRate < 0.55 ? 'moyen' : 'facile';

  const { data: puzzle, error } = await supabase
    .from('puzzles')
    .insert({
      slug,
      name: name.trim(),
      category,
      size,
      difficulty,
      color,
      solution,
      clues,
      is_community: true,
      created_by: user.id,
      status: 'approved',
      play_count: 0,
    })
    .select('slug')
    .single();

  if (error || !puzzle) {
    console.error('Puzzle insert error:', error);
    return NextResponse.json({ error: 'Erreur lors de la sauvegarde' }, { status: 500 });
  }

  // Award +50 XP to creator for publishing
  const { data: profile } = await supabase
    .from('profiles')
    .select('xp')
    .eq('id', user.id)
    .single();

  if (profile) {
    await supabase
      .from('profiles')
      .update({ xp: profile.xp + 50 })
      .eq('id', user.id);
  }

  return NextResponse.json({
    slug: puzzle.slug,
    url: `https://nonogramme.com/puzzle/${puzzle.slug}`,
  });
}
