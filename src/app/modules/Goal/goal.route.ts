import { Router } from 'express';
import { GoalControllers } from './goal.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.post('/create', auth(), GoalControllers.createGoal);
router.get('/', auth(), GoalControllers.getAllGoals);
router.get('/:id', auth(), GoalControllers.getGoalById);
router.patch('/:id', auth(), GoalControllers.updateGoal);
router.delete('/:id', auth(), GoalControllers.deleteGoal);

export const GoalRoutes = router;
