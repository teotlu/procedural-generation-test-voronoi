import { IValueGenerator } from '../../generators/typings';
import { IWorldPoint } from '../WorldPoint';
import { Vector2D } from '../../helpers/geometry';

export class WorldChunk {
  public points: IWorldPoint[][] = [];
  public position: Vector2D;

  constructor(
    position: Vector2D,
    private size: number,
    private elevationGenerator: IValueGenerator,
    private moistureGenerator: IValueGenerator,
    private temperatureGenerator: IValueGenerator,
  ) {
    this.position = position;
    const shiftX = position.x * this.size;
    const shiftY = position.y * this.size;
    for (let x = 0; x < this.size; x++) {
      this.points[x] = [];
      for (let y = 0; y < this.size; y++) {
        this.points[x][y] = {
          elevation: this.elevationGenerator.getValue(x + shiftX, y + shiftY),
          moisture: this.moistureGenerator.getValue(x + shiftX, y + shiftY),
          temperature: this.temperatureGenerator.getValue(
            x + shiftX,
            y + shiftY,
          ),
        };
      }
    }
  }
}
