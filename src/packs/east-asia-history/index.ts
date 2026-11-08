/**
 * @file index.ts
 * @description Assembled DomainPack for East Asia & Korean Peninsula History (Manchuria + Korean Peninsula + Japanese Archipelago, 400 CE - 1000 CE).
 */

import type { DomainPack } from '../../contracts/timeline.contract';
import { eastAsiaAxes } from './axes';
import { eastAsiaEntities } from './entities';
import { eastAsiaSegments } from './segments';
import { eastAsiaTransitions } from './transitions';
import { eastAsiaEvents, eastAsiaEvidences } from './eventsAndEvidences';

export const eastAsiaHistoryPack: DomainPack = {
  id: 'east-asia-history',
  packCode: 'ea',
  title: '한반도 · 만주 · 일본 열도 역사 (삼국 ~ 남북국 ~ 후삼국 ~ 고려 통일)',
  subtitle:
    '왜 통일신라는 후삼국으로 쪼개졌고, 어떻게 발해 유민·태봉·신라·후백제가 고려로 재통합되었는가? (400년 ~ 1000년)',
  domainType: 'HISTORY',
  version: '1.0.0',
  timeRange: {
    startYear: 400,
    endYear: 1000,
    defaultFocusYear: 901,
  },
  eraMilestones: [
    {
      id: 'era_ea_three_kingdoms',
      name: '삼국 항쟁 · 가야 · 왜 동맹기',
      startYear: 400,
      endYear: 675,
      color: '#ef4444',
      description: '고구려·백제·신라·가야의 패권 경쟁과 나당전쟁·백강 전투를 거친 삼국통일 과정',
    },
    {
      id: 'era_ea_north_south_states',
      name: '남북국 시대 (통일신라 · 발해 · 일본 나라/헤이안)',
      startYear: 676,
      endYear: 888,
      color: '#3b82f6',
      description: '대동강 이남 통일신라와 만주·북부의 해동성국 발해가 공존하고 신라 하대 모순이 누적된 시기',
    },
    {
      id: 'era_ea_later_three_kingdoms',
      name: '후삼국 시대 격변기 (신라 · 후백제 · 후고구려/마진/태봉 · 고려 · 발해 멸망)',
      startYear: 889,
      endYear: 936,
      color: '#ec4899',
      description: '889년 조세 파탄·농민 봉기부터 견훤의 후백제, 궁예의 태봉, 왕건의 고려 건국과 발해 유민 흡수 및 936년 일리천 최종 통일까지의 47년 대격변',
    },
    {
      id: 'era_ea_unified_goryeo',
      name: '고려 민족 재통일 · 북진 및 체제 정비기',
      startYear: 937,
      endYear: 1000,
      color: '#10b981',
      description: '삼한과 발해 유민을 통합한 고려의 훈요 10조, 광종·성종 개혁 및 거란(요)과의 외교·군사 대결',
    },
  ],
  axes: eastAsiaAxes,
  entities: eastAsiaEntities,
  segments: eastAsiaSegments,
  transitions: eastAsiaTransitions,
  events: eastAsiaEvents,
  evidences: eastAsiaEvidences,
};
