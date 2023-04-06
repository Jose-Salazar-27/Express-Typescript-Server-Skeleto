import { createClient } from '@supabase/supabase-js';
import { validateEnvVar } from '../helpers/env-variables-validator';

const supabaseUrl = validateEnvVar('SUPABASE_URL');
const supabaseKey = validateEnvVar('SUPABASE_PUBLIC_ANON_KEY');

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
