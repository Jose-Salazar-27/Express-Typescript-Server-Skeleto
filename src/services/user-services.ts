import { ServerConfig } from '../config/server-config';

export class UserService extends ServerConfig {
  constructor() {
    super();
  }

  async uploadUser(name: string, password: string, email: string) {
    const payload = await this.supabaseClient.from('Users').insert([{ name, password, email }]);
  }

  async getSingleUser(email: string) {
    const user = await this.supabaseClient.from('Users').select('*').eq('email', email);
    console.log('==== user ====');
    console.log(user);
    return user;
  }

  async getUsers() {
    const payload = await this.supabaseClient.from('Users').select('*');
    return payload;
  }
}
