import axios from 'axios';
import { ServerConfig } from '../config/server-config';
import querystring from 'querystring';

export class AuthService extends ServerConfig {
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
      scope: 'identify email'
    };

    const response = await axios.post('https://discord.com/api/oauth2/token', querystring.stringify(data), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    return response.data.access_token;
  }

  async getDiscordUser(accessToken: any) {
    const response = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return response.data;
  }

  getRedirectUri() {
    return this.redirectUri;
  }
}
