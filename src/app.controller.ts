import { Router } from 'express';
import usersRouter from './users/users.controller';
import citiesRouter from './cities/cities.controller';

const router = Router();

router.use('/users', usersRouter);
router.use('/cities', citiesRouter);

export default router;