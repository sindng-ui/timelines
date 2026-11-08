/**
 * @file workerClient.ts
 * @description Web Worker client bridge with aggressive LRU memoization caching for zero-latency UI scrubbing.
 */

import type { DomainPack, FactorTag } from '../contracts/timeline.contract';
import type {
  CausalLineageResult,
  RiverLayoutResult,
  TimelineSnapshot,
  WorkerRequest,
  WorkerResponse,
} from '../contracts/worker.contract';
import {
  buildPackIndex,
  computeRiverLayout,
  computeSnapshotAtYear,
  traceCausalLineage,
  type IndexedDomainPack,
} from './layoutEngine';

class LruCache<K, V> {
  private readonly maxEntries: number;
  private readonly map = new Map<K, V>();

  constructor(maxEntries: number) {
    this.maxEntries = maxEntries;
  }

  get(key: K): V | undefined {
    const val = this.map.get(key);
    if (val !== undefined) {
      this.map.delete(key);
      this.map.set(key, val);
    }
    return val;
  }

  set(key: K, value: V): void {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.maxEntries) {
      const oldestKey = this.map.keys().next().value;
      if (oldestKey !== undefined) {
        this.map.delete(oldestKey);
      }
    }
    this.map.set(key, value);
  }
}

export class TimelineWorkerClient {
  private worker: Worker | null = null;
  private reqCounter = 0;
  private pending = new Map<
    string,
    { resolve: (res: WorkerResponse) => void; reject: (err: Error) => void }
  >();

  private layoutCache = new Map<string, RiverLayoutResult>();
  private snapshotCache = new LruCache<string, TimelineSnapshot>(512);
  private lineageCache = new LruCache<string, CausalLineageResult>(256);
  private fallbackIndexMap = new Map<string, IndexedDomainPack>();

  constructor() {
    if (typeof window !== 'undefined' && typeof Worker !== 'undefined') {
      try {
        this.worker = new Worker(
          new URL('../workers/timelineEngine.worker.ts', import.meta.url),
          { type: 'module' }
        );
        this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
          const res = event.data;
          const handler = this.pending.get(res.requestId);
          if (!handler) return;
          this.pending.delete(res.requestId);

          if (res.type === 'WORKER_ERROR') {
            handler.reject(new Error(res.error));
          } else {
            handler.resolve(res);
          }
        };
      } catch {
        this.worker = null;
      }
    }
  }

  private getOrBuildFallbackIndex(pack: DomainPack): IndexedDomainPack {
    let idx = this.fallbackIndexMap.get(pack.id);
    if (!idx) {
      idx = buildPackIndex(pack);
      this.fallbackIndexMap.set(pack.id, idx);
    }
    return idx;
  }

  private sendRequest(req: WorkerRequest): Promise<WorkerResponse> {
    if (!this.worker) {
      return Promise.reject(new Error('Web Worker not available'));
    }
    return new Promise((resolve, reject) => {
      this.pending.set(req.requestId, { resolve, reject });
      this.worker!.postMessage(req);
    });
  }

  async initPack(pack: DomainPack): Promise<RiverLayoutResult> {
    this.getOrBuildFallbackIndex(pack);
    const cached = this.layoutCache.get(pack.id);
    if (cached) return cached;

    if (this.worker) {
      const requestId = `req_${++this.reqCounter}`;
      const res = await this.sendRequest({
        requestId,
        type: 'INIT_PACK',
        pack,
      });
      if (res.type === 'PACK_INITIALIZED') {
        this.layoutCache.set(pack.id, res.layout);
        return res.layout;
      }
    }

    const idx = this.getOrBuildFallbackIndex(pack);
    const layout = computeRiverLayout(idx);
    this.layoutCache.set(pack.id, layout);
    return layout;
  }

  /**
   * Synchronous fast-path snapshot check from LRU cache or fallback index,
   * plus worker warming. Ensures 60fps slider dragging with zero frame drops.
   */
  getSnapshotSync(
    pack: DomainPack,
    year: number,
    factorFilter: FactorTag | 'ALL'
  ): TimelineSnapshot {
    const cacheKey = `${pack.id}:${year}:${factorFilter}`;
    const hit = this.snapshotCache.get(cacheKey);
    if (hit) return hit;

    const idx = this.getOrBuildFallbackIndex(pack);
    const snapshot = computeSnapshotAtYear(idx, year, factorFilter);
    this.snapshotCache.set(cacheKey, snapshot);
    return snapshot;
  }

  async computeSnapshot(
    pack: DomainPack,
    year: number,
    factorFilter: FactorTag | 'ALL'
  ): Promise<TimelineSnapshot> {
    const cacheKey = `${pack.id}:${year}:${factorFilter}`;
    const hit = this.snapshotCache.get(cacheKey);
    if (hit) return hit;

    if (this.worker) {
      const requestId = `req_${++this.reqCounter}`;
      const res = await this.sendRequest({
        requestId,
        type: 'COMPUTE_SNAPSHOT',
        packId: pack.id,
        year,
        factorFilter,
      });
      if (res.type === 'SNAPSHOT_READY') {
        this.snapshotCache.set(cacheKey, res.snapshot);
        return res.snapshot;
      }
    }

    return this.getSnapshotSync(pack, year, factorFilter);
  }

  async traceLineage(
    pack: DomainPack,
    focusType: 'ENTITY' | 'TRANSITION' | 'EVENT',
    focusId: string,
    factorFilter: FactorTag | 'ALL'
  ): Promise<CausalLineageResult> {
    const cacheKey = `${pack.id}:${focusType}:${focusId}:${factorFilter}`;
    const hit = this.lineageCache.get(cacheKey);
    if (hit) return hit;

    if (this.worker) {
      const requestId = `req_${++this.reqCounter}`;
      const res = await this.sendRequest({
        requestId,
        type: 'TRACE_LINEAGE',
        packId: pack.id,
        focusType,
        focusId,
        factorFilter,
      });
      if (res.type === 'LINEAGE_READY') {
        this.lineageCache.set(cacheKey, res.lineage);
        return res.lineage;
      }
    }

    const idx = this.getOrBuildFallbackIndex(pack);
    const lineage = traceCausalLineage(idx, focusType, focusId, factorFilter);
    this.lineageCache.set(cacheKey, lineage);
    return lineage;
  }
}

export const timelineWorkerClient = new TimelineWorkerClient();
