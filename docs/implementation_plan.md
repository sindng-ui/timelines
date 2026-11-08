# 범용 타임라인 & 인과관계 지식 프레임워크 (Universal Timeline Framework) 마스터 계획서

> 작성일: 2026-11-08  
> 상태: 승인 완료 (Approved & In Progress)

## 1. 핵심 설계 철학: 왜 '틀(Framework & Contract)'이 먼저인가?

나무위키처럼 파편화된 문서들을 일일이 찾아다니며 머릿속으로 이어 붙여야 하는 한계를 극복하고, **"시간의 흐름에 따른 개체(국가·이론·인물·사건)의 생성·분열·통합·소멸"**과 **"왜 그렇게 변화했는가(인과관계·근거·사료)"**를 타임라인 스크러빙과 그래프로 한눈에 조작하며 탐색할 수 있는 **범용 타임라인 엔진 및 데이터 계약(Contract) 체계**를 구축합니다.

한반도 역사(만주·일본 포함)뿐만 아니라 향후 **물리학의 역사(고전역학 → 상대성이론/양자역학 분기 및 통합)**, **유럽사**, **기술 발전사** 등 어떤 도메인이든 코드 수정 없이 데이터 팩(Data Pack)만 교체·추가하면 즉시 동작하도록 **4대 엄밀 계약(Strict Contracts)**으로 분리합니다:

1. **Ontology & Schema Contract (데이터 스키마 계약)**: 시대·도메인을 불문하고 모든 타임라인 조각을 표현하는 5대 기본 원자(Primitive)와 JSON Schema / TypeScript 타입 규격.
2. **Domain Pack Contract (도메인 팩 디렉토리 & 파일 계약)**: 어떤 AI가 데이터를 생성하더라도 파일명, ID 네이밍, 시간 표기법, 검증 스크립트 통과 기준이 100% 고정된 규격.
3. **Engine & Worker Contract (연산 및 워커 파이프라인 계약)**: 수만 개의 사건과 상태 변화가 있어도 메인 스레드 블로킹 없이 특정 시점($t$)의 스냅샷과 전후 인과 그래프를 $O(\log N)$으로 계산하는 Web Worker 프로토콜.
4. **View & Interaction Contract (뷰어 플러그인 계약)**: 시간축 강줄기 뷰(Time-River View), 전후 인과 추적기(Causal Lineage Tracer), 시점 스냅샷 비교 뷰(Snapshot State Panel), 사료·근거 인스펙터(Evidence Drawer), 요인별 필터(Factor Filter)가 동일한 스토어 상태를 구독하는 인터페이스.

---

## 2. 5대 핵심 데이터 원자 (Core Data Primitives) 및 4대 추가 제안의 전면 반영

### ① 5대 핵심 데이터 원자
1. **`Axis` (차원/트랙 정의)**: 지리적 권역(만주/요동, 한반도 북부, 한반도 중부, 한반도 남부, 일본 열도) 또는 학문 분과 트랙.
2. **`Entity` (개체: 국가, 왕조, 학파, 이론, 인물)**: 시간 속에서 지속성(Lifespan)을 가지는 주체 (`ent_<domain>_<slug>`).
3. **`StateSegment` (시대별 상태 구간)**: 하나의 `Entity` 내부에서 시간에 따라 변하는 국호, 수도, 체제, 전성기/쇠퇴기, 세력 비중(`powerWeight`), 상태 요약.
4. **`Transition` (변화 및 인과 연결고리)**: 국가/이론의 건국(`FOUNDATION`), 분열(`SPLIT`), 통합/흡수(`MERGE`), 체제교체(`REGIME_CHANGE`), 외부자극/전쟁(`INFLUENCE`)을 나타내는 방향성 간선. 원인(`causes`), 결정적 계기(`triggers`), 결과(`consequences`)와 근거(`evidenceIds`)를 필수 포함.
5. **`Evidence & HistoricalEvent` (근거/사료/사건 편린)**: 모든 변화와 사건을 뒷받침하는 사료 출처(『삼국사기』, 『고려사』 등), 신뢰도 등급(`CERTAIN`, `PROBABLE`, `DEBATED`), 인용문, 요인 태그(`FactorTag`).

### ② 전면 반영된 4대 핵심 기능 (Tips & Proposals)
1. **산키(Sankey) 스타일 시간 강줄기(Time-River) 뷰**: 하나의 국가(신라)에서 줄기가 갈라져 나와(후백제, 태봉) 다시 하나의 큰 강(고려)으로 합쳐지는 분열·통합 흐름도 시각화.
2. **타임머신 스냅샷 & 전후 인과 추적기 (Causal Lineage Tracer)**: 특정 국가나 전환점을 선택하면 `[선행 원인(Why it happened)] → [현재 선택 개체/전환] → [후속 결과(What it caused)]` 경로를 추적하고 근거 사료를 스토리보드로 제시.
3. **AI 데이터 무결성 검증기 (Contract Validator Engine & CLI)**: 끊어진 ID 참조, 시간 역전 오류, 근거 누락, 구간 중첩 오류를 자동 검출하여 어떤 AI가 데이터를 작성하더라도 무결성을 100% 보장.
4. **다중 관점 / 요인별 필터링 (Factor & Perspective Layer)**: `POLITICAL`(정치), `MILITARY`(군사/전쟁), `ECONOMIC`(경제/조세), `DIPLOMATIC`(외교/국제정세), `SOCIAL`(사회/호족/신분), `IDEOLOGICAL`(사상/종교/과학이론) 태그별 필터링 및 정설/학설 신뢰도 배지 표시.

---

## 3. 오라클(Oracle) 문서 체계 구성

추후 어떤 AI가 다른 역사나 과학사 제작에 투입되더라도 즉시 참조할 수 있는 **오라클 문서 세트**를 `important/` 폴더에 구축합니다:
- `important/00_ORACLE_TIMELINE_FRAMEWORK.md`: 단일 진실 공급원(SSOT) 마스터 오라클 문서.
- `important/01_SYSTEM_ARCHITECTURE.md`: 아키텍처, 워커, 메모이제이션, No-Blur, 900줄 제한 규칙.
- `important/02_DATA_SCHEMA_CONTRACT.md`: 데이터 스키마 및 JSON/TypeScript 필드별 엄밀 명세.
- `important/03_AI_AUTHORING_PLAYBOOK.md`: AI가 새로운 도메인 팩을 생성할 때 따라야 하는 단계별 레시피 및 검증 프로토콜.
- `important/04_VIEW_ENGINE_CONTRACT.md`: 시각화 엔진 및 인터랙션 상태 계약.
