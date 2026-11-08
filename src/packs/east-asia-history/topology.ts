/**
 * @file topology.ts
 * @description Fixed Geographical Map topology for East Asia & Korean Peninsula
 * (Manchuria South + Korean Peninsula + Japan Northwest).
 * Uses Natural Earth 10m Vector coastlines and rivers via baseMapData.ts.
 */

import type { SpatialTopology } from '../../contracts/timeline.contract';
import { eastAsiaBaseLayers, eastAsiaProjection, eastAsiaViewBox } from './baseMapData';

export const eastAsiaTopology: SpatialTopology = {
  canvasType: 'GEOGRAPHIC_MAP',
  projection: eastAsiaProjection,
  viewBox: eastAsiaViewBox,
  baseLayers: eastAsiaBaseLayers,
  clipTerritoriesToLand: true,
  regions: [
    {
      id: 'loc_ea_manchuria_liaodong',
      name: '만주 남부 · 요동 · 동모산 권역',
      shortLabel: '만주·요동·동모산',
      description: '요하·요동반도·압록강 북쪽 및 동모산(발해 건국지)·백두산 북방 초원 지대',
      centerCoord: { x: 125.0, y: 42.0 },
      kind: 'PLACE',
    },
    {
      id: 'loc_ea_north_pyeongyang',
      name: '한반도 북부 (평양 · 패서 · 원산만)',
      shortLabel: '평양·패서',
      description: '평양성(고구려·고려 서경)·대동강 유역·패서 13진 및 관서·동북면 일대',
      centerCoord: { x: 125.75, y: 39.03 },
      kind: 'PLACE',
    },
    {
      id: 'loc_ea_central_han_river',
      name: '한반도 중부 (송악 · 철원 · 한강 유역)',
      shortLabel: '송악·철원·한강',
      description: '개경(송악)·철원(태봉 수도)·한양(한성) 및 예성강·임진강·한강 수운 거점',
      centerCoord: { x: 126.9, y: 37.7 },
      kind: 'PLACE',
    },
    {
      id: 'loc_ea_southwest_honam',
      name: '한반도 남서부 (호남 · 완산 · 나주)',
      shortLabel: '완산·나주',
      description: '웅진·사비(백제), 완산주(후백제 전주), 무진주(광주), 금성/나주(왕건 수군 기지)',
      centerCoord: { x: 126.9, y: 35.5 },
      kind: 'PLACE',
    },
    {
      id: 'loc_ea_southeast_yeongnam',
      name: '한반도 남동부 (영남 · 금성 · 가야)',
      shortLabel: '금성(경주)·영남',
      description: '금성(신라 경주), 대가야(고령), 금관가야(김해), 낙동강, 공산·고창·일리천 결전지',
      centerCoord: { x: 128.8, y: 35.7 },
      kind: 'PLACE',
    },
    {
      id: 'loc_ea_tamna_jeju',
      name: '도서 해양권 (탐라 · 제주)',
      shortLabel: '탐라국 (제주)',
      description: '제주도 일대 독립 해양 세력 (백제·신라·고려와 조공 자치 관계)',
      centerCoord: { x: 126.55, y: 33.35 },
      kind: 'PLACE',
    },
    {
      id: 'loc_ea_japan_west',
      name: '일본 열도 서북부 (규슈 · 기나이)',
      shortLabel: '일본 서부·규슈',
      description: '쓰시마, 규슈 다자이후, 세토내해, 야마토/아스카/헤이조쿄/헤이안쿄',
      centerCoord: { x: 130.8, y: 33.6 },
      kind: 'PLACE',
    },
  ],
};
