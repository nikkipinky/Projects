/* eslint-disable camelcase */
import express from 'express';

import { verifyUser } from '../middleware/authorization.js';
import { registerUser, loginUser, getUser, updateUser } from '../controllers/user.js';

const router = express.Router();

// POST /users/register
router.post('/register', registerUser);

// POST /users/login
router.post('/login', loginUser);

// GET /users/:id
router.get('/:id', verifyUser, getUser);

// PUT /users/:id
router.put('/:id', verifyUser, updateUser);

export default router;
