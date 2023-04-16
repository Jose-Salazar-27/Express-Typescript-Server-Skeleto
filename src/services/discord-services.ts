import { ServerConfig } from '../config/server-config';

interface Post {
  guild_id: string;
  author: string;
  content: string;
}

type Role = ['Super Premium' | 'Premium' | 'Free'];

export class DiscordServices extends ServerConfig {
  constructor() {
    super();
  }

  async saveMessage(payload: Post, role: Role) {
    console.log({ payload, role });

    const result = await this.supabaseClient.from(`${role[0]} Messages`).insert([
      {
        guild_id: payload.guild_id,
        author: payload.author,
        message: payload.content,
      },
    ]);

    if (result.error) {
      console.log(result.error);
    }

    return result;
  }

  // This will be removed once there is time to write an appropriate test
  async testMessage(payload: Post, role: Role) {
    console.log([payload, role]);
    return { ok: 'ok' };
  }
}
