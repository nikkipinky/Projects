<script>
  import axios from 'axios';
  import { onMount } from "svelte";
  import MealCard from '../components/MealCard.svelte'; 

    let { id } = $props();


    let profile = $state(null);

    onMount(async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await axios.get(`http://localhost:3000/users/${id}`, {
                headers: {
                    Authorization: user.header_token
                }
            });

            //console.log("API Response:", response.data);
            profile = response.data;

        } catch (error) {
            console.log(error);

        }
    });
</script>

<div class="profile-container">
    {#if !profile}
        <div>Loading user Profile...</div>
    {:else}
    {#if !profile.preferences.length}
    <h1>Welcome, {profile.username}! You did not mention any preferences.</h1>
    {:else}
    <h1>Welcome, {profile.username}! Your preferences are {profile.preferences}.</h1>
    {/if}
    <hr />
        <h2> Meal Plan</h2>
        <div class="meal-plan">
            {#if profile.mealplans.length === 0}
                <p>No meals in your mealplan.</p>
                {:else}
                    {#each profile.mealplans as mealplan}
                        <div class="mealplan-week">
                            <h3>Week {mealplan.week}</h3>
                            <MealCard 
                                meals={mealplan.meals}
                            />
                        </div>
                    {/each}
                {/if}
        </div>
    {/if}
</div>

<style>
    .profile-container {
        margin: 2rem auto;
        padding: 2rem;
        text-align: left;
    }

    h1 {
        font-family: 'Montserrat', sans-serif;
        font-size: 2rem;
    }

    h2 {
        font-family: 'Montserrat', sans-serif;
        font-size: 1.5rem;
    }

    .meal-plan {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-top: 2rem;
    }
    .mealplan-week {
    display: block; /* Ensures week content stacks vertically */
  }

  h3 {
    margin-bottom: 1rem; /* Space between week heading and cards */
    font-size: 1.25rem;
    font-family: 'Montserrat', sans-serif;
  }
</style>

Try fetching user id from Profile.svelte

