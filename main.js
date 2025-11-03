// ====== HENTER ELEMENTER FRA DOM ======
const pokemonContainer = document.getElementById("pokemonContainer");
const searchBtn = document.getElementById("searchBtn");
const pokemonInput = document.getElementById("pokemonInput");
const loadMoreBtn = document.getElementById("loadMoreBtn");

// ====== STARTVERDIER ======
let offset = 0; // hvor vi starter i API-listen
const limit = 10; // hvor mange Pokémon vi henter om gangen

// ====== FUNKSJON FOR Å HENTE FLERE POKÉMON ======
async function fetchPokemonList() {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    );
    const data = await response.json();

    const pokemonPromises = data.results.map((pokemon) =>
      fetchPokemonData(pokemon.url)
    );
    const pokemonList = await Promise.all(pokemonPromises);

    displayPokemon(pokemonList);
  } catch (error) {
    console.error("Feil ved henting av Pokémon-listen:", error);
  }
}

// ====== FUNKSJON FOR Å HENTE ENKELT POKÉMON ======
async function fetchPokemonData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Feil ved henting av Pokémon-data:", error);
  }
}

// ====== VISER POKÉMON PÅ SIDEN ======
function displayPokemon(pokemonList) {
  pokemonList.forEach((pokemon) => {
    const card = document.createElement("div");
    card.classList.add("pokemon-card");

    card.innerHTML = `
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      <h3>${pokemon.name}</h3>
      <p>Type: ${pokemon.types.map((t) => t.type.name).join(", ")}</p>
    `;

    pokemonContainer.appendChild(card);
  });
}

// ====== SØK FUNKSJON (parametre i URL) ======
searchBtn.addEventListener("click", async () => {
  const name = pokemonInput.value.toLowerCase().trim();
  if (!name) {
    alert("Skriv inn et Pokémon-navn!");
    return;
  }

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    if (!response.ok) {
      throw new Error("Pokémon ikke funnet!");
    }

    const data = await response.json();

    pokemonContainer.innerHTML = "";
    displayPokemon([data]);
  } catch (error) {
    pokemonContainer.innerHTML = `<p class="error">Fant ingen Pokémon med det navnet 😢</p>`;
  }
});

// ====== LAST INN FLERE KNAPP ======
loadMoreBtn.addEventListener("click", () => {
  offset += limit;
  fetchPokemonList();
});

// ====== KJØRER VED LASTING ======
fetchPokemonList();

// ====== KALL PÅ PIKACHU-KNAPP ======
const pikachuBtn = document.getElementById("pikachuBtn");
const pikachuContainer = document.getElementById("pikachuContainer");

pikachuBtn.addEventListener("click", () => {
  // Lager et <img>-element for Pikachu
  const pikachu = document.createElement("img");
  // Pikachu GIF 
  pikachu.src =
    "https://i.pinimg.com/originals/ab/be/28/abbe28a943ed44fcd98452687f7c46c9.gif";
  pikachu.classList.add("pikachu");

  // Legger Pikachu i containeren
  pikachuContainer.appendChild(pikachu);

  // Løper fremover (3 sek), snur og løper tilbake
  setTimeout(() => {
    pikachu.style.animation = "runBack 3s linear forwards";
  }, 3000);

  // Etter totalt 6 sekunder fjerner vi Pikachu
  setTimeout(() => {
    pikachu.remove();
  }, 6000);
});
