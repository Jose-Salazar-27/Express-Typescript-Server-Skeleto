import jwt from 'jsonwebtoken';
import { inject, injectable } from 'inversify';
import axios, { AxiosResponse } from 'axios';
import querystring from 'querystring';
import { NextFunction, Request, Response } from 'express';
import { AuthServices } from '../services/auth-services';
import { TYPES } from '../shared/constants';

@injectable()
export class AuthController {
  public readonly service: AuthServices;

  constructor(@inject(TYPES.Auth.service) _service: AuthServices) {
    this.service = _service;
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
    const code = req.query.code as string;

    try {
      const accessToken = await this.service.getDiscordToken(code);
      const user = await this.service.getDiscordUser(accessToken);

      const { id } = user;

      const redirectUri = this.service.getRedirectUri();

      const ban = await this.service.checkBan(id);

      if (ban) {
        res.redirect(redirectUri + '/banned');
        return;
      }

      const query = await this.service.findUserById(id);

      // TODO: mover esta funcion de token al tokenHandler
      const token = jwt.sign({ data: accessToken }, 'mySecret', { expiresIn: '5m' });

      if (query.data?.length && query.data[0].verified) {
        res.redirect(redirectUri + `/dashboard?t=${token}`);
      } else {
        res.redirect(redirectUri + `/verify-email?t=${token}`);
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async user(req: any, res: Response) {
    const token = req.token as string;
    try {
      // TODO: mover esta funcion de token al tokenHandler
      const accessToken = jwt.verify(token, 'mySecret') as { data: string };
      const user = await this.service.getDiscordUser(accessToken.data);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async verifyEmail(req: Request, res: Response) {
    try {
      const { email, discord_id: id, token, emailExist } = req.body;
      const emailStatus = await this.service.sendToken(email, id);

      if (emailExist) {
        const updateResult = await this.service.updateOne(email, emailStatus.code!);
        res.status(200).json({ result: updateResult });
      } else {
        const saveStatus = await this.service.saveOne(email, id, emailStatus.code);
        res.status(200).json({
          payload: {
            emailStatus,
            saveStatus,
          },
        });
      }
    } catch (err) {
      res.status(400).json({ err });
    }
  }

  // TODO: IMPLEMENTAR UNA INTERFAZ CUSTOMREQUEST PARA ESTOS 3
  async verifyCode(req: any, res: Response, next: NextFunction) {
    try {
      const { code } = req.body;

      const result = await this.service.validateCode(code);

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
      res.status(500).json({ err });
    }
  }

  async searchInDiscord(req: any, res: Response, next: NextFunction) {
    try {
      const token = req.token as string;
      const { discord_id } = req.payload;
      const discordResult = <AxiosResponse>await this.service.fetchFromDiscord(discord_id);

      if (discordResult.data?.user) {
        next();
      } else {
        const insertResult = await this.service.insertUserInDiscord(token, discord_id, next);
        const isValid = Object.keys(insertResult?.data).length > 0;

        if (isValid) {
          next();
        } else {
          res.status(500).json({ err: 'At this moment, we cannnot process your request' });
        }
      }
    } catch (err) {
      next(err);
    }
  }

  async setUserData(req: any, res: Response, next: NextFunction) {
    try {
      const { discord_id } = req.payload;
      const result = await this.service.setUserData('@everyone', discord_id);

      res.status(201).json({ result });
    } catch (err) {
      next(err);
    }
  }

  async getInstagramToken(req: Request, res: Response) {
    try {
      // todo: delete these constanst later
      // const clientId = 1402923880314690;
      // const redirectUri = 'https://tiento-server-on-render.onrender.com/api/auth/ig';

      const data = {
        client_id: 1402923880314690,
        client_secret: '89c4952d71ba25a1c8f89f62fc38075d',
        grant_type: 'authorization_code',
        redirect_uri: 'https://tiento-server-on-render.onrender.com/api/auth/ig',
        code: req.query.code as string,
      };

      // get access token
      const resutl = await axios.post('https://api.instagram.com/oauth/access_token', data, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' }, //make sure to set this request as url enconded
      });

      return res.send(resutl.data.access_token);
    } catch (error) {
      res.send(error);
    }
  }
}
