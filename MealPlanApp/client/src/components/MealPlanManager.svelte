<script>
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import MealCard from "./MealCard.svelte"; // Assuming you have this component
    import axios from 'axios';

    // Store definitions
    const week = writable(1);  // Default week is 1
    const mealPlans = writable([]);
    const isLoading = writable(true);
    const userId = writable(null);  // Will store user ID fetched via props or other method
    const userToken = writable(null); // Will store user token

    // Fetch meal plans from the backend using the user ID from localStorage or other method
    const fetchMealPlans = async (selectedWeek) => {
        isLoading.set(true);
        try {
            const response = await axios.get(`http://localhost:3000/users/${$userId}`, {
                headers: {
                    Authorization: `Bearer ${$userToken}`
                }
            });
            // Filter the meal plans by the selected week
            const mealplans = response.data.mealplans.filter(mp => mp.week === selectedWeek);
            mealPlans.set(mealplans);
        } catch (error) {
            console.error("Failed to fetch meal plans:", error);
            mealPlans.set([]);
        } finally {
            isLoading.set(false);
        }
    };

    // Handle week selection
    const handleWeekChange = (event) => {
        week.set(parseInt(event.target.value, 10));
    };

    // Fetch the user ID and token (you can replace this with your own method)
    // For example, assuming the ID and token are passed as props or received via another means
    onMount(() => {
        const user = JSON.parse(localStorage.getItem('user')); // Modify this part if needed
        if (user && user.id && user.header_token) {
            userId.set(user.id); 
            userToken.set(user.header_token);
            fetchMealPlans($week); // Fetch meal plans after setting user ID and token
        } else {
            console.error("User ID or Token not found");
        }
    });

    // Delete meal plan by ID
    const deleteMealPlan = async (mealPlanId) => {
        try {
            const response = await fetch(`http://localhost:3000/mealplans/${mealPlanId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete meal plan");
            }
            // Remove the deleted meal plan from the store
            mealPlans.update((plans) => plans.filter((mealPlan) => mealPlan._id !== mealPlanId));
        } catch (error) {
            console.error(error);
        }
    };

    // Add new meal plan (this assumes the backend supports POST /mealplans)
    const addMealPlan = async () => {
        try {
            const response = await fetch("http://localhost:3000/mealplans", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    week: $week,
                    meals: [],  // You may want to send actual meals data here
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to add meal plan");
            }
            const newMealPlan = await response.json();
            mealPlans.update((plans) => [...plans, newMealPlan]);
        } catch (error) {
            console.error(error);
        }
    };
</script>

<!-- Week Selection -->
<div>
    <label for="week-select">Select Week:</label>
    <select id="week-select" bind:value={$week} on:change={handleWeekChange}>
        <option value="1">Week 1</option>
        <option value="2">Week 2</option>
        <option value="3">Week 3</option>
        <option value="4">Week 4</option>
        <!-- Add more weeks as needed -->
    </select>
</div>

<!-- Add Meal Plan Button -->
<button on:click={addMealPlan}>Add Meal Plan</button>

<!-- Meal Plan Display -->
{#if $isLoading}
    <p>Loading meal plans...</p>
{:else if $mealPlans.length === 0}
    <p>No meal plans found for week {$week}</p>
{:else}
    <div class="meal-plans">
        {#each $mealPlans as mealPlan (mealPlan._id)}
            <div class="meal-plan-card">
                <MealCard {mealPlan} />
                <button on:click={() => deleteMealPlan(mealPlan._id)}>Delete</button>
            </div>
        {/each}
    </div>
{/if}

<style>
    .meal-plans {
        display: flex;
        flex-wrap: wrap;
    }

    .meal-plan-card {
        margin: 1rem;
    }

    select {
        padding: 0.5rem;
        font-size: 1rem;
    }

    button {
        padding: 0.5rem 1rem;
        background-color: #1d2531;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1rem;
        margin-top: 1rem;
    }

    button:hover {
        background-color: #1e2a39;
    }
</style>
