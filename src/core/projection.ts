/**
 * @file projection.ts
 * @description Shared coordinate projection for SpatialTopology canvases.
 * GEOGRAPHIC maps use an equirectangular projection (x = lon, y = lat) scaled by cos(midLat).
 * CONCEPTUAL maps use IDENTITY (coordinates are already in viewBox space).
 * Used both at build time (scripts/buildBaseMap.ts) and at runtime (SpatialTopologyCanvas).
 */

import type { PointCoord, SpatialProjection } from '../contracts/timeline.contract';

export interface ProjectionFrame {
  width: number;
  height: number;
  project: (x: number, y: number) => [number, number];
}

/**
 * Builds a projection frame. For EQUIRECTANGULAR the viewBox width is fixed by `targetWidth`
 * and the height is derived so that the aspect ratio stays geographically faithful.
 */
export function createProjectionFrame(
  projection: SpatialProjection,
  targetWidth = 1000
): ProjectionFrame {
  const { minX, maxX, minY, maxY } = projection.bounds;

  if (projection.type === 'IDENTITY') {
    return {
      width: maxX - minX,
      height: maxY - minY,
      project: (x, y) => [x - minX, y - minY],
    };
  }

  const midLatRad = (((minY + maxY) / 2) * Math.PI) / 180;
  const cosLat = Math.cos(midLatRad);
  const k = targetWidth / ((maxX - minX) * cosLat);
  const height = (maxY - minY) * k;

  return {
    width: targetWidth,
    height,
    project: (lon, lat) => [(lon - minX) * cosLat * k, (maxY - lat) * k],
  };
}

export function projectPoint(frame: ProjectionFrame, p: PointCoord): [number, number] {
  return frame.project(p.x, p.y);
}

/** Converts rings of [x, y] tuples in topology space into a single SVG path string. */
export function ringsToSvgPath(
  frame: ProjectionFrame,
  rings: Array<Array<[number, number]>>
): string {
  let d = '';
  for (const ring of rings) {
    for (let i = 0; i < ring.length; i++) {
      const [px, py] = frame.project(ring[i][0], ring[i][1]);
      d += `${i === 0 ? 'M' : 'L'}${px.toFixed(1)} ${py.toFixed(1)}`;
    }
    d += 'Z';
  }
  return d;
}

/** Simple vertex-average centroid in topology space (used as label fallback). */
export function ringCentroid(ring: Array<[number, number]>): PointCoord {
  let sx = 0;
  let sy = 0;
  for (const [x, y] of ring) {
    sx += x;
    sy += y;
  }
  return { x: sx / ring.length, y: sy / ring.length };
}
