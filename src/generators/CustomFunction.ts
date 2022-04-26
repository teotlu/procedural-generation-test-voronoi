import { IValueGenerator } from './typings';

export type CustomFunctionConfig = {
  customFunction: (x: number, y: number) => number;
};

export class CustomFunction implements IValueGenerator {
  constructor(private func: (x: number, y: number) => number) {}

  public getValue(x: number, y: number): number {
    return this.func(x, y);
  }
}
