import { Request, Response } from 'express';
import { supabase } from '../config/supabase-config';
import { UserService } from '../services/user-services';

export class UserController {
  protected service: UserService;
  constructor() {
    this.service = new UserService();
  }

  // protected async getAllUsers(req: Request, res: Response) {
  //   const { data: users, error } = await supabase.from('Users').select('*');

  //   console.log(users);
  //   if (error) {
  //     return res.json({ error });
  //   }

  //   console.log(users);
  //   res.json({ payload: 'ok' });
  // }

  // protected async searchUser(req: Request, res: Response) {
  //   const { name, email, password } = req.body;
  //   console.log(req.body);

  //   const user = await supabase.from('Users').select().textSearch('email', email);

  //   if (!user.data?.length || user.error) {
  //     res.status(400).json({ error: user.error || 'something was wrong fetching' });
  //   }
  // }

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
