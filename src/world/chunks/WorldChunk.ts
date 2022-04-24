import { IValueGenerator } from '../../generators/typings';
import { IWorldPoint } from '../WorldPoint';
import { Vector2D, getRandomPointInCircle } from '../../helpers/geometry';
import { SeedRandom } from '../../typings';
import { Voronoi } from './Voronoi';

export class WorldChunk {
  public points: IWorldPoint[][] = [];
  public position: Vector2D;
  public sites: number[][] = [];
  public voronoi: Voronoi;

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
    for (
      let x = -this.cellSize * 2;
      x < this.size + this.cellSize * 2;
      x += this.cellSize
    ) {
      this.points[x] = [];
      for (
        let y = -this.cellSize * 2;
        y < this.size + this.cellSize * 2;
        y += this.cellSize
      ) {
        const randomPoint = getRandomPointInCircle(this.cellSize / 2, prng);
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

        // console.log(this.sites, this.points);
      }
    }
    this.voronoi = new Voronoi(this.sites);
  }
}
