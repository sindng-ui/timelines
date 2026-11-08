# 🏛️ ORACLE: 범용 타임라인 & 인과관계 지식 프레임워크 마스터 명세서
**(Universal Timeline & Causal Knowledge Graph Framework — Single Source of Truth)**

> **문서 등급**: `ORACLE (최상위 절대 규격)`  
> **적용 대상**: 본 프로젝트에 참여하는 모든 AI 에이전트 및 개발자  
> **핵심 목적**: 어떤 AI가 이 문서를 읽더라도 **1) 프레임워크의 구조와 계약을 100% 이해**하고, **2) 한국사·유럽사·물리학사·기술사 등 어떤 주제의 타임라인이든 완벽하게 조립**하며, **3) 정해진 계약(Contract)대로만 작성하면 즉각 고성능 시각화와 인과 추적이 동작**하도록 보장한다.

---

## 1. 문제 정의와 프레임워크의 존재 이유 (Why This Oracle Exists)

기존 백과사전이나 위키(예: 나무위키의 '후삼국 시대' 문서)는 **단절된 문서 단위**로 지식을 서술한다.
- 특정 시대의 문서만 읽으면 **그 앞 시대에 어떤 개체(국가·학파·이론)가 있었는지**, **왜 분열하거나 통합되었는지**, **동시대 인접 영역(예: 만주, 일본 열도)에서는 무슨 일이 벌어져 어떤 영향을 주고받았는지** 한눈에 파악할 수 없다.
- 사용자가 여러 창을 띄워놓고 머릿속에서 시간축과 인과관계를 직접 이어 붙여야 하는 인지적 한계가 존재한다.

**본 프레임워크(ChronoNexus / Universal Timeline Engine)는 이 문제를 다음 4가지 원리로 해결한다:**
1. **연속적 시간 강줄기 (Time-River Split & Merge)**: 개체(Entity)의 탄생, 내부 체제 변화(StateSegment), 분열(Split), 통합/흡수(Merge), 소멸을 산키(Sankey) 스타일의 시간 흐름 줄기로 시각화한다.
2. **명시적 인과 간선 (Explicit Causal Transitions)**: 모든 변화에는 반드시 `[선행 개체] ──(원인·계기·결과 + 사료 근거)──▶ [후속 개체]`라는 구조화된 인과 데이터(`Transition`)가 결합된다.
3. **시점 스냅샷 타임머신 (Time-Scrubber Snapshot)**: 사용자가 특정 연도($t$)로 타임라인을 조작하면, 해당 시점에 각 축(`Axis`)에 공존하던 모든 개체의 상태(`StateSegment`), 세력 비중(`powerWeight`), 진행 중인 사건을 즉시 복원한다.
4. **다중 요인 및 학설 필터링 (Factor & Reliability Layer)**: 정치(`POLITICAL`), 군사(`MILITARY`), 경제(`ECONOMIC`), 외교(`DIPLOMATIC`), 사회(`SOCIAL`), 사상/이론(`IDEOLOGICAL`) 등 요인별 필터와 사료 신뢰도(`CERTAIN`, `PROBABLE`, `DEBATED`)를 분리하여 입체적 분석을 제공한다.

---

## 2. 오라클 문서 체계 지침 (Oracle Document Map)

본 폴더(`important/`)의 문서는 상호 보완적인 **5대 계약서**로 구성되며, 모든 작업 전 반드시 숙지해야 한다.

| 문서 번호 및 파일명 | 핵심 내용 | 필수 참조 시점 |
| :--- | :--- | :--- |
| **`00_ORACLE_TIMELINE_FRAMEWORK.md`** (본 문서) | 프레임워크 철학, 5대 원자 개념, 전체 아키텍처 요약, 불변 법칙 | 모든 대화 시작 시 / 프로젝트 파악 시 |
| **`01_SYSTEM_ARCHITECTURE.md`** | 레이어 분리, Web Worker 연산 계약, LRU 메모이제이션, No-Blur UI 규칙, 900줄 제한 | 코어 엔진, 워커, 상태 관리, UI 수정 시 |
| **`02_DATA_SCHEMA_CONTRACT.md`** | `DomainPack`, `Axis`, `Entity`, `StateSegment`, `Transition`, `HistoricalEvent`, `Evidence`, `AstroTime`의 엄밀한 스키마 명세 | 데이터 구조 참조 및 검증기 수정 시 |
| **`03_AI_AUTHORING_PLAYBOOK.md`** | **AI가 새로운 역사/과학사 도메인 팩을 만들 때 따라야 하는 7단계 표준 공정(SOP)** 및 12대 무결성 검증 규칙 | 새로운 역사/도메인 타임라인 추가 및 데이터 확장 시 |
| **`04_VIEW_ENGINE_CONTRACT.md`** | Time-River 캔버스, 인과 추적기(Lineage Tracer), 스냅샷 패널, 근거 드로어, 요인 필터 UI 계약 | 뷰 컴포넌트 추가/수정 및 인터랙션 구현 시 |

---

## 3. 절대 불변의 10대 아키텍처 법칙 (The 10 Commandments)

어떤 AI가 작업을 수행하든 아래 10가지 법칙을 어기면 계약 위반(Contract Breach)으로 간주한다.

1. **도메인 독립성 (Domain Agnosticism)**: 코어 엔진(`src/core/`, `src/workers/`, `src/components/`)에는 특정 도메인(예: "후백제", "고려", "양자역학")의 하드코딩된 문자열이나 분기문이 **단 1줄도 존재해서는 안 된다.** 모든 도메인 지식은 오직 `src/packs/<pack-id>/` 내부의 `DomainPack` 데이터로만 주입된다.
2. **5대 데이터 원자 + 사건 모델 준수**: 모든 타임라인은 오직 `Axis`(축), `Entity`(개체), `StateSegment`(상태 구간), `Transition`(인과 전환 간선), `HistoricalEvent`(주요 사건), `Evidence`(근거/사료)라는 6개 표준 테이블(배열)의 관계형 조합으로만 표현한다.
3. **고유 ID 네이밍 규격 강제**: 모든 ID는 `<prefix>_<packCode>_<slug>` 형식을 엄격히 따른다 (예: `axis_ea_manchuria`, `ent_ea_goryeo`, `seg_ea_silla_late`, `trn_ea_silla_to_hubakje`, `evt_ea_gongsan_battle`, `evd_ea_samguksagi_gyeonhwon`).
4. **천문학적 연도(`AstroTime`) 및 `sortKey` 정렬**: 기원전(BCE)은 음수 연도(예: 기원전 108년 = `-108`), 기원후(CE)는 양수 연도(예: `918`)로 표기하며, 모든 시간 비교는 정규화된 정수형 타임스탬프인 `sortKey`를 사용한다.
5. **인과 전환(`Transition`)의 근거 의무화**: 어떤 개체가 분열(`SPLIT`), 통합(`MERGE`), 건국(`FOUNDATION`), 체제전환(`REGIME_CHANGE`), 외부자극(`INFLUENCE`)을 겪을 때 반드시 1개 이상의 구조화된 원인(`causes`), 결과(`consequences`), 요인 태그(`factors`), 그리고 최소 1개 이상의 유효한 `evidenceIds`를 연결해야 한다.
6. **상태 구간(`StateSegment`)의 시간 연속성 및 비중(`powerWeight`) 명시**: 한 개체(`Entity`)의 존속 기간 동안 `StateSegment`들은 서로 시간이 겹치지(Overlap) 않아야 하며, Time-River(산키 강줄기) 두께 렌더링을 위해 `powerWeight` ($1 \sim 100$) 값을 반드시 가져야 한다.
7. **Web Worker 전담 연산 & 메모이제이션**: 시점 $t$의 스냅샷 계산, 전후 인과 그래프 탐색(BFS/DFS Lineage Tracing), 요인별 필터링, 레이아웃 좌표 계산 등 무거운 데이터 처리는 Web Worker(`timelineEngine.worker.ts`)에서 수행하고 결과를 메모이제이션(LRU Cache)한다.
8. **시각화 성능 최우선 (No-Blur Rule)**: UI 렌더링 성능을 떨어뜨리는 CSS `backdrop-filter: blur(...)`, `filter: blur(...)`, 과도한 그림자 중첩을 **절대 사용하지 않는다.** 고대비 불투명/반투명 단색 레이어와 정밀한 보더(`1px solid`)로 깊이감을 표현한다.
9. **단일 책임 및 파일 크기 제한 (< 900 Lines)**: 어떤 파일도 900줄을 넘어서는 안 되며, 컴포넌트와 도메인 데이터 파일은 역할별로 작게 쪼개어 작성한다.
10. **무결성 검증기(`validatePack`) 통과 필수**: 새로운 도메인 팩을 생성하거나 기존 팩을 수정한 후에는 반드시 `validateDomainPack(pack)` 검증기를 실행하여 **에러 0건(Zero Errors)**임을 확인해야만 레지스트리에 등록할 수 있다.
