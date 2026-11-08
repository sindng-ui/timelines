# 🖥️ 04. 뷰 엔진 및 인터랙션 계약 명세서
**(View Engine, Sankey Time-River & Causal Interaction Contract)**

> **문서 번호**: `04_VIEW_ENGINE_CONTRACT`  
> **상위 오라클**: `00_ORACLE_TIMELINE_FRAMEWORK.md`

---

## 1. 뷰 엔진의 5대 핵심 뷰포트 구성

앱 화면은 사용자가 **"전체 시간의 강줄기(거시적 분열·통합)"**, **"특정 시점($t$)의 동시대 권역별 판도"**, **"왜 변화했는가에 대한 전후 인과 사슬과 사료 근거"**를 한 화면에서 끊김 없이 조작할 수 있도록 아래 5개 모듈로 구성된다.

1. **`TopControlBar` (도메인 팩 스위처 & 요인 필터 바 — 제안 4)**
   - 도메인 팩 전환 드롭다운 (`동아시아·한반도사 (만주·한반도·일본)` ↔ `물리학의 패러다임 역사` 등 등록된 모든 팩 즉시 전환).
   - **요인별 필터 토글 (`FactorTag` Filter)**: 전체(`ALL`), 정치(`POLITICAL`), 군사(`MILITARY`), 경제(`ECONOMIC`), 외교(`DIPLOMATIC`), 사회(`SOCIAL`), 사상/이론(`IDEOLOGICAL`) 버튼을 클릭하면 해당 요인이 작용한 인과 간선(`Transition`)과 사건만 하이라이트한다.
   - **계약 무결성 배지 (`Contract Verified Badge`)**: 현재 로드된 도메인 팩의 12대 계약 검증 통과 여부(`12/12 Rules Passed`)를 실시간으로 표시하고 클릭 시 검증 리포트를 보여준다.

2. **`TimeScrubber` (타임머신 연도 슬라이더 & 시대 점프 컨트롤)**
   - 연도 슬라이더 조작 시 Web Worker가 계산한 시점 $t$의 스냅샷을 `0ms` 지연(LRU 캐시 히트 시)으로 즉시 갱신한다.
   - 시대 구분 마일스톤(`eraMilestones` — 예: `삼국 항쟁기` → `남북국 시대` → `후삼국 분열기` → `고려 통일기`) 원클릭 점프 버튼 제공.
   - 자동 재생(`Play/Pause`) 및 배속 조절 기능 제공.

3. **`TimeRiverCanvas` (산키 스타일 시간 강줄기 캔버스 — 제안 1 핵심)**
   - 가로축(X)은 시간(`year`), 세로축(Y)은 `Axis`(지정학 권역 또는 학문 트랙) 레인이다.
   - **StateSegment 가변 폭 스트림**: 각 개체(`Entity`)는 단순 직선 막대가 아니라, 시기별 `StateSegment.powerWeight`에 비례하여 두께가 유기적으로 변하는 강줄기(Stream Polygon/Path)로 렌더링된다. 또한 시기별 국호 변화(예: `후고구려` → `마진` → `태봉`)가 구간 위에 명확히 표시된다.
   - **Split & Merge 베지어 리본(Bezier Ribbon)**: `Transition`의 `fromEntityIds`에서 `toEntityIds`로 이어지는 분열(`SPLIT`), 통합(`MERGE`), 체제교체(`REGIME_CHANGE`), 외부자극(`INFLUENCE`)이 곡선 리본과 전환 노드로 연결되어, **"신라에서 어떻게 후백제와 태봉이 갈라져 나왔고, 어떻게 발해 유민·태봉·신라·후백제가 고려로 합쳐졌는가"**를 시각적으로 한눈에 보여준다.
   - 현재 선택 연도($t$)를 가로지르는 **황금색 수직 타임 커서(Time Cursor Line)**를 드래그하여 시간을 직접 조작할 수 있다.

4. **`SpatialTopologyCanvas` (고정 영토/위상 캔버스 — 공간 직관 중심 뷰)**
   - 만주 남부, 한반도 전역, 일본 열도 서북부(또는 과학사의 2D 스케일 위상도)의 고정된 배경 지도를 렌더링한다.
   - **영토 점유 색상 변환(Territory Dynamic Fill)**: 연도 슬라이더($t$) 조작 시, 각 `LocusRegion`을 지배하는 국가(`StateSegment.occupiedRegions`)의 고유 색상으로 영역이 실시간으로 물든다.
   - **수도/거점 핀(Capital Pins)**: 당시 각 국가의 수도(금성, 완산주, 송악, 철원, 평양, 개경 등)가 정확한 위치에 핀과 펄스 링으로 표시된다.
   - **결전지 핀(Battle/Event Pins)**: 공산 전투, 고창 전투, 일리천 전투, 백강 전투, 천문령 전투 등 주요 역사적 사건이 지도상 위치에 ⚡ 핀으로 표시되며, 클릭 시 인과/사료 패널과 1:1 연동된다.

5. **`CausalLineageTracer` & `EvidenceDrawer` (전후 인과 추적기 및 사료 근거 인스펙터 — 제안 2 핵심)**
   - 사용자가 특정 개체(예: `후백제`, `태봉`, `고려`)나 전환점(예: `왕건의 역성혁명`, `신라 경순왕 귀부`), 사건(예: `공산 전투`, `고창 전투`)을 클릭하면 즉시 작동한다.
   - **3단 인과 계보 뷰**:
     1. **[선행 모체 및 탄생 원인 (Upstream — 왜 등장했는가?)]**: 이전 국가/이론으로부터 분열·창시된 배경 원인(`causes`), 도화선(`triggers`).
     2. **[선택 대상의 시대별 변천 (Internal Evolution)]**: 내부 상태 구간(`StateSegment`) 타임라인과 주요 사건(`HistoricalEvent`).
     3. **[후속 귀결 및 역사적 영향 (Downstream — 어떻게 변화·흡수되었는가?)]**: 이후 어떤 개체로 통합/교체되었는지(`consequences`)와 후속 전환 연결.
   - **사료 및 사실 근거 카드 (`Evidence Cards`)**: 선택된 변화나 사건에 연결된 모든 `Evidence` 카드를 신뢰도 배지(`CERTAIN` 정설 / `PROBABLE` 통설 / `DEBATED` 이설), 원전 출처(`『삼국사기』`, `『고려사』` 등), 원문 요약 및 학술 해설과 함께 표시한다.
