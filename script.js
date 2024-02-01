"use strict";

let favList = document.getElementById("fav-list");
let allList = document.getElementById("all-list");
let popupWindowBackground = document.createElement("div");
let popupWindow = document.createElement("div");

// Metod som fixar standardinställningar för vårt popup-fönster.
function initPopupWindow() {
    popupWindowBackground.setAttribute("id", "popup-window-background");
    popupWindow.setAttribute("id", "popup-window");
    let popButton = document.createElement("button");
    let popTextarea = document.createElement("textarea");
    popButton.innerText = "x";
    popButton.setAttribute("id", "close-button");
    popButton.addEventListener("click", () => {
        popupWindowBackground.style.display = "none";
    });
    popTextarea.setAttribute("placeholder", "Ange text...");
    popTextarea.setAttribute("maxlength", "800");
    popupWindow.appendChild(popButton);
    popupWindow.appendChild(document.createElement("h2"));
    popupWindow.appendChild(document.createElement("img"));
    popupWindow.appendChild(popTextarea);
    document.body.appendChild(popupWindowBackground);
    popupWindowBackground.appendChild(popupWindow);
}

// Metod för att hämta information om en Pokémon och lägga till i en lista.
function fetchPokemon(id, list) {
    return fetch("https://pokeapi.co/api/v2/pokemon/" + id)
        .then((res) => res.json())
        .then((data) => list.appendChild(createPokemonContainer(data, list.getAttribute("id"))));
}

// Skapar behållar/knapp för en Pokémon.
function createPokemonContainer(pokemon, listId) {
    let li = document.createElement("li");
    let h3 = document.createElement("h3");
    let img = document.createElement("img");
    if (pokemon.name != "mr-mime" && pokemon.name != "ho-oh" && pokemon.name.includes("-")) {
        pokemon.name = pokemon.name.slice(0, pokemon.name.indexOf("-"));
    }
    pokemon.name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    h3.innerText = pokemon.name;
    img.src = pokemon.sprites.front_default;
    li.appendChild(h3);
    li.appendChild(img);

    if (listId === "all-list") {
        li.setAttribute("title", "Lägg till som favorit");
        li.addEventListener("click", () => {
            if (popupWindow.getElementsByTagName("button").length === 2) {
                popupWindow.getElementsByTagName("button").item(1).remove();
            }
            popupWindowBackground.style.display = "block";
            popupWindow.getElementsByTagName("h2").item(0).innerText = "#" + pokemon.id + " " + pokemon.name;
            popupWindow.getElementsByTagName("img").item(0).src = pokemon.sprites.front_default;
            popupWindow.getElementsByTagName("textarea").item(0).value = "";
            popupWindow.appendChild(document.createElement("button"));
            popupWindow.getElementsByTagName("button").item(1).setAttribute("id", "big-button");
            popupWindow.getElementsByTagName("button").item(1).innerText = "Lägg till som favorit";
            popupWindow
                .getElementsByTagName("button")
                .item(1)
                .addEventListener("click", () => {
                    fetch("http://http://localhost:8080/favorite", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            id: popupWindow.getElementsByTagName("h2").item(0).innerText.charAt(1),
                            note: popupWindow.getElementsByTagName("textarea").item(0).value === "" ? " " : popupWindow.getElementsByTagName("textarea").item(0).value,
                        }),
                    })
                        .then((res) => res.json())
                        .then((data) => {
                            console.log("data", data);
                            printUsers;
                            newUserName.value = "";
                        });
                    popupWindowBackground.style.display = "none";
                });
        });
    } else {
        li.setAttribute("title", "Ändra");
    }

    return li;
}

// Metod för att visa alla Pokémon.
function printAll() {
    // Vi hämtar hem de tre första generationerna av Pokémons (totalt 386 stycken).
    for (let i = 1; i <= 386; i++) {
        fetchPokemon(i, allList);
    }
}

// Metod för att visa alla favoriter.
function printFavorites() {
    favList.innerHTML = "";
    fetch("http://localhost:8080/favorites")
        .then((res) => res.json())
        .then((data) => {
            data.map((favorite) => {});
        });
    // Har vi inga favoriter? Då informerar vi användaren om det.
    if (favList.children.length === 0) {
        let h3 = document.createElement("h3");
        h3.innerText = "Du har inga favoriter!";
        favList.appendChild(h3);
    }
}

initPopupWindow();
printAll();
printFavorites();

// popupWindow.getElementsByTagName("button").item(1) = null;
// if (popupWindow.getElementsByTagName("button").item(2) === null) {
//     popupWindow.remove(popupWindow.getElementsByTagName("button").item(2));
// }

// // Skapar behållar/knapp för en Pokémon.
// function createPokemonContainer(pokemonData, listName) {
//     let li = document.createElement("li");
//     let h3 = document.createElement("h3");
//     let img = document.createElement("img");
//     if (pokemonData.name != "mr-mime" && pokemonData.name != "ho-oh" && pokemonData.name.includes("-")) {
//         pokemonData.name = pokemonData.name.slice(0, pokemonData.name.indexOf("-"));
//     }
//     pokemonData.name = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);
//     h3.innerText = pokemonData.name;
//     img.src = pokemonData.sprites.front_default;
//     if (listName === "fav-list") {
//         li.setAttribute("title", "Ändra");
//     } else if (listName === "all-list") {
//         li.setAttribute("title", "Lägg till som favorit");
//         li.addEventListener("click", () => {
//             popupWindowBackground.style.display = "block";
//             popupWindow.style.display = "block";
//             popupWindow.getElementsByTagName("h2").item(0).innerText = "#" + pokemonData.id + " " + pokemonData.name;
//             popupWindow.getElementsByTagName("img").item(0).src = pokemonData.sprites.front_default;
//             popupWindow.getElementsByTagName("textarea").item(0).value = "";
//             popupWindow.appendChild(document.createElement("button"));
//             popupWindow.getElementsByTagName("button").item(1).setAttribute("id", "big-button");
//             popupWindow.getElementsByTagName("button").item(1).innerText = "Lägg till somm favorit";
//             popupWindow
//                 .getElementsByTagName("button")
//                 .item(1)
//                 .addEventListener("click", () => {
//                     fetch("http://http://localhost:8080/favorite", {
//                         method: "POST",
//                         headers: {
//                             "Content-Type": "application/json",
//                         },
//                         body: JSON.stringify({
//                             id: popupWindow.getElementsByTagName("h2").item(0).innerText.charAt(1),
//                             note: popupWindow.getElementsByTagName("textarea").item(0).value === "" ? " " : popupWindow.getElementsByTagName("textarea").item(0).value,
//                         }),
//                     })
//                         .then((res) => res.json())
//                         .then((data) => {
//                             console.log("data", data);
//                             printUsers;
//                             newUserName.value = "";
//                         });
//                     popupWindowBackground.style.display = "none";
//                 });
//         });
//     }
//     li.appendChild(h3);
//     li.appendChild(img);
//     return li;
// }
