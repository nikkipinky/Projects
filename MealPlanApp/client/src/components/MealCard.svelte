<script>
    export let meals = [];
    export let week;
  </script>

<div class="meal-card-container">
    {#if meals.length === 0}
        <p>No meals available for this week.</p>
    {:else}
        {#each meals as meal}
            <div class="meal-card">
                <img src={meal.image} alt={meal.name} class="meal-image" />
                <div class="meal-info">
                    <h4>{meal.name}</h4>
                    <p>{meal.diets.join(", ")}</p>
                </div>
            </div>
        {/each}
    {/if}
</div>
<style>
    .meal-card {
        background-color: #1d2531;
        padding: 2em;
        margin: 10px;
        border-radius: 25px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        max-width: 250px;
        transition: transform 0.2s ease-in-out;
    }

    .meal-card:hover {
        transform: scale(1.05);
    }

    .meal-image {
        width: 100%;
        height: 200px;
        border-radius: 25px;
        object-fit: cover;
        margin-bottom: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .meal-info {
        text-align: center;
    }

    .meal-name {
        font-family: 'Montserrat', sans-serif;
        font-size: 1.5rem;
        margin: 0.5rem 0;
    }

    .meal-diets {
        color: #a8b9b7;
        margin: 0.3rem 0;
    }
    .meal-week {
        font-weight: bold;
        margin-top: 0.3rem;
    }

   
</style>