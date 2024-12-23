import MealPlan from '../models/mealplan.js';

const MAX_MEALS = 3;

const addMealPlan = async (req, res) => {
    try {
        const { user_id } = req.verified;
        const { week, meal } = req.body;

        // find the mealplan for the user and week
        const mealplanEntry = await MealPlan.findOne({ user_id, week });

        if (mealplanEntry) {
            // check if the mealplan already has 3 meals
            if (mealplanEntry.meals.length >= MAX_MEALS) {
                return res.status(400).json({ error: 'MealPlan contains the maximum of 3 meals' });
            }

            // add the meal to the meals array
            mealplanEntry.meals.push(meal);
            await mealplanEntry.save();

            return res.json(mealplanEntry);
        }

        // if no mealplan exists for user and week - create a new one
        const createdMealPlan = await MealPlan.create({
            user_id,
            week,
            meals: [meal]
        });

        res.json(createdMealPlan);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const deleteMealPlan = async (req, res) => {
    try {
        const { user_id } = req.verified;
        const { id } = req.params;

        // find and delete the mealplan by user_id and _id
        const deletedMealPlan = await MealPlan.findOneAndDelete({
            _id: id,
            user_id
        });

        if (!deletedMealPlan) {
            return res.status(404).json({ message: 'MealPlan not found' });
        }

        res.json({ _id: id, message: 'Delete success' });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

export { addMealPlan, deleteMealPlan };
