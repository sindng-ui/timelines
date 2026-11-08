# 🤖 03. AI 전용 타임라인 도메인 팩 제작 표준 지침서 (SOP)
**(AI Authoring Playbook & Automated Contract Validation Rules)**

> **문서 번호**: `03_AI_AUTHORING_PLAYBOOK`  
> **상위 오라클**: `00_ORACLE_TIMELINE_FRAMEWORK.md`  
> **핵심 목적**: 어떤 AI 에이전트가 투입되더라도 이 문서의 **7단계 공정(7-Step Recipe)**만 순서대로 수행하면, UI 코드를 단 한 줄도 건드리지 않고도 **Time-River 분열·통합 뷰, 인과 계보 추적기, 시점 스냅샷, 요인별 필터가 100% 완벽하게 작동하는 신규 타임라인**을 만들어 붙일 수 있도록 안내한다.

---

## 1. AI 도메인 팩 제작 7단계 표준 공정 (The 7-Step Recipe)

새로운 주제(예: 유럽의 역사, 물리학의 역사, 중국 춘추전국~삼국시대, AI 발전사 등)를 요청받으면 AI는 반드시 아래 순서대로 파일을 생성한다.

### Step 1: 도메인 범위 및 `packCode` 확정
1. `src/packs/<pack-id>/` 폴더를 생성한다 (예: `src/packs/europe-history/`).
2. 2~4글자의 영문 소문자 `packCode`를 정한다 (예: `'eu'`, `'ea'`, `'phy'`).
3. 전체 타임라인의 `startYear`, `endYear`, 그리고 사용자가 처음 열었을 때 가장 흥미로운 분기점이 보이는 `defaultFocusYear`를 결정한다.

### Step 2: `Axis` (공간/분과 트랙) 3~7개 설계 (`axes.ts`)
- **역사 도메인**: 인접하여 상호작용하는 지정학적 권역으로 나눈다.
  - 예 (동아시아·한반도): `0: 만주·요동·북방`, `1: 한반도 북부(패서·관서)`, `2: 한반도 중부(송악·철원·한강)`, `3: 한반도 남부(신라·후백제·가야권)`, `4: 일본 열도`
  - 예 (유럽사): `0: 브리튼·북유럽`, `1: 서유럽(갈리아·프랑크)`, `2: 중부유럽(신성로마·독일)`, `3: 지중해·이탈리아`, `4: 동유럽·비잔티움`
- **과학/학문 도메인**: 핵심 탐구 영역별로 나눈다.
  - 예 (물리학사): `0: 천체·우주·중력`, `1: 고전·열·연속체 역학`, `2: 전자기·광학`, `3: 양자·미시·입자물리`

### Step 3: `Entity` (국가/학파/이론) 정의 및 생명주기 설정 (`entities.ts`)
1. 각 축(`axisId`)에 등장하는 주체들을 정의한다.
2. **동일 축 내 동시대 공존 처리**: 같은 `axisId` 안에서 같은 시기에 2개 이상의 개체가 공존할 경우(예: 한반도 남부의 신라 말기와 후백제), `laneOffset` 값을 각각 `-0.35`, `+0.35`처럼 부여하여 스트림이 위아래로 깔끔하게 분리되도록 한다.
3. 모든 ID는 반드시 `ent_<packCode>_<slug>` 형식을 지킨다.

### Step 4: `StateSegment` (시대별 상태 변화 및 국호 변천) 쪼개기 (`segments.ts`)
1. 하나의 `Entity`를 단일 막대로 두지 말고, **내부적 변화(국호 변경, 수도 천도, 전성기→쇠퇴기, 패러다임 수정)**에 따라 여러 `StateSegment`로 쪼갠다.
   - **모범 사례 (궁예의 정권 `ent_ea_taebong`)**:
     - `seg_ea_taebong_hugoguryeo` (901~904): 공식명 `'후고구려'`, 수도 `'송악(개성)'`, `powerWeight: 45`
     - `seg_ea_taebong_majin` (904~911): 공식명 `'마진(摩震)'`, 수도 `'철원'`, `powerWeight: 70` (영토 확장 전성기)
     - `seg_ea_taebong_taebong` (911~918): 공식명 `'태봉(泰封)'`, 수도 `'철원'`, `powerWeight: 55` (미륵 관심법 및 공포정치로 민심 이반)
2. **절대 규칙**: 동일 `entityId`에 속한 `StateSegment`들은 시간 구간이 역전되거나 겹치면 안 되며(`prev.endTime.sortKey <= next.startTime.sortKey`), `Entity`의 전체 `startTime` ~ `endTime` 범위 안에 완전히 포함되어야 한다.

### Step 5: `Evidence` (사료·근거·논문 카드) 구축 (`eventsAndEvidences.ts`)
- 모든 변화(`Transition`)와 사건(`HistoricalEvent`)을 설명하기 전에, 이를 뒷받침할 **근거(`Evidence`)**부터 먼저 정의한다.
- 나무위키식 카더라 서술이 아니라, **구체적인 출전(`sourceCitation`)**, **신뢰도(`CERTAIN` | `PROBABLE` | `DEBATED`)**, **핵심 내용(`quoteOrSummary`)**, **역사적/과학적 해설(`interpretation`)**을 명시한다.

### Step 6: `Transition` (분열·통합·인과 간선) 촘촘하게 연결 (`transitions.ts`)
- **가장 중요한 단계**다. 어떤 개체도 허공에서 이유 없이 나타나거나 사라져서는 안 된다.
- **분열(`SPLIT`) 작성법**:
  - 예: 신라 하대(`ent_ea_silla`) ──[`SPLIT`: 진성여왕기 조세 파탄 및 호족 봉기]──▶ 후백제(`ent_ea_hubakje`), 태봉/후고구려(`ent_ea_taebong`)
- **체제 교체(`REGIME_CHANGE`) 또는 계승(`MERGE`) 작성법**:
  - 예: 태봉(`ent_ea_taebong`) ──[`REGIME_CHANGE`: 918년 왕건 추대 역성혁명]──▶ 고려(`ent_ea_goryeo`)
- **통합/병합(`MERGE`) 작성법**:
  - 예: 발해(`ent_ea_balhae`) 멸망 후 세자 대광현 등 유민 집단 ──[`MERGE`: 926~934년 발해 유민의 고려 대거 귀부]──▶ 고려(`ent_ea_goryeo`)
  - 예: 신라(`ent_ea_silla`) ──[`MERGE`: 935년 경순왕의 자발적 손국 귀부]──▶ 고려(`ent_ea_goryeo`)
  - 예: 후백제(`ent_ea_hubakje`) ──[`MERGE`: 936년 신검의 항복과 일리천 전투 최종 통일]──▶ 고려(`ent_ea_goryeo`)
- 각 `Transition`에는 반드시 `causes`(배경 원인), `triggers`(직접 도화선), `consequences`(결과), `factors`(요인 태그), `evidenceIds`(근거 ID)를 빠짐없이 채운다.

### Step 7: 레지스트리 등록 및 검증기(`validatePacks`) 실행
- `src/packs/index.ts`의 `DOMAIN_PACKS` 배열에 신규 팩을 추가한다.
- 검증기를 실행하여 **12대 무결성 규칙**을 통과하는지 확인한다.

---

## 2. 12대 자동 무결성 검증 규칙 (The 12 Validation Rules)

`src/core/validator.ts`는 모든 `DomainPack`에 대해 아래 12가지 규칙을 엄격히 검사하며, 하나라도 위반 시 구체적인 에러 코드와 수정 가이드를 출력한다.

| 규칙 코드 | 검증 항목 | 계약 조건 (Pass Criteria) |
| :--- | :--- | :--- |
| **`V01_ID_FORMAT`** | ID 접두사 및 고유성 | 모든 `Axis`(`axis_`), `Entity`(`ent_`), `StateSegment`(`seg_`), `Transition`(`trn_`), `HistoricalEvent`(`evt_`), `Evidence`(`evd_`) ID는 `packCode`를 포함하고 중복이 없어야 함 |
| **`V02_AXIS_REF`** | 축 참조 무결성 | 모든 `Entity.axisId` 및 `secondaryAxisIds`는 실제 존재하는 `Axis.id`여야 함 |
| **`V03_ENTITY_TIME`** | 개체 시간 유효성 | 모든 `Entity`의 `startTime.sortKey`는 `endTime.sortKey`보다 작거나 같아야 하며, 팩의 `timeRange` 내에 존재해야 함 |
| **`V04_SEGMENT_BOUNDS`** | 상태 구간 범위 준수 | 모든 `StateSegment`는 참조하는 `Entity`가 존재해야 하며, 구간의 시작·종료가 부모 `Entity`의 존속 기간 내에 있어야 함 |
| **`V05_SEGMENT_NO_OVERLAP`** | 상태 구간 비중첩 | 동일 `Entity`에 속한 `StateSegment`들은 서로 시간 구간이 역전되거나 겹치지 않아야 함 |
| **`V06_POWER_WEIGHT`** | 세력 가중치 범위 | `StateSegment.powerWeight` 및 `Transition.flowWeight`는 `1` 이상 `100` 이하의 숫자여야 함 |
| **`V07_TRANSITION_REFS`** | 전환 개체 참조 무결성 | `Transition.fromEntityIds` 및 `toEntityIds`의 모든 ID는 실제 존재하는 `Entity.id`여야 하며, `toEntityIds`는 최소 1개 이상이어야 함 |
| **`V08_TRANSITION_CAUSALITY`** | 인과 설명 완결성 | 모든 `Transition`은 최소 1개 이상의 `causes`, `triggers`, `consequences`, `factors`를 가져야 함 |
| **`V09_EVIDENCE_REQUIRED`** | 사료/근거 연결 의무 | 모든 `Transition`과 `HistoricalEvent`는 최소 1개 이상의 실제 존재하는 `Evidence.id`를 참조해야 함 (근거 없는 주장 금지) |
| **`V10_EVENT_REFS`** | 사건 참조 무결성 | 모든 `HistoricalEvent.entityIds`는 실제 존재하는 `Entity.id`여야 함 |
| **`V11_TEMPORAL_CAUSALITY`** | 시간 인과율 준수 | `Transition`의 시점(`time.year`)은 선행 개체(`fromEntityIds`)의 시작 연도보다 앞설 수 없음 (원인이 존재하기 전에 파생 불가) |
| **`V12_ENTITY_COVERAGE`** | 고립 개체 경고 | 모든 `Entity`는 최소 1개 이상의 `StateSegment`와 최소 1개 이상의 `Transition`에 연결되어야 함 |
