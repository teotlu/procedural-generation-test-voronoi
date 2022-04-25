import { FractalNoise } from '../../generators/FractalNoise';
import { Vector2D } from '../../helpers/geometry';
import { WorldChunk } from './WorldChunk';

export class WorldChunksManager {
  public spawnedChunks: Record<string, WorldChunk> = {};

  private elevationNoise = new FractalNoise(`${this.seed}_elevation`, {
    octaves: 5,
    frequency: 0.002,
  });

  private temperatureNoise = new FractalNoise(`${this.seed}_temperature`, {
    octaves: 5,
    frequency: 0.002,
  });

  private moistureNoise = new FractalNoise(`${this.seed}_moisture`, {
    octaves: 5,
    frequency: 0.002,
  });

  private sitesPerChunkSide = 5;

  constructor(private seed: string, private chunkSize: number) {}

  public spawnChunk(position: Vector2D): WorldChunk {
    const chunk = new WorldChunk(
      position,
      this.chunkSize,
      this.sitesPerChunkSide,
      this.elevationNoise,
      this.moistureNoise,
      this.temperatureNoise,
      this.seed,
    );
    this.spawnedChunks[position.hash] = chunk;
    return chunk;
  }

  public removeChunk(position: Vector2D) {
    delete this.spawnedChunks[position.hash];
  }
}
