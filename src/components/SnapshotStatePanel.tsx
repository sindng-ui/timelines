/**
 * @file SnapshotStatePanel.tsx
 * @description Displays the simultaneous state of all active Entities across every Axis at the selected year `t`.
 */

import React from 'react';
import { Clock, MapPin, Users, Zap } from 'lucide-react';
import type { Axis } from '../contracts/timeline.contract';
import type { TimelineSnapshot } from '../contracts/worker.contract';

export interface SnapshotStatePanelProps {
  axes: Axis[];
  snapshot: TimelineSnapshot;
  selectedFocusType: 'ENTITY' | 'TRANSITION' | 'EVENT';
  selectedFocusId: string;
  onSelectEntity: (entityId: string) => void;
  onSelectTransition: (transitionId: string, year: number) => void;
  onSelectEvent: (eventId: string, year: number) => void;
}

export const SnapshotStatePanel: React.FC<SnapshotStatePanelProps> = React.memo(
  ({
    axes,
    snapshot,
    selectedFocusType,
    selectedFocusId,
    onSelectEntity,
    onSelectTransition,
    onSelectEvent,
  }) => {
    return (
      <section className="panel-card" aria-label="시점 스냅샷 동시대 비교 패널">
        <div className="section-header">
          <div className="section-title">
            <Clock size={16} color="#10b981" />
            <span>
              [{snapshot.year}년 타임머신 스냅샷] 동시대 권역·축별 세력 판도 ({snapshot.activeEntities.length}개 활성)
            </span>
          </div>
        </div>

        <div className="panel-body">
          {axes.map((axis) => {
            const activeList = snapshot.activeEntitiesByAxis[axis.id] ?? [];
            return (
              <div key={axis.id} className="axis-snapshot-group">
                <div className="axis-group-header">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: axis.accentColor,
                      }}
                    />
                    {axis.name}
                  </span>
                  <span style={{ fontSize: 11, color: '#64748b' }}>
                    {activeList.length > 0 ? `${activeList.length}개 주체 공존` : '해당 시점 공백'}
                  </span>
                </div>

                {activeList.length === 0 ? (
                  <div style={{ fontSize: 12, color: '#64748b', padding: '4px 0' }}>
                    이 시점({snapshot.year}년)에 본 트랙에 등록된 독립 주체가 없습니다.
                  </div>
                ) : (
                  activeList.map(({ entity, activeSegment }) => {
                    const isSelected =
                      selectedFocusType === 'ENTITY' && selectedFocusId === entity.id;
                    return (
                      <div
                        key={entity.id}
                        className={`entity-snap-card ${isSelected ? 'selected' : ''}`}
                        style={{ borderLeftColor: entity.color }}
                        onClick={() => onSelectEntity(entity.id)}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 4,
                          }}
                        >
                          <strong style={{ fontSize: 13.5, color: '#f8fafc' }}>
                            {activeSegment.officialName}
                          </strong>
                          <span
                            style={{
                              fontSize: 11,
                              padding: '1px 6px',
                              borderRadius: 4,
                              backgroundColor: '#0f172a',
                              color: '#fcd34d',
                              fontWeight: 700,
                            }}
                          >
                            세력 비중 {activeSegment.powerWeight}/100
                          </span>
                        </div>

                        <div
                          style={{
                            fontSize: 11.5,
                            color: '#93c5fd',
                            fontWeight: 600,
                            marginBottom: 4,
                          }}
                        >
                          단계: {activeSegment.phaseTitle} ({activeSegment.startTime.year}~
                          {activeSegment.endTime.year}년)
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 10,
                            fontSize: 11.5,
                            color: '#94a3b8',
                            marginBottom: 6,
                          }}
                        >
                          {activeSegment.capitalOrCenter && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                              <MapPin size={12} />
                              거점: {activeSegment.capitalOrCenter}
                            </span>
                          )}
                          {activeSegment.keyFigures.length > 0 && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                              <Users size={12} />
                              인물: {activeSegment.keyFigures.join(', ')}
                            </span>
                          )}
                        </div>

                        <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.45 }}>
                          {activeSegment.stateDescription}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            );
          })}

          {/* Nearby Transitions & Events around year t */}
          {(snapshot.nearbyTransitions.length > 0 || snapshot.nearbyEvents.length > 0) && (
            <div className="axis-snapshot-group" style={{ borderColor: '#f59e0b' }}>
              <div className="axis-group-header" style={{ color: '#fcd34d' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <Zap size={13} />
                  {snapshot.year}년 전후 인접 전환점 및 주요 사건
                </span>
              </div>

              {snapshot.nearbyTransitions.map((trn) => (
                <div
                  key={trn.id}
                  className="transition-card"
                  onClick={() => onSelectTransition(trn.id, trn.time.year)}
                >
                  <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700 }}>
                    [인과 전환 · {trn.time.displayLabel}]
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: '#f8fafc' }}>
                    {trn.title}
                  </div>
                </div>
              ))}

              {snapshot.nearbyEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="transition-card"
                  onClick={() => onSelectEvent(evt.id, evt.time.year)}
                >
                  <div style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700 }}>
                    [역사 사건 · {evt.time.displayLabel}]
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: '#f8fafc' }}>
                    {evt.title}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }
);
