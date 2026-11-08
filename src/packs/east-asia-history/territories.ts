/**
 * @file territories.ts
 * @description Time-bounded territorial extents in geographic coordinates [lon, lat]
 * for East Asia History (Manchuria South, Korean Peninsula, Japan Northwest).
 *
 * Territories are clipped strictly by the Natural Earth land mask at render time,
 * allowing convex envelopes to produce razor-sharp coastline-accurate fills.
 */

import type { TerritoryShape } from '../../contracts/timeline.contract';

export const eastAsiaTerritories: TerritoryShape[] = [
  // ==========================================
  // 1. GOGURYEO (400 - 668)
  // Manchuria, Liaodong, and Northern/Central Korea down to Han River / Jungwon
  // ==========================================
  {
    id: 'ter_ea_goguryeo_peak',
    entityId: 'ent_ea_goguryeo',
    startYear: 400,
    endYear: 668,
    level: 'DOMINANT',
    rings: [
      [
        [120.0, 43.5],
        [132.0, 43.5],
        [131.0, 39.0],
        [128.5, 37.0], // Han River / Jungwon Goguryeo monument
        [126.0, 37.2],
        [124.5, 39.5],
        [120.0, 40.5],
      ],
    ],
    labelCoord: { x: 125.8, y: 40.8 },
  },

  // ==========================================
  // 2. BAEKJE (400 - 660)
  // Han River basin (pre-475) -> Ungjin/Sabi, Chungcheong, Jeolla
  // ==========================================
  {
    id: 'ter_ea_baekje',
    entityId: 'ent_ea_baekje',
    startYear: 400,
    endYear: 660,
    level: 'DOMINANT',
    rings: [
      [
        [125.5, 37.5],
        [127.8, 37.0],
        [127.8, 35.0],
        [126.0, 34.3],
        [125.5, 36.0],
      ],
    ],
    labelCoord: { x: 126.8, y: 35.8 },
  },

  // ==========================================
  // 3. GAYA CONFEDERACY (400 - 562)
  // Nakdong River basin (Gimhae, Goryeong)
  // ==========================================
  {
    id: 'ter_ea_gaya',
    entityId: 'ent_ea_gaya',
    startYear: 400,
    endYear: 562,
    level: 'DOMINANT',
    rings: [
      [
        [127.8, 35.8],
        [128.8, 35.8],
        [129.0, 35.0],
        [127.9, 34.9],
      ],
    ],
    labelCoord: { x: 128.4, y: 35.4 },
  },

  // ==========================================
  // 4. SILLA (Three Kingdoms ~ Unified Silla ~ Late Silla)
  // ==========================================
  // 4-1. Early Silla (400 - 675): Southeast Korea, expanding to Han River (553)
  {
    id: 'ter_ea_silla_early',
    entityId: 'ent_ea_silla',
    startYear: 400,
    endYear: 675,
    level: 'DOMINANT',
    rings: [
      [
        [127.8, 37.8],
        [129.5, 37.8],
        [129.8, 35.3],
        [128.8, 34.9],
        [127.8, 35.8],
      ],
    ],
    labelCoord: { x: 128.9, y: 36.2 },
  },

  // 4-2. Unified Silla Peak (676 - 888):
  // Entire Korean Peninsula south of Daedong River & Wonsan Bay
  {
    id: 'ter_ea_silla_unified',
    entityId: 'ent_ea_silla',
    startYear: 676,
    endYear: 888,
    level: 'DOMINANT',
    rings: [
      [
        [125.0, 39.2], // Daedong River mouth
        [127.8, 39.3], // Wonsan Bay
        [129.6, 36.0],
        [129.0, 34.8],
        [126.0, 34.2],
        [125.5, 37.5],
      ],
    ],
    labelCoord: { x: 127.8, y: 36.8 },
  },

  // 4-3. Late Silla Crisis / Splintering (889 - 900):
  // Retreating to Gyeongsang & Eastern Gangwon as Gyeon Hwon & Gung Ye rise
  {
    id: 'ter_ea_silla_declining',
    entityId: 'ent_ea_silla',
    startYear: 889,
    endYear: 900,
    level: 'DOMINANT',
    rings: [
      [
        [127.6, 37.2],
        [129.4, 37.5],
        [129.6, 35.4],
        [128.6, 34.8],
        [127.8, 35.5],
      ],
    ],
    labelCoord: { x: 128.8, y: 36.1 },
  },

  // 4-4. Late Silla Core (901 - 935):
  // Confined to Gyeongju, Yeongnam basin until peaceful surrender to Goryeo
  {
    id: 'ter_ea_silla_rump',
    entityId: 'ent_ea_silla',
    startYear: 901,
    endYear: 935,
    level: 'DOMINANT',
    rings: [
      [
        [128.2, 36.3],
        [129.5, 36.3],
        [129.6, 35.3],
        [128.8, 35.0],
        [128.2, 35.5],
      ],
    ],
    labelCoord: { x: 129.1, y: 35.8 },
  },

  // ==========================================
  // 5. BALHAE (698 - 926)
  // Southern Manchuria, Dongmosan, Primorsky, and Northern Korea down to Daedong River
  // ==========================================
  {
    id: 'ter_ea_balhae',
    entityId: 'ent_ea_balhae',
    startYear: 698,
    endYear: 926,
    level: 'DOMINANT',
    rings: [
      [
        [120.0, 43.5],
        [133.0, 43.5],
        [132.0, 39.3], // Wonsan Bay border with Silla
        [125.0, 39.2], // Daedong River border with Silla
        [124.0, 40.0],
        [120.0, 41.0],
      ],
    ],
    labelCoord: { x: 127.5, y: 41.8 },
  },

  // ==========================================
  // 6. KHITAN LIAO (907 - 1000)
  // Northern Manchuria & Liaodong, annexing Balhae in 926
  // ==========================================
  {
    id: 'ter_ea_khitan_liao_early',
    entityId: 'ent_ea_khitan_liao',
    startYear: 907,
    endYear: 925,
    level: 'DOMINANT',
    rings: [
      [
        [120.0, 43.5],
        [125.0, 43.5],
        [123.5, 41.0],
        [120.0, 41.5],
      ],
    ],
    labelCoord: { x: 122.0, y: 42.5 },
  },
  {
    id: 'ter_ea_khitan_liao_post_balhae',
    entityId: 'ent_ea_khitan_liao',
    startYear: 926,
    endYear: 1000,
    level: 'DOMINANT',
    rings: [
      [
        [120.0, 43.5],
        [133.0, 43.5],
        [131.5, 40.0],
        [126.0, 40.2],
        [124.0, 40.0],
        [120.0, 41.0],
      ],
    ],
    labelCoord: { x: 126.0, y: 42.2 },
  },

  // ==========================================
  // 7. LATER BAEKJE (892 - 936)
  // Founded by Gyeon Hwon: Jeolla, Chungcheong, contested Gyeongsang border
  // ==========================================
  {
    id: 'ter_ea_hubaekje_main',
    entityId: 'ent_ea_hubaekje',
    startYear: 892,
    endYear: 936,
    level: 'DOMINANT',
    rings: [
      [
        [125.5, 37.0],
        [128.0, 36.5],
        [128.3, 35.4],
        [127.7, 34.4],
        [125.8, 34.2],
      ],
    ],
    labelCoord: { x: 127.0, y: 35.6 },
  },

  // ==========================================
  // 8. TAEBONG / HUGOGURYEO / MAJIN (898 - 918)
  // Gung Ye: Songak -> Cheorwon, Hwanghae/Paeseo, Han River, Gangwon, Pyeongyang
  // ==========================================
  {
    id: 'ter_ea_taebong_main',
    entityId: 'ent_ea_taebong',
    startYear: 898,
    endYear: 918,
    level: 'DOMINANT',
    rings: [
      [
        [124.8, 39.3],
        [128.5, 39.3],
        [129.2, 37.5],
        [127.6, 36.8],
        [125.6, 37.2],
        [124.8, 38.3],
      ],
    ],
    labelCoord: { x: 127.2, y: 38.2 },
  },

  // ==========================================
  // 9. GORYEO (918 - 1000)
  // 9-1. Goryeo Early Phase (918 - 935):
  // Inherits Taebong (Central/North) + Naju Enclave in Later Baekje's rear
  // ==========================================
  {
    id: 'ter_ea_goryeo_central',
    entityId: 'ent_ea_goryeo',
    startYear: 918,
    endYear: 935,
    level: 'DOMINANT',
    rings: [
      [
        [124.8, 39.3],
        [128.5, 39.3],
        [129.2, 37.3],
        [127.8, 36.7],
        [125.6, 37.1],
        [124.8, 38.3],
      ],
    ],
    labelCoord: { x: 126.7, y: 38.2 },
  },
  // Naju Enclave: naval base established by Wang Geon in 903, held through 936!
  {
    id: 'ter_ea_goryeo_naju_enclave',
    entityId: 'ent_ea_goryeo',
    startYear: 918,
    endYear: 935,
    level: 'DOMINANT',
    layer: 2, // Drawn on top of regional layer
    rings: [
      [
        [126.4, 35.2],
        [126.9, 35.2],
        [126.8, 34.8],
        [126.3, 34.8],
      ],
    ],
    labelCoord: { x: 126.6, y: 35.0 },
  },

  // 9-2. Goryeo Post-Silla Surrender (935):
  // Silla peacefully surrenders; Goryeo absorbs Gyeongsang
  {
    id: 'ter_ea_goryeo_with_silla',
    entityId: 'ent_ea_goryeo',
    startYear: 935,
    endYear: 935,
    level: 'DOMINANT',
    rings: [
      [
        [124.8, 39.3],
        [128.5, 39.3],
        [129.6, 36.5],
        [129.5, 35.2],
        [128.2, 35.2],
        [127.8, 36.7],
        [125.6, 37.1],
        [124.8, 38.3],
      ],
    ],
    labelCoord: { x: 127.5, y: 37.6 },
  },

  // 9-3. Unified Goryeo (936 - 1000):
  // Later Baekje destroyed at Ilicheon; Entire Korean Peninsula unified + Northern expansion
  {
    id: 'ter_ea_goryeo_unified',
    entityId: 'ent_ea_goryeo',
    startYear: 936,
    endYear: 1000,
    level: 'DOMINANT',
    rings: [
      [
        [124.5, 40.2], // Northern frontier (Chongchon River / Amnok border)
        [128.8, 40.0],
        [129.6, 36.5],
        [129.2, 34.8],
        [126.0, 34.2],
        [125.5, 37.2],
        [124.5, 39.0],
      ],
    ],
    labelCoord: { x: 127.2, y: 37.2 },
  },

  // ==========================================
  // 10. TAMNA / JEJU (400 - 1000)
  // Island maritime autonomy
  // ==========================================
  {
    id: 'ter_ea_tamna',
    entityId: 'ent_ea_tamna',
    startYear: 400,
    endYear: 1000,
    level: 'DOMINANT',
    rings: [
      [
        [126.1, 33.6],
        [127.0, 33.6],
        [127.0, 33.1],
        [126.1, 33.1],
      ],
    ],
    labelCoord: { x: 126.55, y: 33.35 },
  },

  // ==========================================
  // 11. JAPAN (Yamato / Nara / Heian) (400 - 1000)
  // Kyushu and Northwest Honshu within visible bounds
  // ==========================================
  {
    id: 'ter_ea_japan_asuka',
    entityId: 'ent_ea_yamato_asuka',
    startYear: 400,
    endYear: 710,
    level: 'DOMINANT',
    rings: [
      [
        [129.2, 34.5], // Tsushima
        [133.0, 35.5],
        [133.0, 32.5],
        [129.5, 32.5],
        [129.0, 33.8],
      ],
    ],
    labelCoord: { x: 130.8, y: 33.6 },
  },
  {
    id: 'ter_ea_japan_nara',
    entityId: 'ent_ea_nara_japan',
    startYear: 710,
    endYear: 794,
    level: 'DOMINANT',
    rings: [
      [
        [129.2, 34.5],
        [133.0, 35.5],
        [133.0, 32.5],
        [129.5, 32.5],
        [129.0, 33.8],
      ],
    ],
    labelCoord: { x: 130.8, y: 33.6 },
  },
  {
    id: 'ter_ea_japan_heian',
    entityId: 'ent_ea_heian_japan',
    startYear: 794,
    endYear: 1000,
    level: 'DOMINANT',
    rings: [
      [
        [129.2, 34.5],
        [133.0, 35.5],
        [133.0, 32.5],
        [129.5, 32.5],
        [129.0, 33.8],
      ],
    ],
    labelCoord: { x: 130.8, y: 33.6 },
  },
];
