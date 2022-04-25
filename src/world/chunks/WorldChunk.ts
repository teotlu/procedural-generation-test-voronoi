import { IValueGenerator } from '../../generators/typings';
import { IWorldPoint } from '../WorldPoint';
import { Vector2D, getRandomPointInCircle } from '../../helpers/geometry';
import { Voronoi } from './Voronoi';
import seedrandom from 'seedrandom';

export class WorldChunk {
  public points: IWorldPoint[][] = [];
  public position: Vector2D;
  public sites: number[][] = [];
  public sitesToPoints: IWorldPoint[] = [];
  public voronoi: Voronoi;

  constructor(
    position: Vector2D,
    private size: number,
    private cellSize: number,
    private elevationGenerator: IValueGenerator,
    private moistureGenerator: IValueGenerator,
    private temperatureGenerator: IValueGenerator,
    seed: string,
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
        const prng = seedrandom(`${seed}_${shiftX + x}_${shiftY + y}`);
        const randomPoint = getRandomPointInCircle(this.cellSize / 2, prng);
        const site = [
          x + randomPoint.x + this.cellSize / 2,
          y + randomPoint.y + this.cellSize / 2,
        ];
        this.sites.push(site);
        this.points[x][y] = {
          elevation: this.elevationGenerator.getValue(x + shiftX, y + shiftY),
          moisture: this.moistureGenerator.getValue(x + shiftX, y + shiftY),
          temperature: this.temperatureGenerator.getValue(
            x + shiftX,
            y + shiftY,
          ),
        };
        this.sitesToPoints.push(this.points[x][y]);

        // console.log(this.sites, this.points);
      }
    }
    this.voronoi = new Voronoi(this.sites);
  }

  isSiteInBounds(site: number[]) {
    if (!site) return false;
    return (
      site[0] >= this.position.x &&
      site[0] < this.position.x + this.size &&
      site[1] >= this.position.y &&
      site[1] < this.position.y + this.size
    );
  }
}
