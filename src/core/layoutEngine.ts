/**
 * @file layoutEngine.ts
 * @description High-performance indexing, O(log N) binary search snapshot engine, BFS causal lineage tracer,
 * and Sankey Time-River geometry layout solver. Runs inside the Web Worker (with synchronous fallback).
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
} from '../contracts/timeline.contract';
import type {
  ActiveEntitySnapshot,
  CausalLineageResult,
  RiverLayoutResult,
  StreamGeometryNode,
  StreamSegmentBox,
  TimelineSnapshot,
  TransitionRibbonGeometry,
} from '../contracts/worker.contract';

export interface IndexedDomainPack {
  pack: DomainPack;
  axisById: Map<string, Axis>;
  entityById: Map<string, Entity>;
  evidenceById: Map<string, Evidence>;
  segmentsByEntityId: Map<string, StateSegment[]>;
  transitionsByFromEntity: Map<string, Transition[]>;
  transitionsByToEntity: Map<string, Transition[]>;
  eventsByEntityId: Map<string, HistoricalEvent[]>;
  transitionById: Map<string, Transition>;
  eventById: Map<string, HistoricalEvent>;
}

/**
 * Builds pre-sorted in-memory indexes for O(log N) and O(1) lookups.
 */
export function buildPackIndex(pack: DomainPack): IndexedDomainPack {
  const axisById = new Map<string, Axis>();
  for (const axis of pack.axes) {
    axisById.set(axis.id, axis);
  }

  const entityById = new Map<string, Entity>();
  for (const ent of pack.entities) {
    entityById.set(ent.id, ent);
  }

  const evidenceById = new Map<string, Evidence>();
  for (const evd of pack.evidences) {
    evidenceById.set(evd.id, evd);
  }

  const segmentsByEntityId = new Map<string, StateSegment[]>();
  for (const seg of pack.segments) {
    const list = segmentsByEntityId.get(seg.entityId) ?? [];
    list.push(seg);
    segmentsByEntityId.set(seg.entityId, list);
  }
  for (const [entId, list] of segmentsByEntityId.entries()) {
    list.sort((a, b) => a.startTime.sortKey - b.startTime.sortKey);
    segmentsByEntityId.set(entId, list);
  }

  const transitionsByFromEntity = new Map<string, Transition[]>();
  const transitionsByToEntity = new Map<string, Transition[]>();
  const transitionById = new Map<string, Transition>();

  for (const trn of pack.transitions) {
    transitionById.set(trn.id, trn);
    for (const fromId of trn.fromEntityIds) {
      const list = transitionsByFromEntity.get(fromId) ?? [];
      list.push(trn);
      transitionsByFromEntity.set(fromId, list);
    }
    for (const toId of trn.toEntityIds) {
      const list = transitionsByToEntity.get(toId) ?? [];
      list.push(trn);
      transitionsByToEntity.set(toId, list);
    }
  }

  const eventsByEntityId = new Map<string, HistoricalEvent[]>();
  const eventById = new Map<string, HistoricalEvent>();
  for (const evt of pack.events) {
    eventById.set(evt.id, evt);
    for (const entId of evt.entityIds) {
      const list = eventsByEntityId.get(entId) ?? [];
      list.push(evt);
      eventsByEntityId.set(entId, list);
    }
  }

  return {
    pack,
    axisById,
    entityById,
    evidenceById,
    segmentsByEntityId,
    transitionsByFromEntity,
    transitionsByToEntity,
    eventsByEntityId,
    transitionById,
    eventById,
  };
}

/**
 * Binary search over pre-sorted StateSegments for an Entity at a given year.
 */
function findSegmentBinarySearch(segments: StateSegment[], year: number): StateSegment {
  let low = 0;
  let high = segments.length - 1;

  while (low <= high) {
    const mid = (low + high) >>> 1;
    const seg = segments[mid];
    if (year < seg.startTime.year) {
      high = mid - 1;
    } else if (year > seg.endTime.year) {
      low = mid + 1;
    } else {
      return seg;
    }
  }

  // Fallback to closest boundary segment
  if (year <= segments[0].startTime.year) return segments[0];
  return segments[segments.length - 1];
}

function matchesFactor(factors: FactorTag[], filter: FactorTag | 'ALL'): boolean {
  if (filter === 'ALL') return true;
  return factors.includes(filter);
}

/**
 * Computes the complete geopolitical/disciplinary snapshot at year `t`.
 */
export function computeSnapshotAtYear(
  index: IndexedDomainPack,
  year: number,
  factorFilter: FactorTag | 'ALL'
): TimelineSnapshot {
  const { pack, axisById, segmentsByEntityId, eventsByEntityId, transitionsByFromEntity, transitionsByToEntity } =
    index;

  const activeEra =
    pack.eraMilestones.find((era) => year >= era.startYear && year <= era.endYear) ??
    pack.eraMilestones[0];

  const activeEntitiesByAxis: Record<string, ActiveEntitySnapshot[]> = {};
  for (const axis of pack.axes) {
    activeEntitiesByAxis[axis.id] = [];
  }

  const activeEntities: ActiveEntitySnapshot[] = [];
  const totalSpan = Math.max(1, pack.timeRange.endYear - pack.timeRange.startYear);
  const windowYears = Math.max(8, Math.round(totalSpan * 0.035));

  for (const entity of pack.entities) {
    if (year >= entity.startTime.year && year <= entity.endTime.year) {
      const segs = segmentsByEntityId.get(entity.id) ?? [];
      if (segs.length === 0) continue;

      const activeSegment = findSegmentBinarySearch(segs, year);
      const axis = axisById.get(entity.axisId);
      if (!axis) continue;

      const entityEvents = (eventsByEntityId.get(entity.id) ?? []).filter(
        (evt) =>
          Math.abs(evt.time.year - year) <= windowYears &&
          matchesFactor(evt.factors, factorFilter)
      );

      const outTrns = transitionsByFromEntity.get(entity.id) ?? [];
      const inTrns = transitionsByToEntity.get(entity.id) ?? [];
      const activeTransitions = [...inTrns, ...outTrns].filter(
        (trn) =>
          Math.abs(trn.time.year - year) <= windowYears &&
          matchesFactor(trn.factors, factorFilter)
      );

      const snap: ActiveEntitySnapshot = {
        entity,
        activeSegment,
        axis,
        recentEvents: entityEvents,
        activeTransitions,
      };

      activeEntities.push(snap);
      activeEntitiesByAxis[axis.id].push(snap);
    }
  }

  const nearbyTransitions = pack.transitions
    .filter(
      (trn) =>
        Math.abs(trn.time.year - year) <= windowYears &&
        matchesFactor(trn.factors, factorFilter)
    )
    .sort((a, b) => a.time.sortKey - b.time.sortKey);

  const nearbyEvents = pack.events
    .filter(
      (evt) =>
        Math.abs(evt.time.year - year) <= windowYears &&
        matchesFactor(evt.factors, factorFilter)
    )
    .sort((a, b) => a.time.sortKey - b.time.sortKey);

  return {
    packId: pack.id,
    year,
    activeEraName: activeEra ? activeEra.name : pack.title,
    activeEntitiesByAxis,
    activeEntities,
    nearbyTransitions,
    nearbyEvents,
  };
}

/**
 * Traces the full upstream (Why it emerged) and downstream (How it transformed/merged) causal lineage.
 */
export function traceCausalLineage(
  index: IndexedDomainPack,
  focusType: 'ENTITY' | 'TRANSITION' | 'EVENT',
  focusId: string,
  factorFilter: FactorTag | 'ALL'
): CausalLineageResult {
  const {
    pack,
    entityById,
    evidenceById,
    transitionsByFromEntity,
    transitionsByToEntity,
    eventsByEntityId,
    transitionById,
    eventById,
  } = index;

  const upstreamTransitionsMap = new Map<string, Transition>();
  const downstreamTransitionsMap = new Map<string, Transition>();
  const relatedEntityIds = new Set<string>();
  const relatedEventIds = new Set<string>();
  const evidenceIdSet = new Set<string>();

  let focusTitle = '';
  let focusSummary = '';
  let focusEntity: Entity | undefined;
  let focusTransition: Transition | undefined;
  let focusEvent: HistoricalEvent | undefined;

  if (focusType === 'ENTITY') {
    focusEntity = entityById.get(focusId) ?? pack.entities[0];
    focusTitle = `${focusEntity.name} (${focusEntity.nativeName ?? focusEntity.category})`;
    focusSummary = focusEntity.summary;
    relatedEntityIds.add(focusEntity.id);

    // Collect evidences from entity segments
    const segs = index.segmentsByEntityId.get(focusEntity.id) ?? [];
    for (const s of segs) {
      for (const evId of s.evidenceIds) evidenceIdSet.add(evId);
    }

    // Upstream transitions (leading INTO this entity and its immediate parents)
    const directIn = (transitionsByToEntity.get(focusEntity.id) ?? []).filter((t) =>
      matchesFactor(t.factors, factorFilter)
    );
    for (const trn of directIn) {
      upstreamTransitionsMap.set(trn.id, trn);
      for (const evId of trn.evidenceIds) evidenceIdSet.add(evId);
      for (const parentId of trn.fromEntityIds) {
        relatedEntityIds.add(parentId);
        // 2-hop upstream for deep context
        const grandIn = (transitionsByToEntity.get(parentId) ?? []).filter((t) =>
          matchesFactor(t.factors, factorFilter)
        );
        for (const gTrn of grandIn) {
          upstreamTransitionsMap.set(gTrn.id, gTrn);
          for (const gParentId of gTrn.fromEntityIds) relatedEntityIds.add(gParentId);
        }
      }
    }

    // Downstream transitions (leading OUT OF this entity and its immediate children)
    const directOut = (transitionsByFromEntity.get(focusEntity.id) ?? []).filter((t) =>
      matchesFactor(t.factors, factorFilter)
    );
    for (const trn of directOut) {
      downstreamTransitionsMap.set(trn.id, trn);
      for (const evId of trn.evidenceIds) evidenceIdSet.add(evId);
      for (const childId of trn.toEntityIds) {
        relatedEntityIds.add(childId);
        const grandOut = (transitionsByFromEntity.get(childId) ?? []).filter((t) =>
          matchesFactor(t.factors, factorFilter)
        );
        for (const gTrn of grandOut) {
          downstreamTransitionsMap.set(gTrn.id, gTrn);
          for (const gChildId of gTrn.toEntityIds) relatedEntityIds.add(gChildId);
        }
      }
    }

    // Events for focus entity
    const evts = (eventsByEntityId.get(focusEntity.id) ?? []).filter((e) =>
      matchesFactor(e.factors, factorFilter)
    );
    for (const e of evts) {
      relatedEventIds.add(e.id);
      for (const evId of e.evidenceIds) evidenceIdSet.add(evId);
    }
  } else if (focusType === 'TRANSITION') {
    focusTransition = transitionById.get(focusId) ?? pack.transitions[0];
    focusTitle = focusTransition.title;
    focusSummary = focusTransition.summary;
    upstreamTransitionsMap.set(focusTransition.id, focusTransition);

    for (const evId of focusTransition.evidenceIds) evidenceIdSet.add(evId);
    for (const fromId of focusTransition.fromEntityIds) {
      relatedEntityIds.add(fromId);
      const prevTrns = (transitionsByToEntity.get(fromId) ?? []).filter((t) =>
        matchesFactor(t.factors, factorFilter)
      );
      for (const pTrn of prevTrns) upstreamTransitionsMap.set(pTrn.id, pTrn);
    }
    for (const toId of focusTransition.toEntityIds) {
      relatedEntityIds.add(toId);
      const nextTrns = (transitionsByFromEntity.get(toId) ?? []).filter((t) =>
        matchesFactor(t.factors, factorFilter)
      );
      for (const nTrn of nextTrns) downstreamTransitionsMap.set(nTrn.id, nTrn);
    }

    for (const evt of pack.events) {
      if (evt.relatedTransitionId === focusTransition.id) {
        relatedEventIds.add(evt.id);
        for (const evId of evt.evidenceIds) evidenceIdSet.add(evId);
      }
    }
  } else {
    focusEvent = eventById.get(focusId) ?? pack.events[0];
    focusTitle = focusEvent.title;
    focusSummary = focusEvent.summary;
    relatedEventIds.add(focusEvent.id);

    for (const evId of focusEvent.evidenceIds) evidenceIdSet.add(evId);
    for (const entId of focusEvent.entityIds) {
      relatedEntityIds.add(entId);
      const inTrns = transitionsByToEntity.get(entId) ?? [];
      const outTrns = transitionsByFromEntity.get(entId) ?? [];
      for (const t of inTrns) upstreamTransitionsMap.set(t.id, t);
      for (const t of outTrns) downstreamTransitionsMap.set(t.id, t);
    }
    if (focusEvent.relatedTransitionId) {
      const relTrn = transitionById.get(focusEvent.relatedTransitionId);
      if (relTrn) {
        focusTransition = relTrn;
        upstreamTransitionsMap.set(relTrn.id, relTrn);
        for (const evId of relTrn.evidenceIds) evidenceIdSet.add(evId);
      }
    }
  }

  const upstreamTransitions = [...upstreamTransitionsMap.values()].sort(
    (a, b) => a.time.sortKey - b.time.sortKey
  );
  const downstreamTransitions = [...downstreamTransitionsMap.values()].sort(
    (a, b) => a.time.sortKey - b.time.sortKey
  );
  const relatedEntities = [...relatedEntityIds]
    .map((id) => entityById.get(id))
    .filter((e): e is Entity => Boolean(e))
    .sort((a, b) => a.startTime.sortKey - b.startTime.sortKey);

  const relatedEvents = [...relatedEventIds]
    .map((id) => eventById.get(id))
    .filter((e): e is HistoricalEvent => Boolean(e))
    .sort((a, b) => a.time.sortKey - b.time.sortKey);

  const supportingEvidences = [...evidenceIdSet]
    .map((id) => evidenceById.get(id))
    .filter((ev): ev is Evidence => Boolean(ev));

  const highlightedTransitionIds = [
    ...new Set([
      ...upstreamTransitions.map((t) => t.id),
      ...downstreamTransitions.map((t) => t.id),
    ]),
  ];

  return {
    packId: pack.id,
    focusType,
    focusId,
    focusTitle,
    focusSummary,
    focusEntity,
    focusTransition,
    focusEvent,
    upstreamTransitions,
    downstreamTransitions,
    relatedEntities,
    relatedEvents,
    supportingEvidences,
    highlightedEntityIds: [...relatedEntityIds],
    highlightedTransitionIds,
  };
}

/**
 * Computes the Sankey-style Time-River stream geometry and split/merge Bezier ribbon coordinates.
 */
export function computeRiverLayout(index: IndexedDomainPack): RiverLayoutResult {
  const { pack, axisById, segmentsByEntityId } = index;
  const sortedAxes = [...pack.axes].sort((a, b) => a.order - b.order);

  const BAND_HEIGHT_PX = 128;
  const TOP_PADDING_PX = 42;
  const minYear = pack.timeRange.startYear;
  const totalSpan = Math.max(1, pack.timeRange.endYear - minYear);

  const yearToRatio = (year: number): number => {
    return Math.max(0, Math.min(1, (year - minYear) / totalSpan));
  };

  const axisBands = sortedAxes.map((axis, idx) => {
    const topPx = TOP_PADDING_PX + idx * BAND_HEIGHT_PX;
    return {
      axis,
      topPx,
      heightPx: BAND_HEIGHT_PX,
      centerPx: topPx + BAND_HEIGHT_PX * 0.5,
    };
  });

  const bandByAxisId = new Map(axisBands.map((b) => [b.axis.id, b]));
  const streamNodes: StreamGeometryNode[] = [];
  const entityCenterYMap = new Map<string, number>();

  for (const entity of pack.entities) {
    const band = bandByAxisId.get(entity.axisId);
    const axis = axisById.get(entity.axisId);
    if (!band || !axis) continue;

    const offsetPx = (entity.laneOffset ?? 0) * (BAND_HEIGHT_PX * 0.62);
    const yCenterPx = band.centerPx + offsetPx;
    entityCenterYMap.set(entity.id, yCenterPx);

    const xStartRatio = yearToRatio(entity.startTime.year);
    const xEndRatio = yearToRatio(entity.endTime.year);

    const segs = segmentsByEntityId.get(entity.id) ?? [];
    const segmentBoxes: StreamSegmentBox[] = segs.map((seg) => {
      const segStartRatio = yearToRatio(seg.startTime.year);
      const segEndRatio = yearToRatio(seg.endTime.year);
      const heightPx = Math.max(18, Math.min(48, 14 + (seg.powerWeight / 100) * 32));
      return {
        segment: seg,
        xStartRatio: segStartRatio,
        xEndRatio: Math.max(segStartRatio + 0.008, segEndRatio),
        yCenterPx,
        heightPx,
      };
    });

    streamNodes.push({
      entity,
      axis,
      xStartRatio,
      xEndRatio: Math.max(xStartRatio + 0.01, xEndRatio),
      yCenterPx,
      baseHeightPx: 28,
      segmentBoxes,
    });
  }

  const ribbons: TransitionRibbonGeometry[] = [];
  for (const trn of pack.transitions) {
    const xRatio = yearToRatio(trn.time.year);
    const strokeWidth = Math.max(2.5, Math.min(12, (trn.flowWeight / 100) * 11));

    if (trn.fromEntityIds.length === 0) {
      for (const toId of trn.toEntityIds) {
        const toY = entityCenterYMap.get(toId) ?? 100;
        ribbons.push({
          transition: trn,
          toEntityId: toId,
          xRatio,
          fromY: toY - 24,
          toY,
          strokeWidth,
        });
      }
    } else {
      for (const fromId of trn.fromEntityIds) {
        const fromY = entityCenterYMap.get(fromId) ?? 100;
        for (const toId of trn.toEntityIds) {
          const toY = entityCenterYMap.get(toId) ?? 100;
          ribbons.push({
            transition: trn,
            fromEntityId: fromId,
            toEntityId: toId,
            xRatio,
            fromY,
            toY,
            strokeWidth,
          });
        }
      }
    }
  }

  return {
    packId: pack.id,
    totalHeightPx: TOP_PADDING_PX + sortedAxes.length * BAND_HEIGHT_PX + 28,
    axisBands,
    streamNodes,
    ribbons,
  };
}
