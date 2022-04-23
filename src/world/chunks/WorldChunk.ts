import { IValueGenerator } from '../../generators/typings';
import { IWorldPoint } from '../WorldPoint';
import { Vector2D, getRandomPointInCircle } from '../../helpers/geometry';
import { SeedRandom } from '../../typings';

export class WorldChunk {
  public points: IWorldPoint[][] = [];
  public position: Vector2D;
  public sites: number[][] = [];

  constructor(
    position: Vector2D,
    private size: number,
    private cellSize: number,
    private elevationGenerator: IValueGenerator,
    private moistureGenerator: IValueGenerator,
    private temperatureGenerator: IValueGenerator,
    private prng: SeedRandom,
  ) {
    this.position = position;
    const shiftX = position.x * this.size;
    const shiftY = position.y * this.size;
    for (let x = 0; x < this.size; x += this.cellSize) {
      this.points[x] = [];
      for (let y = 0; y < this.size; y += this.cellSize) {
        const randomPoint = getRandomPointInCircle(this.cellSize / 4, prng);
        this.sites.push([
          x + randomPoint.x + this.cellSize / 2,
          y + randomPoint.y + this.cellSize / 2,
        ]);
        this.points[x][y] = {
          elevation: this.elevationGenerator.getValue(x + shiftX, y + shiftY),
          moisture: this.moistureGenerator.getValue(x + shiftX, y + shiftY),
          temperature: this.temperatureGenerator.getValue(
            x + shiftX,
            y + shiftY,
          ),
        };

        console.log(this.sites, this.points);
      }
    }
  }
}
