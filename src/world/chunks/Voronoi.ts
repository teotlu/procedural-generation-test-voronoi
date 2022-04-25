import Delaunator from 'delaunator';
import { forEachVoronoiCell, forEachVoronoiEdge } from './helpers';

export class Voronoi {
  delaunay: Delaunator;

  constructor(private points: number[][]) {
    this.delaunay = Delaunator.from(points);
  }

  forEachEdge(cb: (e: number, p: number[], q: number[]) => void) {
    forEachVoronoiEdge(this.points, this.delaunay, cb);
  }

  forEachCell(cb: (p: number, vertices: number[][]) => void) {
    forEachVoronoiCell(this.points, this.delaunay, cb);
  }
}
