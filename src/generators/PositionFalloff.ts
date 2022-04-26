import seedrandom from 'seedrandom';
import { IValueGenerator } from './typings';
import { SeedRandom } from '../typings';

export type PositionFalloffConfig = {
  min?: number;
  max?: number;
  falloff?: number;
};

export class PositionFalloff implements IValueGenerator {
  private config = {
    min: 0,
    max: 100,
    falloff: 1000,
  };

  private prng: SeedRandom;

  constructor(seed: string, config?: PositionFalloffConfig) {
    this.config = {
      ...this.config,
      ...config,
    };
    this.prng = seedrandom(seed);
  }

  public getValue(x: number, y: number): number {
    // TODO Formula
    return 100;
  }
}
