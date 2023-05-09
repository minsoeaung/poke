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

module.exports = {
  getHeightString,
  getWeightString,
  getStatNumberByNameFromPokemonData,
  getStatTotal,
  getGenderPercentage,
  getEvYield,
};
