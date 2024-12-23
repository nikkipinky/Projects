const DIETS = [
    'gluten free',
    'dairy free',
    'vegan',
    'vegetarian',
    'ketogenic',
    'pescetarian',
    'primal',
    'paleolithic'
];

const validatePreferences = (preferences) => {
    return preferences
        .map((preference) => preference.toLowerCase())
        .filter((preference) => DIETS.includes(preference));
};

export { validatePreferences };
