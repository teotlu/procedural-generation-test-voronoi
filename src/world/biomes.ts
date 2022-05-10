import { Percent } from '../typings';

export enum Biomes {
  DESERT = 'desert',
  SHRUBLAND = 'shrubland',
  TROPICAL_FOREST = 'tropical_forest',
  BOREAL_FOREST = 'boreal_forest',
  GRASSLAND = 'grassland',
  MOUNTAINS = 'mountains',
  TUNDRA = 'tundra',
  POLAR = 'polar',
  MARINE = 'marine',
  CANYON = 'canyon',
}

export const biomeColors: Record<Biomes, number> = {
  [Biomes.DESERT]: 0xfcdd76,
  [Biomes.SHRUBLAND]: 0x967117,
  [Biomes.TROPICAL_FOREST]: 0x34c924,
  [Biomes.BOREAL_FOREST]: 0x228b22,
  [Biomes.GRASSLAND]: 0xccb5e,
  [Biomes.MOUNTAINS]: 0x474a51,
  [Biomes.TUNDRA]: 0x009b76,
  [Biomes.POLAR]: 0xffffff,
  [Biomes.MARINE]: 0x008cf0,
  [Biomes.CANYON]: 0x6d6552,
};

export function getBiome(
  elevation: Percent,
  moisture: Percent,
  temperature: Percent,
) {
  // TODO Balanced biome rules
  if (temperature < 10) return Biomes.POLAR;
  if (elevation > 90) {
    return Biomes.MOUNTAINS;
  }
  if (elevation > 20) {
    if (temperature > 90) return Biomes.DESERT;
    if (moisture > 30 && temperature > 60) return Biomes.SHRUBLAND;
    if (temperature < 10) return Biomes.POLAR;
    if (moisture > 50 && temperature > 60) return Biomes.TROPICAL_FOREST;
    if (moisture > 30 && temperature > 30) return Biomes.BOREAL_FOREST;
    if (moisture > 30 && temperature < 30) return Biomes.TUNDRA;
    return Biomes.GRASSLAND;
  }
  if (moisture > 20 && elevation < 20) return Biomes.MARINE;
  return Biomes.CANYON;
}

export function getPointColor(biome: Biomes) {
  return biomeColors[biome];
}

export function getBiomeElevation(biome: Biomes, elevation: number) {
  if (biome === Biomes.MARINE) {
    return 0;
  }

  return elevation;
}
