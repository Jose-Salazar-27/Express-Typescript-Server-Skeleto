import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

dotenv.config();

const supabaseUrl = String(process.env.SUPABASE_URL);
const supabaseKey = String(process.env.SUPABASE_PUBLIC_ANON_KEY);

const supabase = createClient(supabaseUrl, supabaseKey);

async function validateCode(code: string) {
  return await supabase.from('dicord_users').select('*').eq('token', code);
}

async function fetchFromDiscord(userId: string = '969044990481281094') {
  try {
    const guildId = '1086689618197483540';
    return await axios.get(`https://discord.com/api/v9/guilds/${guildId}/members/${userId}`, {
      headers: {
        Authorization: `Bot MTA5NjIwMDA1Njg5NTQ0MzA1NA.GtOfAI.s6iPI1W2QTsPP2x_vFTTRWMIxUy2xI4BRK3IGo`,
      },
    });
  } catch (err) {
    return err;
  }
}

async function setUserData(userRole: string, id: string) {
  return await supabase.from('dicord_users').update({ role: userRole }).eq('discord_id', id).select();
}
// validateCode('AF042C9D').then(value => console.log(value));
// fetchFromDiscord('969044990481281094').then(res => console.log(res));
// setUserData('@everyone', '969044990481281094').then(res => console.log(res));
