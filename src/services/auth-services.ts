import axios from 'axios';
import { ServerConfig } from '../config/server-config';
import { EmailTransporter } from '../helpers/Email-transporter';
import { Token } from '../models/token-model';

export class AuthServices extends ServerConfig {
  constructor() {
    super();
  }

  async sendToken(email: string, id: string) {
    const transporter = EmailTransporter.useTransport();
    return await transporter.sendEmail(email, id);
  }

  async fetchUserFromDiscord({ email, id }: Token) {
    const testId = '969044990481281094';

    try {
      const result = await axios.get(`https://discord.com/api/v9/guilds/1086689618197483540/members/969044990481281094`, {
        headers: {
          Authorization: `Bot ${this.getEnvVar('DISCORD_TOKEN')}`,
        },
      });

      const roles = result.data.roles;
      console.log(roles);

      return result;
    } catch (err) {
      console.log(err);
    }
  }
}
