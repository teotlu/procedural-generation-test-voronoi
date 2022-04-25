import { Percent } from '../typings';
import { Biomes } from './biomes';

export interface IWorldSite {
  moisture: Percent;
  temperature: Percent;
  elevation: Percent;
  biome: Biomes;
  center: number[];
}

export class WorldSite {
  moisture: Percent;
  temperature: Percent;
  elevation: Percent;
  center: number[];
  biome: Biomes;

  constructor(site: IWorldSite) {
    this.moisture = site.moisture;
    this.temperature = site.temperature;
    this.elevation = site.elevation;
    this.center = site.center;
    this.biome = site.biome;
  }
}
