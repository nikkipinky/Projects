<script>
  import { Router, Link, Route, navigate } from "svelte-routing";

  import LoginRegister from "./pages/LoginRegister.svelte";
  import Profile from "./pages/Profile.svelte";
  import MealPlanManager from './components/MealPlanManager.svelte';
  import MealPlanSearch from './components/MealSearch.svelte';

  const verifyLogin = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("Stored User:", user);

    return user || null;
  };

  const logout = () => {
    localStorage.removeItem("user");
    user = null;

    navigate("/account");
  };

  let user = $state(verifyLogin());
  window.addEventListener("storage-updated", () => {
    user = verifyLogin();
  });
</script>

<div class="app-container">
  <Router>
    <nav class="navbar">
      <div class="navbar-app-name">
        <h1>CS5220 MealPlan App</h1>
      </div>

      <div class="navbar-actions">
        {#if user}
          <Link to="/profile/{user._id}">
            <span class="navbar-item">Profile</span>
          </Link>
          <Link to="/manage">
            <span class="navbar-item">Manage Meal Plans</span>
          </Link>
          <Link to="/search">
            <span class="navbar-item">Search Meal Plans</span>
          </Link>
          <button class="navbar-item logout-btn" onclick={logout}>Logout</button>
        {:else}
          <Link to="/account"><span class="navbar-item">Login</span></Link>
        {/if}
      </div>
    </nav>

    <div>
      <Route path="/account">
        <LoginRegister />
      </Route>

      <Route path="/profile/:id" let:params>
        <Profile id={params.id} />
      </Route>

      <Route path="/manage">
        {#if user}
          <MealPlanManager />
        {:else}
          <p>Please log in to manage your meal plans.</p>
        {/if}
      </Route>

      <Route path="/search">
        {#if user}
          <MealPlanSearch />
        {:else}
          <p>Please log in to search meal plans.</p>
        {/if}
      </Route>
    </div>
  </Router>
</div>

<style>
  .app-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .navbar {
    background-color: #0c111a;
    padding: 1rem;
    border-bottom: 1px solid #00001a;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .navbar-app-name {
    display: flex;
    align-items: center;
  }

  .navbar h1 {
    font-family: "Montserrat", sans-serif;
    font-size: 1.8rem;
    font-weight: 300;
    margin: 0;
    color: #d6dbe4;
  }

  .navbar-actions {
    display: flex;
    align-items: center;
  }

  .navbar-item {
    margin-right: 1rem;
    color: #d6dbe4;
    text-transform: uppercase;
    font-size: 1rem;
    text-decoration: none;
  }

  .logout-btn {
    margin-left: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    background: #f2c069;
    color: #0c111a;
    border: none;
    cursor: pointer;
  }

  .logout-btn:hover {
    background-color: #a0a8b5;
  }
</style>
