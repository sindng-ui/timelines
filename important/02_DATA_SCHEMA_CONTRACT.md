# 📐 02. 데이터 스키마 및 온톨로지 엄밀 계약
**(Data Schema & Ontology Strict Contract)**

> **문서 번호**: `02_DATA_SCHEMA_CONTRACT`  
> **상위 오라클**: `00_ORACLE_TIMELINE_FRAMEWORK.md`  
> **코드 구현체**: `src/contracts/timeline.contract.ts`

---

## 1. 시간 표준 규격: `AstroTime` 계약

역사적 사건(기원전 수천 년 ~ 현대)과 과학사적 사건을 단일 수직선 위에 오차 없이 배치하기 위해 **천문학적 연도 표기법(Astronomical Year Numbering)**을 사용한다.

```typescript
export type TimePrecision = 'YEAR' | 'MONTH' | 'DAY' | 'DECADE' | 'CENTURY' | 'APPROXIMATE';

export interface AstroTime {
  /** 천문학적 연도. 기원후 918년 = 918, 기원전 108년 = -108, 기원전 2333년 = -2333 */
  year: number;
  /** 월 (1 ~ 12, 선택 사항) */
  month?: number;
  /** 일 (1 ~ 31, 선택 사항) */
  day?: number;
  /** 시점 정밀도 */
  precision: TimePrecision;
  /** 화면 표시용 레이블 (예: '918년 6월', '기원전 108년', '900년경') */
  displayLabel: string;
  /**
   * 이진 탐색 및 고속 정렬을 위한 정규화 정수 키.
   * 공식: year * 10000 + (month ?? 1) * 100 + (day ?? 1)
   * 예: 918년 6월 15일 -> 9180615, 기원전 108년 -> -1079899 (또는 createAstroTime 헬퍼 자동 계산)
   */
  sortKey: number;
}
```

> **[절대 규칙]**: 데이터를 작성할 때는 `createAstroTime(year, options)` 헬퍼 함수를 사용하여 `sortKey`와 `displayLabel`이 100% 일관된 수학 공식으로 생성되도록 한다.

---

## 2. 공통 열거형(Enum) 규격

### 2.1. 변화 요인 태그 (`FactorTag` — 제안 4 반영)
모든 `Transition`(변화)과 `HistoricalEvent`(사건), `Evidence`(근거)는 왜 그런 변화가 일어났는지 분류하는 요인 태그를 가진다.
- `'POLITICAL'`: 정치·권력 투쟁·왕위 계승·체제 개혁
- `'MILITARY'`: 군사·전쟁·정복·방어·병력 이동
- `'ECONOMIC'`: 경제·조세·토지 제도·무역·기근
- `'DIPLOMATIC'`: 외교·책봉·조공·동맹·국제 정세
- `'SOCIAL'`: 사회·신분제(골품제 등)·호족 세력·민란·유민 이동
- `'IDEOLOGICAL'`: 사상·종교(불교/유교/풍수지리)·과학 이론·패러다임

### 2.2. 전환 유형 (`TransitionType` — 제안 1 산키/강줄기 분열·통합 반영)
- `'FOUNDATION'`: 새로운 개체의 독자적 창시/건국 (선행 모체 없이 시작하거나 미지의 기원에서 출현)
- `'SPLIT'`: 기존 개체(`fromEntityIds`)에서 분리·독립하여 새로운 개체(`toEntityIds`)가 생성됨 (예: 신라 하대 → 후백제, 후고구려 분열)
- `'MERGE'`: 둘 이상의 개체가 통합되거나 한 개체가 다른 개체를 흡수·병합함 (예: 고려가 태봉 계승 후 신라 강복·후백제 병합으로 후삼국 통일, 발해 유민 흡수)
- `'REGIME_CHANGE'`: 동일 세력 기반 위에서 내부 쿠데타·역성혁명·패러다임 전환으로 개체나 국호가 교체됨 (예: 궁예의 태봉 → 왕건의 고려)
- `'INFLUENCE'`: 개체의 존폐를 직접 합치진 않으나 전쟁·교류·사상 전파 등으로 결정적 상태 변화를 유발함 (예: 당나라·신라 나당연합, 거란의 발해 침공, 백제 멸망 후 왜(일본)의 백강 전투 참전 및 율령국가화 자극)

### 2.3. 근거 신뢰도 등급 (`ReliabilityGrade`)
- `'CERTAIN'`: 1차 사료 교차 검증 완료 또는 학계 이견이 없는 확립된 사실 (정설)
- `'PROBABLE'`: 유력한 사료에 기록되어 있으나 세부 연대나 동기에 일부 해석 여지가 있는 사실 (통설)
- `'DEBATED'`: 사료 간 기록이 상충하거나 학계에서 여러 가설이 대립하는 내용 (이설/논쟁)

---

## 3. 6대 핵심 엔티티 스키마 명세

### ① `Axis` (차원/트랙)
Time-River 캔버스의 가로 레인(Swimlane/Stream Track)을 정의한다.
```typescript
export interface Axis {
  /** 규격: axis_<packCode>_<slug> */
  id: string;
  /** 트랙 이름 (예: '만주·요동 권역', '한반도 북부', '한반도 중부', '한반도 남부', '일본 열도') */
  name: string;
  /** 트랙 부제 또는 설명 */
  description: string;
  /** 위에서 아래로 배치되는 순서 (0부터 시작) */
  order: number;
  /** 트랙 배경 구분용 테마 색상 (HEX) */
  accentColor: string;
}
```

### ② `Entity` (개체: 국가, 왕조, 학파, 이론)
시간의 흐름 속에서 생성·변화·소멸하는 주체다.
```typescript
export interface Entity {
  /** 규격: ent_<packCode>_<slug> */
  id: string;
  /** 대표 명칭 (예: '고려', '후백제', '태봉(후고구려)', '발해', '신라') */
  name: string;
  /** 한자 또는 원어 병기 (예: '高麗', '後百濟', '泰封 / 後高句麗') */
  nativeName?: string;
  /** 주 소속 트랙 ID (Axis.id 참조) */
  axisId: string;
  /** 부 소속/영향권 트랙 ID 목록 (광역 국가나 다학제 이론 표현용, 선택) */
  secondaryAxisIds?: string[];
  /** 개체 분류 (예: 'STATE', 'DYNASTY', 'CONFEDERATION', 'THEORY', 'SCHOOL') */
  category: string;
  /** 존속 시작 시점 */
  startTime: AstroTime;
  /** 존속 종료 시점 */
  endTime: AstroTime;
  /** Time-River 스트림 및 노드 렌더링 대표 색상 (HEX) */
  color: string;
  /** 한 줄 핵심 정의 */
  summary: string;
  /** 이 개체의 핵심 키워드 태그 */
  tags: string[];
  /** 개체 내 트랙 Y축 상대 오프셋 힌트 (-1.0 ~ 1.0, 동일 축 내 동시대 국가 겹침 방지용) */
  laneOffset?: number;
}
```

### ③ `StateSegment` (시대별 내부 상태 구간)
하나의 `Entity`가 시간의 흐름에 따라 어떻게 변모했는지(국호 변경, 천도, 전성기, 호족 분열기 등)를 나타낸다.
```typescript
export interface StateSegment {
  /** 규격: seg_<packCode>_<entitySlug>_<phaseSlug> */
  id: string;
  /** 소속 개체 ID (Entity.id 참조) */
  entityId: string;
  /** 시기 구분 명칭 (예: '후고구려 (송악·철원기)', '마진 (철원 천도기)', '태봉 (말기 폭정기)') */
  phaseTitle: string;
  /** 해당 시기 당시의 공식 국호/명칭 (예: '후고구려' -> '마진' -> '태봉') */
  officialName: string;
  /** 구간 시작 시점 (Entity.startTime 이상) */
  startTime: AstroTime;
  /** 구간 종료 시점 (Entity.endTime 이하) */
  endTime: AstroTime;
  /** 수도, 중심지 또는 핵심 거점 (예: '경주(금성)', '전주(완산주)', '철원', '개경(송악)') */
  capitalOrCenter?: string;
  /** 대표 지도자/인물 목록 (예: ['궁예', '왕건']) */
  keyFigures: string[];
  /**
   * Time-River 산키 스트림 두께(강줄기 폭)를 결정하는 세력/영향력 비중 (1 ~ 100).
   * 예: 통일신라 전성기 = 85, 신라 하대 진성여왕~경순왕 분열기 = 25
   */
  powerWeight: number;
  /** 이 시기의 정치·사회·이론적 상태 핵심 설명 */
  stateDescription: string;
  /** 이 상태 구간을 뒷받침하는 근거 ID 목록 (Evidence.id 참조) */
  evidenceIds: string[];
}
```

### ④ `Transition` (변화 및 인과 연결고리 — 핵심!)
"앞 뒤에 어떤 개체가 있었고 **왜(Why)** 변화했는가"를 정의하는 방향성 인과 간선이다.
```typescript
export interface CausalPoint {
  /** 원인/계기/결과의 핵심 제목 */
  title: string;
  /** 구체적 메커니즘 설명 */
  description: string;
  /** 관련 요인 태그 */
  factor: FactorTag;
}

export interface Transition {
  /** 규격: trn_<packCode>_<slug> */
  id: string;
  /** 전환 유형: FOUNDATION | SPLIT | MERGE | REGIME_CHANGE | INFLUENCE */
  type: TransitionType;
  /** 전환 명칭 (예: '견훤의 후백제 건국 (신라 서남부 이탈)', '왕건의 역성혁명과 고려 건국') */
  title: string;
  /** 전환이 일어난 대표 시점 */
  time: AstroTime;
  /** 전환 기간 종료 시점 (장기 전환인 경우 선택) */
  endTime?: AstroTime;
  /** 선행(원인/모체) 개체 ID 배열 (Entity.id 참조. FOUNDATION인 경우 빈 배열 허용하되 보통 모체 명시) */
  fromEntityIds: string[];
  /** 후속(결과/신생/통합) 개체 ID 배열 (Entity.id 참조, 최소 1개 필수) */
  toEntityIds: string[];
  /**
   * Time-River 산키(Sankey) 합류/분류 시 이동하는 세력/유산의 가중치 (1 ~ 100).
   * 스트림 연결선(Ribbon)의 두께를 결정한다.
   */
  flowWeight: number;
  /** 한 눈에 보는 변화 요약 (Why & How) */
  summary: string;
  /** 구조화된 배경 및 근본 원인 목록 (최소 1개 필수) */
  causes: CausalPoint[];
  /** 변화를 촉발한 직접적 계기/도화선 (최소 1개 필수) */
  triggers: CausalPoint[];
  /** 변화로 인해 발생한 역사적/구조적 결과 (최소 1개 필수) */
  consequences: CausalPoint[];
  /** 이 변화에 작용한 주요 요인 태그 목록 (필터링용, 최소 1개 필수) */
  factors: FactorTag[];
  /** 이 변화를 증명하는 사료/근거 ID 목록 (Evidence.id 참조, 최소 1개 필수) */
  evidenceIds: string[];
}
```

### ⑤ `HistoricalEvent` (주요 사건 편린)
개체 내부 또는 개체 간에 발생한 구체적 사건(전투, 조약, 개혁, 실험, 논문 발표 등)이다.
```typescript
export interface HistoricalEvent {
  /** 규격: evt_<packCode>_<slug> */
  id: string;
  /** 사건 명칭 (예: '공산(팔공산) 전투', '고창(안동) 전투', '신라 경순왕의 고려 귀부') */
  title: string;
  /** 발생 시점 */
  time: AstroTime;
  /** 사건 중요도 (1: 일반, 2: 중요, 3: 시대적 분수령) */
  importance: 1 | 2 | 3;
  /** 관련된 개체 ID 목록 (Entity.id 참조, 최소 1개 필수) */
  entityIds: string[];
  /** 이 사건이 직접 연결된 Transition ID (선택) */
  relatedTransitionId?: string;
  /** 사건 발생 장소 또는 맥락 */
  locationOrContext?: string;
  /** 사건 경과 및 역사적 의의 요약 */
  summary: string;
  /** 작용 요인 태그 목록 */
  factors: FactorTag[];
  /** 근거 사료 ID 목록 (최소 1개 필수) */
  evidenceIds: string[];
}
```

### ⑥ `Evidence` (근거, 사료, 학설 카드)
모든 `StateSegment`, `Transition`, `HistoricalEvent`의 신뢰성을 담보하는 사실/사료 원자다.
```typescript
export interface Evidence {
  /** 규격: evd_<packCode>_<slug> */
  id: string;
  /** 근거 제목 (예: '『삼국사기』 신라본기 진성여왕 3년(889) 조세 독촉과 도적 봉기 기록') */
  title: string;
  /** 출전/사료명 (예: '『삼국사기』 권11 / 권50 견훤전', '『고려사』 태조세가') */
  sourceCitation: string;
  /** 사료/근거 분류 ('PRIMARY_CHRONICLE' | 'ARCHAEOLOGICAL' | 'MODERN_CONSENSUS' | 'HYPOTHESIS' | 'PAPER') */
  sourceType: 'PRIMARY_CHRONICLE' | 'ARCHAEOLOGICAL' | 'MODERN_CONSENSUS' | 'HYPOTHESIS' | 'PAPER';
  /** 신뢰도 등급 ('CERTAIN' | 'PROBABLE' | 'DEBATED') */
  reliability: ReliabilityGrade;
  /** 원문 핵심 인용 또는 사료 요약문 */
  quoteOrSummary: string;
  /** 이 근거가 왜 중요한지(어떻게 인과관계를 뒷받침하는지) 해설 */
  interpretation: string;
  /** 이설이나 논쟁이 있을 경우 대립 학설 설명 (선택) */
  alternativeView?: string;
  /** 관련 요인 태그 */
  factors: FactorTag[];
}
```

---

## 4. 최상위 컨테이너: `DomainPack` 계약

하나의 완성된 타임라인 세계관(예: 동아시아·한반도사, 물리학사, 유럽사)은 아래 `DomainPack` 객체 하나로 패키징된다.

```typescript
export interface EraMilestone {
  id: string;
  name: string;
  startYear: number;
  endYear: number;
  color: string;
  description: string;
}

export interface DomainPack {
  /** 팩 고유 식별자 (예: 'east-asia-history', 'physics-history') */
  id: string;
  /** ID 접두사용 짧은 코드 (예: 'ea', 'phy') */
  packCode: string;
  /** 팩 제목 */
  title: string;
  /** 팩 부제 */
  subtitle: string;
  /** 도메인 분류 ('HISTORY' | 'SCIENCE' | 'TECHNOLOGY' | 'PHILOSOPHY') */
  domainType: 'HISTORY' | 'SCIENCE' | 'TECHNOLOGY' | 'PHILOSOPHY';
  /** 버전 (SemVer, 예: '1.0.0') */
  version: string;
  /** 전체 타임라인 커버 시작 연도 및 종료 연도 */
  timeRange: {
    startYear: number;
    endYear: number;
    defaultFocusYear: number; // 초기 진입 시 포커스할 핵심 연도 (예: 후삼국 정립기 901년)
  };
  /** 배경에 표시할 거시적 시대 구분 띠 (예: 삼국시대 -> 남북국시대 -> 후삼국시대 -> 고려 통일기) */
  eraMilestones: EraMilestone[];
  /** 6대 데이터 테이블 */
  axes: Axis[];
  entities: Entity[];
  segments: StateSegment[];
  transitions: Transition[];
  events: HistoricalEvent[];
  evidences: Evidence[];
}
```
