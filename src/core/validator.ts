/**
 * @file validator.ts
 * @description Automated 12-point Contract Validator for DomainPacks.
 * Guarantees that any AI-authored timeline pack adheres strictly to the Oracle Schema Contract.
 */

import type {
  DomainPack,
  ValidationIssue,
  ValidationReport,
  ValidationRuleCode,
} from '../contracts/timeline.contract';

const ALL_RULE_CODES: ValidationRuleCode[] = [
  'V01_ID_FORMAT',
  'V02_AXIS_REF',
  'V03_ENTITY_TIME',
  'V04_SEGMENT_BOUNDS',
  'V05_SEGMENT_NO_OVERLAP',
  'V06_POWER_WEIGHT',
  'V07_TRANSITION_REFS',
  'V08_TRANSITION_CAUSALITY',
  'V09_EVIDENCE_REQUIRED',
  'V10_EVENT_REFS',
  'V11_TEMPORAL_CAUSALITY',
  'V12_ENTITY_COVERAGE',
  'V13_SPATIAL_INTEGRITY',
];

export function validateDomainPack(pack: DomainPack): ValidationReport {
  const issues: ValidationIssue[] = [];
  const seenIds = new Set<string>();
  const code = pack.packCode;

  const checkIdFormat = (id: string, expectedPrefix: string) => {
    const fullPrefix = `${expectedPrefix}_${code}_`;
    if (!id.startsWith(fullPrefix)) {
      issues.push({
        ruleCode: 'V01_ID_FORMAT',
        severity: 'ERROR',
        targetId: id,
        message: `ID "${id}" must start with "${fullPrefix}".`,
      });
    }
    if (seenIds.has(id)) {
      issues.push({
        ruleCode: 'V01_ID_FORMAT',
        severity: 'ERROR',
        targetId: id,
        message: `Duplicate ID "${id}" detected across the pack.`,
      });
    }
    seenIds.add(id);
  };

  // 1. Validate Axes & Topology Regions
  const axisIdSet = new Set<string>();
  for (const axis of pack.axes) {
    checkIdFormat(axis.id, 'axis');
    axisIdSet.add(axis.id);
  }

  const regionIdSet = new Set<string>();
  if (pack.topology) {
    for (const region of pack.topology.regions) {
      checkIdFormat(region.id, 'loc');
      regionIdSet.add(region.id);
    }
  }

  // 2. Validate Evidences
  const evidenceIdSet = new Set<string>();
  for (const evd of pack.evidences) {
    checkIdFormat(evd.id, 'evd');
    evidenceIdSet.add(evd.id);
  }

  // 3. Validate Entities
  const entityMap = new Map(pack.entities.map((e) => [e.id, e]));
  for (const ent of pack.entities) {
    checkIdFormat(ent.id, 'ent');

    if (!axisIdSet.has(ent.axisId)) {
      issues.push({
        ruleCode: 'V02_AXIS_REF',
        severity: 'ERROR',
        targetId: ent.id,
        message: `Entity "${ent.id}" references non-existent axisId "${ent.axisId}".`,
      });
    }

    if (ent.secondaryAxisIds) {
      for (const secAxisId of ent.secondaryAxisIds) {
        if (!axisIdSet.has(secAxisId)) {
          issues.push({
            ruleCode: 'V02_AXIS_REF',
            severity: 'ERROR',
            targetId: ent.id,
            message: `Entity "${ent.id}" references non-existent secondaryAxisId "${secAxisId}".`,
          });
        }
      }
    }

    if (ent.startTime.sortKey > ent.endTime.sortKey) {
      issues.push({
        ruleCode: 'V03_ENTITY_TIME',
        severity: 'ERROR',
        targetId: ent.id,
        message: `Entity "${ent.id}" has startTime (${ent.startTime.year}) after endTime (${ent.endTime.year}).`,
      });
    }

    if (
      ent.startTime.year < pack.timeRange.startYear ||
      ent.endTime.year > pack.timeRange.endYear
    ) {
      issues.push({
        ruleCode: 'V03_ENTITY_TIME',
        severity: 'ERROR',
        targetId: ent.id,
        message: `Entity "${ent.id}" lifespan (${ent.startTime.year}..${ent.endTime.year}) exceeds pack timeRange (${pack.timeRange.startYear}..${pack.timeRange.endYear}).`,
      });
    }
  }

  // 4. Validate StateSegments
  const segmentsByEntity = new Map<string, typeof pack.segments>();
  for (const seg of pack.segments) {
    checkIdFormat(seg.id, 'seg');
    const parent = entityMap.get(seg.entityId);

    if (!parent) {
      issues.push({
        ruleCode: 'V04_SEGMENT_BOUNDS',
        severity: 'ERROR',
        targetId: seg.id,
        message: `Segment "${seg.id}" references non-existent entityId "${seg.entityId}".`,
      });
      continue;
    }

    if (
      seg.startTime.year < parent.startTime.year ||
      seg.endTime.year > parent.endTime.year ||
      seg.startTime.sortKey > seg.endTime.sortKey
    ) {
      issues.push({
        ruleCode: 'V04_SEGMENT_BOUNDS',
        severity: 'ERROR',
        targetId: seg.id,
        message: `Segment "${seg.id}" (${seg.startTime.year}..${seg.endTime.year}) is out of bounds for parent "${parent.id}" (${parent.startTime.year}..${parent.endTime.year}).`,
      });
    }

    if (seg.powerWeight < 1 || seg.powerWeight > 100) {
      issues.push({
        ruleCode: 'V06_POWER_WEIGHT',
        severity: 'ERROR',
        targetId: seg.id,
        message: `Segment "${seg.id}" powerWeight (${seg.powerWeight}) must be between 1 and 100.`,
      });
    }

    for (const evdId of seg.evidenceIds) {
      if (!evidenceIdSet.has(evdId)) {
        issues.push({
          ruleCode: 'V09_EVIDENCE_REQUIRED',
          severity: 'ERROR',
          targetId: seg.id,
          message: `Segment "${seg.id}" references non-existent evidenceId "${evdId}".`,
        });
      }
    }

    if (seg.occupiedRegions && pack.topology) {
      for (const occ of seg.occupiedRegions) {
        if (!regionIdSet.has(occ.regionId)) {
          issues.push({
            ruleCode: 'V02_AXIS_REF',
            severity: 'ERROR',
            targetId: seg.id,
            message: `Segment "${seg.id}" references non-existent regionId "${occ.regionId}" in topology.`,
          });
        }
      }
    }

    const list = segmentsByEntity.get(seg.entityId) ?? [];
    list.push(seg);
    segmentsByEntity.set(seg.entityId, list);
  }

  // Check segment overlaps per entity
  for (const [entityId, segs] of segmentsByEntity.entries()) {
    const sorted = [...segs].sort((a, b) => a.startTime.sortKey - b.startTime.sortKey);
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const curr = sorted[i];
      if (curr.startTime.year < prev.endTime.year) {
        issues.push({
          ruleCode: 'V05_SEGMENT_NO_OVERLAP',
          severity: 'ERROR',
          targetId: curr.id,
          message: `Segment "${curr.id}" (${curr.startTime.year}..${curr.endTime.year}) overlaps with previous segment "${prev.id}" (${prev.startTime.year}..${prev.endTime.year}) in entity "${entityId}".`,
        });
      }
    }
  }

  // 5. Validate Transitions
  const connectedEntityIds = new Set<string>();
  for (const trn of pack.transitions) {
    checkIdFormat(trn.id, 'trn');

    if (trn.flowWeight < 1 || trn.flowWeight > 100) {
      issues.push({
        ruleCode: 'V06_POWER_WEIGHT',
        severity: 'ERROR',
        targetId: trn.id,
        message: `Transition "${trn.id}" flowWeight (${trn.flowWeight}) must be between 1 and 100.`,
      });
    }

    if (trn.toEntityIds.length === 0) {
      issues.push({
        ruleCode: 'V07_TRANSITION_REFS',
        severity: 'ERROR',
        targetId: trn.id,
        message: `Transition "${trn.id}" must specify at least 1 target entity in toEntityIds.`,
      });
    }

    for (const fromId of trn.fromEntityIds) {
      connectedEntityIds.add(fromId);
      const fromEnt = entityMap.get(fromId);
      if (!fromEnt) {
        issues.push({
          ruleCode: 'V07_TRANSITION_REFS',
          severity: 'ERROR',
          targetId: trn.id,
          message: `Transition "${trn.id}" references non-existent fromEntityId "${fromId}".`,
        });
      } else if (trn.time.year < fromEnt.startTime.year) {
        issues.push({
          ruleCode: 'V11_TEMPORAL_CAUSALITY',
          severity: 'ERROR',
          targetId: trn.id,
          message: `Transition "${trn.id}" occurs in ${trn.time.year}, before predecessor "${fromId}" starts (${fromEnt.startTime.year}).`,
        });
      }
    }

    for (const toId of trn.toEntityIds) {
      connectedEntityIds.add(toId);
      if (!entityMap.has(toId)) {
        issues.push({
          ruleCode: 'V07_TRANSITION_REFS',
          severity: 'ERROR',
          targetId: trn.id,
          message: `Transition "${trn.id}" references non-existent toEntityId "${toId}".`,
        });
      }
    }

    if (
      trn.causes.length === 0 ||
      trn.triggers.length === 0 ||
      trn.consequences.length === 0 ||
      trn.factors.length === 0
    ) {
      issues.push({
        ruleCode: 'V08_TRANSITION_CAUSALITY',
        severity: 'ERROR',
        targetId: trn.id,
        message: `Transition "${trn.id}" must have at least 1 cause, 1 trigger, 1 consequence, and 1 factor.`,
      });
    }

    if (trn.evidenceIds.length === 0) {
      issues.push({
        ruleCode: 'V09_EVIDENCE_REQUIRED',
        severity: 'ERROR',
        targetId: trn.id,
        message: `Transition "${trn.id}" must link to at least 1 Evidence ID.`,
      });
    } else {
      for (const evdId of trn.evidenceIds) {
        if (!evidenceIdSet.has(evdId)) {
          issues.push({
            ruleCode: 'V09_EVIDENCE_REQUIRED',
            severity: 'ERROR',
            targetId: trn.id,
            message: `Transition "${trn.id}" references non-existent evidenceId "${evdId}".`,
          });
        }
      }
    }
  }

  // 6. Validate HistoricalEvents
  for (const evt of pack.events) {
    checkIdFormat(evt.id, 'evt');

    if (evt.entityIds.length === 0) {
      issues.push({
        ruleCode: 'V10_EVENT_REFS',
        severity: 'ERROR',
        targetId: evt.id,
        message: `Event "${evt.id}" must reference at least 1 Entity ID.`,
      });
    }

    for (const entId of evt.entityIds) {
      if (!entityMap.has(entId)) {
        issues.push({
          ruleCode: 'V10_EVENT_REFS',
          severity: 'ERROR',
          targetId: evt.id,
          message: `Event "${evt.id}" references non-existent entityId "${entId}".`,
        });
      }
    }

    if (evt.evidenceIds.length === 0) {
      issues.push({
        ruleCode: 'V09_EVIDENCE_REQUIRED',
        severity: 'ERROR',
        targetId: evt.id,
        message: `Event "${evt.id}" must link to at least 1 Evidence ID.`,
      });
    } else {
      for (const evdId of evt.evidenceIds) {
        if (!evidenceIdSet.has(evdId)) {
          issues.push({
            ruleCode: 'V09_EVIDENCE_REQUIRED',
            severity: 'ERROR',
            targetId: evt.id,
            message: `Event "${evt.id}" references non-existent evidenceId "${evdId}".`,
          });
        }
      }
    }
  }

  // 7. Validate Entity Coverage (V12)
  for (const ent of pack.entities) {
    const segs = segmentsByEntity.get(ent.id) ?? [];
    if (segs.length === 0) {
      issues.push({
        ruleCode: 'V12_ENTITY_COVERAGE',
        severity: 'ERROR',
        targetId: ent.id,
        message: `Entity "${ent.id}" has 0 StateSegments.`,
      });
    }
    if (!connectedEntityIds.has(ent.id)) {
      issues.push({
        ruleCode: 'V12_ENTITY_COVERAGE',
        severity: 'WARNING',
        targetId: ent.id,
        message: `Entity "${ent.id}" is not connected to any Transition.`,
      });
    }
  }

  // 8. Validate Spatial Integrity (V13)
  if (pack.territories) {
    if (!pack.topology) {
      issues.push({
        ruleCode: 'V13_SPATIAL_INTEGRITY',
        severity: 'ERROR',
        targetId: pack.id,
        message: 'DomainPack has territories defined but lacks a topology canvas.',
      });
    } else {
      for (const ter of pack.territories) {
        checkIdFormat(ter.id, 'ter');

        if (!entityMap.has(ter.entityId)) {
          issues.push({
            ruleCode: 'V13_SPATIAL_INTEGRITY',
            severity: 'ERROR',
            targetId: ter.id,
            message: `Territory "${ter.id}" references non-existent entityId "${ter.entityId}".`,
          });
        }

        if (ter.startYear > ter.endYear) {
          issues.push({
            ruleCode: 'V13_SPATIAL_INTEGRITY',
            severity: 'ERROR',
            targetId: ter.id,
            message: `Territory "${ter.id}" has startYear (${ter.startYear}) > endYear (${ter.endYear}).`,
          });
        }

        if (!ter.rings || ter.rings.length === 0) {
          issues.push({
            ruleCode: 'V13_SPATIAL_INTEGRITY',
            severity: 'ERROR',
            targetId: ter.id,
            message: `Territory "${ter.id}" must contain at least 1 polygon ring.`,
          });
        } else {
          for (const ring of ter.rings) {
            if (ring.length < 3) {
              issues.push({
                ruleCode: 'V13_SPATIAL_INTEGRITY',
                severity: 'ERROR',
                targetId: ter.id,
                message: `Territory "${ter.id}" ring must have at least 3 vertices (found ${ring.length}).`,
              });
            }
          }
        }
      }
    }
  }

  const violatedRuleSet = new Set(
    issues.filter((i) => i.severity === 'ERROR').map((i) => i.ruleCode)
  );
  const errorCount = issues.filter((i) => i.severity === 'ERROR').length;
  const warningCount = issues.filter((i) => i.severity === 'WARNING').length;

  return {
    packId: pack.id,
    packTitle: pack.title,
    isValid: errorCount === 0,
    totalRulesChecked: ALL_RULE_CODES.length,
    passedRulesCount: ALL_RULE_CODES.length - violatedRuleSet.size,
    errorCount,
    warningCount,
    issues,
    stats: {
      axesCount: pack.axes.length,
      entitiesCount: pack.entities.length,
      segmentsCount: pack.segments.length,
      transitionsCount: pack.transitions.length,
      eventsCount: pack.events.length,
      evidencesCount: pack.evidences.length,
    },
  };
}
