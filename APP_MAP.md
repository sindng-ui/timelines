# 🗺️ APP_MAP.md — Universal Timeline & Causal Knowledge Graph Engine

> **최종 업데이트**: 2026-11-08  
> **설명**: 본 문서는 프로젝트 내 모든 오라클 문서, 데이터 계약, 코어 엔진, Web Worker, 도메인 팩, UI 컴포넌트의 파일 경로와 핵심 인터페이스 규격을 정의하는 실시간 시스템 지도입니다.

---

## 1. 오라클 마스터 계약 문서 (`important/`)

| 파일 경로 | 역할 및 핵심 인터페이스 |
| :--- | :--- |
| `important/00_ORACLE_TIMELINE_FRAMEWORK.md` | 최상위 오라클 명세서 (문제 정의, 4대 원리, 10대 아키텍처 불변 법칙) |
| `important/01_SYSTEM_ARCHITECTURE.md` | 4-레이어 아키텍처, Web Worker & LRU 메모이제이션 파이프라인, Zero-Blur 및 900줄 제한 규칙 |
| `important/02_DATA_SCHEMA_CONTRACT.md` | `AstroTime`, `Axis`, `Entity`, `StateSegment`, `Transition`, `HistoricalEvent`, `Evidence`, `SpatialTopology`, `TerritoryShape`, `BaseMapLayer`, `DomainPack` 스키마 계약 |
| `important/03_AI_AUTHORING_PLAYBOOK.md` | AI 에이전트용 신규 타임라인 도메인 팩 제작 7단계 표준 공정(SOP) 및 13대 무결성 검증 규칙(`V01`~`V13`) |
| `important/04_VIEW_ENGINE_CONTRACT.md` | 5대 핵심 뷰포트(`TopControlBar`, `TimeScrubber`, `TimeRiverCanvas`, `SpatialTopologyCanvas`, `SnapshotStatePanel`, `CausalLineageTracer` & `EvidenceDrawer`) 계약 및 지도 배치 규격 |

---

## 2. 문서 및 테스트 리포트 (`docs/`)

| 파일 경로 | 역할 |
| :--- | :--- |
| `docs/implementation_plan.md` | 범용 타임라인 프레임워크 마스터 구현 계획서 |
| `docs/test_results.txt` | 도메인 팩 13대 계약 검증기 실행 결과 및 빌드/성능 테스트 리포트 |

---

## 3. 데이터 계약 및 워커 프로토콜 (`src/contracts/`)

| 파일 경로 | 주요 Export 인터페이스 / 타입 | 역할 |
| :--- | :--- | :--- |
| `src/contracts/timeline.contract.ts` | `TimePrecision`, `AstroTime`, `FactorTag`, `TransitionType`, `ReliabilityGrade`, `Axis`, `Entity`, `StateSegment`, `CausalPoint`, `Transition`, `HistoricalEvent`, `Evidence`, `EraMilestone`, `PointCoord`, `ControlLevel`, `LocusOccupancy`, `LocusRegion`, `SpatialProjection`, `BaseMapLayer`, `SpatialTopology`, `TerritoryShape`, `DomainPack`, `ValidationIssue`, `ValidationReport` | 모든 타임라인 데이터 팩과 검증기가 공유하는 엄밀한 데이터 계약 (지리 좌표 투영, 해안선 마스크, 영토 다각형, 13대 무결성 규칙 포함) |
| `src/contracts/worker.contract.ts` | `ActiveEntitySnapshot`, `TimelineSnapshot`, `CausalLineageResult`, `StreamGeometryNode`, `TransitionRibbonGeometry`, `RiverLayoutResult`, `WorkerRequest`, `WorkerResponse` | 메인 스레드와 Web Worker 간의 비동기 연산 및 레이아웃 메시지 계약 |

---

## 4. 코어 엔진 및 무결성 검증기 (`src/core/` & `scripts/`)

| 파일 경로 | 주요 Export 함수 / 클래스 | 역할 |
| :--- | :--- | :--- |
| `src/core/astroTime.ts` | `createAstroTime()`, `yearToSortKey()`, `formatYearDisplay()`, `isTimeWithin()` | 천문학적 연도(`AstroTime`) 생성 및 이진 탐색용 `sortKey` 변환 유틸리티 |
| `src/core/projection.ts` | `createProjectionFrame()`, `projectPoint()`, `ringsToSvgPath()`, `ringCentroid()` | 위경도(Equirectangular, 위도 보정) 및 개념 좌표계를 SVG viewBox 픽셀 공간으로 양방향 투영하는 지오메트리 엔진 |
| `src/core/validator.ts` | `validateDomainPack()`, `validateAllPacks()` | `03_AI_AUTHORING_PLAYBOOK.md`의 13대 무결성 규칙(`V01`~`V13`, 공간 무결성 규칙 포함) 자동 검증기 |
| `src/core/layoutEngine.ts` | `computeSnapshotAtYear()`, `traceCausalLineage()`, `computeRiverLayout()` | 스냅샷 이진 탐색, 전후 인과 BFS 탐색, 산키(Time-River) 스트림 및 베지어 리본 좌표 계산 코어 |
| `src/core/workerClient.ts` | `TimelineWorkerClient` (Singleton with LRU Memoization Cache) | Web Worker 통신 브리지 및 `(packId, year, factor)` 기반 $O(1)$ LRU 캐싱 레이어 |
| `scripts/validatePacks.ts` | CLI Entrypoint (`npm run validate:packs`) | 등록된 모든 도메인 팩의 13대 계약 준수 여부를 터미널에서 즉시 검증하는 CLI 도구 |
| `scripts/buildBaseMap.ts` | GeoJSON 정밀 추출기 | Natural Earth 10m 벡터 데이터에서 만주·한반도·일본 해안선 및 주요 하천을 추출하여 SVG 패스로 컴파일 |

---

## 5. 백그라운드 연산 워커 (`src/workers/`)

| 파일 경로 | 메시지 핸들러 | 역할 |
| :--- | :--- | :--- |
| `src/workers/timelineEngine.worker.ts` | `INIT_PACK`, `COMPUTE_SNAPSHOT`, `TRACE_LINEAGE`, `COMPUTE_LAYOUT` | 대용량 타임라인 데이터 인덱싱, 시점 스냅샷 연산, 인과 계보 추적, 스트림 지오메트리 연산 전담 |

---

## 6. 도메인 데이터 팩 (`src/packs/`)

| 파일 경로 | 주요 Export | 설명 |
| :--- | :--- | :--- |
| `src/packs/index.ts` | `DOMAIN_PACKS`, `getDomainPackById()` | 전체 도메인 팩 레지스트리 |
| `src/packs/east-asia-history/index.ts` | `eastAsiaHistoryPack: DomainPack` | **제1 도메인 팩**: 한반도·만주·일본 역사 (삼국~남북국~후삼국~고려 통일기) |
| `src/packs/east-asia-history/baseMapData.ts` | `eastAsiaProjection`, `eastAsiaViewBox`, `eastAsiaBaseLayers` | Natural Earth 10m 기반 고해상도 해안선(LAND 마스크) 및 18대 하천(RIVER) 정밀 패스 데이터 |
| `src/packs/east-asia-history/territories.ts` | `eastAsiaTerritories: TerritoryShape[]` | 삼국, 통일신라, 발해, 후삼국(신라·후백제·태봉·고려), 나주 거점 등 시대별 정밀 영토 다각형 데이터 |
| `src/packs/east-asia-history/topology.ts` | `eastAsiaTopology: SpatialTopology` | 만주 남부, 요동, 한반도 4대 권역, 탐라, 일본 서북부 고정 지리 지도 벡터 및 권역 좌표 |
| `src/packs/east-asia-history/axes.ts` | `eastAsiaAxes: Axis[]` | 5대 지정학 권역 트랙 (만주·요동, 한반도 북부, 한반도 중부, 한반도 남부, 일본 열도) |
| `src/packs/east-asia-history/entities.ts` | `eastAsiaEntities: Entity[]` | 고구려, 백제, 신라, 가야, 발해, 후백제, 태봉(후고구려/마진), 고려, 거란(요), 탐라, 왜/야마토~나라~헤이안 |
| `src/packs/east-asia-history/segments.ts` | `eastAsiaSegments: StateSegment[]` | 각 국가의 시대별 국호 변경, 수도 천도, 영토 점유(`occupiedRegions`), 정밀 지리 좌표 기반 수도 핀(`capitalCoord`), 상태 및 `powerWeight` |
| `src/packs/east-asia-history/transitions.ts` | `eastAsiaTransitions: Transition[]` | 삼국통일, 발해 건국, 신라 하대 호족 분열(후백제·태봉), 왕건 역성혁명(고려), 발해 멸망 및 유민 흡수, 신라 귀부, 후백제 멸망 및 후삼국 최종 통일 등 모든 인과 간선 |
| `src/packs/east-asia-history/eventsAndEvidences.ts` | `eastAsiaEvents`, `eastAsiaEvidences` | 주요 전투·사건(공산, 고창, 일리천, 백강 등 격전지 핀 정밀 지리 좌표 `mapCoord` 포함) 및 『삼국사기』·『삼국유사』·『고려사』 사료 근거 카드 |
| `src/packs/physics-history/index.ts` | `physicsHistoryPack: DomainPack` | **제2 도메인 팩 (범용성 입증)**: 물리학의 역사 (고전역학·열역학·전자기학 → 상대성이론·양자역학 → 표준모형) |
| `src/packs/physics-history/topology.ts` | `physicsTopology: SpatialTopology` | 2D 미시/거시 x 저속/광속 위상 개념도 벡터 및 위상 영역 정의 |
| `src/packs/physics-history/axesAndEntities.ts` | `physicsAxes`, `physicsEntities`, `physicsSegments` | 물리학 4대 분과 트랙, 핵심 이론 개체 및 위상 점유(`occupiedRegions`) |
| `src/packs/physics-history/transitionsAndEvidences.ts` | `physicsTransitions`, `physicsEvents`, `physicsEvidences` | 고전 물리학의 한계와 상대성이론·양자역학으로의 패러다임 분기·통합 인과 및 실험/논문 근거 |

---

## 7. 고성능 UI 컴포넌트 (`src/components/` & `src/App.tsx`)

| 파일 경로 | 주요 Props / 인터페이스 | 역할 |
| :--- | :--- | :--- |
| `src/App.tsx` | `App()` | **인터랙티브 동기화 뷰 오케스트레이션**: 타임라인 스트림(좌측 58%)과 고정 지도 캔버스(우측 42%)를 나란히 배치하여 스크러빙 시 즉시 시각적 연동 달성 |
| `src/components/TopControlBar.tsx` | `TopControlBarProps` | 도메인 팩 전환기, 6대 요인(`FactorTag`) 필터 토글, 계약 검증(`13/13 Verified`) 모달 트리거 |
| `src/components/TimeScrubber.tsx` | `TimeScrubberProps` | 연도 슬라이더, 시대 마일스톤(`EraMilestone`) 원클릭 점프, 재생/일시정지 및 속도 제어, 후삼국 집중 탐색 프리셋 |
| `src/components/TimeRiverCanvas.tsx` | `TimeRiverCanvasProps` | 산키(Sankey) 스타일 시간 강줄기(`powerWeight` 가변 폭 스트림) + 분열/통합 베지어 리본 + 실시간 타임 커서 드래그 스크러빙 & 줌/팬 |
| `src/components/SpatialTopologyCanvas.tsx` | `SpatialTopologyCanvasProps` | **교과서/나무위키급 인터랙티브 지도**: Natural Earth 10m 해안선 마스크 기반 영토 클리핑 채색, 국가별 수도(★) 핀, 하천 수계, 주요 결전지(⚡) 핀, 영토 호버/클릭 연동 |
| `src/components/SnapshotStatePanel.tsx` | `SnapshotStatePanelProps` | 현재 선택 연도($t$)의 만주·한반도·일본 각 권역별 동시대 국가 상태, 공식 국호, 수도, 지도자, 세력 비중 비교 카드 |
| `src/components/CausalLineageTracer.tsx` | `CausalLineageTracerProps` | 선택된 국가/전환점의 `[선행 원인(Why)] → [내부 변천] → [후속 결과(What Next)]` 전후 인과 추적 스토리보드 |
| `src/components/EvidenceDrawer.tsx` | `EvidenceDrawerProps` | 선택된 전환/사건/상태에 연결된 사료 근거(`Evidence`) 카드, 신뢰도 등급(`CERTAIN`/`PROBABLE`/`DEBATED`), 원전 출처 및 대립 학설 뷰어 |
| `src/components/ValidationBadgeModal.tsx` | `ValidationBadgeModalProps` | 현재 도메인 팩의 13대 오라클 계약 검증 결과(`V01`~`V13`) 및 통계 대시보드 모달 |

---

## 8. 프로젝트 설정 및 인프라 파일 (Root)

| 파일 경로 | 역할 |
| :--- | :--- |
| `.gitignore` | Git 버전 관리 제외 목록 (node_modules, dist, 로그, 환경변수 등) |
| `package.json` | 프로젝트 메타데이터, 의존성 패키지 및 실행 스크립트 정의 |
| `tsconfig.json` | TypeScript 컴파일러 및 모듈 번들러 설정 |
| `vite.config.ts` | Vite 빌드 및 Web Worker ESM 번들링 설정 |
