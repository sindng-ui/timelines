/**
 * @file index.ts
 * @description Assembled DomainPack for the History of Physics (1600 CE - 2025 CE).
 */

import type { DomainPack } from '../../contracts/timeline.contract';
import { physicsAxes, physicsEntities, physicsSegments } from './axesAndEntities';
import { physicsEvidences, physicsEvents, physicsTransitions } from './transitionsAndEvidences';

export const physicsHistoryPack: DomainPack = {
  id: 'physics-history',
  packCode: 'phy',
  title: '물리학 패러다임의 역사 (고전역학 ~ 상대성이론 · 양자역학 ~ 표준모형)',
  subtitle:
    '범용 프레임워크 실증 팩: 뉴턴 역학과 맥스웰 전자기학은 왜 상대성이론과 양자역학으로 분기되었고 어떻게 표준모형으로 통합되었는가? (1600년 ~ 2025년)',
  domainType: 'SCIENCE',
  version: '1.0.0',
  timeRange: {
    startYear: 1600,
    endYear: 2025,
    defaultFocusYear: 1905,
  },
  eraMilestones: [
    {
      id: 'era_phy_classical',
      name: '고전 역학 · 만유인력 정립기',
      startYear: 1600,
      endYear: 1819,
      color: '#10b981',
      description: '갈릴레이·케플러·뉴턴에서 라그랑주·해밀턴으로 이어지는 결정론적 고전 물리학 시대',
    },
    {
      id: 'era_phy_em_thermo',
      name: '전자기장 · 열통계역학 통합 및 고전 물리학의 위기',
      startYear: 1820,
      endYear: 1899,
      color: '#3b82f6',
      description: '맥스웰 전자기 방정식과 볼츠만 통계역학의 완성, 그리고 광속 불변·흑체복사 모순 대두',
    },
    {
      id: 'era_phy_relativity_quantum',
      name: '상대성이론 · 양자역학 2대 패러다임 혁명기',
      startYear: 1900,
      endYear: 1927,
      color: '#f59e0b',
      description: '플랑크 양자 가설(1900), 아인슈타인 상대성이론(1905/1915), 코펜하겐 양자역학(1925~1927)',
    },
    {
      id: 'era_phy_qft_standard_model',
      name: '양자장론(QFT) · 입자물리 표준모형 대통합기',
      startYear: 1928,
      endYear: 2025,
      color: '#ec4899',
      description: '디랙·파인만 QED에서 전자기약력 통일과 2012년 CERN LHC 힉스 보손 발견까지',
    },
  ],
  axes: physicsAxes,
  entities: physicsEntities,
  segments: physicsSegments,
  transitions: physicsTransitions,
  events: physicsEvents,
  evidences: physicsEvidences,
};
