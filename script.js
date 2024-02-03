"use strict";

let favList = document.getElementById("fav-list");
let allList = document.getElementById("all-list");
let popupWindowBackground = document.createElement("div");
let popupWindow = document.createElement("div");

// Metod som ställer in vårt popup-fönster.
function initPopupWindow() {
    popupWindowBackground.setAttribute("id", "popup-window-background");
    popupWindow.setAttribute("id", "popup-window");
    popupWindow.appendChild(document.createElement("button"));
    popupWindow.appendChild(document.createElement("h2"));
    popupWindow.appendChild(document.createElement("img"));
    popupWindow.appendChild(document.createElement("textarea"));
    popupWindow.getElementsByTagName("button").item(0).innerText = "x";
    popupWindow.getElementsByTagName("button").item(0).setAttribute("id", "close-button");
    popupWindow
        .getElementsByTagName("button")
        .item(0)
        .addEventListener("click", () => {
            popupWindowBackground.style.display = "none";
        });
    popupWindow.getElementsByTagName("textarea").item(0).setAttribute("placeholder", "Ange text...");
    popupWindow.getElementsByTagName("textarea").item(0).setAttribute("maxlength", "800");
    document.body.appendChild(popupWindowBackground);
    popupWindowBackground.appendChild(popupWindow);
}

// Metod för att hämta information om en Pokémon och lägga till i en lista.
function fetchPokemon(id, list) {
    return fetch("https://pokeapi.co/api/v2/pokemon/" + id)
        .then((res) => res.json())
        .then((data) => list.appendChild(createPokemonContainer(data, list.getAttribute("id"))));
}

// Återställer popup-fönstret.
function resetPopupWindow(pokemon) {
    if (popupWindow.getElementsByTagName("button").length === 3) {
        popupWindow.getElementsByTagName("button").item(2).remove();
        popupWindow.getElementsByTagName("button").item(1).remove();
    } else if (popupWindow.getElementsByTagName("button").length === 2) {
        popupWindow.getElementsByTagName("button").item(1).remove();
    }
    popupWindow.getElementsByTagName("h2").item(0).innerText = "#" + pokemon.id + " " + pokemon.name;
    popupWindow.getElementsByTagName("img").item(0).src = pokemon.sprites.front_default;
    popupWindow.getElementsByTagName("textarea").item(0).value = "";
}

// Skapar behållar/knapp för en Pokémon.
function createPokemonContainer(pokemon, listId) {
    let li = document.createElement("li");
    li.appendChild(document.createElement("h3"));
    li.appendChild(document.createElement("img"));
    if (pokemon.name != "mr-mime" && pokemon.name != "ho-oh" && pokemon.name.includes("-")) {
        pokemon.name = pokemon.name.slice(0, pokemon.name.indexOf("-"));
    }
    pokemon.name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    li.getElementsByTagName("h3").item(0).innerText = pokemon.name;
    li.getElementsByTagName("img").item(0).src = pokemon.sprites.front_default;

    if (listId === "all-list") {
        li.setAttribute("title", "Lägg till som favorit");
        li.addEventListener("click", () => {
            resetPopupWindow(pokemon);
            popupWindow.appendChild(document.createElement("button"));
            popupWindow.getElementsByTagName("button").item(1).setAttribute("id", "big-button");
            popupWindow.getElementsByTagName("button").item(1).innerText = "Lägg till som favorit";
            popupWindow
                .getElementsByTagName("button")
                .item(1)
                .addEventListener("click", () => {
                    fetch("http://localhost:8080/favorite", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            id: pokemon.id,
                            note: popupWindow.getElementsByTagName("textarea").item(0).value,
                        }),
                    });
                    popupWindowBackground.style.display = "none";
                    setTimeout(() => {
                        printFavorites();
                    }, 250);
                });
            popupWindowBackground.style.display = "block";
        });
    } else {
        li.setAttribute("title", "Ändra");
        li.addEventListener("click", () => {
            resetPopupWindow(pokemon);
            fetch("http://localhost:8080/favorites")
                .then((res) => res.json())
                .then((data) => {
                    data.map((favorite) => {
                        if (pokemon.id === favorite.id) {
                            popupWindow.getElementsByTagName("textarea").item(0).value = favorite.note;
                        }
                    });
                });
            popupWindow.appendChild(document.createElement("button"));
            popupWindow.appendChild(document.createElement("button"));
            popupWindow.getElementsByTagName("button").item(1).setAttribute("class", "small-button");
            popupWindow.getElementsByTagName("button").item(1).innerText = "Ändra";
            popupWindow.getElementsByTagName("button").item(2).setAttribute("class", "small-button");
            popupWindow.getElementsByTagName("button").item(2).innerText = "Ta bort";
            popupWindow
                .getElementsByTagName("button")
                .item(1)
                .addEventListener("click", () => {
                    fetch("http://localhost:8080/favorite", {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            id: pokemon.id,
                            note: popupWindow.getElementsByTagName("textarea").item(0).value,
                        }),
                    });
                    popupWindowBackground.style.display = "none";
                    setTimeout(() => {
                        printFavorites();
                    }, 250);
                });
            popupWindow
                .getElementsByTagName("button")
                .item(2)
                .addEventListener("click", () => {
                    fetch("http://localhost:8080/favorite?id=" + pokemon.id, {
                        method: "DELETE",
                    });
                    popupWindowBackground.style.display = "none";
                    setTimeout(() => {
                        printFavorites();
                    }, 250);
                });
            popupWindowBackground.style.display = "block";
        });
    }
    return li;
}

// Metod för att visa alla Pokémons.
function printAll() {
    // Vi hämtar hem den första generationen av alla Pokémons (totalt 151 stycken).
    for (let i = 1; i <= 151; i++) {
        fetchPokemon(i, allList);
    }
}

// Metod för att visa alla favoriter.
function printFavorites() {
    favList.innerHTML = "";
    fetch("http://localhost:8080/favorites")
        .then((res) => res.json())
        .then((data) => {
            data.map((favorite) => {
                fetchPokemon(favorite.id, favList);
            });
            // Har vi inga favoriter? Då informerar vi om det.
            if (data.length === 0) {
                let h3 = document.createElement("h3");
                h3.innerText = "Du har inga favoriter!";
                favList.appendChild(h3);
            }
        });
}

initPopupWindow();
printAll();
printFavorites();
