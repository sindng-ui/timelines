/**
 * @file transitionsAndEvidences.ts
 * @description Causal Transitions, Events, and Evidences for the History of Physics DomainPack.
 */

import type { Evidence, HistoricalEvent, Transition } from '../../contracts/timeline.contract';
import { createAstroTime } from '../../core/astroTime';

export const physicsEvidences: Evidence[] = [
  {
    id: 'evd_phy_principia_1687',
    title: '아이작 뉴턴 『자연철학의 수학적 원리 (Principia)』 (1687) 원전',
    sourceCitation: 'Isaac Newton, Philosophiæ Naturalis Principia Mathematica (1687)',
    sourceType: 'PAPER',
    reliability: 'CERTAIN',
    quoteOrSummary:
      '운동의 3법칙과 만유인력의 법칙(F = G m1 m2 / r^2)을 통해 지상의 사과 낙하와 천상의 행성 타원 궤도(케플러 법칙)가 동일한 수학적 법칙을 따름을 증명하였다.',
    interpretation:
      '아리스토텔레스 이래 분리되어 있던 천상계와 지상계의 물리학을 하나로 통합한 최초의 대통일 패러다임이다.',
    factors: ['IDEOLOGICAL'],
  },
  {
    id: 'evd_phy_michelson_morley_1887',
    title: '맥스웰 전자기파 방정식(1865) 및 마이컬슨-몰리 에테르 부재 실험(1887)',
    sourceCitation: 'J.C. Maxwell (1865) / A.A. Michelson & E.W. Morley, American Journal of Science (1887)',
    sourceType: 'PAPER',
    reliability: 'CERTAIN',
    quoteOrSummary:
      '맥스웰 방정식에서 도출된 빛의 속도 c가 관찰자의 운동 상태와 무관하게 일정하다는 사실이 1887년 마이컬슨-몰리 간섭계 실험(에테르 바람 검출 실패)으로 확인되었다.',
    interpretation:
      '뉴턴 역학의 절대 시간·갈릴레이 속도 덧셈 법칙과 맥스웰 전자기학이 정면 충돌했음을 보여주며, 아인슈타인이 1905년 특수상대성이론을 도출하게 만든 직접적 원인이다.',
    factors: ['IDEOLOGICAL'],
  },
  {
    id: 'evd_phy_planck_1900',
    title: '막스 플랑크의 흑체복사 에너지 양자화 논문(1900) 및 아인슈타인 광양자설(1905)',
    sourceCitation: 'Max Planck, Annalen der Physik (1900) / Albert Einstein (1905)',
    sourceType: 'PAPER',
    reliability: 'CERTAIN',
    quoteOrSummary:
      '고전 열통계역학과 전자기학이 예측한 흑체복사 "자외선 파탄(Ultraviolet Catastrophe)"을 해결하기 위해 플랑크가 에너지가 E = hν의 불연속적 양자 단위로만 방출·흡수된다는 가설을 제시하였다.',
    interpretation:
      '고전 물리학의 연속성 가정이 미시 세계에서 붕괴했음을 알린 사건으로, 고전 열역학·전자기학에서 양자역학이 분기되어 나온 결정적 증거다.',
    factors: ['IDEOLOGICAL'],
  },
  {
    id: 'evd_phy_einstein_1905_1915',
    title: '아인슈타인 특수상대성이론(1905) · 일반상대성이론 장방정식(1915) 및 에딩턴 개기일식 검증(1919)',
    sourceCitation: 'Albert Einstein, Annalen der Physik (1905) & Sitzungsberichte (1915)',
    sourceType: 'PAPER',
    reliability: 'CERTAIN',
    quoteOrSummary:
      '광속 불변의 원리와 상대성 원리로부터 시간 지연과 E=mc^2을 유도(1905)하고, 등가 원리를 통해 중력을 시공간의 곡률(G_μν = 8πG T_μν)로 재정의하였다(1915).',
    interpretation:
      '뉴턴 역학과 맥스웰 전자기학을 더 높은 차원의 시공간 기하학으로 통합하여 거시 우주론의 새로운 패러다임을 열었다.',
    factors: ['IDEOLOGICAL'],
  },
  {
    id: 'evd_phy_qed_standard_model',
    title: '디랙 방정식(1928) · 파인만 QED(1948) · 와인버그 전자기약력 통일(1967) · CERN 힉스 발견(2012)',
    sourceCitation: 'P.A.M. Dirac (1928) / R.P. Feynman (1948) / S. Weinberg (1967) / ATLAS & CMS Collaborations (2012)',
    sourceType: 'PAPER',
    reliability: 'CERTAIN',
    quoteOrSummary:
      '양자역학과 특수상대성이론, 전자기장 이론을 결합한 양자전기역학(QED)에서 출발해 전자기력과 약력, 강력을 게이지 장론으로 통합한 표준모형이 2012년 CERN LHC의 힉스 보손 검출로 실험적 완성을 이루었다.',
    interpretation:
      '갈라져 있던 양자역학, 특수상대성이론, 고전 전자기학이라는 세 줄기의 강물이 "양자장론(QFT) 및 표준모형"이라는 하나의 거대한 강으로 합류(Merge)했음을 증명한다.',
    factors: ['IDEOLOGICAL'],
  },
];

export const physicsTransitions: Transition[] = [
  {
    id: 'trn_phy_cm_to_thermo',
    type: 'SPLIT',
    title: '고전역학의 미시 입자 확장과 열역학·볼츠만 통계역학의 성립 (1824~1877)',
    time: createAstroTime(1877),
    fromEntityIds: ['ent_phy_classical_mechanics'],
    toEntityIds: ['ent_phy_thermodynamics'],
    flowWeight: 65,
    summary:
      '산업혁명 증기기관 연구에서 출발한 열역학이 뉴턴 역학의 다체(Many-body) 기체 분자 운동론과 결합하여 볼츠만의 통계역학으로 발전함.',
    causes: [
      {
        title: '열(Heat)의 본질에 대한 역학적 환원 필요성',
        description: '열소(Caloric) 가설이 무너지고 열이 수많은 원자·분자의 역학적 운동 에너지임이 밝혀짐.',
        factor: 'IDEOLOGICAL',
      },
    ],
    triggers: [
      {
        title: '볼츠만의 엔트로피 통계 공식(S = k log W, 1877) 정식화',
        description: '뉴턴 역학을 따르는 미시 입자들의 확률 분포로부터 거시 열역학 제2법칙을 유도함.',
        factor: 'IDEOLOGICAL',
      },
    ],
    consequences: [
      {
        title: '흑체복사 에너지 분배 문제 대두 및 양자 가설의 산파 역할',
        description: '통계역학을 전자기파 복사에 적용하는 과정에서 자외선 파탄이 발견되어 양자역학 탄생으로 이어짐.',
        factor: 'IDEOLOGICAL',
      },
    ],
    factors: ['IDEOLOGICAL'],
    evidenceIds: ['evd_phy_principia_1687', 'evd_phy_planck_1900'],
  },
  {
    id: 'trn_phy_cm_em_to_relativity',
    type: 'MERGE',
    title: '뉴턴 역학의 갈릴레이 상대성과 맥스웰 광속 불변성의 충돌 → 아인슈타인 상대성이론 탄생 (1905~1915)',
    time: createAstroTime(1905),
    endTime: createAstroTime(1915),
    fromEntityIds: ['ent_phy_classical_mechanics', 'ent_phy_electromagnetism'],
    toEntityIds: ['ent_phy_relativity'],
    flowWeight: 85,
    summary:
      '고전역학의 절대 시공간 개념과 맥스웰 전자기학의 광속 불변성 사이의 모순을 아인슈타인이 시공간 통합(특수상대성)과 중력의 기하학화(일반상대성)로 해결함.',
    causes: [
      {
        title: '맥스웰 방정식의 광속 불변(c)과 뉴턴 역학의 속도 덧셈 법칙 간 비양립성',
        description: '전자기학 방정식은 관성계 변환 시 형태가 변하지 않으려면 시간과 공간 자체가 상대적이어야 했음.',
        factor: 'IDEOLOGICAL',
      },
    ],
    triggers: [
      {
        title: '마이컬슨-몰리 실험(1887)의 에테르 부재 증명과 아인슈타인의 1905년 기적의 해 논문',
        description: '아인슈타인이 에테르를 폐기하고 광속 불변을 공리로 삼아 시공간 로렌츠 변환을 물리적 실재로 확립함.',
        factor: 'IDEOLOGICAL',
      },
    ],
    consequences: [
      {
        title: '뉴턴 만유인력을 대체한 현대 천체물리학·우주론(블랙홀·빅뱅·중력파) 개막',
        description: '거시 우주와 고속 운동 영역에서 고전역학을 포괄하는 새로운 시공간 패러다임이 정립됨.',
        factor: 'IDEOLOGICAL',
      },
    ],
    factors: ['IDEOLOGICAL'],
    evidenceIds: ['evd_phy_michelson_morley_1887', 'evd_phy_einstein_1905_1915'],
  },
  {
    id: 'trn_phy_thermo_em_to_quantum',
    type: 'SPLIT',
    title: '흑체복사 자외선 파탄과 광전효과 위기 → 양자역학 패러다임의 분기 및 탄생 (1900~1927)',
    time: createAstroTime(1900),
    endTime: createAstroTime(1927),
    fromEntityIds: ['ent_phy_thermodynamics', 'ent_phy_electromagnetism', 'ent_phy_classical_mechanics'],
    toEntityIds: ['ent_phy_quantum_mechanics'],
    flowWeight: 88,
    summary:
      '고전 통계역학과 전자기학으로는 설명할 수 없던 흑체복사, 광전효과, 원자 스펙트럼 문제를 해결하기 위해 플랑크·보어·하이젠베르크·슈뢰딩거가 미시 세계의 양자역학을 창시함.',
    causes: [
      {
        title: '고전 연속체 물리학의 미시 세계 적용 실패 (자외선 파탄 및 러더퍼드 원자 모형 붕괴 모순)',
        description: '고전 전자기학에 따르면 원자핵 주위를 도는 전자는 전자기파를 방출하며 즉시 핵으로 추락해야 했음.',
        factor: 'IDEOLOGICAL',
      },
    ],
    triggers: [
      {
        title: '플랑크 양자 가설(1900), 아인슈타인 광양자설(1905), 하이젠베르크·슈뢰딩거 역학(1925~1926)',
        description: '해밀턴 고전역학의 정준 변수(위치·운동량)를 연산자(행렬)와 파동함수로 치환하여 양자역학을 완성함.',
        factor: 'IDEOLOGICAL',
      },
    ],
    consequences: [
      {
        title: '결정론적 세계관의 종언과 현대 반도체·레이저·화학·양자컴퓨팅의 기초 확립',
        description: '자연의 근본 법칙이 확률파동과 불확정성 원리를 따름이 규명됨.',
        factor: 'IDEOLOGICAL',
      },
    ],
    factors: ['IDEOLOGICAL'],
    evidenceIds: ['evd_phy_planck_1900'],
  },
  {
    id: 'trn_phy_qm_sr_em_to_standard_model',
    type: 'MERGE',
    title: '양자역학 + 특수상대성이론 + 전자기학의 대통합 → 양자장론(QFT) 및 입자물리 표준모형 (1928~2012)',
    time: createAstroTime(1928),
    endTime: createAstroTime(1967),
    fromEntityIds: ['ent_phy_quantum_mechanics', 'ent_phy_relativity', 'ent_phy_electromagnetism'],
    toEntityIds: ['ent_phy_standard_model'],
    flowWeight: 95,
    summary:
      '비상대론적 양자역학의 한계를 넘어, 디랙과 파인만이 양자역학·특수상대성이론·맥스웰 전자기학을 양자전기역학(QED)으로 통합하고, 이어 전자기력·약력·강력을 아우르는 입자물리 표준모형을 완성함.',
    causes: [
      {
        title: '슈뢰딩거 방정식의 비상대론적 한계 및 고에너지 입자 생성·소멸 현상 설명 필요성',
        description: '광속에 가까운 전자와 광자의 상호작용을 기술하려면 상대성이론과 양자역학의 결합이 필수적이었음.',
        factor: 'IDEOLOGICAL',
      },
    ],
    triggers: [
      {
        title: '디랙 방정식(1928), 파인만·슈윙거·도모나가의 QED 재규격화(1948), 와인버그-살람 모형(1967)',
        description: '입자를 근본 실체가 아닌 시공간에 퍼진 양자장(Quantum Field)의 들뜬 상태로 재정의함.',
        factor: 'IDEOLOGICAL',
      },
    ],
    consequences: [
      {
        title: '인류 역사상 가장 정밀한 물리 이론인 표준모형 확립 및 2012년 힉스 보손 발견',
        description: '중력을 제외한 우주의 모든 물질(쿼크·렙톤)과 힘(전자기·약력·강력)을 단일 프레임워크로 통합함.',
        factor: 'IDEOLOGICAL',
      },
    ],
    factors: ['IDEOLOGICAL'],
    evidenceIds: ['evd_phy_qed_standard_model', 'evd_phy_einstein_1905_1915'],
  },
];

export const physicsEvents: HistoricalEvent[] = [
  {
    id: 'evt_phy_principia_pub_1687',
    title: '뉴턴 『프린키피아』 출간 — 만유인력과 고전역학의 탄생 (1687)',
    time: createAstroTime(1687),
    importance: 3,
    entityIds: ['ent_phy_classical_mechanics'],
    locationOrContext: '런던 왕립학회',
    summary: '운동 3법칙과 만유인력으로 천상과 지상의 운동을 단일 수학 체계로 통합함.',
    factors: ['IDEOLOGICAL'],
    evidenceIds: ['evd_phy_principia_1687'],
  },
  {
    id: 'evt_phy_maxwell_equations_1865',
    title: '맥스웰 『전자기장의 역학적 이론』 발표 — 빛은 전자기파다 (1865)',
    time: createAstroTime(1865),
    importance: 3,
    entityIds: ['ent_phy_electromagnetism'],
    locationOrContext: '런던',
    summary: '전기장, 자기장, 빛을 단일 전자기 방정식으로 통합하고 광속 상수 c를 도출함.',
    factors: ['IDEOLOGICAL'],
    evidenceIds: ['evd_phy_michelson_morley_1887'],
  },
  {
    id: 'evt_phy_planck_quantum_1900',
    title: '플랑크 흑체복사 양자 가설 발표 — 양자 시대의 개막 (1900)',
    time: createAstroTime(1900, { month: 12 }),
    importance: 3,
    entityIds: ['ent_phy_thermodynamics', 'ent_phy_quantum_mechanics'],
    relatedTransitionId: 'trn_phy_thermo_em_to_quantum',
    locationOrContext: '베를린 물리학회',
    summary: '에너지가 불연속적인 양자(hν) 단위로 교환된다는 가설로 자외선 파탄을 해결함.',
    factors: ['IDEOLOGICAL'],
    evidenceIds: ['evd_phy_planck_1900'],
  },
  {
    id: 'evt_phy_annus_mirabilis_1905',
    title: '아인슈타인 기적의 해 — 특수상대성이론 및 광양자설 발표 (1905)',
    time: createAstroTime(1905),
    importance: 3,
    entityIds: ['ent_phy_classical_mechanics', 'ent_phy_electromagnetism', 'ent_phy_relativity', 'ent_phy_quantum_mechanics'],
    relatedTransitionId: 'trn_phy_cm_em_to_relativity',
    locationOrContext: '베른',
    summary: '시간과 공간의 상대성, 질량-에너지 등가성(E=mc^2), 빛의 입자성을 동시에 규명함.',
    factors: ['IDEOLOGICAL'],
    evidenceIds: ['evd_phy_einstein_1905_1915', 'evd_phy_planck_1900'],
  },
  {
    id: 'evt_phy_higgs_discovery_2012',
    title: 'CERN LHC 가속기 힉스 보손(Higgs Boson) 발견 — 표준모형 완성 (2012)',
    time: createAstroTime(2012, { month: 7 }),
    importance: 3,
    entityIds: ['ent_phy_standard_model'],
    relatedTransitionId: 'trn_phy_qm_sr_em_to_standard_model',
    locationOrContext: '제네바 CERN',
    summary: '기본 입자에 질량을 부여하는 힉스 입자를 실험적으로 검출하여 표준모형의 마지막 퍼즐을 완성함.',
    factors: ['IDEOLOGICAL'],
    evidenceIds: ['evd_phy_qed_standard_model'],
  },
];
