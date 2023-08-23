let apiurl;
let content = document.getElementById("content");
let content2 = document.getElementById("content2");
let infoPage = document.getElementById("infoPage");
let cards = document.getElementById("cards");
let cardname;
let pokecard;
let img;
let imgdiv;
let a;

let pokedex;
let search;
let next;
let center;
let infocard;
let word;
let img2;
let info;
let keys;
let infos;
let title;
let property;
let pokemons = [];
let pokemon;
let pokeinfos = [];
let pokeinfo;
let pokemen = [];

let pokeinfoknown;

let currentPage = 1;

infoPage.style.display = "none";

async function getPokemon(page) {
    let offset = (page - 1) * 20;
    const apiUrl = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=20`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.results;
}

function createPokecard(obj) {
    cardname = document.createElement("p");  //cardname
    cardname.classList.add("cardname");
    img = document.createElement("img");   //img  
    img.classList.add("img");
    img.src = obj.image;
    imgdiv = document.createElement("div");   //imgdiv  
    imgdiv.classList.add("imgdiv");
    pokecard = document.createElement("div");   //pokecard  
    pokecard.classList.add("pokecard");

    imgdiv.appendChild(img);
    pokecard.appendChild(cardname);
    pokecard.appendChild(imgdiv);
    cardname.innerHTML = obj.name;
    cards.appendChild(pokecard);

    //POKECARD FUNCTIONALITY//
    pokecard.addEventListener("click",
        function () {
            content.style.display = "none";
            content2.innerHTML = " ";
            pokeinfoknown = pokeinfos.find(pokeinfo => pokeinfo.id === obj.id);
            keys.appendChild(title);
            infos.appendChild(property);
            info.appendChild(keys);
            info.appendChild(infos);
            infocard.appendChild(info);
            infocard.appendChild(word);
            infocard.appendChild(img2);
            center.appendChild(infocard);
            content2.appendChild(center);

            infocard.insertBefore(img2, infocard.firstChild);
            infocard.insertBefore(word, infocard.firstChild);
            displayInfo(pokeinfoknown);
            infoPage.style.display = "block";
            img2.src = pokeinfoknown.image;
            word.innerHTML = capital(pokeinfoknown.Name);
        });
}
//POKEDEX LOGO, SEARCHBAR AND NEXT&BACK BUTTONS//
let span = document.createElement("span");
span.classList.add("span");
let span2 = document.createElement("span");
span2.classList.add("span");
span.innerHTML =  `<img src="Assets/Arrow.png" alt="#" id="image">`;
span2.innerHTML = `<img src="Assets/Arrow.png" alt="#" id="image2">`;

let header = document.createElement("div");
header.classList.add("header");

back = document.createElement("div");
back.appendChild(span2);
back.classList.add("button");
header.appendChild(back);

pokedex = document.createElement("h1");
pokedex.innerText = "POKEDEX";
pokedex.classList.add("pokedex");
header.appendChild(pokedex);

next = document.createElement("div");
next.appendChild(span);
next.classList.add("button");
header.appendChild(next);

search = document.createElement("input");
search.type = "text";
search.placeholder = "Search for pokemon";
search.classList.add("search");

content.appendChild(header);
content.insertBefore(header, content.firstChild);
content.insertBefore(search, header.nextSibling);

async function displayPokemon(page) {
    cards.innerHTML = " ";

    try {
        const pokePage = await getPokemon(page);

        await Promise.all(pokePage.map(async function (obj) {
            try {
                const respond = await fetch(obj.url);
                let detail = await respond.json();
                let pokemon = {
                    "id": detail.id,
                    "name": detail.name,
                    "image": detail.sprites.front_default,
                };
                pokemons.push(pokemon);
                pokemen.push(pokemon);
            } catch (error) {
                console.log("Error: ", error);
            }
        }
        ));
        //DISPLAYING EACH POKECARD//
        pokemons.forEach(createPokecard);

    } catch (error) {
        console.log("Error: ", error);
    }
    let previousContent = cards.innerHTML;

    //SEARCHBAR FUNCTIONALITY//
    search.addEventListener("input", function () {
        const query = search.value.toLowerCase();
        let allCards = [];

        for (const card of pokemen) {
            if (search.value.length >= 3) {
                if (card.name.toLowerCase().includes(query)) {
                    cards.innerHTML = " ";

                    allCards.push(card);
                }
            } else if (query.length == 0) {
                cards.innerHTML = previousContent;
            }
        }
        allCards.forEach(function (eachCard) {
            createPokecard(eachCard);
        })
    });
}
displayPokemon(currentPage);

next.addEventListener("click", async function () {
    cards.innerHTML = " ";
    currentPage++;
    pokemons = [];
    await displayPokemon(currentPage);
    getInfo(currentPage);
});

back.addEventListener("click", async function () {
    if (currentPage > 1) {
        cards.innerHTML = " ";
        currentPage--;
        pokemons = [];
        await displayPokemon(currentPage);
        getInfo(currentPage);
    }
});

async function getInfo(page) {
    const pokePage = await getPokemon(page);

    img2 = document.createElement("img");   //img  
    img2.classList.add("img2");
    center = document.createElement("div");  //center-container
    center.classList.add("center-container");
    infocard = document.createElement("div");  //infocard
    infocard.classList.add("infocard");
    infocard.insertBefore(img2, infocard.firstChild);
    word = document.createElement("p");  //word
    word.classList.add("word");
    infocard.insertBefore(word, infocard.firstChild);
    info = document.createElement("div");  //info
    info.classList.add("info");
    keys = document.createElement("div");  //keys
    keys.classList.add("keys");
    infos = document.createElement("div");  //infos
    infos.classList.add("infos");
    title = document.createElement("p");  //title
    title.classList.add("title");
    property = document.createElement("p");  //property
    property.classList.add("property");

    await Promise.all(pokePage.map(async function (obj) {
        try {
            const respond = await fetch(obj.url);
            let detail = await respond.json();
            pokeinfo = {
                "id": detail.id,
                "image": detail.sprites.front_default,
                "Name": detail.name,
                "Species": detail.species.name,
                "Stats": detail.stats.map(obj => [obj.stat.name, obj.base_stat]),
                "Types": detail.types.map(element => element.type.name),
                "Weight": detail.weight,
                "Moves": detail.moves.map(obj => obj.move.name),
            };
            pokeinfos.push(pokeinfo);
        } catch (error) {
            console.log("Error: ", error);
        }
    }))
    // pokeinfos.forEach(function (obj) {
    //     keys.appendChild(title);
    //     infos.appendChild(property);
    //     info.appendChild(keys);
    //     info.appendChild(infos);
    //     infocard.appendChild(info);
    //     infocard.appendChild(word);
    //     infocard.appendChild(img2);
    //     center.appendChild(infocard);
    //     content2.appendChild(center);


    //     infocard.insertBefore(img2, infocard.firstChild);
    //     infocard.insertBefore(word, infocard.firstChild);

    // });
}

function displayInfo(array) {
    let keyDisplay = "";
    let valueDisplay = "";

    for (let key in array) {
        if (key !== "id" && key !== "image") {
            let value = array[key];

            keyDisplay += `<div style = "margin-bottom: 15px;"><div style="margin-bottom: 10px;"><span style = "font-weight: bold; font-size: 20px; margin-left: 20px; margin-right: 20px; padding: 5px;">${key}</span></div></div><br>`;
            if (Array.isArray(value)) {
                valueDisplay += '<span style="display: flex; flex-wrap: wrap;">';
                for (let i = 0; i < value.length; i++) {
                    valueDisplay += `<div style="background-color: #cacaca; padding: 10px; margin: 7px; border-radius: 30px;">${value[i]}</div>`;
                }
                valueDisplay += '</span><br>';
            } else {
                valueDisplay += `<span><div style="background-color: #cacaca; padding: 10px; margin: 7px; border-radius: 30px; display: inline-block;">${value}</div></span><br>`;
            }
        }
    }
    title.innerHTML = keyDisplay;
    property.innerHTML = valueDisplay;
}

function capital(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function goBack() {
    content.style.display = "block";
    infoPage.style.display = "none";
}


// function checkId(id) {
//     pokeinfoknown = pokeinfos.find(pokeinfo => pokeinfo.id === id);
// }
getInfo(1);