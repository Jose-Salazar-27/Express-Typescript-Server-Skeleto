import { Request, Response } from 'express';
import { supabase } from '../config/supabase-config';

const getAllUsers = async (req: Request, res: Response) => {
  // const { data: users, error } = await supabase.from('Users').select('*');

  let { data: users, error } = await supabase.from('Users').select('*');

  console.log(users);
  if (error) {
    return res.json({ error });
  }
  // res.json({ payload: users });
  console.log(users);
  res.json({ payload: 'ok' });
};

const searchUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  console.log(req.body);

  const user = await supabase.from('Users').select().textSearch('email', email);

  if (!user.data?.length || user.error) {
    res.status(400).json({ error: user.error || 'something was wrong fetching' });
  }
};

const validateTest = (req: Request, res: Response) => {
  try {
    console.log('controller is running');

    res.send({
      test: 'todo okay perro',
      data: req.body,
    });
  } catch (error) {
    res.send({ error });
  }
};

export { getAllUsers, searchUser, validateTest };
