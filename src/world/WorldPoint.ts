import { Percent } from '../typings';

export interface IWorldPoint {
  moisture: Percent;
  temperature: Percent;
  elevation: Percent;
}

export class WorldPoint {
  moisture: Percent;
  temperature: Percent;
  elevation: Percent;

  constructor(point: IWorldPoint) {
    this.moisture = point.moisture;
    this.temperature = point.temperature;
    this.elevation = point.elevation;
  }
}
