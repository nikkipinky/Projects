<script>
    import { onMount } from 'svelte';
    import MealCard from '../components/MealCard.svelte';
  
    let searchQuery = '';
    let searchResults = [];
    let isLoading = false;
    let errorMessage = '';
  
    // Function to search meals based on the query entered by the user
    async function searchMeals() {
      if (!searchQuery.trim()) {
        errorMessage = 'Please enter a search term.';
        return;
      }
  
      isLoading = true;
      errorMessage = '';  // Reset error message on each search
      try {
        const response = await fetch(`http://localhost:3000/meals/search?name=${encodeURIComponent(searchQuery)}`);
        console.log('API Response:', response);  // Log the raw response for debugging
  
        if (response.ok) {
          const data = await response.json();
          console.log('Search results:', data);  // Log the parsed response data
  
          // Map the results into a format that the MealCard component expects
          searchResults = data.map((meal) => ({
            id: meal.id,
            title: meal.title,
            image: meal.image,
            instructions: meal.instructions || 'No instructions available.'
          }));
        } else {
          const error = await response.text();
          errorMessage = `Error fetching meals: ${error}`;
          searchResults = [];
        }
      } catch (error) {
        errorMessage = `Error searching meals: ${error.message}`;
        searchResults = [];
      } finally {
        isLoading = false;
      }
    }
  </script>
  
  <div>
    <h2>Search Meals</h2>
  
    <!-- Search bar -->
    <div class="search-bar">
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search meals..."
        on:keydown={(e) => e.key === 'Enter' && searchMeals()}
      />
      <button on:click={searchMeals}>Search</button>
    </div>
  
    <!-- Error message -->
    {#if errorMessage}
      <p class="error">{errorMessage}</p>
    {/if}
  
    <!-- Loading indicator -->
    {#if isLoading}
      <p>Loading...</p>
    {/if}
  
    <!-- Meal cards for search results -->
    <div class="meal-card-grid">
      {#each searchResults as meal}
        <MealCard {meal} />
      {/each}
    </div>
  </div>
  
  <style>
    .search-bar {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
  
    .search-bar input {
      flex: 1;
      padding: 0.5rem;
      font-size: 1rem;
      border-radius: 4px;
      border: 1px solid #ccc;
    }
  
    .search-bar button {
      padding: 0.5rem 1rem;
      font-size: 1rem;
      background-color: #007bff;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  
    .search-bar button:hover {
      background-color: #0056b3;
    }
  
    .meal-card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }
  
    .error {
      color: red;
      font-weight: bold;
    }
  </style>
  