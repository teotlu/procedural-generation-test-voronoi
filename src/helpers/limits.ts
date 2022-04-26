export class Limits {
  public min: number;
  public max: number;

  constructor(min: number, max: number) {
    this.min = min;
    this.max = max;
  }

  public isValueInLimits(value: number) {
    return value >= this.min && value <= this.max;
  }

  public getLimitedValue(value: number) {
    return Math.max(Math.min(value, this.max), this.min);
  }
}
