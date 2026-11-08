/**
 * @file ValidationBadgeModal.tsx
 * @description Modal displaying the 12-rule Oracle Contract Validator report and DomainPack ontology statistics (Proposal 3).
 */

import React from 'react';
import { CheckCircle2, X } from 'lucide-react';
import type { ValidationReport } from '../contracts/timeline.contract';

export interface ValidationBadgeModalProps {
  isOpen: boolean;
  report: ValidationReport;
  onClose: () => void;
}

const RULE_DESCRIPTIONS: Array<{ code: string; desc: string }> = [
  { code: 'V01_ID_FORMAT', desc: '모든 원자 ID 접두사(axis_, ent_, seg_, trn_, evt_, evd_) 및 고유성 준수' },
  { code: 'V02_AXIS_REF', desc: '모든 Entity의 주/부 소속 트랙(axisId) 참조 무결성' },
  { code: 'V03_ENTITY_TIME', desc: '모든 Entity의 시작·종료 AstroTime 정합성 및 팩 범위 포함' },
  { code: 'V04_SEGMENT_BOUNDS', desc: '모든 StateSegment의 부모 Entity 존속 범위 내 포함' },
  { code: 'V05_SEGMENT_NO_OVERLAP', desc: '동일 Entity 내 StateSegment 간 시간 중첩/역전 제로' },
  { code: 'V06_POWER_WEIGHT', desc: '산키(Time-River) 스트림 두께 가중치(1~100) 범위 준수' },
  { code: 'V07_TRANSITION_REFS', desc: '모든 Transition의 선행/후속 Entity ID 참조 무결성' },
  { code: 'V08_TRANSITION_CAUSALITY', desc: '모든 Transition의 원인(causes)·도화선(triggers)·결과(consequences)·요인 필수 포함' },
  { code: 'V09_EVIDENCE_REQUIRED', desc: '모든 변화(Transition)와 사건(Event)에 최소 1개 이상의 사료 Evidence 연결' },
  { code: 'V10_EVENT_REFS', desc: '모든 HistoricalEvent의 관련 Entity 참조 무결성' },
  { code: 'V11_TEMPORAL_CAUSALITY', desc: '시간 인과율 준수 (전환 시점이 선행 모체 시작 연도보다 앞설 수 없음)' },
  { code: 'V12_ENTITY_COVERAGE', desc: '고립된 개체 없이 모든 Entity가 StateSegment 및 인과 그래프에 연결됨' },
];

export const ValidationBadgeModal: React.FC<ValidationBadgeModalProps> = React.memo(
  ({ isOpen, report, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 14,
              paddingBottom: 10,
              borderBottom: '1px solid #263248',
            }}
          >
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#f8fafc' }}>
                🏛️ 오라클 데이터 스키마 & 인과 무결성 계약 검증 리포트
              </h3>
              <p style={{ fontSize: 12, color: '#94a3b8' }}>
                대상 도메인 팩: [{report.packId}] {report.packTitle}
              </p>
            </div>
            <button
              type="button"
              className="preset-btn"
              onClick={onClose}
              aria-label="닫기"
            >
              <X size={16} />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 10,
              marginBottom: 16,
            }}
          >
            <div className="axis-snapshot-group">
              <div style={{ fontSize: 11, color: '#94a3b8' }}>차원 트랙 (Axes) / 개체 (Entities)</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc' }}>
                {report.stats.axesCount}개 축 / {report.stats.entitiesCount}개 주체
              </div>
            </div>
            <div className="axis-snapshot-group">
              <div style={{ fontSize: 11, color: '#94a3b8' }}>상태 구간 (Segments) / 인과 전환 (Transitions)</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#10b981' }}>
                {report.stats.segmentsCount}개 구간 / {report.stats.transitionsCount}개 인과 간선
              </div>
            </div>
            <div className="axis-snapshot-group">
              <div style={{ fontSize: 11, color: '#94a3b8' }}>주요 사건 (Events) / 사료 근거 (Evidences)</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#60a5fa' }}>
                {report.stats.eventsCount}개 사건 / {report.stats.evidencesCount}개 사료
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {RULE_DESCRIPTIONS.map((rule) => {
              const hasError = report.issues.some(
                (i) => i.ruleCode === rule.code && i.severity === 'ERROR'
              );
              return (
                <div
                  key={rule.code}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '7px 10px',
                    backgroundColor: '#111827',
                    border: '1px solid #1e293b',
                    borderRadius: 5,
                    fontSize: 12,
                  }}
                >
                  <span>
                    <strong style={{ color: '#93c5fd', marginRight: 8 }}>{rule.code}</strong>
                    <span style={{ color: '#e2e8f0' }}>{rule.desc}</span>
                  </span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      color: hasError ? '#f43f5e' : '#10b981',
                      fontWeight: 700,
                    }}
                  >
                    <CheckCircle2 size={14} />
                    {hasError ? 'FAIL' : 'PASS'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);
