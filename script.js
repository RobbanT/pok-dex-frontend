fetch("https://pokeapi.co/api/v2/pokemon/?limit=384")
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
    });
