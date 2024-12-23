<script>
  import { navigate } from "svelte-routing";
  import axios from "axios";
  let username = $state("");
  let password = $state("");
  let selectedPreferences = $state([]); // Array to store selected preferences
  let errorMessage = $state("");

  let formType = $state("login");

  const DIETS = [
    "gluten free",
    "dairy free",
    "vegan",
    "vegetarian",
    "ketogenic",
    "pescetarian",
    "primal",
    "paleolithic",
  ];

  const formConfig = {
    login: {
      title: "Login",
      button_text: "Login",
      toggle_text: "No account? Register",
    },
    register: {
      title: "Register",
      button_text: "Register",
      toggle_text: "Already have an account? Login",
    },
  };

  const formTypeToggle = () => {
    formType = formType === "login" ? "register" : "login";
    errorMessage = ""; // Clear error messages when switching forms
    username = "";
    password = "";
    selectedPreferences = []; // Reset preferences when toggling
  };

  const handleSubmit = async () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (trimmedUsername === "") {
      errorMessage = "Username cannot be empty or consist of only spaces.";
      return;
    }
    if (trimmedPassword === "") {
      errorMessage = "Password cannot be empty or consist of only spaces.";
      return;
    }
    const usernameRegex = /[a-zA-Z]/;
    if (!usernameRegex.test(trimmedUsername)) {
      errorMessage = "Username must contain at least one alphabet.";
      return;
    }
    const endpoint = `http://localhost:3000/users/${formType}`;

    const payload = {
      username: trimmedUsername,
      password: trimmedPassword,
      preferences: formType === "register" ? selectedPreferences : [],
    };

    try {
      const response = await axios.post(endpoint, payload);
      console.log(response.data);

      if (formType === "login" && response.data._id) {
        const { _id, token_type, access_token } = response.data;

        const user = { _id, header_token: `${token_type} ${access_token}` };
        localStorage.setItem("user", JSON.stringify(user));
        window.dispatchEvent(new Event("storage-updated"));

        navigate(`/profile/${_id}`);
      }

      if (formType === "register" && response.data._id) {
        formTypeToggle();
      }
    } catch (error) {
      // Handle incorrect credentials or other errors

      if (error.response?.status === 409) {
        errorMessage = "User is already registered.";
      } else if (error.response?.status === 422) {
        errorMessage = "Must provide both username and password";
      } else if (error.response?.status === 401) {
        errorMessage = "Invalid username or password. Please try again.";
      } else if (error.response?.status === 400) {
        errorMessage =
          error.response.data?.message ||
          "Bad request. Please check your inputs.";
      } else {
        errorMessage = "Authentication failed. Please try again.";
      }
    }
  };
</script>

<div class="form-container">
  <h1>{formConfig[formType].title}</h1>
  {#if errorMessage}
    <div class="error-message">{errorMessage}</div>
  {/if}

  <input type="text" bind:value={username} placeholder="username" />
  <input type="password" bind:value={password} placeholder="password" />
  {#if formType === "register"}
    <span class="diet-list-title">Select preferences (optional):</span>
    <div class="preferences">
      {#each DIETS as diet}
        <div class="checkbox-group">
          <input
            type="checkbox"
            bind:group={selectedPreferences}
            value={diet}
            id={diet}
          />
          <label for={diet}>{diet}</label>
        </div>
      {/each}
    </div>
  {/if}

  <button class="submit-btn" onclick={handleSubmit}>
    {formConfig[formType].button_text}
  </button>

  <div class="toggle-container">
    <label for="toggle" class="toggle-label">
      {formConfig[formType].toggle_text}
    </label>
    <button
      class="toggle-btn"
      role="switch"
      aria-label="Toggle between login and register"
      aria-checked={formType === "login" ? false : true}
      class:active={formType === "login"}
      onclick={formTypeToggle}
    ></button>
  </div>
</div>

<style>
  .form-container {
    background-color: #1d2531;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 32rem;
    margin: 2.5rem auto;
    text-align: center;
  }

  .form-container h1 {
    text-transform: uppercase;
  }

  .form-container input {
    width: 100%;
    padding: 1rem;
    margin: 1rem 0;
    border: none;
    border-radius: 0.5rem;
    background: #0f1621;
    color: #a0a0a0;
  }

  .form-container input:focus {
    outline: none;
    box-shadow: 0 0 0.3125rem #394961;
  }

  .form-container .submit-btn {
    width: 100%;
    padding: 1rem;
    border: none;
    border-radius: 0.5rem;
    background: #f2c069;
    cursor: pointer;
    margin-bottom: 1rem;
  }

  .form-container .submit-btn:hover {
    background: #d9ac5e;
  }

  .toggle-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .toggle-label {
    font-size: 1rem;
  }

  .toggle-btn {
    width: 3rem;
    height: 1.5rem;
    background-color: #555;
    border-radius: 1.875rem;
    position: relative;
    cursor: pointer;
    transition: background-color 0.3s;
    display: flex;
    align-items: center;
    padding: 0;
    outline: none;
    border: none;
  }

  .toggle-btn:before {
    content: "";
    position: absolute;
    top: 0.125rem;
    left: 0.125rem;
    width: 1.25rem;
    height: 1.25rem;
    background-color: #d6dbe4;
    border-radius: 50%;
    transition: all 0.3s ease;
  }

  .toggle-btn.active {
    background-color: #d9ac5e;
  }

  .toggle-btn.active:before {
    transform: translateX(1.5rem);
  }

  .toggle-btn:focus {
    outline: none;
    box-shadow: none;
  }

  .error-message {
    color: #ff4d4f;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    font-weight: bold;
    text-align: center;
  }

  .diet-list-title {
    font-size: 1rem;
    padding: 10px;
    font-weight: bold;
    color: #f2c069;
    margin: 1rem 0;
    width: 100%;
  }

  .preferences {
    margin: 1rem 0rem;
    padding: 10px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.5rem;
    width: 100%;
  }

  .checkbox-group {
    display: flex;
    align-items: center;
  }

  .checkbox-group input[type="checkbox"] {
    margin-right: 0.75rem;
    width: 1rem;
    height: 1rem;
  }

  .checkbox-group label {
    font-size: 1rem;
    color: #a0a0a0;
  }
</style>
