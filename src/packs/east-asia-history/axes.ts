/**
 * @file axes.ts
 * @description Geopolitical tracks (Axes) for the East Asia & Korean Peninsula History DomainPack (Manchuria + Korean Peninsula + Japanese Archipelago).
 */

import type { Axis } from '../../contracts/timeline.contract';

export const eastAsiaAxes: Axis[] = [
  {
    id: 'axis_ea_manchuria',
    name: '만주 · 요동 · 북방 권역',
    description: '요하·송화강·백두산 북부 및 요동 평원 (고구려 북부 → 발해 → 거란/요)',
    order: 0,
    accentColor: '#d97706',
  },
  {
    id: 'axis_ea_north_korea',
    name: '한반도 북부 (패서 · 대동강 · 동북면)',
    description: '평양(서경)·패서 호족·원산만 일대 (고구려 남부 → 발해 남경/신라 북변 → 태봉/고려 북진 기지)',
    order: 1,
    accentColor: '#dc2626',
  },
  {
    id: 'axis_ea_central_korea',
    name: '한반도 중부 (송악 · 철원 · 한강 유역)',
    description: '개경(송악)·철원·한강·예성강 유역 (삼국 각축지 → 신라 한주 → 후고구려/마진/태봉 → 고려 본거지)',
    order: 2,
    accentColor: '#10b981',
  },
  {
    id: 'axis_ea_south_korea',
    name: '한반도 남부 (영남 · 호남 · 가야 · 탐라)',
    description: '경주(금성)·전주(완산주)·나주·낙동강 유역 (백제·가야·신라 → 통일신라/하대 분열 → 후백제 vs 신라)',
    order: 3,
    accentColor: '#3b82f6',
  },
  {
    id: 'axis_ea_japan',
    name: '일본 열도 (왜 · 야마토 ~ 나라 ~ 헤이안)',
    description: '규슈·기나이·교토(헤이안쿄) (백제·가야 교류 및 백강 전투 → 율령국가 수립 → 신라·발해·후백제 외교)',
    order: 4,
    accentColor: '#8b5cf6',
  },
];
