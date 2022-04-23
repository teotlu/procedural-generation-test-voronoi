import Alea from 'alea';
import { FractalNoise } from '../../generators/FractalNoise';
import { Vector2D } from '../../helpers/geometry';
import { WorldChunk } from './WorldChunk';

export class WorldChunksManager {
  public spawnedChunks: Record<string, WorldChunk> = {};

  private alea: ReturnType<typeof Alea>;

  private elevationNoise = new FractalNoise(`${this.seed}_elevation`, {
    octaves: 5,
    frequency: 0.01,
  });

  private temperatureNoise = new FractalNoise(`${this.seed}_temperature`, {
    octaves: 5,
    frequency: 0.005,
  });

  private moistureNoise = new FractalNoise(`${this.seed}_moisture`, {
    octaves: 5,
    frequency: 0.005,
  });

  constructor(
    private seed: number,
    private chunkSize: number,
    private chunkCellSize: number,
  ) {
    this.alea = new Alea(seed);
  }

  public spawnChunk(position: Vector2D): WorldChunk {
    const chunk = new WorldChunk(
      position,
      this.chunkSize,
      this.chunkCellSize,
      this.elevationNoise,
      this.moistureNoise,
      this.temperatureNoise,
    );
    this.spawnedChunks[position.hash] = chunk;
    return chunk;
  }

  public removeChunk(position: Vector2D) {
    delete this.spawnedChunks[position.hash];
  }
}
