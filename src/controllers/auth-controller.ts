import { Request, Response } from 'express';
import { AuthServices } from '../services/auth-services';
import { TokenHandler } from '../middleware/token-handler';
import { Token } from '../models/token-model';

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

      const { id } = user;

      const redirectUri = this.service.getRedirectUri();
      console.log(user);

      const query = await this.service.findUserById(id);

      if (query.data?.length) {
        res.redirect(redirectUri);
        res.cookie('discord_access_token', JSON.stringify(accessToken));
        res.redirect(redirectUri);
      } else {
        // ======= TODO: ANADIR URL DEL VERIFY AQUI PARA TERMINAL ESTA RUTA ======
        // res.redirect('URL DEL VERIFY')
      }
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
      const { email, discord_id: id } = req.body;
      const emailStatus = await this.service.sendToken(email, id);
      const saveStatus = await this.service.saveOne(email, id, emailStatus.token);

      res.status(200).json({
        payload: {
          emailStatus,
          saveStatus,
        },
      });
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
