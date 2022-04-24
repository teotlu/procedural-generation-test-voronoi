import Delaunator from 'delaunator';

// Delaunay

export function edgesOfTriangle(t: number): number[] {
  return [3 * t, 3 * t + 1, 3 * t + 2];
}

export function triangleOfEdge(e: number): number {
  return Math.floor(e / 3);
}

export function nextHalfedge(e: number): number {
  return e % 3 === 2 ? e - 2 : e + 1;
}

export function prevHalfedge(e: number): number {
  return e % 3 === 0 ? e + 2 : e - 1;
}

export function forEachTriangleEdge(
  points: number[][],
  delaunay: Delaunator,
  callback: (e: number, p: number[], q: number[]) => void,
): void {
  for (let e = 0; e < delaunay.triangles.length; e++) {
    if (e > delaunay.halfedges[e]) {
      const p = points[delaunay.triangles[e]];
      const q = points[delaunay.triangles[nextHalfedge(e)]];
      callback(e, p, q);
    }
  }
}

export function pointsOfTriangle(delaunay: Delaunator, t: number): number[] {
  return edgesOfTriangle(t).map((e) => delaunay.triangles[e]);
}

export function forEachTriangle(
  points: number[][],
  delaunay: Delaunator,
  callback: (t: number, p: number[][]) => void,
) {
  for (let t = 0; t < delaunay.triangles.length / 3; t++) {
    callback(
      t,
      pointsOfTriangle(delaunay, t).map((p) => points[p]),
    );
  }
}

export function trianglesAdjacentToTriangle(
  delaunay: Delaunator,
  t: number,
): number[] {
  const adjacentTriangles = [];
  for (const e of edgesOfTriangle(t)) {
    const opposite = delaunay.halfedges[e];
    if (opposite >= 0) {
      adjacentTriangles.push(triangleOfEdge(opposite));
    }
  }
  return adjacentTriangles;
}

// Voronoi

export function circumcenter(a: number[], b: number[], c: number[]) {
  const ad = a[0] * a[0] + a[1] * a[1];
  const bd = b[0] * b[0] + b[1] * b[1];
  const cd = c[0] * c[0] + c[1] * c[1];
  const D =
    2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1]));
  return [
    (1 / D) * (ad * (b[1] - c[1]) + bd * (c[1] - a[1]) + cd * (a[1] - b[1])),
    (1 / D) * (ad * (c[0] - b[0]) + bd * (a[0] - c[0]) + cd * (b[0] - a[0])),
  ];
}

export function triangleCenter(
  points: number[][],
  delaunay: Delaunator,
  t: number,
): number[] {
  const vertices = pointsOfTriangle(delaunay, t).map((p) => points[p]);
  return circumcenter(vertices[0], vertices[1], vertices[2]);
}

export function forEachVoronoiEdge(
  points: number[][],
  delaunay: Delaunator,
  callback: (e: number, p: number[], q: number[]) => void,
) {
  for (let e = 0; e < delaunay.triangles.length; e++) {
    if (e < delaunay.halfedges[e]) {
      const p = triangleCenter(points, delaunay, triangleOfEdge(e));
      const q = triangleCenter(
        points,
        delaunay,
        triangleOfEdge(delaunay.halfedges[e]),
      );
      callback(e, p, q);
    }
  }
}

export function edgesAroundPoint(delaunay: Delaunator, start: number) {
  const result = [];
  let incoming = start;
  do {
    result.push(incoming);
    const outgoing = nextHalfedge(incoming);
    incoming = delaunay.halfedges[outgoing];
  } while (incoming !== -1 && incoming !== start);
  return result;
}

export function forEachVoronoiCell(
  points: number[][],
  delaunay: Delaunator,
  callback: (p: number, vertices: number[][]) => void,
) {
  const index = new Map(); // point id to half-edge id
  for (let e = 0; e < delaunay.triangles.length; e++) {
    const endpoint = delaunay.triangles[nextHalfedge(e)];
    if (!index.has(endpoint) || delaunay.halfedges[e] === -1) {
      index.set(endpoint, e);
    }
  }
  for (let p = 0; p < points.length; p++) {
    const incoming = index.get(p);
    const edges = edgesAroundPoint(delaunay, incoming);
    const triangles = edges.map(triangleOfEdge);
    const vertices = triangles.map((t) => triangleCenter(points, delaunay, t));
    callback(p, vertices);
  }
}
