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
import { prisma } from '../../prisma/prisma.client';
import { Prisma } from '@prisma/client';

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
    return await prisma.discordUser.findUnique({ where: { discordId: userId } });
  }

  async sendToken(email: string, id: string) {
    return await this.transporter.sendEmail(email);
  }

  async saveOne(email: string, id: string, token: any) {
    try {
      const now = new Date();
      const expirationDate = new Date(new Date().getTime() + 4 * 60000);

      const newUser = <Prisma.DiscordUserCreateInput>{
        discordId: id,
        email,
        token,
        tokenCreated: now,
        tokenExpires: expirationDate,
      };

      return await prisma.discordUser.create({
        data: newUser,
      });
    } catch (error) {
      console.log(`error while creating user: ${error}`);
      return null;
    }
  }

  async updateOne(email: string, token: string) {
    const now = new Date();
    const expirationDate = new Date(new Date().getTime() + 5 * 60000);

    const updateInput = <Prisma.DiscordUserUpdateInput>{
      token,
      createdAt: now.getTime(),
      tokenExpires: expirationDate.getTime(),
    };

    return await prisma.discordUser.update({
      where: { email: email },
      data: updateInput,
    });
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

  // improve this query later
  async validateCode(code: string) {
    try {
      const result = await prisma.discordUser.findFirst({ where: { token: code } });
      return result;
    } catch (error) {
      console.log(`validate code err: ${error}`);
      return null;
    }
  }

  async verifyUser(id: string) {
    return await prisma.discordUser.update({ where: { id }, data: { verified: true } });
  }

  async fetchFromDiscord(userId: string) {
    try {
      const guildId = '1086689618197483540';
      const response = await axios.get(`https://discord.com/api/v9/guilds/${guildId}/members/${userId}`, {
        headers: {
          Authorization: `Bot ${this.getEnvVar('BOT_TOKEN')}`,
        },
      });

      return response;
    } catch (err) {
      console.log(`fetch from discord err: ${err}`);
      return err;
    }
  }

  async setUserData(userRole: string, id: string) {
    return await prisma.discordUser.update({
      where: { discordId: id },
      data: { role: userRole, verified: true },
    });
  }
}
