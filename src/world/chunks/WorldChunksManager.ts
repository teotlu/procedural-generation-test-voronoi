import { FractalNoise } from '../../generators/FractalNoise';
import { CustomFunction } from '../../generators/CustomFunction';
import { Vector2D } from '../../helpers/geometry';
import { WorldChunk } from './WorldChunk';

export class WorldChunksManager {
  public spawnedChunks: Record<string, WorldChunk> = {};

  public get spawnedChunksList() {
    return Object.values(this.spawnedChunks);
  }

  // Default noises

  private elevationNoise = new FractalNoise(`${this.seed}_elevation`, {
    octaves: 5,
    frequency: 0.001,
  });

  private moistureNoise = new FractalNoise(`${this.seed}_moisture`, {
    octaves: 5,
    frequency: 0.002,
  });

  private temperatureNoise = new FractalNoise(`${this.seed}_temperature`, {
    octaves: 5,
    frequency: 0.002,
  });

  // Value generators

  private elevationGenerator = new CustomFunction((x, y) => {
    // if (
    //   Math.abs(x * x * x) + Math.abs(y * y) < 1000000 ||
    //   Math.abs(x * x) + Math.abs(y * y * y) < 1000000
    // ) {
    //   return Math.max(100 - Math.abs(y * y + x * x) / 100, 0);
    // }

    return this.elevationNoise.getValue(x, y);
  });

  private moistureGenerator = new CustomFunction((x, y) => {
    // if (
    //   Math.abs(x * x * x) + Math.abs(y * y) < 1000000 ||
    //   Math.abs(x * x) + Math.abs(y * y * y) < 1000000
    // ) {
    //   return Math.max(100 - Math.abs(y * y + x * x) / 100, 0);
    // }

    return this.moistureNoise.getValue(x, y);
  });

  private temperatureGenerator = new CustomFunction((x, y) => {
    // if (
    //   Math.abs(x * x * x) + Math.abs(y * y) < 1000000 ||
    //   Math.abs(x * x) + Math.abs(y * y * y) < 1000000
    // ) {
    //   return Math.max(100 - Math.abs(y * y + x * x) / 100, 0);
    // }

    return this.temperatureNoise.getValue(x, y);
  });

  private sitesPerChunkSide = 8;

  constructor(private seed: string, private chunkSize: number) {}

  public spawnChunk(position: Vector2D): WorldChunk {
    const chunk = new WorldChunk(
      position,
      this.chunkSize,
      this.sitesPerChunkSide,
      this.elevationGenerator,
      this.moistureGenerator,
      this.temperatureGenerator,
      this.seed,
    );
    this.spawnedChunks[position.hash] = chunk;
    return chunk;
  }

  public removeChunk(position: Vector2D) {
    delete this.spawnedChunks[position.hash];
  }
}
