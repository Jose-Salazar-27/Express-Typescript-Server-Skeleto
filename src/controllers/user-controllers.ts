import { Request, Response } from 'express';
import { supabase } from '../config/supabase-config';
import { UserService } from '../services/user-services';

export class UserController {
  protected service: UserService;
  constructor() {
    this.service = new UserService();
  }

  async uploadUser(req: Request, res: Response) {
    const { name, email, password } = req.body;

    try {
      const result = await this.service.uploadUser(name, password, email);
      res.status(201).json({ result });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  }

  async searchUser(req: Request, res: Response) {
    const { name, email, password } = req.body;
    console.log({
      params: [name, email, password],
    });

    const user = await this.service.getSingleUser(email);

    if (!user?.data?.length || user.error) {
      return res.status(400).json({ error: user.error || 'something was wrong fetching' });
    }

    res.status(200).json({ payload: user });
  }

  async validateTest(req: Request, res: Response) {
    try {
      console.log('===== controller is running =====');
      const users = await this.service.getUsers();

      res.send({
        ok: 'todo okay perro',
        data: req.body,
        users,
      });
    } catch (error) {
      res.send({ error });
    }
  }
}
