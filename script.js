let favList = document.getElementById("fav-list");
let allList = document.getElementById("all-list");

// Hämtar de tre första generationerna av Pokémons.
fetch("https://pokeapi.co/api/v2/pokemon/?limit=386")
    .then((response) => response.json())
    .then((pokemons) => {
        pokemons.results.forEach((pokemon) => {
            fetch(pokemon.url)
                .then((response) => response.json())
                .then((pokemonData) => {
                    createPokemonContainer(pokemon, pokemonData);
                });
        });
    });

function createPokemonContainer(pokemon, pokemonData) {
    let li = document.createElement("li");
    let h3 = document.createElement("h3");
    if (pokemon.name != "mr-mime" && pokemon.name != "ho-oh" && pokemon.name.includes("-")) {
        pokemon.name = pokemon.name.slice(0, pokemon.name.indexOf("-"));
    }
    h3.innerHTML = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    let img = document.createElement("img");
    img.src = pokemonData.sprites.front_default;
    li.appendChild(h3);
    li.appendChild(img);
    li.setAttribute("title", "Lägg till som favorit.");
    document.getElementById("all-list").appendChild(li);
}
