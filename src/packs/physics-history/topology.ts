/**
 * @file topology.ts
 * @description 2D Conceptual Phase-Scale Topology Map for the History of Physics.
 * Proves that the SpatialTopology Contract generalizes seamlessly to non-geographic scientific phase spaces.
 */

import type { SpatialTopology } from '../../contracts/timeline.contract';

export const physicsTopology: SpatialTopology = {
  canvasType: 'CONCEPTUAL_TOPOLOGY',
  projection: {
    type: 'IDENTITY',
    bounds: { minX: 0, maxX: 900, minY: 0, maxY: 600 },
  },
  viewBox: { width: 900, height: 600 },
  clipTerritoriesToLand: false,
  baseLayers: [
    {
      id: 'layer_phy_grid',
      kind: 'GRID',
      svgPath: `
        M 80 520 L 840 520
        M 80 520 L 80 80
        M 80 300 L 840 300
        M 460 520 L 460 80
      `,
    },
  ],
  regions: [
    {
      id: 'loc_phy_macro_low_speed',
      name: '거시 · 저속 영역 (고전역학 & 열역학 영역)',
      shortLabel: '거시 · 저속',
      description: '일상적 질량과 속도 (v << c, h -> 0) 뉴턴 역학과 라그랑주·열통계역학의 지배 영역',
      centerCoord: { x: 260, y: 410 },
      rings: [
        [
          [90, 310],
          [450, 310],
          [450, 510],
          [90, 510],
        ],
      ],
      kind: 'ZONE',
    },
    {
      id: 'loc_phy_macro_high_speed',
      name: '거시 · 광속/강중력 영역 (상대성이론 영역)',
      shortLabel: '거시 · 광속/중력',
      description: '광속에 가까운 속도 (v ~ c) 및 거대 천체·블랙홀·우주론 시공간 기하학 영역',
      centerCoord: { x: 650, y: 410 },
      rings: [
        [
          [470, 310],
          [830, 310],
          [830, 510],
          [470, 510],
        ],
      ],
      kind: 'ZONE',
    },
    {
      id: 'loc_phy_micro_low_energy',
      name: '미시 · 저에너지 양자 영역 (코펜하겐 양자역학 영역)',
      shortLabel: '미시 · 저에너지',
      description: '원자·분자 및 전자 스펙트럼 (플랑크 상수 h 유효, 비상대론적 슈뢰딩거 파동역학)',
      centerCoord: { x: 260, y: 190 },
      rings: [
        [
          [90, 90],
          [450, 90],
          [450, 290],
          [90, 290],
        ],
      ],
      kind: 'ZONE',
    },
    {
      id: 'loc_phy_micro_high_energy',
      name: '미시 · 초고에너지 입자 영역 (양자장론 QFT & 표준모형)',
      shortLabel: '미시 · 초고에너지',
      description: '소립자 충돌 및 게이지 장론 (특수상대성 + 양자역학 + 전자기/약/강 상호작용 통합)',
      centerCoord: { x: 650, y: 190 },
      rings: [
        [
          [470, 90],
          [830, 90],
          [830, 290],
          [470, 290],
        ],
      ],
      kind: 'ZONE',
    },
  ],
};
