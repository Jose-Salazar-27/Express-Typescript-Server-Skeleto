import jwt from 'jsonwebtoken';
import { inject, injectable } from 'inversify';
import axios, { AxiosResponse, HttpStatusCode } from 'axios';
import { NextFunction, Request, Response } from 'express';
import { AuthServices } from '../services/auth-services';
import { TYPES } from '../shared/constants';
import { readToken, writeToken } from '../helpers/token-utils';
import { getEnv } from '../helpers/getenv';

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
      res.status(HttpStatusCode.InternalServerError).json({ err });
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

      const token = jwt.sign({ data: accessToken }, getEnv('JWT_KEY'), { expiresIn: '5m' });

      if (query.data?.length && query.data[0].verified) {
        res.redirect(redirectUri + `/dashboard?t=${token}`);
      } else {
        res.redirect(redirectUri + `/verify-email?t=${token}`);
      }
    } catch (error) {
      res.status(HttpStatusCode.InternalServerError).json({ error });
    }
  }

  async user(req: any, res: Response) {
    const token = req.token as string;
    try {
      const accessToken = jwt.verify(token, getEnv('JWT_KEY')) as { data: string };
      const user = await this.service.getDiscordUser(accessToken.data);
      res.json(user);
    } catch (error) {
      res.status(HttpStatusCode.InternalServerError).json({ error });
    }
  }

  async verifyEmail(req: Request, res: Response) {
    try {
      const { email, discord_id: id, token, emailExist } = req.body;
      const emailStatus = await this.service.sendToken(email, id);

      if (emailExist) {
        const updateResult = await this.service.updateOne(email, emailStatus.code!);
        res.status(HttpStatusCode.Ok).json({ result: updateResult });
      } else {
        const saveStatus = await this.service.saveOne(email, id, emailStatus.code);
        res.status(HttpStatusCode.Ok).json({
          payload: {
            emailStatus,
            saveStatus,
          },
        });
      }
    } catch (err) {
      res.status(HttpStatusCode.BadRequest).json({ err });
    }
  }

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
        res.status(HttpStatusCode.UnprocessableEntity).json({ err: 'code in valid' });
      }
    } catch (err) {
      res.status(HttpStatusCode.InternalServerError).json({ err });
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
          res
            .status(HttpStatusCode.InternalServerError)
            .json({ err: 'At this moment, we cannnot process your request' });
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

      res.status(HttpStatusCode.Created).json({ result });
    } catch (err) {
      next(err);
    }
  }

  async getInstagramToken(req: Request, res: Response, next: NextFunction) {
    try {
      // TODO: remove this to .env
      const data = {
        client_id: 1402923880314690,
        client_secret: '89c4952d71ba25a1c8f89f62fc38075d',
        grant_type: 'authorization_code',
        redirect_uri: 'https://tiento-server-on-render.onrender.com/api/auth/ig',
        code: req.query.code as string,
      };

      // get access token
      const result = await axios.post('https://api.instagram.com/oauth/access_token', data, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' }, //make sure to set this request as url enconded
      });

      writeToken(result.data.access_token, next);

      return res.send('Token updated successfully. You can close this window');
    } catch (error) {
      res.send(error);
    }
  }
}
