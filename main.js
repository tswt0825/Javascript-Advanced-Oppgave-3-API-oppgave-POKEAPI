// ====== GET ELEMENTS FROM THE DOM ======
const pokemonContainer = document.getElementById("pokemonContainer");
const searchBtn = document.getElementById("searchBtn");
const pokemonInput = document.getElementById("pokemonInput");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const pikachuBtn = document.getElementById("pikachuBtn");
const pikachuContainer = document.getElementById("pikachuContainer");

// ====== INITIAL VALUES ======
let offset = 0; // Where we start in the API list
const limit = 20; // How many Pokémon to fetch at once

// ====== ⭐ NEW: FAVORITES STATE ======
let favorites = [];

// Load favorites from localStorage if available
const storedFavorites = localStorage.getItem("favorites");
if (storedFavorites) {
  favorites = JSON.parse(storedFavorites);
}

// ====== FETCH A LIST OF POKÉMON ======
async function fetchPokemonList() {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    );
    const data = await response.json();

    console.log(data);

    const pokemonList = [];

    for (const pokemon of data.results) {
      const pokemonData = await fetchPokemonData(pokemon.url);
      pokemonList.push(pokemonData);
    }

    displayPokemon(pokemonList);
  } catch (error) {
    console.error("Error fetching Pokémon list:", error);
  }
}

// ====== FETCH DATA FOR A SINGLE POKÉMON ======
async function fetchPokemonData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// ====== DISPLAY POKÉMON ON THE PAGE ======
function displayPokemon(pokemonList) {
  pokemonList.forEach((pokemon) => {
    const card = document.createElement("div");
    card.classList.add("pokemon-card");

    //  NEW: check if Pokémon is a favorite
    const isFavorite = favorites.includes(pokemon.name);

    card.innerHTML = `
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      <p>Id: ${String(pokemon.id).padStart(3, "0")}</p>
      <h3>${pokemon.name}</h3>
      <p>Type: ${pokemon.types.map((t) => t.type.name).join(", ")}</p>

      <!--   Favorite button -->
      <button class="fav-btn" data-name="${pokemon.name}">
        ${isFavorite ? "⭐ Remove Favorite" : "☆ Add Favorite"}
      </button>
    `;

    pokemonContainer.appendChild(card);
  });

  // ⭐ NEW: Add event listeners for all favorite buttons
  document.querySelectorAll(".fav-btn").forEach((btn) => {
    btn.addEventListener("click", () => toggleFavorite(btn.dataset.name));
  });
}

// ====== ⭐ NEW: TOGGLE FAVORITE ======
function toggleFavorite(name) {
  if (favorites.includes(name)) {
    favorites = favorites.filter((fav) => fav !== name);
  } else {
    favorites.push(name);
  }

  // Update localStorage
  localStorage.setItem("favorites", JSON.stringify(favorites));

  // Refresh Pokémon list to update star icons
  pokemonContainer.innerHTML = "";
  fetchPokemonList();
}

// ====== ⭐ NEW: SHOW FAVORITES ======
async function showFavorites() {
  if (favorites.length === 0) {
    pokemonContainer.innerHTML = "<p>No favorites yet ⭐</p>";

    return;
  }

  const favData = [];
  for (const name of favorites) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await response.json();

    favData.push(data);
  }

  pokemonContainer.innerHTML = "";
  displayPokemon(favData);
}

// ====== SEARCH FUNCTION ======
searchBtn.addEventListener("click", async () => {
  const name = pokemonInput.value.toLowerCase().trim();

  pokemonInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      searchBtn.click();
    }
  });

  if (!name) {
    alert("Please enter a Pokémon name!");
    return;
  }

  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  const data = await response.json();

  pokemonContainer.innerHTML = "";
  displayPokemon([data]);
});

// ====== LOAD MORE BUTTON ======
loadMoreBtn.addEventListener("click", () => {
  offset += limit;
  fetchPokemonList();
});

// ====== SHOW FAVORITES BUTTON ======
const showFavBtn = document.createElement("button");
showFavBtn.textContent = "⭐ Show Favorites";
showFavBtn.classList.add("load-more");
showFavBtn.addEventListener("click", showFavorites);
document.querySelector("main").appendChild(showFavBtn);

// ====== RUN ON PAGE LOAD ======
fetchPokemonList();

// ====== PIKACHU BUTTON ======
pikachuBtn.addEventListener("click", () => {
  const pikachu = document.createElement("img");
  pikachu.src =
    "https://i.pinimg.com/originals/ab/be/28/abbe28a943ed44fcd98452687f7c46c9.gif";
  pikachu.classList.add("pikachu");
  pikachuContainer.appendChild(pikachu);
});

const backToTopBtn = document.getElementById("backToTopBtn");

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth", // Smooth scroll animation
  });
});
