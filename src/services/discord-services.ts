import { ServerConfig } from '../config/server-config';
import { MessagesClasifications } from '../helpers/messages-clasifications';

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

  async getPosts(role: string) {
    if (role === MessagesClasifications.Super_Premium) {
      console.log('executing super premium');
      const superPremiumPost = await this.supabaseClient.from('Super Premium Messages').select('*');
      const premiumPost = await this.supabaseClient.from('Premium Messages').select('*');
      const freePosts = await this.supabaseClient.from('Free Messages').select('*');

      return [superPremiumPost, premiumPost, freePosts];
    }

    if (role === MessagesClasifications.Premium) {
      const premiumPost = await this.supabaseClient.from('Premium Messages').select('*');
      const freePosts = await this.supabaseClient.from('Free Messages').select('*');

      return [premiumPost, freePosts];
    }

    if (role === MessagesClasifications.Free) {
      const freePosts = await this.supabaseClient.from('Free Messages').select('*');

      return [freePosts];
    }
  }

  // This will be removed once there is time to write an appropriate test
  async testMessage(payload: Post, role: Role) {
    console.log([payload, role]);
    return { ok: 'ok' };
  }
}
