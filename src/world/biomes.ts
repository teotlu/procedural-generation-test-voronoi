import { IWorldPoint } from './WorldPoint';

enum Biomes {
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

export function getPointBiome(point: IWorldPoint) {
  if (point.elevation > 90) {
    if (point.temperature < 10) return Biomes.POLAR;
    return Biomes.MOUNTAINS;
  }
  if (point.elevation > 20) {
    if (point.temperature > 90) return Biomes.DESERT;
    if (point.moisture > 30 && point.temperature > 60) return Biomes.SHRUBLAND;
    if (point.temperature < 10) return Biomes.POLAR;
    if (point.moisture > 50 && point.temperature > 60)
      return Biomes.TROPICAL_FOREST;
    if (point.moisture > 30 && point.temperature > 30)
      return Biomes.BOREAL_FOREST;
    if (point.moisture > 30 && point.temperature < 30) return Biomes.TUNDRA;
    return Biomes.GRASSLAND;
  }
  if (point.moisture > 20 && point.elevation < 20) return Biomes.MARINE;
  return Biomes.CANYON;
}

export function getPointColor(point: IWorldPoint) {
  return biomeColors[getPointBiome(point)];
}
