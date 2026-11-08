/**
 * @file buildBaseMap.ts
 * @description Extracts East Asia (Manchuria + Korean Peninsula + Japan Northwest)
 * land polygons and rivers from Natural Earth 10m GeoJSONs, projects them to SVG paths,
 * and saves them into src/packs/east-asia-history/baseMapData.ts.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { createProjectionFrame } from '../src/core/projection';
import type { BaseMapLayer, SpatialProjection } from '../src/contracts/timeline.contract';

const BOUNDS = {
  minX: 120.0, // Longitude West (Liaodong / Shandong edge)
  maxX: 133.0, // Longitude East (East Sea / Northwest Japan Honshu / Kyushu)
  minY: 32.5,  // Latitude South (Jeju / Kyushu)
  maxY: 43.5,  // Latitude North (Southern Manchuria / Dongmosan / Jilin)
};

const PROJECTION: SpatialProjection = {
  type: 'EQUIRECTANGULAR',
  bounds: BOUNDS,
};

const frame = createProjectionFrame(PROJECTION, 900);
const viewBox = { width: frame.width, height: Math.round(frame.height) };

console.log(`Generated viewBox: ${viewBox.width} x ${viewBox.height}`);

// Helper to check if a bbox overlaps our area
function bboxOverlaps(minX: number, maxX: number, minY: number, maxY: number): boolean {
  return !(maxX < BOUNDS.minX - 0.5 || minX > BOUNDS.maxX + 0.5 || maxY < BOUNDS.minY - 0.5 || minY > BOUNDS.maxY + 0.5);
}

// Simple point distance check to avoid redundant SVG vertices
function distSq(p1: [number, number], p2: [number, number]): number {
  const dx = p1[0] - p2[0];
  const dy = p1[1] - p2[1];
  return dx * dx + dy * dy;
}

function processCoordinates(ring: number[][]): string {
  // Check if at least some points fall within or near our bounds
  let insideCount = 0;
  for (const [lon, lat] of ring) {
    if (lon >= BOUNDS.minX - 0.5 && lon <= BOUNDS.maxX + 0.5 && lat >= BOUNDS.minY - 0.5 && lat <= BOUNDS.maxY + 0.5) {
      insideCount++;
    }
  }
  if (insideCount === 0) return '';

  let pathStr = '';
  let lastPt: [number, number] | null = null;
  let count = 0;

  for (let i = 0; i < ring.length; i++) {
    const [lon, lat] = ring[i];
    const [px, py] = frame.project(lon, lat);

    // Skip point if too close to previous point (< 1.6px)
    if (lastPt && distSq([px, py], lastPt) < 2.56 && i < ring.length - 1) {
      continue;
    }

    pathStr += `${count === 0 ? 'M' : 'L'}${px.toFixed(1)} ${py.toFixed(1)}`;
    lastPt = [px, py];
    count++;
  }

  if (count > 2) {
    // If all points span less than 3px in width and height, it's a subpixel speck, skip it
    let minPx = Infinity, maxPx = -Infinity, minPy = Infinity, maxPy = -Infinity;
    for (const [lon, lat] of ring) {
      const [px, py] = frame.project(lon, lat);
      if (px < minPx) minPx = px;
      if (px > maxPx) maxPx = px;
      if (py < minPy) minPy = py;
      if (py > maxPy) maxPy = py;
    }
    if (maxPx - minPx < 3 && maxPy - minPy < 3) return '';

    pathStr += 'Z ';
    return pathStr;
  }
  return '';
}

function processLineCoordinates(line: number[][]): string {
  let insideCount = 0;
  for (const [lon, lat] of line) {
    if (lon >= BOUNDS.minX - 0.5 && lon <= BOUNDS.maxX + 0.5 && lat >= BOUNDS.minY - 0.5 && lat <= BOUNDS.maxY + 0.5) {
      insideCount++;
    }
  }
  if (insideCount === 0) return '';

  let pathStr = '';
  let lastPt: [number, number] | null = null;
  let count = 0;

  for (let i = 0; i < line.length; i++) {
    const [lon, lat] = line[i];
    const [px, py] = frame.project(lon, lat);

    if (lastPt && distSq([px, py], lastPt) < 1.44 && i < line.length - 1) {
      continue;
    }

    pathStr += `${count === 0 ? 'M' : 'L'}${px.toFixed(1)} ${py.toFixed(1)}`;
    lastPt = [px, py];
    count++;
  }

  if (count > 1) {
    return pathStr + ' ';
  }
  return '';
}

// 1. Process Land
const landPath = path.resolve('C:/Users/simja/.gemini/antigravity/brain/d6e6b81c-2a84-47ca-b11a-ead38f992771/scratch/ne/land.geojson');
console.log(`Reading land GeoJSON from ${landPath}...`);
const landGeo = JSON.parse(fs.readFileSync(landPath, 'utf-8'));

let landSvgPath = '';
let processedPolys = 0;

for (const feature of landGeo.features) {
  const geom = feature.geometry;
  if (!geom) continue;

  if (geom.type === 'Polygon') {
    for (const ring of geom.coordinates) {
      const p = processCoordinates(ring);
      if (p) {
        landSvgPath += p;
        processedPolys++;
      }
    }
  } else if (geom.type === 'MultiPolygon') {
    for (const poly of geom.coordinates) {
      for (const ring of poly) {
        const p = processCoordinates(ring);
        if (p) {
          landSvgPath += p;
          processedPolys++;
        }
      }
    }
  }
}

console.log(`Processed ${processedPolys} land polygon rings. Land SVG path length: ${landSvgPath.length} chars.`);

// 2. Process Rivers
const riverPath = path.resolve('C:/Users/simja/.gemini/antigravity/brain/d6e6b81c-2a84-47ca-b11a-ead38f992771/scratch/ne/rivers.geojson');
console.log(`Reading river GeoJSON from ${riverPath}...`);
const riverGeo = JSON.parse(fs.readFileSync(riverPath, 'utf-8'));

let riverSvgPath = '';
let processedRivers = 0;

for (const feature of riverGeo.features) {
  const geom = feature.geometry;
  if (!geom) continue;

  if (geom.type === 'LineString') {
    const p = processLineCoordinates(geom.coordinates);
    if (p) {
      riverSvgPath += p;
      processedRivers++;
    }
  } else if (geom.type === 'MultiLineString') {
    for (const line of geom.coordinates) {
      const p = processLineCoordinates(line);
      if (p) {
        riverSvgPath += p;
        processedRivers++;
      }
    }
  }
}

console.log(`Processed ${processedRivers} river segments. River SVG path length: ${riverSvgPath.length} chars.`);

// 3. Write baseMapData.ts
const outputPath = path.resolve('src/packs/east-asia-history/baseMapData.ts');

const outputContent = `/**
 * @file baseMapData.ts
 * @description Pre-rendered static coastline and river paths for East Asia
 * (Manchuria South, Korean Peninsula, Japan Northwest).
 * Generated from Natural Earth 10m Vector data by scripts/buildBaseMap.ts.
 */

import type { BaseMapLayer, SpatialProjection } from '../../contracts/timeline.contract';

export const eastAsiaProjection: SpatialProjection = ${JSON.stringify(PROJECTION, null, 2)};

export const eastAsiaViewBox = {
  width: ${viewBox.width},
  height: ${viewBox.height},
};

export const eastAsiaBaseLayers: BaseMapLayer[] = [
  {
    id: 'layer_ea_land_mask',
    kind: 'LAND',
    svgPath: \`${landSvgPath.trim()}\`,
  },
  {
    id: 'layer_ea_rivers',
    kind: 'RIVER',
    svgPath: \`${riverSvgPath.trim()}\`,
  },
];
`;

fs.writeFileSync(outputPath, outputContent, 'utf-8');
console.log(`Saved base map data to ${outputPath} (${(outputContent.length / 1024).toFixed(1)} KB)`);
