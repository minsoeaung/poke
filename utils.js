const nameAndIds = require("./namdAndIds.json");

function getHeightString(height) {
  // input: The height of the Pokémon, in tenths of a meter (decimeters)

  const realFeet = height * 0.32808;
  const feet = Math.floor(realFeet);
  const inches = Math.round((realFeet - feet) * 12);
  const meter = Number((height * 0.1).toFixed(2));
  return `${meter} m (${feet}'${
    String(inches).length > 1 ? inches : `0${inches}`
  }")`;
}

// for (let i = 1; i < 202; i++) {
// console.log(getHeightString(i));
// }

function getWeightString(weight) {
  // input: The weight of the Pokémon, in tenths of a kilogram (hectograms)

  const lbs = `${(Math.round(weight * 0.2205 * 10) / 10).toFixed(1)}`;
  const kg = `${Number((weight * 0.1).toFixed(2))}`;
  return `${kg} kg (${lbs} lbs)`;
}

function getStatNumberByNameFromPokemonData(data, statName) {
  return data.stats.find((stat) => stat.stat.name === statName).base_stat;
}

function getStatTotal(statsArray) {
  return statsArray.reduce((accumulator, currentValue) => {
    return currentValue.base_stat + accumulator;
  }, 0);
}

function getGenderPercentage(genderRate) {
  if (genderRate === -1) {
    return null;
  }
  const female = (100 * genderRate) / 8;
  return {
    female,
    male: 100 - female,
  };
}

function getEvYield(statsArray) {
  const yields = [];
  statsArray.forEach((statInfo) => {
    if (statInfo.effort > 0) {
      yields.push(
        `${statInfo.effort} ${statInfo.stat.name
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}`
      );
    }
  });
  return yields.join(", ");
}

function getEvolution(evolutionChain) {
  if (!evolutionChain) return [];
  const chain = [];
  let evoData = evolutionChain.chain;

  do {
    const evoDetails = evoData.evolution_details[0];
    chain.push({
      speciesName: evoData.species.name,
      minLevel: !evoDetails ? 1 : evoDetails.min_level,
      triggerName: !evoDetails ? null : evoDetails.trigger.name,
      item: !evoDetails ? null : evoDetails.item,
    });
    evoData = evoData["evolves_to"][0];
  } while (!!evoData && evoData.hasOwnProperty("evolves_to"));

  const results = [];

  for (let i = 0; i < chain.length - 1; i++) {
    const from = chain[i];
    const to = chain[i + 1];
    if (results.at(-1) !== nameAndIds[from.speciesName]) {
      results.push(nameAndIds[from.speciesName]);
    }
    if (to) {
      results.push(getEvoTrigger(to));
      results.push(nameAndIds[to.speciesName]);
    }
  }

  return results;
}

function getEvoTrigger(to) {
  const triggerName = to.triggerName;
  let lastPart = "";
  if (triggerName === "level-up" && to.minLevel) {
    lastPart = "at level " + to.minLevel;
  } else if (triggerName === "trade") {
    lastPart = "by trading";
  } else if (triggerName === "use-item" && to.item?.name) {
    lastPart =
      "using a " +
      to.item?.name
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
  } else if (triggerName === "shed") {
    lastPart = "when leveled up with high friendship";
  } else if (triggerName === "spin") {
    lastPart = "by spinning around holding Sweet";
  } else if (triggerName === "tower-of-darkness") {
    lastPart = "in Tower of Darkness";
  } else if (triggerName === "tower-of-waters") {
    lastPart = "in Tower of Water";
  } else if (triggerName === "three-critical-hits") {
    lastPart = "by achieving 3 critical hits in one battle";
  } else if (triggerName === "take-damage") {
  }

  return lastPart;
}

module.exports = {
  getHeightString,
  getWeightString,
  getStatNumberByNameFromPokemonData,
  getStatTotal,
  getGenderPercentage,
  getEvYield,
  getEvolution,
};
