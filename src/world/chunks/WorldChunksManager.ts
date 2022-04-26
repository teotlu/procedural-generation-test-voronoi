import { FractalNoise } from '../../generators/FractalNoise';
import { PositionFalloff } from '../../generators/PositionFalloff';
import { Vector2D } from '../../helpers/geometry';
import { WorldChunk } from './WorldChunk';

export class WorldChunksManager {
  public spawnedChunks: Record<string, WorldChunk> = {};

  private elevationGenerator = new FractalNoise(`${this.seed}_elevation`, {
    octaves: 5,
    frequency: 0.001,
  });

  private moistureGenerator = new FractalNoise(`${this.seed}_moisture`, {
    octaves: 5,
    frequency: 0.002,
  });

  private temperatureGenerator = new FractalNoise(`${this.seed}_temperature`, {
    octaves: 5,
    frequency: 0.002,
  });

  // private temperatureGenerator = new PositionFalloff(
  //   `${this.seed}_temperature`,
  //   {
  //     falloff: 10,
  //   },
  // );

  private sitesPerChunkSide = 5;

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
