/* eslint-disable camelcase */
import express from 'express';

import { verifyUser } from '../middleware/authorization.js';
import { addMealPlan, deleteMealPlan } from '../controllers/mealplan.js';

const router = express.Router();

router.post('/', verifyUser, addMealPlan);

router.delete('/:id', verifyUser, deleteMealPlan);

export default router;
