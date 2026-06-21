import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * 3層キャッシュ戦略用のユーティリティ
 */
export const CACHE_TTL = {
  ATTRACTION: 30 * 24 * 60 * 60 * 1000, // 30日
  REPULSION: 7 * 24 * 60 * 60 * 1000,   // 7日
};

export async function getCache<T>(key: string, type: 'ATTRACTION' | 'REPULSION'): Promise<T | null> {
  const { data, error } = await supabase
    .from('market_cache')
    .select('*')
    .eq('cache_key', key)
    .single();

  if (error || !data) return null;

  const now = new Date().getTime();
  const createdAt = new Date(data.created_at).getTime();
  const ttl = type === 'ATTRACTION' ? CACHE_TTL.ATTRACTION : CACHE_TTL.REPULSION;

  if (now - createdAt > ttl) {
    // キャッシュ切れ
    return null;
  }

  return data.content as T;
}

export async function setCache(key: string, content: any) {
  const { error } = await supabase
    .from('market_cache')
    .upsert({ 
      cache_key: key, 
      content, 
      created_at: new Date().toISOString() 
    }, { onConflict: 'cache_key' });
  
  if (error) console.error('Supabase cache error:', error);
}

/**
 * アイディア（カンバン）操作
 */
export async function getIdeas() {
  const { data, error } = await supabase
    .from('ideas')
    .select('*')
    .order('updated_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function upsertIdea(idea: any) {
  const { data, error } = await supabase
    .from('ideas')
    .upsert(idea)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}
