/**
 * @file CausalLineageTracer.tsx
 * @description 3-Stage Causal Lineage Tracer (Proposal 2).
 * Answers "What came before, why did it change, how did it evolve internally, and what did it become next?"
 */

import React from 'react';
import { ArrowDownRight, ArrowUpLeft, GitCommit,Milestone } from 'lucide-react';
import type { StateSegment, Transition } from '../contracts/timeline.contract';
import type { CausalLineageResult } from '../contracts/worker.contract';

export interface CausalLineageTracerProps {
  lineage: CausalLineageResult;
  focusSegments: StateSegment[];
  onSelectEntity: (entityId: string) => void;
  onSelectTransition: (transitionId: string, year: number) => void;
  onSelectEvent: (eventId: string, year: number) => void;
}

const renderTransitionDetailCard = (
  trn: Transition,
  isSelected: boolean,
  onSelectTransition: (id: string, year: number) => void
) => (
  <div
    key={trn.id}
    className={`transition-card ${isSelected ? 'selected' : ''}`}
    onClick={() => onSelectTransition(trn.id, trn.time.year)}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 800,
          color: '#f59e0b',
          backgroundColor: '#451a03',
          padding: '2px 6px',
          borderRadius: 4,
        }}
      >
        {trn.type} · {trn.time.displayLabel}
      </span>
      <span style={{ fontSize: 11, color: '#94a3b8' }}>
        요인: {trn.factors.join(', ')}
      </span>
    </div>

    <div style={{ fontSize: 13.5, fontWeight: 800, color: '#f8fafc', marginBottom: 5 }}>
      {trn.title}
    </div>

    <p style={{ fontSize: 12, color: '#cbd5e1', marginBottom: 8 }}>{trn.summary}</p>

    <div className="causal-point-list">
      {trn.causes.map((c, idx) => (
        <div
          key={`cause_${idx}`}
          className="causal-point-item"
          style={{ borderLeftColor: '#f43f5e' }}
        >
          <strong style={{ color: '#fda4af' }}>[근본 원인 · {c.factor}] {c.title}:</strong>{' '}
          <span style={{ color: '#cbd5e1' }}>{c.description}</span>
        </div>
      ))}
      {trn.triggers.map((t, idx) => (
        <div
          key={`trig_${idx}`}
          className="causal-point-item"
          style={{ borderLeftColor: '#f59e0b' }}
        >
          <strong style={{ color: '#fcd34d' }}>[직접 도화선 · {t.factor}] {t.title}:</strong>{' '}
          <span style={{ color: '#cbd5e1' }}>{t.description}</span>
        </div>
      ))}
      {trn.consequences.map((con, idx) => (
        <div
          key={`cons_${idx}`}
          className="causal-point-item"
          style={{ borderLeftColor: '#10b981' }}
        >
          <strong style={{ color: '#6ee7b7' }}>[역사적 귀결 · {con.factor}] {con.title}:</strong>{' '}
          <span style={{ color: '#cbd5e1' }}>{con.description}</span>
        </div>
      ))}
    </div>
  </div>
);

export const CausalLineageTracer: React.FC<CausalLineageTracerProps> = React.memo(
  ({
    lineage,
    focusSegments,
    onSelectEntity,
    onSelectTransition,
    onSelectEvent,
  }) => {
    return (
      <section className="panel-card" aria-label="전후 인과관계 추적 스토리보드">
        <div className="section-header">
          <div className="section-title">
            <GitCommit size={16} color="#ec4899" />
            <span>
              [전후 인과 계보 추적기 (Why & How)] — 앞뒤에 무엇이 있었고 왜 변했는가?
            </span>
          </div>
        </div>

        <div className="panel-body">
          {/* Focus Header Banner */}
          <div
            style={{
              padding: '10px 12px',
              backgroundColor: '#172554',
              border: '1px solid #3b82f6',
              borderRadius: 6,
            }}
          >
            <div style={{ fontSize: 11, color: '#93c5fd', fontWeight: 700 }}>
              현재 추적 대상 ({lineage.focusType})
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#ffffff', margin: '2px 0 4px' }}>
              {lineage.focusTitle}
            </div>
            <p style={{ fontSize: 12, color: '#dbeafe' }}>{lineage.focusSummary}</p>

            {/* Connected Entities Quick Switcher */}
            {lineage.relatedEntities.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 6,
                  marginTop: 8,
                  paddingTop: 8,
                  borderTop: '1px solid #1e3a8a',
                }}
              >
                <span style={{ fontSize: 11, color: '#93c5fd', fontWeight: 700 }}>
                  연결된 전후 국가/이론 바로 이동:
                </span>
                {lineage.relatedEntities.map((ent) => (
                  <button
                    key={ent.id}
                    type="button"
                    className={`preset-btn ${
                      lineage.focusType === 'ENTITY' && lineage.focusId === ent.id
                        ? 'active'
                        : ''
                    }`}
                    style={{ borderLeft: `3px solid ${ent.color}` }}
                    onClick={() => onSelectEntity(ent.id)}
                  >
                    {ent.name} ({ent.startTime.year}~{ent.endTime.year})
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Stage 1: Upstream Causes */}
          <div className="lineage-stage">
            <div className="lineage-stage-header" style={{ color: '#fda4af' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <ArrowUpLeft size={14} />
                1단계: 선행 배경 및 분열·탄생 인과 (앞에 무엇이 있었고 왜 등장했는가?)
              </span>
              <span>{lineage.upstreamTransitions.length}건</span>
            </div>

            {lineage.upstreamTransitions.length === 0 ? (
              <div style={{ fontSize: 12, color: '#64748b' }}>
                현재 타임라인 범위의 시작점에 해당하는 원류 주체입니다.
              </div>
            ) : (
              lineage.upstreamTransitions.map((trn) =>
                renderTransitionDetailCard(
                  trn,
                  lineage.focusType === 'TRANSITION' && lineage.focusId === trn.id,
                  onSelectTransition
                )
              )
            )}
          </div>

          {/* Stage 2: Internal State Segments & Events */}
          {focusSegments.length > 0 && (
            <div className="lineage-stage">
              <div className="lineage-stage-header" style={{ color: '#93c5fd' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <Milestone size={14} />
                  2단계: 내부 시기별 변천 (국호 변경 · 천도 · 전성기/쇠퇴기 흐름)
                </span>
                <span>{focusSegments.length}단계</span>
              </div>

              {focusSegments.map((seg, idx) => (
                <div
                  key={seg.id}
                  style={{
                    padding: '8px 10px',
                    backgroundColor: '#161f30',
                    borderLeft: '3px solid #38bdf8',
                    borderRadius: 4,
                    marginBottom: idx === focusSegments.length - 1 ? 0 : 8,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: '#f8fafc',
                    }}
                  >
                    <span>
                      [{seg.officialName}] {seg.phaseTitle}
                    </span>
                    <span style={{ color: '#fcd34d', fontSize: 11 }}>
                      {seg.startTime.year}~{seg.endTime.year}년 (비중 {seg.powerWeight})
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4 }}>
                    {seg.stateDescription}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Stage 3: Downstream Consequences */}
          <div className="lineage-stage">
            <div className="lineage-stage-header" style={{ color: '#6ee7b7' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <ArrowDownRight size={14} />
                3단계: 후속 변화 및 통합 귀결 (이후 어떤 국가/이론으로 어떻게 이어졌는가?)
              </span>
              <span>{lineage.downstreamTransitions.length}건</span>
            </div>

            {lineage.downstreamTransitions.length === 0 ? (
              <div style={{ fontSize: 12, color: '#64748b' }}>
                현재 타임라인 범위의 최종 통합 단계까지 존속하는 주체입니다.
              </div>
            ) : (
              lineage.downstreamTransitions.map((trn) =>
                renderTransitionDetailCard(
                  trn,
                  lineage.focusType === 'TRANSITION' && lineage.focusId === trn.id,
                  onSelectTransition
                )
              )
            )}
          </div>

          {/* Related Watershed Events */}
          {lineage.relatedEvents.length > 0 && (
            <div className="lineage-stage">
              <div className="lineage-stage-header" style={{ color: '#fcd34d' }}>
                <span>⚡ 관련 결정적 역사/과학 사건 ({lineage.relatedEvents.length}건)</span>
              </div>
              {lineage.relatedEvents.map((evt) => (
                <div
                  key={evt.id}
                  className={`transition-card ${
                    lineage.focusType === 'EVENT' && lineage.focusId === evt.id
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() => onSelectEvent(evt.id, evt.time.year)}
                >
                  <div style={{ fontSize: 11, color: '#fcd34d', fontWeight: 700 }}>
                    [{evt.time.displayLabel} · {evt.locationOrContext ?? '-'}]
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>
                    {evt.title}
                  </div>
                  <p style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4 }}>
                    {evt.summary}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }
);
