export class Vector2D {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public get hash() {
    return `${this.x}_${this.y}`;
  }
}

export class Bounds {
  public pointFrom: Vector2D;
  public pointTo: Vector2D;

  constructor(pointFrom: Vector2D, pointTo: Vector2D) {
    this.pointFrom = pointFrom;
    this.pointTo = pointTo;
  }
}

export function getRandomPointInCircle(r: number) {
  const angle = Math.random() * 2 * Math.PI;
  return new Vector2D(
    Math.round(Math.cos(angle) * r),
    Math.round(Math.sin(angle) * r),
  );
}
