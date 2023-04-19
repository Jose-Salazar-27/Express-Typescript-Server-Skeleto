import axios from 'axios';
import querystring from 'querystring';

import { ServerConfig } from '../config/server-config';
import { EmailTransporter } from '../helpers/Email-transporter';
import { Token } from '../models/token-model';

export class AuthServices extends ServerConfig {
  protected discordClientId: string;
  protected discordClientSecret: string;
  protected redirectUri: string;

  constructor() {
    super();
    this.discordClientId = this.getEnvVar('DISCORD_CLIENT_ID');
    this.discordClientSecret = this.getEnvVar('DISCORD_TOKEN');
    this.redirectUri = this.getEnvVar('FRONTEND_REDIRECT_URI');
  }

  stringifyDiscordParams() {
    const params = querystring.stringify({
      client_id: this.discordClientId,
      grant_type: 'authorization_code',
      response_type: 'code',
      scope: 'identify',
      client_secret: this.discordClientSecret,
    });

    return params;
  }

  async getDiscordToken(code: any) {
    const data: any = {
      client_id: this.discordClientId,
      client_secret: this.discordClientSecret,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.redirectUri,
      scope: 'identify email',
    };

    const response = await axios.post('https://discord.com/api/oauth2/token', querystring.stringify(data), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    return response.data.access_token;
  }

  async getDiscordUser(accessToken: any) {
    const response = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  }

  getRedirectUri() {
    return this.redirectUri;
  }

  async findUserById(userId: string) {
    return await this.supabaseClient.from('dicord_users').select('*').eq('id', userId);
  }

  async sendToken(email: string, id: string) {
    const transporter = EmailTransporter.useTransport();
    return await transporter.sendEmail(email);
  }

  async saveOne(email: string, id: string, token: any) {
    console.log('==== RECEIVED ID: ' + id);
    const now = new Date();
    const expirationDate = new Date(new Date().getTime() + 5 * 60000);

    return await this.supabaseClient.from('dicord_users').insert([
      {
        discord_id: id,
        email,
        token,
        token_created: now.getTime(),
        token_expires: expirationDate.getTime(),
      },
    ]);
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

  async validateCode(code: string) {
    return await this.supabaseClient.from('dicord_users').select('*').eq('token', code);
  }

  async verifyUser(id: string) {
    return await this.supabaseClient.from('dicord_users').update({ verified: true }).eq('id', id);
  }

  async fetchFromDiscord(userId: string) {
    try {
      const guildId = '1086689618197483540';
      return await axios.get(`https://discord.com/api/v9/guilds/${guildId}/members/${userId}`, {
        headers: {
          Authorization: `Bot ${this.getEnvVar('TOKEN')}`,
        },
      });
    } catch (err) {
      return err;
    }
  }

  async setUserData(userRole: string, id: string) {
    return await this.supabaseClient.from('dicord_users').update({ role: userRole, verified: true }).eq('discord_id', id).select();
  }
}
