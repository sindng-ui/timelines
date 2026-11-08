/**
 * @file App.tsx
 * @description Root orchestrator for the ChronoNexus Universal Timeline & Causal Knowledge Graph Engine.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DOMAIN_PACKS, getDomainPackById } from './packs';
import type { FactorTag } from './contracts/timeline.contract';
import type {
  CausalLineageResult,
  RiverLayoutResult,
} from './contracts/worker.contract';
import { validateDomainPack } from './core/validator';
import { timelineWorkerClient } from './core/workerClient';
import {
  buildPackIndex,
  computeRiverLayout,
  traceCausalLineage,
} from './core/layoutEngine';
import { TopControlBar } from './components/TopControlBar';
import { TimeScrubber } from './components/TimeScrubber';
import { TimeRiverCanvas } from './components/TimeRiverCanvas';
import { SpatialTopologyCanvas } from './components/SpatialTopologyCanvas';
import { SnapshotStatePanel } from './components/SnapshotStatePanel';
import { CausalLineageTracer } from './components/CausalLineageTracer';
import { EvidenceDrawer } from './components/EvidenceDrawer';
import { ValidationBadgeModal } from './components/ValidationBadgeModal';

export const App: React.FC = () => {
  const [activePackId, setActivePackId] = useState<string>(DOMAIN_PACKS[0].id);
  const activePack = useMemo(() => getDomainPackById(activePackId), [activePackId]);

  const [currentYear, setCurrentYear] = useState<number>(
    activePack.timeRange.defaultFocusYear
  );
  const [activeFactor, setActiveFactor] = useState<FactorTag | 'ALL'>('ALL');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState<boolean>(false);

  // Selection focus state ('ENTITY' | 'TRANSITION' | 'EVENT')
  const [selectedFocusType, setSelectedFocusType] = useState<
    'ENTITY' | 'TRANSITION' | 'EVENT'
  >('ENTITY');
  const [selectedFocusId, setSelectedFocusId] = useState<string>(
    activePack.entities.find((e) => e.id.includes('taebong'))?.id ??
      activePack.entities[0].id
  );

  // Validate active pack against the 12 Oracle Contract rules (memoized)
  const validationReport = useMemo(
    () => validateDomainPack(activePack),
    [activePack]
  );

  // Pre-computed fallback index for zero-frame-drop initial render
  const syncIndex = useMemo(() => buildPackIndex(activePack), [activePack]);
  const [riverLayout, setRiverLayout] = useState<RiverLayoutResult>(() =>
    computeRiverLayout(syncIndex)
  );
  const [lineageResult, setLineageResult] = useState<CausalLineageResult>(() =>
    traceCausalLineage(syncIndex, selectedFocusType, selectedFocusId, activeFactor)
  );

  // Initialize pack in Web Worker when pack changes
  useEffect(() => {
    let cancelled = false;
    setRiverLayout(computeRiverLayout(syncIndex));

    timelineWorkerClient.initPack(activePack).then((layout) => {
      if (!cancelled) {
        setRiverLayout(layout);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [activePack, syncIndex]);

  // Trace lineage in Web Worker (with LRU cache) when selection or factor filter changes
  useEffect(() => {
    let cancelled = false;
    timelineWorkerClient
      .traceLineage(activePack, selectedFocusType, selectedFocusId, activeFactor)
      .then((lineage) => {
        if (!cancelled) {
          setLineageResult(lineage);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activePack, selectedFocusType, selectedFocusId, activeFactor]);

  // Fast O(log N) + LRU cached snapshot at currentYear
  const snapshot = useMemo(
    () => timelineWorkerClient.getSnapshotSync(activePack, currentYear, activeFactor),
    [activePack, currentYear, activeFactor]
  );

  // Warm worker snapshot cache asynchronously
  useEffect(() => {
    void timelineWorkerClient.computeSnapshot(activePack, currentYear, activeFactor);
  }, [activePack, currentYear, activeFactor]);

  // Playback timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setCurrentYear((prev) => {
        if (prev >= activePack.timeRange.endYear) {
          setIsPlaying(false);
          return activePack.timeRange.endYear;
        }
        return prev + 1;
      });
    }, 110);
    return () => window.clearInterval(timer);
  }, [isPlaying, activePack.timeRange.endYear]);

  const handleSelectPack = useCallback((packId: string) => {
    const nextPack = getDomainPackById(packId);
    setActivePackId(packId);
    setIsPlaying(false);
    setCurrentYear(nextPack.timeRange.defaultFocusYear);
    setActiveFactor('ALL');
    setSelectedFocusType('ENTITY');
    const defaultEntity =
      nextPack.entities.find(
        (e) =>
          nextPack.timeRange.defaultFocusYear >= e.startTime.year &&
          nextPack.timeRange.defaultFocusYear <= e.endTime.year
      ) ?? nextPack.entities[0];
    setSelectedFocusId(defaultEntity.id);
  }, []);

  const handleSelectEntity = useCallback((entityId: string) => {
    setSelectedFocusType('ENTITY');
    setSelectedFocusId(entityId);
  }, []);

  const handleSelectTransition = useCallback((transitionId: string, year: number) => {
    setSelectedFocusType('TRANSITION');
    setSelectedFocusId(transitionId);
    setCurrentYear(year);
  }, []);

  const handleSelectEvent = useCallback((eventId: string, year: number) => {
    setSelectedFocusType('EVENT');
    setSelectedFocusId(eventId);
    setCurrentYear(year);
  }, []);

  const handleResetFocusYear = useCallback(() => {
    setIsPlaying(false);
    setCurrentYear(activePack.timeRange.defaultFocusYear);
  }, [activePack.timeRange.defaultFocusYear]);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const focusSegments = useMemo(() => {
    if (selectedFocusType === 'ENTITY') {
      return activePack.segments
        .filter((s) => s.entityId === selectedFocusId)
        .sort((a, b) => a.startTime.sortKey - b.startTime.sortKey);
    }
    if (lineageResult.focusEntity) {
      return activePack.segments
        .filter((s) => s.entityId === lineageResult.focusEntity!.id)
        .sort((a, b) => a.startTime.sortKey - b.startTime.sortKey);
    }
    return [];
  }, [activePack.segments, selectedFocusType, selectedFocusId, lineageResult.focusEntity]);

  const sortedAxes = useMemo(
    () => [...activePack.axes].sort((a, b) => a.order - b.order),
    [activePack.axes]
  );

  return (
    <div className="app-shell">
      <TopControlBar
        packs={DOMAIN_PACKS}
        activePack={activePack}
        onSelectPack={handleSelectPack}
        activeFactor={activeFactor}
        onSelectFactor={setActiveFactor}
        validationReport={validationReport}
        onOpenValidationModal={() => setIsValidationModalOpen(true)}
      />

      <TimeScrubber
        pack={activePack}
        currentYear={currentYear}
        activeEraName={snapshot.activeEraName}
        isPlaying={isPlaying}
        onYearChange={setCurrentYear}
        onTogglePlay={handleTogglePlay}
        onResetFocusYear={handleResetFocusYear}
        onSelectEventAndYear={handleSelectEvent}
      />

      <main className="workspace-container">
        {/* Top Interactive Row: Time River Stream on Left + Spatial Topology Map on Right */}
        <div className={`interactive-stream-row ${!activePack.topology ? 'full-width' : ''}`}>
          <div className="stream-col">
            <TimeRiverCanvas
              pack={activePack}
              layout={riverLayout}
              currentYear={currentYear}
              activeFactor={activeFactor}
              selectedFocusType={selectedFocusType}
              selectedFocusId={selectedFocusId}
              highlightedEntityIds={lineageResult.highlightedEntityIds}
              highlightedTransitionIds={lineageResult.highlightedTransitionIds}
              onSelectEntity={handleSelectEntity}
              onSelectTransition={handleSelectTransition}
              onSelectEvent={handleSelectEvent}
              onScrubYear={setCurrentYear}
            />
          </div>

          {activePack.topology && (
            <div className="map-col">
              <SpatialTopologyCanvas
                pack={activePack}
                snapshot={snapshot}
                selectedFocusType={selectedFocusType}
                selectedFocusId={selectedFocusId}
                onSelectEntity={handleSelectEntity}
                onSelectEvent={handleSelectEvent}
                onSelectTransition={handleSelectTransition}
              />
            </div>
          )}
        </div>

        {/* Bottom Analysis Deck: Status Breakdown + 3-Stage Causal Storyboard + Evidences */}
        <div className="analysis-deck">
          <div className="deck-left-col">
            <SnapshotStatePanel
              axes={sortedAxes}
              snapshot={snapshot}
              selectedFocusType={selectedFocusType}
              selectedFocusId={selectedFocusId}
              onSelectEntity={handleSelectEntity}
              onSelectTransition={handleSelectTransition}
              onSelectEvent={handleSelectEvent}
            />
          </div>

          <div className="deck-right-col">
            <CausalLineageTracer
              lineage={lineageResult}
              focusSegments={focusSegments}
              onSelectEntity={handleSelectEntity}
              onSelectTransition={handleSelectTransition}
              onSelectEvent={handleSelectEvent}
            />

            <EvidenceDrawer
              evidences={lineageResult.supportingEvidences}
              focusTitle={lineageResult.focusTitle}
            />
          </div>
        </div>
      </main>

      <ValidationBadgeModal
        isOpen={isValidationModalOpen}
        report={validationReport}
        onClose={() => setIsValidationModalOpen(false)}
      />
    </div>
  );
};
