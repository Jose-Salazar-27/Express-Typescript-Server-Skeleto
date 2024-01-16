import jwt from 'jsonwebtoken';
import { inject, injectable } from 'inversify';
import axios, { AxiosResponse, HttpStatusCode } from 'axios';
import { NextFunction, Request, Response } from 'express';
import { AuthServices } from '../services/auth-services';
import { TYPES } from '../shared/constants';
import { readToken, writeToken } from '../helpers/token-utils';
import { getEnv } from '../helpers/getenv';
import { HttpError } from '../exceptions/custom-error';
import { dataSets } from '../shared/axiom/datasets';

@injectable()
export class AuthController {
  public readonly service: AuthServices;

  constructor(@inject(TYPES.Auth.service) _service: AuthServices) {
    this.service = _service;
  }

  async discord(req: Request, res: Response, next: NextFunction) {
    try {
      const params = this.service.stringifyDiscordParams();
      const discordOAuthUrl = `https://discord.com/api/oauth2/authorize?${params}`;

      res.redirect(discordOAuthUrl);
    } catch (err) {
      next({ err, path: req.originalUrl });
    }
  }

  async discordCallback(req: Request, res: Response, next: NextFunction) {
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
      next({ err: error, path: req.originalUrl });
    }
  }

  async user(req: any, res: Response, next: NextFunction) {
    const token = req.token as string;
    try {
      const accessToken = jwt.verify(token, getEnv('JWT_KEY')) as { data: string };
      const user = await this.service.getDiscordUser(accessToken.data);
      res.json(user);
    } catch (error) {
      next({ err: error, path: req.originalUrl });
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
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
      next({ err, path: req.originalUrl });
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

          return next();
        }
      }
      throw new HttpError({
        code: HttpStatusCode.UnprocessableEntity,
        dataSet: dataSets.http,
        message: 'code in valid',
      });
    } catch (err) {
      next({ err, path: req.originalUrl });
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

        if (!isValid) {
          throw new HttpError({
            code: HttpStatusCode.InternalServerError,
            dataSet: dataSets.http,
            message: 'cannot find int discord',
          });
        }
        next();
      }
    } catch (err) {
      next({ err, path: req.originalUrl });
    }
  }

  async setUserData(req: any, res: Response, next: NextFunction) {
    try {
      const { discord_id } = req.payload;
      const result = await this.service.setUserData('@everyone', discord_id);

      res.status(HttpStatusCode.Created).json({ result });
    } catch (err) {
      next({ err, path: req.originalUrl });
    }
  }

  async getInstagramToken(req: Request, res: Response, next: NextFunction) {
    try {
      const data = {
        client_id: getEnv('IG_CLIENT_ID'),
        client_secret: getEnv('IG_CLIENT_SECRET'),
        grant_type: 'authorization_code',
        redirect_uri: getEnv('BACKEND_URL') + '/api/auth/ig',
        code: req.query.code as string,
      };

      // get access token
      const result = await axios.post('https://api.instagram.com/oauth/access_token', data, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' }, //make sure to set this request as url enconded
      });

      // change access token to long lived access
      const longLiveToken = await axios.get(
        `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${data.client_secret}&access_token=${result.data.access_token}`
      );
      writeToken(longLiveToken.data.access_token, next);

      return res.send('Token updated successfully. You can close this window');
    } catch (error) {
      next({ err: error, path: req.originalUrl });
    }
  }
}
