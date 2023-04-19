import { Request, Response } from 'express';
import { AuthServices } from '../services/auth-services';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { AxiosResponse } from 'axios';

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

      res.cookie('discord_access_token', JSON.stringify(accessToken));

      if (query.data?.length) {
        res.redirect(redirectUri);
      } else {
        res.redirect(redirectUri + '/verify-email');
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

  async verifyCode(req: Request, res: Response) {
    try {
      const { code } = req.body;

      // TODO: ESTO DEBE VALIDARSE DESDE EL MIDDLEWARE QUE ESTA ANTES DE ESTE CONTROLLER, POR ESO LO COMENTO. EN UN PR FUTURO SE ANADE LA VALIDACION DEL CODIFGO

      // if (!code) {
      //   return res.status(500).json({ err: 'missing code' });
      // }

      const result = await this.service.validateCode(code);
      console.log('============= VALIDATE CODE =============');
      console.log(result);

      if (result.data?.length) {
        const { token, token_expires, id } = result.data[0];

        if (token === code && new Date().getTime() < token_expires) {
          const updateResult = await this.service.verifyUser(id);
          console.log('============= UPDATE RESULT =============');
          console.log(updateResult);

          const discordResult = <AxiosResponse>await this.service.fetchFromDiscord();
          console.log('============= DISCORD RESULT =============');
          console.log(discordResult);

          if (discordResult.data?.user) {
            const { roles } = discordResult.data.user;
            const setDisdcordData = await this.service.setUserData(roles, id);

            console.log('============= SET DISCORD RESULT =============');
            console.log(setDisdcordData);

            const redirectUri = this.service.getRedirectUri();

            res.redirect(redirectUri + '/dashboard');
            res.send({ setDisdcordData });
          }
        } else {
          res.status(422).send('Invalid data');
        }
      } else {
        res.status(422).json({ err: 'code in valid' });
      }

      res.status(200).json({ payload: result });
    } catch (err) {
      res.status(500).json({ err });
    }
  }
}
