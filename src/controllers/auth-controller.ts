import { NextFunction, Request, Response } from 'express';
import { AuthServices } from '../services/auth-services';
import { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';
import { AxiosResponse } from 'axios';
import jwt from 'jsonwebtoken'

interface CustomRequest extends Request {
  payload: {
    token: string;
    token_expires?: string;
    id: string;
    roles?: string;
  };
}

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

      // res.cookie('discord_access_token', JSON.stringify(accessToken), { domain: 'react-frontend-demo.vercel.app', httpOnly: true, secure: true, sameSite: 'none', path: '/verify-email' });
      const token = jwt.sign({ data: accessToken }, 'mySecret', { expiresIn: '5m' });

      if (query.data?.length) {
        res.redirect(redirectUri);
      } else {
        res.redirect(redirectUri + `/verify-email?t=${token}`);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }

  // TODO: BORRAR ESTE TEST
  async test(req: Request, res: Response) {
    const id = 'f7a3202b-6f74-4d3d-b8e5-ae3eb4b7c589';
    const result = await this.service.findUserById(id);

    res.send({ result });
  }

  async user(req: Request, res: Response) {
    const token = req.token as string;
    try {
      const accessToken = jwt.verify(token, 'mySecret') as { data: string };
      const user = await this.service.getDiscordUser(accessToken.data);
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

  // TODO: IMPLEMENTAR UNA INTERFAZ CUSTOMREQUEST PARA ESTOS 3
  async verifyCode(req: any, res: Response, next: NextFunction) {
    try {
      const { code } = req.body;

      const result = await this.service.validateCode(code);
      console.log('=========== VERIFY CODE CONTROLLER ===========');
      console.log(result);

      if (result.data?.length) {
        const { token, token_expires, discord_id } = result.data[0];

        if (token === code && new Date().getTime() < token_expires) {
          req.payload = { token, token_expires, discord_id };

          next();
        }
      } else {
        res.status(422).json({ err: 'code in valid' });
      }
    } catch (err) {
      // res.status(500).json({ err });
      next(err);
    }
  }

  async searchInDiscord(req: any, res: Response, next: NextFunction) {
    try {
      const { discord_id } = req.payload;
      const discordResult = <AxiosResponse>await this.service.fetchFromDiscord(discord_id);
      console.log('=========== SEARACH IN DISCORD CONTROLLER ===========');
      console.log(discordResult.data);

      if (discordResult.data?.user) {
        // const { roles } = discordResult.data.user;
        next();
      } else {
        res.status(500).json({ err: 'cannot found user in discord' });
      }
    } catch (err) {
      next(err);
    }
  }

  async setUserData(req: any, res: Response, next: NextFunction) {
    try {
      const { discord_id } = req.payload;
      const result = await this.service.setUserData('@everyone', discord_id);
      console.log('===========  SET USER DATA CONTROLLER ===========');
      console.log(result);

      res.status(201).json({ result });
    } catch (err) {
      next(err);
    }
  }
}
