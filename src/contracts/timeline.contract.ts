/**
 * @file timeline.contract.ts
 * @description Strict ontology and data schema contracts for the Universal Timeline & Causal Knowledge Graph Framework.
 * Every DomainPack MUST conform 100% to these interfaces and pass the 12-point validator.
 */

export type TimePrecision = 'YEAR' | 'MONTH' | 'DAY' | 'DECADE' | 'CENTURY' | 'APPROXIMATE';

export interface AstroTime {
  /** Astronomical year number (e.g., 918 for 918 CE, -108 for 108 BCE) */
  year: number;
  /** Optional month (1 - 12) */
  month?: number;
  /** Optional day (1 - 31) */
  day?: number;
  /** Temporal precision indicator */
  precision: TimePrecision;
  /** Human-readable label for display */
  displayLabel: string;
  /** Normalized integer key for O(log N) binary search: year * 10000 + month * 100 + day */
  sortKey: number;
}

export type FactorTag =
  | 'POLITICAL'
  | 'MILITARY'
  | 'ECONOMIC'
  | 'DIPLOMATIC'
  | 'SOCIAL'
  | 'IDEOLOGICAL';

export type TransitionType =
  | 'FOUNDATION'
  | 'SPLIT'
  | 'MERGE'
  | 'REGIME_CHANGE'
  | 'INFLUENCE';

export type ReliabilityGrade = 'CERTAIN' | 'PROBABLE' | 'DEBATED';

export type SourceType =
  | 'PRIMARY_CHRONICLE'
  | 'ARCHAEOLOGICAL'
  | 'MODERN_CONSENSUS'
  | 'HYPOTHESIS'
  | 'PAPER';

export interface Axis {
  /** Format: axis_<packCode>_<slug> */
  id: string;
  /** Track title */
  name: string;
  /** Track subtitle or geographical/disciplinary scope */
  description: string;
  /** Vertical display order (0-indexed from top to bottom) */
  order: number;
  /** Theme accent color (HEX) */
  accentColor: string;
}

export interface Entity {
  /** Format: ent_<packCode>_<slug> */
  id: string;
  /** Primary display name */
  name: string;
  /** Original script or secondary name (e.g., Hanja or Latin name) */
  nativeName?: string;
  /** Primary track ID (references Axis.id) */
  axisId: string;
  /** Optional secondary track IDs for multi-region empires or interdisciplinary theories */
  secondaryAxisIds?: string[];
  /** Entity classification (e.g., 'STATE', 'DYNASTY', 'CONFEDERATION', 'THEORY', 'PARADIGM') */
  category: string;
  /** Lifespan start time */
  startTime: AstroTime;
  /** Lifespan end time */
  endTime: AstroTime;
  /** Primary visual color (HEX) */
  color: string;
  /** One-line core summary */
  summary: string;
  /** Search and categorization tags */
  tags: string[];
  /** Relative vertical offset within the same Axis lane (-1.0 to 1.0) to prevent overlap */
  laneOffset?: number;
}

export interface StateSegment {
  /** Format: seg_<packCode>_<entitySlug>_<phaseSlug> */
  id: string;
  /** Parent entity ID (references Entity.id) */
  entityId: string;
  /** Phase title */
  phaseTitle: string;
  /** Official state or theory name during this specific period */
  officialName: string;
  /** Segment start time */
  startTime: AstroTime;
  /** Segment end time */
  endTime: AstroTime;
  /** Capital city, institutional center, or core locus */
  capitalOrCenter?: string;
  /** Key historical or scientific figures active in this segment */
  keyFigures: string[];
  /** Relative power, territory, or paradigm dominance weight (1 to 100) for Sankey stream thickness */
  powerWeight: number;
  /** Detailed description of internal conditions during this phase */
  stateDescription: string;
  /** Supporting evidence IDs (references Evidence.id) */
  evidenceIds: string[];
}

export interface CausalPoint {
  /** Concise title of the cause, trigger, or consequence */
  title: string;
  /** Detailed explanation of the causal mechanism */
  description: string;
  /** Primary factor classification */
  factor: FactorTag;
}

export interface Transition {
  /** Format: trn_<packCode>_<slug> */
  id: string;
  /** Structural nature of the transition */
  type: TransitionType;
  /** Transition headline */
  title: string;
  /** Primary timestamp of the transition */
  time: AstroTime;
  /** Optional completion timestamp for multi-year transitions */
  endTime?: AstroTime;
  /** Upstream/predecessor entity IDs (references Entity.id) */
  fromEntityIds: string[];
  /** Downstream/successor entity IDs (references Entity.id; at least 1 required) */
  toEntityIds: string[];
  /** Sankey ribbon flow thickness weight (1 to 100) */
  flowWeight: number;
  /** Executive summary of how and why the transition occurred */
  summary: string;
  /** Structural root causes (at least 1 required) */
  causes: CausalPoint[];
  /** Immediate catalysts or triggers (at least 1 required) */
  triggers: CausalPoint[];
  /** Historical or scientific consequences (at least 1 required) */
  consequences: CausalPoint[];
  /** Active factor tags for perspective filtering (at least 1 required) */
  factors: FactorTag[];
  /** Supporting evidence IDs (references Evidence.id; at least 1 required) */
  evidenceIds: string[];
}

export interface HistoricalEvent {
  /** Format: evt_<packCode>_<slug> */
  id: string;
  /** Event title */
  title: string;
  /** Timestamp of occurrence */
  time: AstroTime;
  /** Significance level (1 = standard, 2 = major, 3 = watershed) */
  importance: 1 | 2 | 3;
  /** Participating entity IDs (references Entity.id; at least 1 required) */
  entityIds: string[];
  /** Optional direct link to a Transition ID */
  relatedTransitionId?: string;
  /** Geographical location or experimental context */
  locationOrContext?: string;
  /** Summary of the event and its impact */
  summary: string;
  /** Factor classification tags */
  factors: FactorTag[];
  /** Supporting evidence IDs (references Evidence.id; at least 1 required) */
  evidenceIds: string[];
}

export interface Evidence {
  /** Format: evd_<packCode>_<slug> */
  id: string;
  /** Evidence card title */
  title: string;
  /** Primary source or bibliographic citation */
  sourceCitation: string;
  /** Classification of the source material */
  sourceType: SourceType;
  /** Scholarly reliability grade */
  reliability: ReliabilityGrade;
  /** Direct quote or factual excerpt from the source */
  quoteOrSummary: string;
  /** Analytical interpretation explaining how this evidence proves the causal link */
  interpretation: string;
  /** Optional competing theory or historiographical debate */
  alternativeView?: string;
  /** Factor classification tags */
  factors: FactorTag[];
}

export interface EraMilestone {
  id: string;
  name: string;
  startYear: number;
  endYear: number;
  color: string;
  description: string;
}

export interface DomainPack {
  /** Unique pack slug (e.g., 'east-asia-history', 'physics-history') */
  id: string;
  /** Short prefix code used in all entity IDs (e.g., 'ea', 'phy') */
  packCode: string;
  /** Pack display title */
  title: string;
  /** Pack subtitle */
  subtitle: string;
  /** Domain category */
  domainType: 'HISTORY' | 'SCIENCE' | 'TECHNOLOGY' | 'PHILOSOPHY';
  /** Semantic version */
  version: string;
  /** Overall temporal bounds and initial focus year */
  timeRange: {
    startYear: number;
    endYear: number;
    defaultFocusYear: number;
  };
  /** Macro-era background bands */
  eraMilestones: EraMilestone[];
  /** The 6 canonical tables */
  axes: Axis[];
  entities: Entity[];
  segments: StateSegment[];
  transitions: Transition[];
  events: HistoricalEvent[];
  evidences: Evidence[];
}

export type ValidationRuleCode =
  | 'V01_ID_FORMAT'
  | 'V02_AXIS_REF'
  | 'V03_ENTITY_TIME'
  | 'V04_SEGMENT_BOUNDS'
  | 'V05_SEGMENT_NO_OVERLAP'
  | 'V06_POWER_WEIGHT'
  | 'V07_TRANSITION_REFS'
  | 'V08_TRANSITION_CAUSALITY'
  | 'V09_EVIDENCE_REQUIRED'
  | 'V10_EVENT_REFS'
  | 'V11_TEMPORAL_CAUSALITY'
  | 'V12_ENTITY_COVERAGE';

export interface ValidationIssue {
  ruleCode: ValidationRuleCode;
  severity: 'ERROR' | 'WARNING';
  targetId: string;
  message: string;
}

export interface ValidationReport {
  packId: string;
  packTitle: string;
  isValid: boolean;
  totalRulesChecked: number;
  passedRulesCount: number;
  errorCount: number;
  warningCount: number;
  issues: ValidationIssue[];
  stats: {
    axesCount: number;
    entitiesCount: number;
    segmentsCount: number;
    transitionsCount: number;
    eventsCount: number;
    evidencesCount: number;
  };
}
