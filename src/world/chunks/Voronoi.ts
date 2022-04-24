import Delaunator from 'delaunator';
import { forEachVoronoiEdge } from './helpers';

export class Voronoi {
  delaunay: Delaunator;

  constructor(private points: number[][]) {
    this.delaunay = Delaunator.from(points);
  }

  forEachEdge(cb: (e: number, p: number[], q: number[]) => void) {
    forEachVoronoiEdge(this.points, this.delaunay, cb);
  }
}
