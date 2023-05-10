const { default: axios } = require("axios");
const { writeFile } = require("fs");

(async () => {
  const { data } = await axios.get(
    "https://pokeapi.co/api/v2/pokemon?limit=10000&offet=0"
  );

  const results = data.results;

  const ok = {};
  results.forEach((r) => {
    ok[r.name] = r.url.split("/").at(-2);
  });

  writeFile("namdAndIds.json", JSON.stringify(ok), "utf-8", (error) => {
    if (error) {
      console.log(error);
    }

    console.log("done");
  });
})();
