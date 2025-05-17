import { Router } from 'express';
import usersRouter from './users/users.controller';
import citiesRouter from './cities/cities.controller';
import modulesRouter from './modules/modules.controller';
import guidesRouter from './guides/guides.controller';
import questionsRouter from './questions/questions.controller';

const router = Router();

router.use('/users', usersRouter);
router.use('/cities', citiesRouter);
router.use('/guides', guidesRouter);
router.use('/modules', modulesRouter);
router.use('/questions', questionsRouter);

export default router;