const pokemon = {
  id: 1,
  name: "bulbasaur",
  profile: {
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    specieis: "Seed",
    types: ["grass", "poison"],
    height: "1.7 m (2'04'')",
    weight: "6.9 kg (15.2 lbs)",
    abilities: [{ isHidden: true, slot: 1, name: "" }],
    flavorTextEntry: {
      diamond: "",
    },
    gender: {
      male: "80%",
      female: "20%",
    }, // or null
  },
  training: {
    catchRate: 45,
    growthRate: "medium-slow",
    baseExp: 64,
    baseHappiness: 50, // 0 to 255
  },
  breeding: {
    eggGroups: ["grass", "Monster"],
    eggCycles: "20 ",
  },
  stats: {
    hp: [20, 200, 200], // value, minValue, maxValue
    attack: [20, 200, 200],
    defense: [20, 200, 200],
    specialAttack: [20, 200, 200],
    specialDefense: [20, 200, 200],
    speed: [20, 200, 200],
    total: 160,
  },
  evolutions: ["#001", "#002", "#003"],
  evolvedfrom: "",
};

const { default: axios } = require("axios");
const { MainClient } = require("pokenode-ts");

const api = new MainClient();

(async () => {
  const { data: resData } = await axios(
    "https://pokeapi.co/api/v2/pokemon?limit=50000&offet=0"
  );
  const allPokemons = resData.results;
  for (let i = 0; i < 10; i++) {
    const { name, url } = allPokemons[i];
    const pokemonData = await api.pokemon.getPokemonByName(name);
    const speciesData = await api.pokemon.getPokemonSpeciesByName(
      pokemonData.species.name
    );
    const text =
      speciesData.flavor_text_entries.find(
        (entry) =>
          entry.version.name === "diamond" && entry.language.name === "en"
      )?.flavor_text || "";
    const usablePokemonData = {
      id: pokemonData.id,
      name: pokemonData.name,
      // --------------------------------------
      profile: {
        sprite: pokemonData.sprites.front_default,
        specieis: "Seed",
        types: pokemonData.types.map((type) => type.type.name),
        height: "1.7 m (2'04'')",
        weight: "6.9 kg (15.2 lbs)",
        abilities: [{ isHidden: true, slot: 1, name: "" }],
        flavorTextEntry: {
          diamond: text.replace(/(\r\n|\r|\n)/g, " "),
        },
        gender: {
          male: "80%",
          female: "20%",
        }, // or null
      },
      // --------------------------------------
      catchRate: speciesData.capture_rate,
      breeding: {
        eggGroups: speciesData.egg_groups.map((gp) => gp.name),
      },
    };
    console.log("name", name, "done");
  }
  console.log(allPokemons);
  // await api.pokemon.getPokemonById(1).then((data) => console.log(data));
})();
