import User from '../models/user.js';

import { hash, compare, signToken } from '../util/auth.js';
import { validatePreferences } from '../util/helpers.js';

const registerUser = async (req, res) => {
    try {
        const { username, password, preferences = [] } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: 'User is already registered.' });
        }

        if (!username || !password) {
            return res.status(422).json({ error: 'Must provide both username and password' });
        }

        const hashedPassword = await hash(password);
        const userEntry = await User.create({
            username,
            password: hashedPassword,
            preferences: validatePreferences(preferences)
        });

        res.json({
            _id: userEntry._id,
            username: userEntry.username,
            preferences: userEntry.preferences
        });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(422).json({ error: 'Must provide both username and password' });
        }

        const userEntry = await User.findOne({ username: username.toLowerCase() });
        if (!userEntry) {
            return res.status(401).json({ error: 'Invalid username' });
        }

        const isPasswordEqual = await compare(password, userEntry.password);
        if (!isPasswordEqual) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = signToken(userEntry.username, userEntry._id);

        res.json({
            _id: userEntry._id,
            username: userEntry.username,
            preferences: userEntry.preferences,
            token_type: 'Bearer',
            access_token: token
        });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const getUser = async (req, res) => {
    try {
        const { user_id } = req.verified;
        const { id } = req.params;

        if (user_id !== id) {
            return res.status(403).json({ error: 'Forbidden user.' });
        }

        const userWithMealplans = await User.findById(id).select('-password').populate('mealplans');

        res.json(userWithMealplans);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const updateUser = async (req, res) => {
    try {
        const { user_id } = req.verified;
        const { id } = req.params;
        const { preferences = [] } = req.body;

        if (user_id !== id) {
            return res.status(403).json({ error: 'Forbidden user.' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { preferences: validatePreferences(preferences) },
            { new: true, select: '-password' }
        );

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

export { registerUser, loginUser, getUser, updateUser };
