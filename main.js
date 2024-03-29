const { writeFile } = require("fs");
const { default: axios } = require("axios");
const { MainClient } = require("pokenode-ts");
const {
  getHeightString,
  getWeightString,
  getStatNumberByNameFromPokemonData,
  getStatTotal,
  getGenderPercentage,
  getEvYield,
  getEvolution,
} = require("./utils");
const nameAndIds = require("./raw_data_jsons/namdAndIds.json");
const pokemonDetails = require("./app_usable_jsons/pokemonDetails.json");

const api = new MainClient();

(async () => {
  const RESULTS = { ...pokemonDetails };
  try {
    const allPokemonNames = Object.keys(nameAndIds);

    for (let i = 0; i < allPokemonNames.length; i++) {
      const name = allPokemonNames[i];
      if (RESULTS[name]?.name === name) {
        console.log(RESULTS[name].name, "already there... skipped");
        continue;
      }
      const pokemonData = await api.pokemon.getPokemonByName(name);
      const speciesData = await api.pokemon.getPokemonSpeciesByName(
        pokemonData.species.name
      );
      const { data: evolutionsData } = await axios.get(
        speciesData.evolution_chain.url
      );
      const text =
        speciesData.flavor_text_entries.find(
          (entry) =>
            entry.version.name === "diamond" && entry.language.name === "en"
        )?.flavor_text || "";

      const usablePokemonData = {
        id: pokemonData.id,
        name: pokemonData.name,
        profile: {
          sprite: pokemonData.sprites.front_default,
          species: speciesData.genera.find(
            (generaInfo) => generaInfo.language.name === "en"
          ).genus,
          types: pokemonData.types.map((type) => type.type.name),
          height: getHeightString(pokemonData.height),
          weight: getWeightString(pokemonData.weight),
          abilities: pokemonData.abilities.map((ability) => {
            return {
              isHidden: ability.is_hidden,
              slot: ability.slot,
              name: ability.ability.name,
            };
          }),
          flavorTextEntry: {
            diamond: text.replace(/(\r\n|\r|\n)/g, " "),
          },
          gender: getGenderPercentage(speciesData.gender_rate),
        },
        training: {
          catchRate: speciesData.capture_rate,
          growthRate: speciesData.growth_rate.name
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          baseHappiness: speciesData.base_happiness,
          baseExp: pokemonData.base_experience,
          evYield: getEvYield(pokemonData.stats),
        },
        breeding: {
          eggGroups: speciesData.egg_groups.map((gp) => gp.name),
          eggCycles: speciesData.hatch_counter, // How to decide cycles?
        },
        stats: {
          hp: [getStatNumberByNameFromPokemonData(pokemonData, "hp")],
          attack: [getStatNumberByNameFromPokemonData(pokemonData, "attack")],
          defense: [getStatNumberByNameFromPokemonData(pokemonData, "defense")],
          specialAttack: [
            getStatNumberByNameFromPokemonData(pokemonData, "special-attack"),
          ],
          specialDefense: [
            getStatNumberByNameFromPokemonData(pokemonData, "special-defense"),
          ],
          speed: [getStatNumberByNameFromPokemonData(pokemonData, "speed")],
          total: [getStatTotal(pokemonData.stats)],
        },
        evolutions: getEvolution(evolutionsData),
      };
      RESULTS[name] = usablePokemonData;
      console.log(
        `Pushed for ${name}. ${Object.keys(RESULTS).length}/${
          allPokemonNames.length
        }`
      );
    }
  } catch (e) {
    console.log(e);
  } finally {
    writeFile(
      "./app_usable_jsons/pokemonDetails.json",
      JSON.stringify(RESULTS),
      "utf8",
      function readFileCallback(err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log("Write operation done");
        }
      }
    );
  }
})();
