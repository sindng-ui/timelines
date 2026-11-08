/**
 * @file EvidenceDrawer.tsx
 * @description Displays primary-source Evidence cards, reliability grades, citations, and scholarly debates (Proposal 4).
 */

import React from 'react';
import { BookOpen, Scale, AlertCircle } from 'lucide-react';
import type { Evidence, ReliabilityGrade } from '../contracts/timeline.contract';

export interface EvidenceDrawerProps {
  evidences: Evidence[];
  focusTitle: string;
}

const RELIABILITY_TEXT: Record<ReliabilityGrade, string> = {
  CERTAIN: 'CERTAIN · 1차 사료/실험 교차검증 정설',
  PROBABLE: 'PROBABLE · 유력 사료 통설',
  DEBATED: 'DEBATED · 학설 논쟁/이설 존재',
};

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = React.memo(
  ({ evidences, focusTitle }) => {
    return (
      <section className="panel-card" aria-label="사료 및 근거 검증 패널">
        <div className="section-header">
          <div className="section-title">
            <BookOpen size={16} color="#3b82f6" />
            <span>
              [근거 · 사료 · 학설 검증 카드] ({evidences.length}건 연결됨)
            </span>
          </div>
        </div>

        <div className="panel-body">
          <div
            style={{
              fontSize: 12,
              color: '#94a3b8',
              padding: '6px 10px',
              backgroundColor: '#111827',
              borderRadius: 5,
              border: '1px solid #1e293b',
            }}
          >
            선택 대상 <strong style={{ color: '#f8fafc' }}>{focusTitle}</strong>의 인과관계를 뒷받침하는 1차 사료 및 학술 근거입니다.
          </div>

          {evidences.map((evd) => (
            <article key={evd.id} className="evidence-card">
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 6,
                  marginBottom: 6,
                }}
              >
                <span className={`reliability-badge reliability-${evd.reliability}`}>
                  {RELIABILITY_TEXT[evd.reliability]}
                </span>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>
                  요인: {evd.factors.join(', ')}
                </span>
              </div>

              <h4 style={{ fontSize: 13.5, fontWeight: 800, color: '#f8fafc', marginBottom: 4 }}>
                {evd.title}
              </h4>

              <div
                style={{
                  fontSize: 11.5,
                  color: '#60a5fa',
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                📜 출전: {evd.sourceCitation}
              </div>

              <blockquote
                style={{
                  padding: '8px 10px',
                  backgroundColor: '#161f30',
                  borderLeft: '3px solid #f59e0b',
                  borderRadius: 4,
                  fontSize: 12,
                  color: '#f1f5f9',
                  marginBottom: 8,
                }}
              >
                {evd.quoteOrSummary}
              </blockquote>

              <div style={{ fontSize: 12, color: '#cbd5e1', marginBottom: evd.alternativeView ? 8 : 0 }}>
                <strong style={{ color: '#6ee7b7' }}>
                  <Scale size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  인과 해설:
                </strong>{' '}
                {evd.interpretation}
              </div>

              {evd.alternativeView && (
                <div
                  style={{
                    padding: '7px 9px',
                    backgroundColor: '#27170a',
                    border: '1px solid #92400e',
                    borderRadius: 4,
                    fontSize: 11.5,
                    color: '#fde68a',
                  }}
                >
                  <strong>
                    <AlertCircle size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                    사학계/학계 이설 및 비판적 시각:
                  </strong>{' '}
                  {evd.alternativeView}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    );
  }
);
