import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const username = formData.get('username') as string | null;
  const avatarFile = formData.get('avatar') as File | null;

  const updates: Record<string, string> = {};

  if (username?.trim()) {
    updates.username = username.trim().slice(0, 30);
  }

  if (avatarFile && avatarFile.size > 0) {
    const ext = avatarFile.name.split('.').pop() ?? 'jpg';
    const path = `${user.id}.${ext}`;
    const bytes = await avatarFile.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, bytes, { upsert: true, contentType: avatarFile.type });

    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
      updates.avatar_url = publicUrl;
    }
  }

  if (Object.keys(updates).length > 0) {
    await supabase.from('profiles').update(updates).eq('id', user.id);
  }

  return NextResponse.json({ success: true });
}
