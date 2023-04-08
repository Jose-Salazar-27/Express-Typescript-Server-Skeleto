import { Router } from 'express';
import { getAllUsers, searchUser, validateTest } from '../controllers/user-controllers';
import { validateLoginUser } from '../validators/user-validator';

const router = Router();

router.get('/', getAllUsers);
router.get('/login', searchUser);
router.get('/test', validateLoginUser, validateTest);

export { router };
