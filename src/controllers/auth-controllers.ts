import { Request, Response } from 'express';
import { AuthService } from '../services/auth-services';

export class AuthController {
  protected service: AuthService;

  constructor() {
    this.service = new AuthService();
  }

  async discord(req: Request, res: Response) {
    const params = this.service.stringifyDiscordParams();
    const discordOAuthUrl = `https://discord.com/api/oauth2/authorize?${params}`;

    res.redirect(discordOAuthUrl);
  }

  async discordCallback(req: Request, res: Response) {
    const code = req.query.code;

    try {
      const accessToken = await this.service.getDiscordToken(code);
      const user = await this.service.getDiscordUser(accessToken);
      const redirectUri = this.service.getRedirectUri();
      console.log(user);

      res.cookie('discord_access_token', JSON.stringify(accessToken));
      res.redirect(redirectUri);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }

  async user(req: Request, res: Response) {
    const accessToken = req.token;

    try {
      const user = await this.service.getDiscordUser(accessToken)
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
