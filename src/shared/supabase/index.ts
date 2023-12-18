import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { getEnv } from '../../helpers/getenv';

export const getClient = (): SupabaseClient => {
  const url = getEnv('SUPABASE_URL');
  const key = getEnv('SUPABASE_PUBLIC_ANON_KEY');

  const supabase = createClient(url, key);
  return supabase;
};
