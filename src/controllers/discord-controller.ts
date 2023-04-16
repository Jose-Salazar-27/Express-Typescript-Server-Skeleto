import { Request, Response } from 'express';
import { DiscordServices } from '../services/discord-services';

export class DiscordController {
  protected service: DiscordServices;

  constructor() {
    this.service = new DiscordServices();
  }

  async saveMessage(req: Request, res: Response) {
    console.log(req.body);
    try {
      const { roles, ...payload } = req.body;
      const result = await this.service.saveMessage(payload, roles);

      res.status(201).json({ result });
    } catch (err) {
      console.log('==== Error ====');
      res.json({ err });
    }
  }

  async testMessage(req: Request, res: Response) {
    console.log(req.body);
    try {
      const { roles, ...payload } = req.body;
      const result = await this.service.testMessage(payload, roles);

      res.status(201).json({ status: 201, result });
    } catch (err) {
      console.log('==== Error ====');
      res.json({ err });
    }
  }
}
