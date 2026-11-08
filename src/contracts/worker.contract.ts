/**
 * @file worker.contract.ts
 * @description Contracts for Web Worker computation requests, responses, snapshots, causal lineage trees, and Sankey Time-River geometry.
 */

import type {
  Axis,
  DomainPack,
  Entity,
  Evidence,
  FactorTag,
  HistoricalEvent,
  StateSegment,
  Transition,
} from './timeline.contract';

export interface ActiveEntitySnapshot {
  entity: Entity;
  activeSegment: StateSegment;
  axis: Axis;
  recentEvents: HistoricalEvent[];
  activeTransitions: Transition[];
}

export interface TimelineSnapshot {
  packId: string;
  year: number;
  activeEraName: string;
  activeEntitiesByAxis: Record<string, ActiveEntitySnapshot[]>;
  activeEntities: ActiveEntitySnapshot[];
  nearbyTransitions: Transition[];
  nearbyEvents: HistoricalEvent[];
}

export interface LineageNode {
  entity: Entity;
  segments: StateSegment[];
  depth: number;
  direction: 'ORIGIN' | 'UPSTREAM' | 'DOWNSTREAM';
}

export interface CausalLineageResult {
  packId: string;
  focusType: 'ENTITY' | 'TRANSITION' | 'EVENT';
  focusId: string;
  focusTitle: string;
  focusSummary: string;
  focusEntity?: Entity;
  focusTransition?: Transition;
  focusEvent?: HistoricalEvent;
  upstreamTransitions: Transition[];
  downstreamTransitions: Transition[];
  relatedEntities: Entity[];
  relatedEvents: HistoricalEvent[];
  supportingEvidences: Evidence[];
  highlightedEntityIds: string[];
  highlightedTransitionIds: string[];
}

export interface StreamSegmentBox {
  segment: StateSegment;
  xStartRatio: number;
  xEndRatio: number;
  yCenterPx: number;
  heightPx: number;
}

export interface StreamGeometryNode {
  entity: Entity;
  axis: Axis;
  xStartRatio: number;
  xEndRatio: number;
  yCenterPx: number;
  baseHeightPx: number;
  segmentBoxes: StreamSegmentBox[];
}

export interface TransitionRibbonGeometry {
  transition: Transition;
  fromEntityId?: string;
  toEntityId: string;
  xRatio: number;
  fromY: number;
  toY: number;
  strokeWidth: number;
}

export interface RiverLayoutResult {
  packId: string;
  totalHeightPx: number;
  axisBands: Array<{
    axis: Axis;
    topPx: number;
    heightPx: number;
    centerPx: number;
  }>;
  streamNodes: StreamGeometryNode[];
  ribbons: TransitionRibbonGeometry[];
}

export type WorkerRequest =
  | {
      requestId: string;
      type: 'INIT_PACK';
      pack: DomainPack;
    }
  | {
      requestId: string;
      type: 'COMPUTE_SNAPSHOT';
      packId: string;
      year: number;
      factorFilter: FactorTag | 'ALL';
    }
  | {
      requestId: string;
      type: 'TRACE_LINEAGE';
      packId: string;
      focusType: 'ENTITY' | 'TRANSITION' | 'EVENT';
      focusId: string;
      factorFilter: FactorTag | 'ALL';
    };

export type WorkerResponse =
  | {
      requestId: string;
      type: 'PACK_INITIALIZED';
      packId: string;
      layout: RiverLayoutResult;
    }
  | {
      requestId: string;
      type: 'SNAPSHOT_READY';
      snapshot: TimelineSnapshot;
    }
  | {
      requestId: string;
      type: 'LINEAGE_READY';
      lineage: CausalLineageResult;
    }
  | {
      requestId: string;
      type: 'WORKER_ERROR';
      error: string;
    };
