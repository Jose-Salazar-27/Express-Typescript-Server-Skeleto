import axios from 'axios';
import querystring from 'querystring';
import { inject, injectable } from 'inversify';
import type { NextFunction } from 'express';
import { ServerConfig } from '../config/server-config';
import { EmailTransporter } from '../helpers/Email-transporter';
import { TokenHandler } from '../middleware/token-handler';
import { TABLES, TYPES } from '../shared/constants';
import { discordRolesId, guildId } from '../shared/constants/discord';
import { getEnv } from '../helpers/getenv';

@injectable()
export class AuthServices extends ServerConfig {
  private readonly transporter: EmailTransporter;
  protected discordClientId: string;
  protected discordClientSecret: string;
  protected redirectUri: string;

  constructor(@inject(TYPES.helpers.email) _transporter: EmailTransporter) {
    super();
    this.transporter = _transporter;
    this.discordClientId = this.getEnvVar('DISCORD_CLIENT_ID');
    this.discordClientSecret = this.getEnvVar('DISCORD_TOKEN');
    this.redirectUri = this.getEnvVar('FRONTEND_REDIRECT_URI');
  }

  // Creo que esto seria mas una utilidad
  stringifyDiscordParams() {
    const params = querystring.stringify({
      client_id: this.discordClientId,
      grant_type: 'authorization_code',
      response_type: 'code',
      scope: 'identify guilds.join',
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

    const response = await axios.post('https://discord.com/api/oauth2/token', data, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    return response.data.access_token;
  }

  async getDiscordUser(accessToken: string) {
    const response = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  }

  async checkBan(id: string) {
    return await axios
      .get(`https://discord.com/api/v9/guilds/${guildId}/bans/${id}`, {
        headers: {
          Authorization: `Bot ${getEnv('BOT_TOKEN')}`,
        },
        validateStatus: (status) => status === 404,
      })
      .then(() => false)
      .catch((err) => true);
  }
  getRedirectUri() {
    return this.redirectUri;
  }

  async findUserById(userId: string) {
    return await this.supabaseClient.from(TABLES.DISCORD_USER).select('*').eq('discord_id', userId);
  }

  async sendToken(email: string, id: string) {
    return await this.transporter.sendEmail(email);
  }

  async saveOne(email: string, id: string, token: any) {
    const now = new Date();
    const expirationDate = new Date(new Date().getTime() + 5 * 60000);

    return await this.supabaseClient.from(TABLES.DISCORD_USER).insert([
      {
        discord_id: id,
        email,
        token,
        token_created: now.getTime(),
        token_expires: expirationDate.getTime(),
      },
    ]);
  }

  async updateOne(email: string, token: string) {
    const now = new Date();
    const expirationDate = new Date(new Date().getTime() + 5 * 60000);
    return await this.supabaseClient
      .from(TABLES.DISCORD_USER)
      .update({
        token,
        token_created: now.getTime(),
        token_expires: expirationDate.getTime(),
      })
      .eq('email', email);
  }

  async insertUserInDiscord(jwt: string, id: string, next: NextFunction) {
    const access_token = <any>TokenHandler.getMiddleware().decodeJWT(jwt);

    try {
      const result = await axios.put(
        `https://discord.com/api/v9/guilds/${guildId}/members/${id}`,
        { access_token: access_token?.data, roles: [discordRolesId.tryout] }, // ? I'm not sure if tryout will be the initial role
        {
          headers: {
            Authorization: `Bot ${getEnv('BOT_TOKEN')}`,
          },
        }
      );

      return result;
    } catch (err) {
      next(err);
    }
  }

  async validateCode(code: string) {
    return await this.supabaseClient.from(TABLES.DISCORD_USER).select('*').eq('token', code);
  }

  async verifyUser(id: string) {
    return await this.supabaseClient.from(TABLES.DISCORD_USER).update({ verified: true }).eq('id', id);
  }

  async fetchFromDiscord(userId: string) {
    try {
      const guildId = '1086689618197483540';
      return await axios.get(`https://discord.com/api/v9/guilds/${guildId}/members/${userId}`, {
        headers: {
          Authorization: `Bot ${this.getEnvVar('BOT_TOKEN')}`,
        },
      });
    } catch (err) {
      return err;
    }
  }

  async setUserData(userRole: string, id: string) {
    return await this.supabaseClient
      .from(TABLES.DISCORD_USER)
      .update({ role: userRole, verified: true })
      .eq('discord_id', id)
      .select();
  }
}
