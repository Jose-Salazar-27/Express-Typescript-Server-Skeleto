import { ServerConfig } from '../config/server-config';

export class UserService extends ServerConfig {
  constructor() {
    super();
  }

  async getUsers() {
    const payload = await this.supabaseClient.from('Users').select('*');
    // console.log(payload);
    return payload;
  }
}
