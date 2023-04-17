import { Request, Response } from 'express';
import { AuthServices } from '../services/auth-services';
import { TokenHandler } from '../middleware/token-handler';
import { Token } from '../models/token-model';
import { JwtPayload } from 'jsonwebtoken';

export class AuthController {
  protected service: AuthServices;

  constructor() {
    this.service = new AuthServices();
  }

  async discord(req: Request, res: Response) {
    try {
      const params = this.service.stringifyDiscordParams();
      const discordOAuthUrl = `https://discord.com/api/oauth2/authorize?${params}`;

      res.redirect(discordOAuthUrl);
    } catch (err) {
      res.status(500).json({ err });
    }
  }

  async discordCallback(req: Request, res: Response) {
    const code = req.query.code;

    try {
      const accessToken = await this.service.getDiscordToken(code);
      const user = await this.service.getDiscordUser(accessToken);

      // Verificar que el usario excista o no

      // const { id } = user

      // const dbUser = await supabase...AuthController

      // if(db) {
      //   res.redirect(redirectUri);
      // } else {

      // }

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
      const user = await this.service.getDiscordUser(accessToken);
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async verifyEmail(req: Request, res: Response) {
    try {
      const { email, id } = req.body;
      const result = await this.service.sendToken(email, id);

      res.status(200).json({ payload: result });
    } catch (err) {
      res.status(400).json({ err });
    }
  }

  async verifyToken(req: Request, res: Response) {
    try {
      const { token } = req.params;
      const decode = <Token>TokenHandler.getMiddleware().decode(token);
      console.log('======== DECODED TOKEN ========');
      console.log(decode);

      if (!decode) {
        return res.status(500).json({ err: 'something is wrong with jwt' });
      }

      const result = this.service.fetchUserFromDiscord(decode);

      res.status(200).json({ payload: result });
    } catch (err) {
      res.status(401).json({ err });
    }
  }
}
