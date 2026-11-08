/**
 * @file timelineEngine.worker.ts
 * @description Dedicated Web Worker for indexing DomainPacks, computing O(log N) temporal snapshots,
 * tracing causal lineages, and calculating Sankey Time-River stream geometry off the main UI thread.
 */

import type { WorkerRequest, WorkerResponse } from '../contracts/worker.contract';
import {
  buildPackIndex,
  computeRiverLayout,
  computeSnapshotAtYear,
  traceCausalLineage,
  type IndexedDomainPack,
} from '../core/layoutEngine';

const indexStore = new Map<string, IndexedDomainPack>();

self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const req = event.data;

  try {
    if (req.type === 'INIT_PACK') {
      const indexed = buildPackIndex(req.pack);
      indexStore.set(req.pack.id, indexed);
      const layout = computeRiverLayout(indexed);

      const response: WorkerResponse = {
        requestId: req.requestId,
        type: 'PACK_INITIALIZED',
        packId: req.pack.id,
        layout,
      };
      self.postMessage(response);
      return;
    }

    if (req.type === 'COMPUTE_SNAPSHOT') {
      const indexed = indexStore.get(req.packId);
      if (!indexed) {
        throw new Error(`Pack "${req.packId}" is not initialized in worker.`);
      }
      const snapshot = computeSnapshotAtYear(indexed, req.year, req.factorFilter);
      const response: WorkerResponse = {
        requestId: req.requestId,
        type: 'SNAPSHOT_READY',
        snapshot,
      };
      self.postMessage(response);
      return;
    }

    if (req.type === 'TRACE_LINEAGE') {
      const indexed = indexStore.get(req.packId);
      if (!indexed) {
        throw new Error(`Pack "${req.packId}" is not initialized in worker.`);
      }
      const lineage = traceCausalLineage(
        indexed,
        req.focusType,
        req.focusId,
        req.factorFilter
      );
      const response: WorkerResponse = {
        requestId: req.requestId,
        type: 'LINEAGE_READY',
        lineage,
      };
      self.postMessage(response);
      return;
    }
  } catch (err) {
    const response: WorkerResponse = {
      requestId: req.requestId,
      type: 'WORKER_ERROR',
      error: err instanceof Error ? err.message : String(err),
    };
    self.postMessage(response);
  }
};
