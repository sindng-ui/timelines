/**
 * @file eventsAndEvidences.ts
 * @description HistoricalEvents and primary-source Evidence cards for the East Asia & Korean Peninsula History DomainPack.
 */

import type { Evidence, HistoricalEvent } from '../../contracts/timeline.contract';
import { createAstroTime } from '../../core/astroTime';

export const eastAsiaEvidences: Evidence[] = [
  {
    id: 'evd_ea_samguksagi_goguryeo',
    title: '『삼국사기』 고구려본기 보장왕 27년(668) 연개소문 사후 내분과 평양성 함락 기록',
    sourceCitation: '『삼국사기(三國史記)』 권22 고구려본기 제10 보장왕',
    sourceType: 'PRIMARY_CHRONICLE',
    reliability: 'CERTAIN',
    quoteOrSummary:
      '연개소문이 죽자 장남 남생이 대막리지가 되었으나 아우 남건·남산과 불화하여 남생이 국내성으로 달아나 당에 투항하고 앞장서 길을 인도하니, 당 이적과 신라 김인문 연합군이 평양성을 포위하여 668년 9월 고구려가 멸망하였다.',
    interpretation:
      '수·당과의 70년 전쟁을 버텨낸 동북아 최강국 고구려가 외부 침공뿐 아니라 최고 권력층(연개소문 아들들)의 내부 분열과 반역으로 붕괴했음을 보여주는 핵심 사료다.',
    factors: ['POLITICAL', 'MILITARY', 'DIPLOMATIC'],
  },
  {
    id: 'evd_ea_samguksagi_silla_unification',
    title: '『삼국사기』 신라본기 문무왕 매소성(675)·기벌포(676) 나당전쟁 승리 기록',
    sourceCitation: '『삼국사기(三國史記)』 권7 신라본기 제7 문무왕 하(下)',
    sourceType: 'PRIMARY_CHRONICLE',
    reliability: 'CERTAIN',
    quoteOrSummary:
      '문무왕 15년(675) 9월 설인귀의 당군과 매소성에서 싸워 이를 크게 깨뜨리고 전마 3만 380필을 노획하였으며, 16년(676) 11월 사찬 시득이 기벌포에서 설인귀 수군을 격파하여 크고 작은 22번의 싸움에서 모두 승리하였다.',
    interpretation:
      '신라가 백제·고구려 유민까지 포섭하여 당나라의 한반도 전체 복속 야욕(안동도호부·웅진도독부)을 군사적으로 물리치고 대동강~원산만 이남의 자주적 통일을 달성한 근거다.',
    alternativeView:
      '만주와 요동 고구려 고토를 상실한 불완전한 통일이라는 비판(신채호 등)과, 이후 대조영의 발해 건국(698)으로 남북국 시대가 열렸다는 시각(유득공 『발해고』)이 공존한다.',
    factors: ['MILITARY', 'DIPLOMATIC', 'POLITICAL'],
  },
  {
    id: 'evd_ea_baekgang_battle_663',
    title: '『일본서기』 및 『삼국사기』 663년 백강(백촌강) 전투와 왜(일본)의 율령국가 전환',
    sourceCitation: '『일본서기(日本書紀)』 권27 덴지 천황 2년(663) 8월 / 『삼국사기』 문무왕 3년',
    sourceType: 'PRIMARY_CHRONICLE',
    reliability: 'CERTAIN',
    quoteOrSummary:
      '백제 부흥군(복신·풍장)을 구원하기 위해 왜(야마토 정권)가 전함 400여 척과 2만 7천 대군을 백강(금강 하구)에 투입했으나, 당 유인궤와 신라 문무왕 연합군에 화공으로 400척이 불타며 궤멸적 참패를 당하였다.',
    interpretation:
      '백제 멸망이 단순한 한반도 내부 사건이 아니라 동아시아 국제전이었고, 이 패배의 충격과 백제 망명 귀족의 유입이 왜가 국호를 "일본(日本)"으로 바꾸고 천황 중심 율령국가로 재편되는 결정적 계기가 되었음을 증명한다.',
    factors: ['MILITARY', 'DIPLOMATIC', 'POLITICAL'],
  },
  {
    id: 'evd_ea_balhae_japan_envoy',
    title: '『속일본기』 728년 발해 무왕 국서 — "고구려의 옛 땅을 수복하고 부여의 유속을 잇다"',
    sourceCitation: '『속일본기(續日本紀)』 권10 신키(神龜) 5년(728) 정월 갑인조',
    sourceType: 'PRIMARY_CHRONICLE',
    reliability: 'CERTAIN',
    quoteOrSummary:
      '발해 무왕(대무예)이 일본 성무 천황에게 보낸 국서에서 "무예가 황폐해진 고구려의 옛 강토를 회복하고 부여의 유속을 이어받았으니(復高麗之舊居 有扶餘之遺俗)..."라고 천명하였다.',
    interpretation:
      '발해가 스스로 고구려(高麗)의 정통 계승국임을 대외에 공식 선포했으며, 당·신라 연합을 견제하기 위해 일본 열도와 북방-해상 외교 축을 형성했음을 보여주는 결정적 1차 사료다.',
    factors: ['DIPLOMATIC', 'IDEOLOGICAL', 'POLITICAL'],
  },
  {
    id: 'evd_ea_jinseong_889_rebellion',
    title: '『삼국사기』 신라본기 진성여왕 3년(889) 조세 파탄 및 원종·애노의 난 폭발',
    sourceCitation: '『삼국사기(三國史記)』 권11 신라본기 제11 진성왕 3년(889)',
    sourceType: 'PRIMARY_CHRONICLE',
    reliability: 'CERTAIN',
    quoteOrSummary:
      '"국내 여러 주군(州郡)에서 공물과 조세를 바치지 않아 나라의 창고가 텅 비고 재정이 궁핍해지자 왕이 사신을 보내 독촉하니, 이로 말미암아 사방에서 도적이 벌떼처럼 일어났다. 사벌주(상주)에서 원종(元宗)과 애노(哀奴)가 반란을 일으켰다."',
    interpretation:
      '왜 통일신라가 후삼국으로 쪼개졌는지를 설명하는 가장 핵심적인 사회·경제적 인과 근거다. 진골 귀족의 대토지 겸병으로 국가 재정이 파탄 나자 농민에게 이중 과세를 독촉했고, 이것이 전국적 민란과 지방 호족(기훤·양길·견훤·궁예)의 독립으로 직결되었다.',
    factors: ['ECONOMIC', 'SOCIAL', 'POLITICAL'],
  },
  {
    id: 'evd_ea_choichiwon_shimu10',
    title: '『삼국사기』 최치원 열전 — 진성여왕에게 올린 시무책(894)과 골품제의 구조적 한계',
    sourceCitation: '『삼국사기(三國史記)』 권46 열전 제6 최치원',
    sourceType: 'PRIMARY_CHRONICLE',
    reliability: 'CERTAIN',
    quoteOrSummary:
      '당 유학파 6두품 최치원이 894년 진성여왕에게 시무 10여 조를 올려 골품제 폐단과 국정 개혁을 건의했으나, 진골 귀족들의 반발로 전혀 시행되지 못하자 관직을 버리고 가야산 해인사로 은둔하였다.',
    interpretation:
      '신라 하대 체제가 내부 자정 능력을 완전히 상실했음을 보여주며, 최치원·최승우(후백제)·최언위(고려) 등 6두품 지식인들이 신라를 등지고 후백제·고려 등 새로운 체제 건설의 브레인으로 이동한 사상적 원인이다.',
    factors: ['SOCIAL', 'POLITICAL', 'IDEOLOGICAL'],
  },
  {
    id: 'evd_ea_samguksagi_gyeonhwon',
    title: '『삼국사기』 견훤 열전 — 무진주 봉기(892)와 완산주 후백제 건국(900) 선언문',
    sourceCitation: '『삼국사기(三國史記)』 권50 열전 제10 견훤(甄萱)',
    sourceType: 'PRIMARY_CHRONICLE',
    reliability: 'CERTAIN',
    quoteOrSummary:
      '견훤이 서기 900년 완산주(전주)에 도읍을 정하고 후백제 왕을 칭하며 이르기를, "옛날 신라가 당에 군사를 청하여 백제를 멸망시켰으니, 내가 이제 완산에 도읍을 세워 의자왕의 숙원(宿憤)을 씻어주지 않을 수 있겠는가!"라고 하였다.',
    interpretation:
      '신라 서남해 방위군 장수였던 견훤이 호남·충청 지역의 옛 백제계 유민들의 반신라 정서와 호족 세력을 결집하기 위해 "백제 부흥"이라는 역사적 명분을 전략적으로 채택했음을 보여준다.',
    factors: ['POLITICAL', 'MILITARY', 'IDEOLOGICAL'],
  },
  {
    id: 'evd_ea_samguksagi_gungye',
    title: '『삼국사기』 궁예 열전 — 후고구려 건국(901) → 마진(904) → 태봉(911)과 관심법 폭정',
    sourceCitation: '『삼국사기(三國史記)』 권50 열전 제10 궁예(弓裔)',
    sourceType: 'PRIMARY_CHRONICLE',
    reliability: 'CERTAIN',
    quoteOrSummary:
      '신라 왕족 출신 승려 궁예가 양길 휘하에서 독립해 송악 왕륭·왕건 부자의 귀부를 받아 901년 후고구려를 세우고, 904년 마진(철원 천도), 911년 태봉으로 국호를 바꾸었다. 말년에 미륵불을 자처하며 관심법으로 강비와 신하들을 참살하니 민심이 떠났다.',
    interpretation:
      '궁예가 왜 국호와 수도를 계속 바꾸었는가? 초기에는 패서(송악·평양) 호족들의 "고구려 부흥" 요구에 의지했으나, 왕권 전제화를 위해 송악 세력을 견제하려 철원으로 천도하고 미륵 신앙(관심법)에 기댔다가 결국 호족 연합에 의해 축출된 정치적 인과를 설명한다.',
    alternativeView:
      '『삼국사기』와 『고려사』가 역성혁명을 정당화하기 위해 궁예 말년의 폭정을 일부 과장했을 가능성이 있으며, 실제로는 광평성 관제 정비와 친평민·반귀족 전제왕권 추구 과정에서 패서 호족과 충돌한 결과라는 현대 사학계의 해석이 있다.',
    factors: ['POLITICAL', 'IDEOLOGICAL', 'SOCIAL'],
  },
  {
    id: 'evd_ea_naju_naval_campaign',
    title: '『고려사』 태조세가 — 903년 왕건의 나주(금성) 수군 원정과 후백제 해상 포위',
    sourceCitation: '『고려사(高麗史)』 권1 태조세가 총서',
    sourceType: 'PRIMARY_CHRONICLE',
    reliability: 'CERTAIN',
    quoteOrSummary:
      '궁예의 명으로 수군을 이끈 왕건이 903년 서남해 해로를 통해 후백제의 남방 거점인 금성(나주) 등 10여 군현을 공취하고, 909년 후백제가 오월(중국)로 보내는 사신선을 나포하였다.',
    interpretation:
      '육상 군사력에서 앞서던 후백제(견훤)가 왜 후고구려/고려에 전략적 주도권을 내주었는지 설명하는 지정학적 분수령이다. 나주 확보로 후백제는 앞뒤(개경·나주)에서 협공당하는 형국이 되었고 대중국 해상 외교로가 차단되었다.',
    factors: ['MILITARY', 'DIPLOMATIC', 'ECONOMIC'],
  },
  {
    id: 'evd_ea_goryeo_revolution_918',
    title: '『고려사』 태조 원년(918) 6월 — 4대 기장(홍유·배현경·신숭겸·복지겸)의 왕건 추대 역성혁명',
    sourceCitation: '『고려사(高麗史)』 권1 태조세가 원년(918) 6월 을묘조',
    sourceType: 'PRIMARY_CHRONICLE',
    reliability: 'CERTAIN',
    quoteOrSummary:
      '기장 홍유·배현경·신숭겸·복지겸이 밤에 왕건의 집을 찾아가 "지금 왕(궁예)이 포학하여 부인과 자식을 죽이고 신하들을 주륙하니 민심이 이미 떠났습니다. 유독 덕으로 정치를 펴는 공께서 왕위에 오르셔야 합니다"라며 추대하니, 국호를 고려(高麗), 연호를 천수(天授)라 하였다.',
    interpretation:
      '태봉이 왜 고려로 교체되었으며 정책이 어떻게 180도 바뀌었는지를 보여준다. 왕건은 궁예의 전제·공포정치와 반신라 강경책을 폐기하고, 호족 연합 정권(혼인 정책), 조세 1/10 감면(취민유도), 친신라 유화책으로 전환하여 통일의 정통성을 확보했다.',
    factors: ['POLITICAL', 'ECONOMIC', 'SOCIAL'],
  },
  {
    id: 'evd_ea_poseokjeong_gongsan',
    title: '『삼국사기』 및 『고려사』 927년 견훤의 경주 급습(경애왕 최후)과 공산(팔공산) 전투',
    sourceCitation: '『삼국사기』 권12 경애왕 4년(927) / 『고려사』 태조 10년(927)',
    sourceType: 'PRIMARY_CHRONICLE',
    reliability: 'CERTAIN',
    quoteOrSummary:
      '927년 11월 견훤이 신라 왕도 경주를 기습하여 포석정에 있던 경애왕을 자결케 하고 김부(경순왕)를 세운 뒤 노략질하고 돌아갔다. 구원하러 출동한 왕건의 고려군 5천을 대구 공산(팔공산)에서 포위 격파하니, 신숭겸과 김락이 왕건의 갑옷을 바꿔 입고 전사하여 왕건이 겨우 탈출하였다.',
    interpretation:
      '후백제의 군사력이 최고조에 달했던 사건이지만, 역설적으로 견훤의 경주 약탈과 경애왕 살해는 신라 귀족과 백성들이 후백제에 치를 떨고 고려 왕건을 "구원자"로 여겨 8년 뒤 고려에 자진 귀부하게 만든 결정적 정치적 패착이었다.',
    factors: ['MILITARY', 'POLITICAL', 'DIPLOMATIC'],
  },
  {
    id: 'evd_ea_gochang_battle_930',
    title: '『고려사』 태조 13년(930) 고창(안동) 병산 전투 대승과 후삼국 판도 역전',
    sourceCitation: '『고려사(高麗史)』 권1 태조세가 13년(930) 정월조',
    sourceType: 'PRIMARY_CHRONICLE',
    reliability: 'CERTAIN',
    quoteOrSummary:
      '고창군(안동) 병산에서 고려 태조 왕건이 현지 호족 김선평·권행·장길(삼태사)의 지원을 받아 견훤의 후백제군과 격돌하여 8천여 급을 참획하는 대승을 거두니, 영남과 동해안의 30여 성이 일제히 고려에 항복하였다.',
    interpretation:
      '공산 전투(927) 패배 이후 열세에 몰렸던 고려가 지방 호족들의 자발적 지지와 협력을 이끌어내어 후삼국 통일 전쟁의 군사적·지정학적 주도권을 완전히 역전시킨 분수령이다.',
    factors: ['MILITARY', 'POLITICAL', 'SOCIAL'],
  },
  {
    id: 'evd_ea_balhae_fall_refugees',
    title: '『고려사』 태조 17년(934) 발해 세자 대광현의 수만 유민 인솔 귀부와 왕건의 동족 예우',
    sourceCitation: '『고려사(高麗史)』 권2 태조세가 17년(934) 7월조',
    sourceType: 'PRIMARY_CHRONICLE',
    reliability: 'CERTAIN',
    quoteOrSummary:
      '926년 거란에 발해가 멸망한 후, 934년 7월 발해국 세자 대광현(大光顯)이 무리 수만 명을 거느리고 고려에 망명해 오자, 태조 왕건이 왕씨 성(왕계 王繼)을 하사하고 종적(왕실 족보)에 올렸으며 백관의 위에 두어 발해 제사를 잇게 하였다.',
    interpretation:
      '남북국 시대의 북국(발해)이 멸망한 뒤 그 지배층과 유민 다수가 고려로 흡수되었음을 증명한다. 고려 태조 왕건은 발해를 "친척의 나라"로 규정하고 유민을 적극 수용함으로써 고구려·발해 계승 정통성과 북방 국방력을 동시에 확보했다.',
    factors: ['DIPLOMATIC', 'SOCIAL', 'POLITICAL'],
  },
  {
    id: 'evd_ea_silla_surrender_935',
    title: '『삼국사기』 신라본기 경순왕 9년(935) 신라의 평화적 고려 귀부(遜國)',
    sourceCitation: '『삼국사기(三國史記)』 권12 신라본기 제12 경순왕 9년(935) 10~11월',
    sourceType: 'PRIMARY_CHRONICLE',
    reliability: 'CERTAIN',
    quoteOrSummary:
      '경순왕이 국세가 미약하여 스스로 보전할 수 없음을 알고 군신들과 고려에 귀부하기를 논의할 때 태자(마의태자)는 통곡하며 반대했으나, 왕이 "무고한 백성들을 차마 죽게 할 수 없다"며 시랑 김봉휴를 보내 항복을 청하고 경주에서 개경으로 입조하니 왕건이 맏딸 낙랑공주와 혼인시키고 경주의 사심관으로 삼았다.',
    interpretation:
      '천년 왕국 신라가 피를 흘리지 않고 고려에 평화적으로 통합된 역사적 사건이다. 왕건의 오랜 친신라 유화책과 신라 지배층에 대한 특권 보장(사심관 제도, 왕실 혼인)이 결합되어 고려가 신라의 문화적·정치적 유산을 온전히 흡수하게 되었다.',
    factors: ['POLITICAL', 'DIPLOMATIC', 'SOCIAL'],
  },
  {
    id: 'evd_ea_geumsansa_illicheon',
    title: '『삼국사기』 및 『고려사』 935년 후백제 금산사 정변(견훤의 고려 귀순)과 936년 일리천 최후 결전',
    sourceCitation: '『삼국사기』 권50 견훤전 / 『고려사』 태조 18~19년(935~936)',
    sourceType: 'PRIMARY_CHRONICLE',
    reliability: 'CERTAIN',
    quoteOrSummary:
      '935년 3월 후백제 장남 신검이 동생 금강에게 왕위를 물려주려던 아버지 견훤을 금산사에 유폐하고 금강을 죽인 뒤 스스로 왕위에 올랐다. 6월 견훤이 나주를 거쳐 고려로 탈출하자 왕건이 상부(尙父)로 극진히 대우하였고, 936년 9월 견훤이 직접 선봉에 서서 선산 일리천 전투에서 신검의 후백제군을 격파하여 후삼국을 통일하였다.',
    interpretation:
      '후백제가 왜 고려에 멸망했는가에 대한 결정적 인과다. 강력한 카리스마에 의존하던 견훤 정권이 후계 구도 실패와 호족 파벌 갈등(전주·능환계 vs 나주·신검계 등)으로 내전을 일으켰고, 창업주 견훤 자신이 적국 고려의 선봉에 서면서 후백제군의 사기와 명분이 완전히 붕괴되었다.',
    factors: ['POLITICAL', 'MILITARY', 'SOCIAL'],
  },
  {
    id: 'evd_ea_goryeo_manbugyo',
    title: '『고려사』 태조 25년(942) 거란 낙타 50필 아사(만부교 사건)와 대거란 강경 노선',
    sourceCitation: '『고려사(高麗史)』 권2 태조세가 25년(942) 10월조',
    sourceType: 'PRIMARY_CHRONICLE',
    reliability: 'CERTAIN',
    quoteOrSummary:
      '거란이 사신 30명과 낙타 50필을 보내 화친을 청하자, 태조 왕건이 "거란은 일찍이 발해와 화목하게 지내다가 하루아침에 맹약을 배반하고 발해를 멸망시켰으니 심히 무도한 나라다"라며 사신들을 섬으로 유배 보내고 낙타는 만부교 아래 매어 굶어 죽게 하였다.',
    interpretation:
      '후삼국 통일 직후 고려가 만주의 거란(요)을 어떻게 인식했는지 보여주는 상징적 사건으로, 발해 멸망을 동족 국가의 비극으로 간주하고 강력한 북진 정책을 추진한 외교적 근거다.',
    factors: ['DIPLOMATIC', 'IDEOLOGICAL', 'MILITARY'],
  },
  {
    id: 'evd_ea_hunyo_10_articles',
    title: '『고려사』 태조 26년(943) 『훈요 10조(訓要十條)』 — 통일 왕조의 국가 운영 철학',
    sourceCitation: '『고려사(高麗史)』 권2 태조세가 26년(943) 4월조',
    sourceType: 'PRIMARY_CHRONICLE',
    reliability: 'PROBABLE',
    quoteOrSummary:
      '태조 왕건이 박술희에게 전한 『훈요 10조』에서 불교 숭상(제1조), 거란 풍속 배척(제4조), 서경(평양) 중시 및 북진 의지(제5조), 백성 조세·요역 경감(제7조), 차현 이남 공주강 외곽(옛 후백제 지역) 등용 경계(제8조) 등을 유훈으로 남겼다.',
    interpretation:
      '후삼국 통일 직후 고려의 사상적·지정학적 지향점(불교·풍수지리·고구려 계승 서경 중시·반거란)과 끝까지 저항했던 후백제 지역에 대한 정치적 경계심을 압축적으로 보여준다.',
    alternativeView:
      '일부 학자(이마니시 류 등)에 의해 후대(현종 대 거란 침입 이후) 위작설 또는 가필설이 제기된 바 있으나, 한국 사학계 다수는 태조 대의 원형이 전승된 것으로 본다.',
    factors: ['IDEOLOGICAL', 'POLITICAL', 'DIPLOMATIC'],
  },
  {
    id: 'evd_ea_heian_diplomacy_refusal',
    title: '『부상략기』 및 『본조문수』 후백제(922, 929)·고려(937)의 대일본 통교 요청과 헤이안 조정의 거절',
    sourceCitation: '『부상략기(扶桑略記)』 엔초 7년(929) / 『본조문수(本朝文粹)』 조헤이 7년(937)',
    sourceType: 'PRIMARY_CHRONICLE',
    reliability: 'CERTAIN',
    quoteOrSummary:
      '922년과 929년 후백제 견훤이 쓰시마를 통해 일본 헤이안 조정에 사절을 보내 과거 백제-왜의 우호를 들어 통교를 요청했고, 937년에는 통일을 이룬 고려 태조 왕건이 사절을 파견했으나, 헤이안 조정은 신라구(해적) 경계와 대외 고립주의를 이유로 공식 국교를 모두 거절하였다.',
    interpretation:
      '후삼국 시대 한반도 국가들이 왜(일본)를 외교·군사적 우군으로 끌어들이려 치열한 외교전을 벌였으나, 당 멸망(907)과 견당사 폐지(894) 이후 대외 소극책으로 돌아선 헤이안 일본이 한반도 정세 불개입 노선을 택했음을 보여준다.',
    factors: ['DIPLOMATIC', 'ECONOMIC'],
  },
];

export const eastAsiaEvents: HistoricalEvent[] = [
  {
    id: 'evt_ea_gaya_annexation_562',
    title: '신라 진흥왕의 대가야 병합 (가야 연맹 완전 소멸)',
    time: createAstroTime(562, { month: 9 }),
    importance: 2,
    entityIds: ['ent_ea_gaya', 'ent_ea_silla'],
    relatedTransitionId: 'trn_ea_gaya_to_silla',
    locationOrContext: '고령 (대가야)',
    summary: '신라 진흥왕이 이사부와 사다함을 보내 대가야를 정벌함으로써 낙동강 유역 가야 연맹이 신라에 완전히 흡수되고 신라의 삼국통일 경제·군사 기반이 마련됨.',
    factors: ['MILITARY', 'POLITICAL'],
    evidenceIds: ['evd_ea_samguksagi_silla_unification'],
  },
  {
    id: 'evt_ea_baekje_fall_baekgang_663',
    title: '백제 멸망(660) 및 동아시아 국제전 백강 전투(663)',
    time: createAstroTime(663, { month: 8 }),
    importance: 3,
    entityIds: ['ent_ea_baekje', 'ent_ea_silla', 'ent_ea_yamato_asuka'],
    relatedTransitionId: 'trn_ea_baekje_to_silla_japan',
    locationOrContext: '사비성 및 백강 (금강 하구)',
    summary: '660년 나당연합군에 의해 백제가 멸망한 뒤, 백제 부흥군을 구원하려 출병한 왜(야마토) 수군 400척이 백강 전투에서 전멸하며 백제 부흥 운동이 종결되고 일본은 율령국가 체제로 급변함.',
    factors: ['MILITARY', 'DIPLOMATIC'],
    evidenceIds: ['evd_ea_baekgang_battle_663', 'evd_ea_samguksagi_silla_unification'],
  },
  {
    id: 'evt_ea_goguryeo_fall_nadang_676',
    title: '고구려 멸망(668)과 매소성·기벌포 나당전쟁 승리(676)',
    time: createAstroTime(676, { month: 11 }),
    importance: 3,
    entityIds: ['ent_ea_goguryeo', 'ent_ea_silla'],
    relatedTransitionId: 'trn_ea_three_kingdoms_unification',
    locationOrContext: '평양성 · 매소성(연천) · 기벌포(금강 하구)',
    summary: '668년 연개소문 아들들의 내분 속에 고구려가 멸망한 뒤, 한반도 전체를 지배하려던 당나라 군대를 신라 문무왕이 고구려·백제 유민과 연합해 매소성(675)·기벌포(676)에서 격파하고 삼국통일을 완수함.',
    factors: ['MILITARY', 'DIPLOMATIC', 'POLITICAL'],
    evidenceIds: ['evd_ea_samguksagi_goguryeo', 'evd_ea_samguksagi_silla_unification'],
  },
  {
    id: 'evt_ea_balhae_founding_698',
    title: '대조영의 천문령 대승과 발해(진국) 건국 — 남북국 시대 개막',
    time: createAstroTime(698),
    importance: 3,
    entityIds: ['ent_ea_balhae', 'ent_ea_goguryeo', 'ent_ea_silla'],
    relatedTransitionId: 'trn_ea_goguryeo_to_balhae',
    locationOrContext: '천문령 및 만주 동모산',
    summary: '당의 영주(조양)에 강제 이주되었던 고구려 유민과 말갈족을 이끈 대조영이 천문령에서 당 추격군을 궤멸시키고 만주 동모산에 진국(발해)을 세워 고구려 계승 남북국 시대를 엶.',
    factors: ['MILITARY', 'POLITICAL', 'IDEOLOGICAL'],
    evidenceIds: ['evd_ea_balhae_japan_envoy'],
  },
  {
    id: 'evt_ea_jinseong_889_uprising',
    title: '진성여왕 조세 독촉 파탄과 원종·애노의 난(889) — 후삼국 분열의 도화선',
    time: createAstroTime(889),
    importance: 3,
    entityIds: ['ent_ea_silla'],
    relatedTransitionId: 'trn_ea_silla_split_hubaekje',
    locationOrContext: '사벌주(상주) 및 신라 전역',
    summary: '진골 귀족의 대토지 독점과 왕위 쟁탈전으로 국가 재정이 고갈되자 진성여왕이 주군에 조세를 강제 독촉했고, 이에 분노한 농민들이 상주 원종·애노의 난을 시작으로 전국에서 봉기하며 중앙 통제력이 완전히 붕괴됨.',
    factors: ['ECONOMIC', 'SOCIAL', 'POLITICAL'],
    evidenceIds: ['evd_ea_jinseong_889_rebellion', 'evd_ea_choichiwon_shimu10'],
  },
  {
    id: 'evt_ea_hubaekje_proclamation_900',
    title: '견훤의 무진주 봉기(892) 및 완산주(전주) 후백제 정식 건국(900)',
    time: createAstroTime(900),
    importance: 3,
    entityIds: ['ent_ea_silla', 'ent_ea_hubaekje'],
    relatedTransitionId: 'trn_ea_silla_split_hubaekje',
    locationOrContext: '무진주(광주) → 완산주(전주)',
    summary: '신라 서남해 방위군 비장 견훤이 892년 무진주를 점령한 데 이어 900년 전주에 입성해 "백제 의자왕의 숙원을 씻겠다"며 후백제 왕을 칭하고 관제를 정비함.',
    factors: ['POLITICAL', 'MILITARY', 'IDEOLOGICAL'],
    evidenceIds: ['evd_ea_samguksagi_gyeonhwon'],
  },
  {
    id: 'evt_ea_hugoguryeo_naju_901_903',
    title: '궁예의 후고구려 건국(901) 및 왕건의 나주 해상 기습 점령(903)',
    time: createAstroTime(901),
    importance: 3,
    entityIds: ['ent_ea_silla', 'ent_ea_taebong', 'ent_ea_hubaekje'],
    relatedTransitionId: 'trn_ea_silla_split_taebong',
    locationOrContext: '송악(개성) · 철원 · 나주(금성)',
    summary: '송악 호족 왕륭·왕건 부자의 결합으로 중부권을 장악한 궁예가 901년 후고구려를 건국하고, 903년 왕건의 수군으로 후백제 턱밑인 나주를 점령해 후백제를 남북에서 포위함.',
    factors: ['POLITICAL', 'MILITARY'],
    evidenceIds: ['evd_ea_samguksagi_gungye', 'evd_ea_naju_naval_campaign'],
  },
  {
    id: 'evt_ea_goryeo_founding_918',
    title: '왕건의 역성혁명과 고려(高麗) 건국(918년 6월) 및 개경 천도(919)',
    time: createAstroTime(918, { month: 6 }),
    importance: 3,
    entityIds: ['ent_ea_taebong', 'ent_ea_goryeo'],
    relatedTransitionId: 'trn_ea_taebong_to_goryeo',
    locationOrContext: '철원 → 개경(송악)',
    summary: '궁예의 미륵 관심법 공포정치와 무리한 수취에 반발한 홍유·배현경·신숭겸·복지겸 등 무장들과 패서 호족들이 시중 왕건을 추대하여 고려를 건국하고 친신라·호족 포용 노선으로 대전환함.',
    factors: ['POLITICAL', 'SOCIAL', 'ECONOMIC'],
    evidenceIds: ['evd_ea_goryeo_revolution_918'],
  },
  {
    id: 'evt_ea_balhae_fall_926',
    title: '거란(요)의 발해 멸망(926) 및 세자 대광현 등 발해 유민 수만 명 고려 귀부(934)',
    time: createAstroTime(926, { month: 1 }),
    importance: 3,
    entityIds: ['ent_ea_balhae', 'ent_ea_khitan_liao', 'ent_ea_goryeo'],
    relatedTransitionId: 'trn_ea_balhae_to_goryeo',
    locationOrContext: '상경 홀한성 → 고려 개경',
    summary: '야율아보기의 거란군이 발해 상경 홀한성을 함락시켜 발해가 멸망하자, 세자 대광현을 비롯한 발해 지배층과 유민 수만 명이 동족 국가 고려로 대거 망명하고 왕건은 대광현에게 왕씨 성을 하사하며 적극 수용함.',
    factors: ['MILITARY', 'DIPLOMATIC', 'SOCIAL'],
    evidenceIds: ['evd_ea_balhae_fall_refugees', 'evd_ea_goryeo_manbugyo'],
  },
  {
    id: 'evt_ea_gongsan_battle_927',
    title: '견훤의 경주 포석정 습격 및 대구 공산(팔공산) 전투 대승(927)',
    time: createAstroTime(927, { month: 11 }),
    importance: 3,
    entityIds: ['ent_ea_hubaekje', 'ent_ea_silla', 'ent_ea_goryeo'],
    locationOrContext: '경주 포석정 · 대구 공산(팔공산)',
    summary: '견훤이 신라 수도 경주를 급습해 경애왕을 자결케 하고, 구원군으로 온 왕건의 고려 정예 기병 5천을 팔공산에서 포위 섬멸함. 신숭겸이 왕건 대신 전사하여 왕건이 구사일생으로 탈출했으나, 신라 민심은 후백제에 완전히 등을 돌림.',
    factors: ['MILITARY', 'POLITICAL'],
    evidenceIds: ['evd_ea_poseokjeong_gongsan'],
  },
  {
    id: 'evt_ea_gochang_battle_930',
    title: '고창(안동) 병산 전투 — 고려의 대승과 후삼국 판도 완전 역전(930)',
    time: createAstroTime(930, { month: 1 }),
    importance: 3,
    entityIds: ['ent_ea_goryeo', 'ent_ea_hubaekje', 'ent_ea_silla'],
    locationOrContext: '고창군 병산 (안동)',
    summary: '안동 지역 호족(삼태사: 김선평·권행·장길)과 결합한 왕건의 고려군이 견훤의 후백제 주력군을 격파(8천 급 참획)하며 영남·동해안 30여 성이 고려에 귀순하고 통일 주도권이 고려로 넘어감.',
    factors: ['MILITARY', 'POLITICAL', 'SOCIAL'],
    evidenceIds: ['evd_ea_gochang_battle_930'],
  },
  {
    id: 'evt_ea_silla_peaceful_surrender_935',
    title: '신라 경순왕의 고려 자진 귀부(935년 11월) — 천년 신라의 평화적 통합',
    time: createAstroTime(935, { month: 11 }),
    importance: 3,
    entityIds: ['ent_ea_silla', 'ent_ea_goryeo'],
    relatedTransitionId: 'trn_ea_silla_to_goryeo',
    locationOrContext: '경주 → 개경',
    summary: '신라 마지막 왕 경순왕(김부)이 마의태자의 반대를 무릅쓰고 백성의 희생을 막기 위해 고려에 나라를 바치자, 왕건이 맏딸 낙랑공주와 혼인시키고 경주 사심관으로 임명하며 신라 세력을 평화롭게 흡수함.',
    factors: ['POLITICAL', 'DIPLOMATIC', 'SOCIAL'],
    evidenceIds: ['evd_ea_silla_surrender_935'],
  },
  {
    id: 'evt_ea_geumsansa_illicheon_936',
    title: '후백제 금산사 정변(견훤의 고려 투항 935) 및 일리천 전투 후삼국 최종 통일(936)',
    time: createAstroTime(936, { month: 9 }),
    importance: 3,
    entityIds: ['ent_ea_hubaekje', 'ent_ea_goryeo'],
    relatedTransitionId: 'trn_ea_hubaekje_to_goryeo',
    locationOrContext: '김제 금산사 → 선산 일리천(구미) → 황산(논산)',
    summary: '후백제 장남 신검이 왕위 계승 불만으로 아버지 견훤을 금산사에 유폐하자, 탈출한 견훤이 고려 왕건에게 귀순함. 936년 9월 왕건과 견훤이 이끈 8만 7천 대군이 일리천 전투에서 신검의 후백제군을 격파하고 황산에서 항복을 받아 후삼국 통일을 완성함.',
    factors: ['POLITICAL', 'MILITARY'],
    evidenceIds: ['evd_ea_geumsansa_illicheon'],
  },
];
