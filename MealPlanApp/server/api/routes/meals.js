/* eslint-disable camelcase */
import express from 'express';

import { verifyUser } from '../middleware/authorization.js';
import { searchMeals } from '../controllers/meal.js';

const router = express.Router();

// GET /meals/search
router.get('/search', verifyUser, searchMeals);

export default router;
