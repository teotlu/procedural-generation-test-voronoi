import { IValueGenerator } from '../../generators/typings';
import { IWorldSite } from '../WorldSite';
import { Vector2D, getRandomPointInCircle } from '../../helpers/geometry';
import { Voronoi } from './Voronoi';
import seedrandom from 'seedrandom';
import { getBiome } from '../biomes';

export class WorldChunk {
  public sites: IWorldSite[] = [];
  public position: Vector2D;
  public voronoi: Voronoi;
  private cellSize: number;

  public get siteCenters() {
    return this.sites.map((s) => s.center);
  }

  constructor(
    position: Vector2D,
    private size: number,
    private sitesPerChunkSide: number,
    private elevationGenerator: IValueGenerator,
    private moistureGenerator: IValueGenerator,
    private temperatureGenerator: IValueGenerator,
    seed: string,
  ) {
    this.position = position;
    this.cellSize = Math.floor(this.size / sitesPerChunkSide);
    const shiftX = position.x * this.size;
    const shiftY = position.y * this.size;
    for (
      let x = -this.cellSize * 2;
      x < this.size + this.cellSize * 2;
      x += this.cellSize
    ) {
      for (
        let y = -this.cellSize * 2;
        y < this.size + this.cellSize * 2;
        y += this.cellSize
      ) {
        const prng = seedrandom(`${seed}_${shiftX + x}_${shiftY + y}`);
        const randomPoint = getRandomPointInCircle(this.cellSize, prng);
        const siteX = x + randomPoint.x + this.cellSize / 2;
        const siteY = y + randomPoint.y + this.cellSize / 2;

        const elevation = this.elevationGenerator.getValue(
          siteX + shiftX,
          siteY + shiftY,
        );
        const moisture = this.moistureGenerator.getValue(
          siteX + shiftX,
          siteY + shiftY,
        );
        const temperature = this.temperatureGenerator.getValue(
          siteX + shiftX,
          siteY + shiftY,
        );

        const site = {
          elevation,
          moisture,
          temperature,
          biome: getBiome(elevation, moisture, temperature),
          center: [siteX, siteY],
        };

        this.sites.push(site);
      }
    }
    this.voronoi = new Voronoi(this.siteCenters);
  }

  isSiteInBounds(site: number[]) {
    if (!site) return false;
    const x = Math.floor(site[0]);
    const y = Math.floor(site[1]);
    return x >= 0 && x < this.size && y >= 0 && y < this.size;
  }
}
