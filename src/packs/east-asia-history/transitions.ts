/**
 * @file transitions.ts
 * @description Explicit Causal Transitions (Split, Merge, Regime Change, Influence) for the East Asia & Korean Peninsula History DomainPack.
 */

import type { Transition } from '../../contracts/timeline.contract';
import { createAstroTime } from '../../core/astroTime';

export const eastAsiaTransitions: Transition[] = [
  // 1. Gaya -> Silla (532 - 562)
  {
    id: 'trn_ea_gaya_to_silla',
    type: 'MERGE',
    title: '신라의 가야 연맹 병합 (금관가야 532 · 대가야 562)',
    time: createAstroTime(562, { month: 9 }),
    fromEntityIds: ['ent_ea_gaya'],
    toEntityIds: ['ent_ea_silla'],
    flowWeight: 38,
    summary:
      '연맹 왕국 단계에 머물렀던 가야 소국들이 신라 법흥왕·진흥왕의 팽창 정책에 의해 신라로 병합되고, 금관가야 왕족(김유신 가문)이 신라 진골 귀족으로 편입되어 삼국통일의 주역이 됨.',
    causes: [
      {
        title: '연맹 왕국 체제의 한계와 백제·신라의 압박',
        description:
          '금관가야와 대가야가 소국들의 자치권을 완전히 제압하지 못해 중앙집권 율령국가로 전환하지 못한 상태에서 백제와 신라의 양면 압박을 받음.',
        factor: 'POLITICAL',
      },
    ],
    triggers: [
      {
        title: '신라 법흥왕의 금관가야 수용(532) 및 진흥왕의 대가야 정벌(562)',
        description:
          '532년 금관가야 구형왕이 자진 항복하여 진골로 예우받았고, 554년 관산성 전투에서 백제-대가야 연합이 패배한 뒤 562년 이사부·사다함의 신라군이 대가야를 최종 정복함.',
        factor: 'MILITARY',
      },
    ],
    consequences: [
      {
        title: '낙동강 철기·농업 기반 확보 및 김유신 가문의 부상',
        description:
          '신라가 낙동강 서안의 철 산지와 곡창 지대를 확보하고, 옛 금관가야 왕족 김유신이 김춘추와 결합해 신라 삼국통일의 핵심 군사 지도자로 성장함.',
        factor: 'SOCIAL',
      },
    ],
    factors: ['MILITARY', 'POLITICAL', 'SOCIAL'],
    evidenceIds: ['evd_ea_samguksagi_silla_unification'],
  },

  // 2. Baekje -> Silla & Yamato/Japan (660 - 663)
  {
    id: 'trn_ea_baekje_to_silla_japan',
    type: 'MERGE',
    title: '백제 멸망(660) · 백강 전투(663)와 신라 통합 및 백제 유민의 왜(일본) 망명',
    time: createAstroTime(660, { month: 7 }),
    endTime: createAstroTime(663, { month: 8 }),
    fromEntityIds: ['ent_ea_baekje'],
    toEntityIds: ['ent_ea_silla', 'ent_ea_yamato_asuka'],
    flowWeight: 68,
    summary:
      '나당연합군에 의해 660년 사비성이 함락되고, 663년 백강 전투에서 왜(일본) 구원군마저 궤멸되면서 백제 고토는 신라에 통합되고 다수의 백제 귀족·기술자는 일본 열도로 망명하여 일본 율령국가 형성에 기여함.',
    causes: [
      {
        title: '의자왕 말기 지배층 분열과 신라-당(나당) 군사 동맹 체결',
        description:
          '백제 의자왕이 대야성 함락 등 신라를 강하게 압박하자 위기에 몰린 김춘추가 당 태종과 나당동맹(648)을 맺었고, 백제 내부에서는 의자왕과 좌평 귀족들 간의 갈등으로 방어 체계가 이완됨.',
        factor: 'DIPLOMATIC',
      },
    ],
    triggers: [
      {
        title: '황산벌 전투·사비성 함락(660) 및 백강 전투(663) 패배',
        description:
          '소정방의 당군 13만과 김유신의 신라군 5만이 사비성을 함락시키고, 이후 복신·도침·풍장의 부흥군과 왜 수군 400척이 663년 백강에서 나당연합군에 전멸함.',
        factor: 'MILITARY',
      },
    ],
    consequences: [
      {
        title: '백제 고토의 신라 편입과 240년 뒤 후백제(견훤) 부흥 운동의 역사적 씨앗',
        description:
          '백제 영토는 나당전쟁을 거쳐 신라의 웅주·전주·무주로 편입되었으나, 옛 백제 유민의 정체성이 잠재되어 900년 견훤의 후백제 건국 명분으로 부활함. 한편 일본으로 망명한 백제 귀족들은 일본의 방어 체제와 율령제 구축을 주도함.',
        factor: 'IDEOLOGICAL',
      },
    ],
    factors: ['MILITARY', 'DIPLOMATIC', 'IDEOLOGICAL'],
    evidenceIds: ['evd_ea_baekgang_battle_663', 'evd_ea_samguksagi_silla_unification'],
  },

  // 3. Goguryeo -> Silla (668 - 676)
  {
    id: 'trn_ea_three_kingdoms_unification',
    type: 'MERGE',
    title: '고구려 멸망(668)과 나당전쟁 승리(676) — 신라의 대동강 이남 삼국통일',
    time: createAstroTime(668, { month: 9 }),
    endTime: createAstroTime(676, { month: 11 }),
    fromEntityIds: ['ent_ea_goguryeo'],
    toEntityIds: ['ent_ea_silla'],
    flowWeight: 55,
    summary:
      '연개소문 사후 내분으로 668년 고구려가 멸망한 뒤, 신라 문무왕이 고구려 부흥군(안승 등) 및 옛 백제민을 포섭하여 매소성·기벌포 전투에서 당군을 몰아내고 대동강~원산만 이남의 삼국통일을 달성함.',
    causes: [
      {
        title: '70년 수·당 전쟁으로 인한 국력 고갈 및 연개소문 사후 아들들의 권력 내전',
        description:
          '살수대첩과 안시성 전투 승리 이면에 누적된 국력 소모와, 666년 연개소문 사망 직후 장남 연남생이 아우 연남건·연남산에게 밀려 당나라에 투항해 길잡이가 된 내부 붕괴.',
        factor: 'POLITICAL',
      },
    ],
    triggers: [
      {
        title: '평양성 함락(668) 및 신라의 매소성(675)·기벌포(676) 당군 격파',
        description:
          '고구려 멸망 후 당나라가 한반도 전체를 지배하려 하자, 신라 문무왕이 고구려 유민 안승을 보덕국왕으로 봉하며 연합전선을 구축해 당의 육군과 수군을 연파함.',
        factor: 'MILITARY',
      },
    ],
    consequences: [
      {
        title: '통일신라 9주 5소경 체제 성립과 삼한일통의식(三韓一統意識) 형성',
        description:
          '신라가 고구려·백제·신라 유민을 9서당에 함께 편제하며 민족 융합의 기틀을 마련했으나, 만주 고토는 신라 영역 밖으로 남아 발해 건국의 배경이 됨.',
        factor: 'SOCIAL',
      },
    ],
    factors: ['MILITARY', 'POLITICAL', 'DIPLOMATIC', 'SOCIAL'],
    evidenceIds: ['evd_ea_samguksagi_goguryeo', 'evd_ea_samguksagi_silla_unification'],
  },

  // 4. Goguryeo -> Balhae (698)
  {
    id: 'trn_ea_goguryeo_to_balhae',
    type: 'SPLIT',
    title: '대조영의 천문령 대승과 발해(진국) 건국(698) — 고구려 계승 남북국 시대 개막',
    time: createAstroTime(698),
    fromEntityIds: ['ent_ea_goguryeo'],
    toEntityIds: ['ent_ea_balhae'],
    flowWeight: 75,
    summary:
      '고구려 멸망 후 당의 영주(조양)에 강제 이주되었던 고구려 장군 출신 대조영이 고구려 유민과 말갈족을 이끌고 탈출해 천문령에서 당군을 격파하고 만주 동모산에 발해를 세워 남북국 시대를 엶.',
    causes: [
      {
        title: '고구려 유민의 강한 부흥 의지와 당의 영주(營州) 강제 이주 정책의 모순',
        description:
          '당나라가 고구려 지배층과 유민 수십만 명을 요서 영주 등지로 강제 이주시켰으나, 고구려 유민 사회의 결속력과 부흥 의지가 유지됨.',
        factor: 'SOCIAL',
      },
    ],
    triggers: [
      {
        title: '696년 거란 이진충의 반란을 틈탄 영주 탈출과 천문령 전투 승리(698)',
        description:
          '영주에서 거란족 반란으로 당의 통제가 무너지자 대조영이 유민을 이끌고 동쪽으로 진군, 이해고의 당 추격군을 천문령에서 전멸시키고 동모산에 도읍을 세움.',
        factor: 'MILITARY',
      },
    ],
    consequences: [
      {
        title: '만주·한반도 북부의 고구려 고토 회복 및 남북국(발해·신라) 구도 정착',
        description:
          '발해가 고구려 옛 강토를 회복하고 대외적으로 "고구려 국왕"을 칭하며 230년간 만주와 한반도 북부를 지배하는 해동성국으로 발전함.',
        factor: 'POLITICAL',
      },
    ],
    factors: ['MILITARY', 'POLITICAL', 'IDEOLOGICAL', 'SOCIAL'],
    evidenceIds: ['evd_ea_balhae_japan_envoy'],
  },

  // 5. Yamato/Asuka -> Nara -> Heian (710, 794) + Balhae-Japan Diplomacy
  {
    id: 'trn_ea_yamato_to_nara',
    type: 'REGIME_CHANGE',
    title: '백강 패전 충격 이후 다이호 율령(701) 반포 및 나라 시대(710) 천황 율령국가 전환',
    time: createAstroTime(710),
    fromEntityIds: ['ent_ea_yamato_asuka'],
    toEntityIds: ['ent_ea_nara_japan'],
    flowWeight: 65,
    summary:
      '663년 백강 전투 참패 후 나당연합군의 침공 위협에 직면한 왜(야마토 정권)가 백제 망명 지식인들을 활용해 방어 체제와 중앙집권 개혁을 단행하고, 다이호 율령(701)과 헤이조쿄 천도(710)로 "일본" 율령국가를 완성함.',
    causes: [
      {
        title: '백제 멸망 및 백강 전투 패배로 인한 안보 위기와 백제 망명 귀족의 유입',
        description:
          '한반도 내 최대 동맹국 백제의 소멸로 대외 위기감이 고조되었고, 망명한 백제 관료·학자들이 문서 행정과 산성 축조 기술을 전수함.',
        factor: 'DIPLOMATIC',
      },
    ],
    triggers: [
      {
        title: '다이호 율령 제정(701) 및 헤이조쿄(나라) 천도(710)',
        description:
          '국호를 공식적으로 "일본(日本)", 군주 칭호를 "천황"으로 확립하고 당의 장안성을 모방한 헤이조쿄로 수도를 옮김.',
        factor: 'POLITICAL',
      },
    ],
    consequences: [
      {
        title: '신라와의 외교 경쟁 및 발해와의 해상 외교 동맹 구축',
        description:
          '율령국가 일본은 통일신라와 외교적 신경전을 벌이는 한편, 727년부터 만주의 발해와 사절을 교환하며 동해 해상 교류망을 형성함.',
        factor: 'DIPLOMATIC',
      },
    ],
    factors: ['POLITICAL', 'DIPLOMATIC'],
    evidenceIds: ['evd_ea_baekgang_battle_663', 'evd_ea_balhae_japan_envoy'],
  },
  {
    id: 'trn_ea_balhae_nara_alliance',
    type: 'INFLUENCE',
    title: '발해-일본 동해 외교·무역 동맹 (신라 견제 북방-열도 축)',
    time: createAstroTime(727),
    fromEntityIds: ['ent_ea_balhae'],
    toEntityIds: ['ent_ea_nara_japan'],
    flowWeight: 40,
    summary:
      '당·신라와 대립하던 발해 무왕이 727년 일본에 첫 사절을 파견한 이래 멸망 때까지 34차례 사절을 보내며 신라를 남북에서 견제하고 대규모 공무역을 전개함.',
    causes: [
      {
        title: '발해 무왕 대 당·신라와의 군사적 대립과 외교 돌파구 필요성',
        description:
          '흑수말갈 문제로 당·신라와 갈등이 깊어진 발해가 후방 안정을 위해 일본과의 연대를 모색함.',
        factor: 'DIPLOMATIC',
      },
    ],
    triggers: [
      {
        title: '727년 고인의 등 발해 제1차 견일사 파견과 고구려 계승 국서 전달',
        description:
          '발해 사절단이 동해를 건너 헤이조쿄에 입성하여 고구려 계승을 천명하고 국교를 수립함.',
        factor: 'DIPLOMATIC',
      },
    ],
    consequences: [
      {
        title: '동아시아 남북(당·신라) vs 북동(발해·일본) 세력 균형 형성',
        description:
          '신라는 북쪽의 발해와 남동쪽의 일본을 동시에 의식해야 했으며, 동해 항로를 통한 모피·인삼·비단 무역이 크게 번성함.',
        factor: 'ECONOMIC',
      },
    ],
    factors: ['DIPLOMATIC', 'ECONOMIC', 'MILITARY'],
    evidenceIds: ['evd_ea_balhae_japan_envoy'],
  },
  {
    id: 'trn_ea_nara_to_heian',
    type: 'REGIME_CHANGE',
    title: '헤이안쿄(교토) 천도(794) 및 대외 고립주의(견당사 폐지·후삼국 통교 거절) 전환',
    time: createAstroTime(794),
    fromEntityIds: ['ent_ea_nara_japan'],
    toEntityIds: ['ent_ea_heian_japan'],
    flowWeight: 64,
    summary:
      '나라 불교 세력의 정치 개입을 끊기 위해 간무 천황이 794년 헤이안쿄(교토)로 천도함. 9세기 후반 신라 하대 혼란과 당 쇠퇴 속에 894년 견당사를 폐지하고, 후백제·고려의 국교 요청을 모두 거절하는 고립주의로 전환함.',
    causes: [
      {
        title: '나라 사찰 귀족의 비대화와 9세기 동아시아(당·신라) 체제 이완',
        description:
          '헤이조쿄 사찰 세력의 발호를 벗어나 새 수도가 필요했고, 9세기 후반 당과 신라가 동시에 내란에 빠지자 대륙 외교의 실익이 감소함.',
        factor: 'POLITICAL',
      },
    ],
    triggers: [
      {
        title: '794년 헤이안쿄 천도 및 894년 스가와라 미치자네의 건의로 견당사 폐지',
        description:
          '헤이안 시대가 열리고 100년 뒤 대륙 공식 사절 파견을 중단하며 독자적 국풍 문화와 귀족 섭관정치로 내향화됨.',
        factor: 'DIPLOMATIC',
      },
    ],
    consequences: [
      {
        title: '후삼국 시대(후백제 견훤·고려 왕건) 사절 거절 및 한반도 정세 불개입',
        description:
          '660년 백제 멸망 때 대군을 파병했던 것과 달리, 10세기 후삼국 격변기에는 후백제(922, 929)와 고려(937)의 통교 요청을 모두 거절하고 중립·고립을 유지함.',
        factor: 'DIPLOMATIC',
      },
    ],
    factors: ['POLITICAL', 'DIPLOMATIC'],
    evidenceIds: ['evd_ea_heian_diplomacy_refusal'],
  },

  // 6. Core of the User's Question: Why Unified Silla fractured into the Later Three Kingdoms!
  {
    id: 'trn_ea_silla_split_hubaekje',
    type: 'SPLIT',
    title: '신라 하대 모순 폭발과 견훤의 후백제 건국 (892 무진주 봉기 → 900 완산주 건국)',
    time: createAstroTime(892),
    endTime: createAstroTime(900),
    fromEntityIds: ['ent_ea_silla'],
    toEntityIds: ['ent_ea_hubaekje'],
    flowWeight: 62,
    summary:
      '진골 귀족 내전과 골품제 모순, 889년 진성여왕의 이중 조세 독촉으로 전국 농민 봉기가 폭발하자, 신라 서남해 방위군 비장 견훤이 옛 백제 유민의 반신라 정서를 결집해 무진주(892)와 완산주(900)를 장악하고 후백제를 세움.',
    causes: [
      {
        title: '진골 귀족 대토지 겸병과 889년(진성여왕 3년) 국가 재정 파탄·이중 과세',
        description:
          '경주 진골 귀족들이 면세 대농장을 늘리자 국가 세수가 고갈되었고, 중앙 정부가 지방 농민에게 조세를 강제 독촉하면서 농민들이 토지를 버리고 초적(도적)이나 호족 휘하로 들어감.',
        factor: 'ECONOMIC',
      },
      {
        title: '골품제 한계로 인한 6두품 지식인(최승우 등) 이탈과 백제 고토의 반신라 정서',
        description:
          '최치원의 시무 10조(894)가 묵살되는 등 개혁이 좌절되자 6두품 지식인들이 지방 세력과 결합했고, 호남·충청 지역에 남아 있던 백제 부흥 의식이 폭발함.',
        factor: 'SOCIAL',
      },
    ],
    triggers: [
      {
        title: '889년 원종·애노의 난 폭발과 견훤의 무진주(광주 892)·완산주(전주 900) 점령',
        description:
          '전국적 민란 속에서 군사력을 보유한 신라 장수 견훤이 서남해 군사를 이끌고 봉기하여 한 달 만에 5천 군사를 모으고 "의자왕의 숙원을 갚겠다"며 후백제 왕을 칭함.',
        factor: 'MILITARY',
      },
    ],
    consequences: [
      {
        title: '호남·충청 곡창 지대 상실과 후삼국 시대(後三國時代)의 본격 개막',
        description:
          '신라가 최대 곡창 지대인 전라도와 충청도를 상실하여 경제적으로 치명타를 입었고, 후백제는 오월·후당과 외교를 맺으며 후삼국 최강 군사 강국으로 부상함.',
        factor: 'POLITICAL',
      },
    ],
    factors: ['ECONOMIC', 'SOCIAL', 'MILITARY', 'POLITICAL', 'IDEOLOGICAL'],
    evidenceIds: [
      'evd_ea_jinseong_889_rebellion',
      'evd_ea_choichiwon_shimu10',
      'evd_ea_samguksagi_gyeonhwon',
    ],
  },
  {
    id: 'trn_ea_silla_split_taebong',
    type: 'SPLIT',
    title: '신라 중북부 호족 이탈과 궁예의 후고구려(마진·태봉) 건국 (898 송악 → 901 건국)',
    time: createAstroTime(898),
    endTime: createAstroTime(901),
    fromEntityIds: ['ent_ea_silla'],
    toEntityIds: ['ent_ea_taebong'],
    flowWeight: 65,
    summary:
      '신라 왕위 쟁탈전에서 밀려난 몰락 왕족 출신 승려 궁예가 강원·경기·패서(황해도)의 호족 세력(특히 송악의 왕륭·왕건 부자)과 결합하여 "고구려의 원수를 갚겠다"며 후고구려(이후 마진·태봉)를 건국함.',
    causes: [
      {
        title: '신라 중앙 정부의 한강·패서(예성강·대동강) 변경 통제력 상실 및 독립 호족 성장',
        description:
          '신라 북변인 송악(개성)·패서 지역에서 해상 무역과 자체 성곽·사병을 갖춘 대호족(왕륭 등)이 성장하며 경주 중심 골품 체제에서 독자 노선을 모색함.',
        factor: 'SOCIAL',
      },
      {
        title: '패서 지역 고구려 유민의 고구려 부흥 염원과 미륵 불국토 신앙의 확산',
        description:
          '옛 고구려 남부 영토였던 한반도 중북부 주민들의 고구려 계승 의식과 난세를 구원할 미륵 신앙이 승려 출신 궁예의 카리스마와 결합함.',
        factor: 'IDEOLOGICAL',
      },
    ],
    triggers: [
      {
        title: '896년 송악 왕륭·왕건 부자의 귀부와 901년 후고구려 정식 건국 선포',
        description:
          '북원 양길 휘하에서 자립한 궁예에게 해상·군사력을 갖춘 송악 호족 왕륭·왕건이 투항하면서 한강·예성강 유역을 평정하고 901년 후고구려 왕을 칭함.',
        factor: 'POLITICAL',
      },
    ],
    consequences: [
      {
        title: '한반도 중북부·나주까지 아우르는 최대 영토 확보 및 철원 광평성 체제 구축',
        description:
          '신라·후백제·후고구려(태봉)의 후삼국 정립이 완성되었고, 왕건이 나주 수군 원정(903) 등으로 핵심 무장으로 성장하며 향후 고려 건국의 모체가 됨.',
        factor: 'MILITARY',
      },
    ],
    factors: ['POLITICAL', 'SOCIAL', 'IDEOLOGICAL', 'MILITARY'],
    evidenceIds: [
      'evd_ea_jinseong_889_rebellion',
      'evd_ea_samguksagi_gungye',
      'evd_ea_naju_naval_campaign',
    ],
  },

  // 7. Taebong -> Goryeo (918 Regime Change)
  {
    id: 'trn_ea_taebong_to_goryeo',
    type: 'REGIME_CHANGE',
    title: '왕건의 역성혁명과 태봉에서 고려(高麗)로의 정권·노선 교체 (918년 6월)',
    time: createAstroTime(918, { month: 6 }),
    fromEntityIds: ['ent_ea_taebong'],
    toEntityIds: ['ent_ea_goryeo'],
    flowWeight: 80,
    summary:
      '궁예가 철원 천도 후 고구려 계승 명분을 버리고(마진·태봉) 미륵 관심법으로 호족과 신하들을 대거 숙청하자, 918년 6월 홍유·배현경·신숭겸·복지겸 등 무장과 패서 호족들이 시중 왕건을 추대하여 역성혁명을 일으키고 고구려 계승국 "고려"를 세움.',
    causes: [
      {
        title: '궁예의 전제왕권 강화를 위한 미륵 관심법 공포정치와 패서 호족과의 갈등',
        description:
          '궁예가 왕권을 극대화하기 위해 부인 강씨와 왕자들, 장수들을 관심법으로 잇따라 처형하자 중앙 관료와 패서(개성) 호족들이 생존 위협을 느낌.',
        factor: 'POLITICAL',
      },
      {
        title: '철원 대궁궐 축조 및 무리한 전쟁 동원으로 인한 농민·군사 피로 누적',
        description:
          '무리한 토목 공사와 가혹한 조세·군역 징발로 태봉 내부 민심이 완전히 이반됨.',
        factor: 'ECONOMIC',
      },
    ],
    triggers: [
      {
        title: '918년 6월 4대 기장(홍유·배현경·신숭겸·복지겸)의 거사와 왕건 추대',
        description:
          '기장 4인이 왕건의 자택을 찾아가 혁명을 결행했고, 군사들이 일제히 호응하자 궁예는 북쪽 산골로 도주하다 부양(평강) 백성에게 피살됨.',
        factor: 'POLITICAL',
      },
    ],
    consequences: [
      {
        title: '개경(송악) 환도(919) · 취민유도 감세 · 호족 포용 · 친신라 외교로의 대전환',
        description:
          '왕건은 국호를 다시 고구려를 뜻하는 "고려"로 되돌리고, 신라를 "멸망시켜야 할 원수"로 보던 궁예의 노선을 버리고 "신라를 보호하는 동맹"으로 전환하여 통일 전쟁의 결정적 명분 우위를 점함.',
        factor: 'DIPLOMATIC',
      },
    ],
    factors: ['POLITICAL', 'ECONOMIC', 'DIPLOMATIC', 'SOCIAL'],
    evidenceIds: ['evd_ea_samguksagi_gungye', 'evd_ea_goryeo_revolution_918'],
  },

  // 8. Khitan destroys Balhae (926) & Balhae refugees merge into Goryeo (926 - 934)
  {
    id: 'trn_ea_khitan_destroys_balhae',
    type: 'INFLUENCE',
    title: '야율아보기의 거란(요) 제국 부상과 발해 상경 홀한성 함락(926)',
    time: createAstroTime(926, { month: 1 }),
    fromEntityIds: ['ent_ea_khitan_liao'],
    toEntityIds: ['ent_ea_balhae'],
    flowWeight: 70,
    summary:
      '907년 거란 부족을 통일한 야율아보기가 중원 진출에 앞서 배후의 화근을 없애기 위해 925년 말 발해를 기습 침공, 지배층 내분에 빠진 발해 수도 상경 홀한성을 보름 만에 함락시키고 발해를 멸망시킴.',
    causes: [
      {
        title: '거란(요)의 유목 제국 팽창과 발해 말기(대인선 대) 지배층 내분',
        description:
          '당 멸망(907) 이후 만주·몽골 초원의 패권을 잡은 거란이 남하를 준비한 반면, 발해는 유력 귀족 가문 간 권력 다툼으로 방어 태세가 와해됨.',
        factor: 'MILITARY',
      },
    ],
    triggers: [
      {
        title: '925년 12월 야율아보기의 친정 기습과 926년 1월 부여성·홀한성 연쇄 함락',
        description:
          '거란 대군이 겨울 강추위를 뚫고 요동을 넘어 부여성과 수도 홀한성을 포위하자 대인선 왕이 항복하며 229년 역사의 발해가 멸망함.',
        factor: 'MILITARY',
      },
    ],
    consequences: [
      {
        title: '만주 패권의 거란 이동 및 발해 유민의 대규모 고려 망명과 고려의 반거란 북진 정책 확정',
        description:
          '만주 지역이 거란(동란국)의 영향권에 들어가고, 발해 왕족·귀족·백성 수만 명이 남쪽 동족 국가 고려로 망명하면서 고려가 고구려·발해의 정통 후계자임을 자임하고 거란과 적대하게 됨.',
        factor: 'DIPLOMATIC',
      },
    ],
    factors: ['MILITARY', 'DIPLOMATIC', 'POLITICAL'],
    evidenceIds: ['evd_ea_balhae_fall_refugees', 'evd_ea_goryeo_manbugyo'],
  },
  {
    id: 'trn_ea_balhae_to_goryeo',
    type: 'MERGE',
    title: '발해 멸망 후 세자 대광현 등 발해 유민 수만 명의 고려 대거 귀부 및 통합 (926~934)',
    time: createAstroTime(926, { month: 3 }),
    endTime: createAstroTime(934, { month: 7 }),
    fromEntityIds: ['ent_ea_balhae'],
    toEntityIds: ['ent_ea_goryeo'],
    flowWeight: 58,
    summary:
      '거란에 나라를 잃은 발해의 세자 대광현(大光顯)과 장군 신덕, 예부경 대화균 등 지배층과 백성 수만 명이 연이어 고려로 망명하자, 태조 왕건이 대광현에게 왕씨 성(왕계)을 하사하고 왕실 족보에 편입하며 남북국 통합을 이룩함.',
    causes: [
      {
        title: '발해와 고려의 공통된 고구려 계승 정체성(동족 의식)',
        description:
          '발해와 고려 모두 고구려(高麗)의 후예임을 국시로 삼고 있었기에, 발해 지배층과 유민들이 이민족 거란의 지배를 거부하고 고려를 귀부처로 선택함.',
        factor: 'IDEOLOGICAL',
      },
    ],
    triggers: [
      {
        title: '926년 발해 멸망 직후부터 934년 세자 대광현의 수만 유민 인솔 입조',
        description:
          '934년 7월 마지막 세자 대광현이 수만 명의 유민을 이끌고 개경에 들어오자 태조 왕건이 최고 예우로 맞이함.',
        factor: 'SOCIAL',
      },
    ],
    consequences: [
      {
        title: '고려의 북방 군사력·인구 증강 및 민족사적 남북국 통합의 정통성 확보',
        description:
          '발해 유민들이 패서·북방 개척에 배치되어 고려의 후삼국 통일 전쟁과 대거란 방어력을 크게 높였으며, 고려가 고구려·발해의 역사적 유산을 계승함.',
        factor: 'POLITICAL',
      },
    ],
    factors: ['SOCIAL', 'IDEOLOGICAL', 'POLITICAL', 'DIPLOMATIC'],
    evidenceIds: ['evd_ea_balhae_fall_refugees', 'evd_ea_goryeo_manbugyo'],
  },

  // 9. Silla Peaceful Surrender to Goryeo (935)
  {
    id: 'trn_ea_silla_to_goryeo',
    type: 'MERGE',
    title: '신라 경순왕의 고려 자진 귀부(遜國) — 천년 신라의 무혈 통합 (935년 11월)',
    time: createAstroTime(935, { month: 11 }),
    fromEntityIds: ['ent_ea_silla'],
    toEntityIds: ['ent_ea_goryeo'],
    flowWeight: 48,
    summary:
      '927년 후백제 견훤의 경주 포석정 습격으로 치명타를 입은 반면, 고려 왕건의 일관된 친신라 보호 정책과 930년 고창 전투 대승으로 영남 민심이 고려로 완전히 기울자, 935년 11월 신라 마지막 왕 경순왕이 백성의 희생을 막기 위해 평화적으로 나라를 고려에 바침.',
    causes: [
      {
        title: '후백제 견훤의 대(對)신라 강경 약탈(927 포석정 참극) vs 고려 왕건의 친신라 구원·예우 정책',
        description:
          '견훤이 경주를 약탈하고 경애왕을 자결시킨 사건으로 신라 상하가 후백제를 불구대천의 원수로 여긴 반면, 왕건은 공산 전투에서 목숨을 걸고 신라를 구원하려 했고 경주 방문 시 추호도 범하지 않아 신라인들의 절대적 신뢰를 얻음.',
        factor: 'DIPLOMATIC',
      },
      {
        title: '930년 고창 전투 승리 이후 영남·동해안 30여 호족 성주의 고려 귀순으로 인한 경주 고립',
        description:
          '경주 주변 모든 주군이 고려에 투항하여 신라 조정은 더 이상 국가를 독자 유지할 경제·군사적 기반이 소멸됨.',
        factor: 'MILITARY',
      },
    ],
    triggers: [
      {
        title: '935년 10월 경순왕의 어전회의 결단과 11월 개경 입조(遜國)',
        description:
          '마의태자의 눈물의 반대에도 경순왕이 "무고한 백성들을 더 이상 도탄에 빠뜨릴 수 없다"며 김봉휴를 보내 귀부를 청하고 백관을 이끌고 개경으로 행차함.',
        factor: 'POLITICAL',
      },
    ],
    consequences: [
      {
        title: '천년 신라의 문화·제도·6두품/진골 인재의 온전한 고려 흡수 및 통일 정통성 완성',
        description:
          '왕건이 경순왕에게 맏딸 낙랑공주를 시집보내고 정승(태자보다 높은 지위)과 경주 사심관으로 임명함으로써, 신라 귀족 세력이 저항 없이 고려 지배층으로 융합되고 후백제는 완전히 고립됨.',
        factor: 'SOCIAL',
      },
    ],
    factors: ['POLITICAL', 'DIPLOMATIC', 'SOCIAL', 'MILITARY'],
    evidenceIds: [
      'evd_ea_poseokjeong_gongsan',
      'evd_ea_gochang_battle_930',
      'evd_ea_silla_surrender_935',
    ],
  },

  // 10. Hubaekje -> Goryeo (935 Geumsansa Coup & 936 Battle of Illicheon Final Unification)
  {
    id: 'trn_ea_hubaekje_to_goryeo',
    type: 'MERGE',
    title: '후백제 금산사 정변(견훤 귀순 935) 및 일리천 결전 승리 — 고려의 후삼국 최종 통일 (936년 9월)',
    time: createAstroTime(935, { month: 6 }),
    endTime: createAstroTime(936, { month: 9 }),
    fromEntityIds: ['ent_ea_hubaekje'],
    toEntityIds: ['ent_ea_goryeo'],
    flowWeight: 74,
    summary:
      '고창(930)·운주(934) 패전으로 수세에 몰린 후백제에서 935년 왕위 계승 갈등으로 장남 신검이 아버지 견훤을 금산사에 유폐하는 정변이 발생함. 탈출한 견훤이 고려 왕건에게 귀순하여 936년 9월 일리천 전투의 선봉에 서면서 신검의 후백제군이 궤멸되고 44년간의 후삼국 시대가 고려의 완전 통일로 막을 내림.',
    causes: [
      {
        title: '견훤 1인 군사 카리스마 체제의 한계와 후계 구도 실패 (장남 신검 vs 넷째 금강)',
        description:
          '호족들을 혼인과 관제로 제도화한 왕건과 달리, 견훤은 군사적 강압으로 호족을 통제했고 장성한 장남 신검·양검·용검 대신 후비 고씨 소생의 넷째 아들 금강에게 왕위를 물려주려 해 지배층이 두 파벌로 분열됨.',
        factor: 'POLITICAL',
      },
      {
        title: '나주 상실(903)·고창 전투 패배(930)·신라의 고려 귀부(935)로 인한 전략적 포위',
        description:
          '북쪽의 개경, 서남쪽의 나주, 동쪽의 경주가 모두 고려 수중에 들어가며 후백제는 삼면 포위 상태에 빠짐.',
        factor: 'MILITARY',
      },
    ],
    triggers: [
      {
        title: '935년 3월 신검의 금산사 정변 · 6월 견훤의 고려 망명 · 936년 9월 선산 일리천 결전',
        description:
          '금산사에서 탈출한 창업주 견훤이 나주를 거쳐 고려에 투항하고, 936년 9월 왕건과 함께 8만 7천 대군의 선봉에 서서 "불효자 신검을 징벌한다"고 외치자 후백제 장수 박영규(견훤 사위) 등이 내응하며 후백제 전선이 붕괴됨.',
        factor: 'MILITARY',
      },
    ],
    consequences: [
      {
        title: '936년 후삼국 통일 완성과 삼한(고구려·백제·신라) + 발해 유민을 포괄한 민족 재통일',
        description:
          '신검이 황산(논산)에서 최종 항복함으로써 후백제가 멸망하고, 외세 개입 없이 우리 민족 스스로의 힘으로 후삼국 재통일을 완수함.',
        factor: 'POLITICAL',
      },
    ],
    factors: ['POLITICAL', 'MILITARY', 'SOCIAL'],
    evidenceIds: [
      'evd_ea_gochang_battle_930',
      'evd_ea_geumsansa_illicheon',
      'evd_ea_hunyo_10_articles',
    ],
  },

  // 11. Tamna Tributary Alliance with Goryeo (938)
  {
    id: 'trn_ea_tamna_goryeo_tribute',
    type: 'INFLUENCE',
    title: '후삼국 통일 직후 탐라국 태자 말로의 고려 입조 및 자치 공인 (938)',
    time: createAstroTime(938, { month: 12 }),
    fromEntityIds: ['ent_ea_tamna'],
    toEntityIds: ['ent_ea_goryeo'],
    flowWeight: 25,
    summary:
      '고려가 후삼국을 통일하자 제주도의 해상 왕국 탐라국이 938년 태자 말로를 개경에 파견하여 조공을 바치고, 태조 왕건으로부터 성주·왕자 작위를 공식 재확인받으며 고려 해상 네트워크에 합류함.',
    causes: [
      {
        title: '한반도 본토의 후삼국 분열 종식과 고려 중심 해상 질서 재편',
        description:
          '나주와 한반도 남해안을 완전히 장악한 고려가 동아시아 해상 패권을 쥐게 됨.',
        factor: 'DIPLOMATIC',
      },
    ],
    triggers: [
      {
        title: '938년 12월 탐라국 태자 말로(末老)의 개경 입조',
        description:
          '탐라국 왕실이 고려의 통일을 축하하며 사절단을 파견하고 신라 시대의 성주·왕자 작위를 승계받음.',
        factor: 'DIPLOMATIC',
      },
    ],
    consequences: [
      {
        title: '탐라의 독자 자치 유지 및 개경 벽란도 남방 해상 무역로 안정',
        description:
          '탐라국은 내부 자치를 유지하면서 고려-송-일본을 잇는 남방 해상 교역의 핵심 기지가 됨.',
        factor: 'ECONOMIC',
      },
    ],
    factors: ['DIPLOMATIC', 'ECONOMIC'],
    evidenceIds: ['evd_ea_silla_surrender_935'],
  },
];
