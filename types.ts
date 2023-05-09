type POKEMON_DETAIL = {
  id: number;
  name: string;
  profile: {
    sprite: string;
    species: string;
    types: string[];
    height: string; // 1.7 m (2'04")
    weight: string; // 6.9 kg (15.2 lbs)
    abilities: {
      isHidden: boolean;
      slot: number;
      name: string;
    }[];
    flavorTextEntry: {
      diamond: string;
    };
    gender: {
      male: number;
      female: number;
    } | null;
  };
  training: {
    catchRate: number;
    growthRate: string;
    baseExp: number;
    baseHappiness: number;
    evYield: string;
  };
  breeding: {
    eggGroups: string[];
    eggCycles: string;
  };
  stats: {
    hp: [number, number, number];
    attack: [number, number, number];
    defense: [number, number, number];
    specialAttack: [number, number, number];
    specialDefense: [number, number, number];
    speed: [number, number, number];
    total: [number, number, number];
  };
  evolutions: number[];
  evolvedFrom: string;
};
