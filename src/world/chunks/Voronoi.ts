import Delaunator from 'delaunator';
import { forEachVoronoiCell, forEachVoronoiEdge } from './helpers';

export class Voronoi {
  delaunay: Delaunator;

  constructor(private siteCenters: number[][]) {
    this.delaunay = Delaunator.from(siteCenters);
  }

  forEachEdge(cb: (e: number, p: number[], q: number[]) => void) {
    forEachVoronoiEdge(this.siteCenters, this.delaunay, cb);
  }

  forEachCell(cb: (p: number, vertices: number[][]) => void) {
    forEachVoronoiCell(this.siteCenters, this.delaunay, cb);
  }
}
