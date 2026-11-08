/**
 * @file TopControlBar.tsx
 * @description DomainPack switcher, Factor perspective filter toggle bar, and Oracle Contract Validator badge.
 */

import React from 'react';
import { ShieldCheck, Filter, Layers } from 'lucide-react';
import type {
  DomainPack,
  FactorTag,
  ValidationReport,
} from '../contracts/timeline.contract';

export interface TopControlBarProps {
  packs: DomainPack[];
  activePack: DomainPack;
  onSelectPack: (packId: string) => void;
  activeFactor: FactorTag | 'ALL';
  onSelectFactor: (factor: FactorTag | 'ALL') => void;
  validationReport: ValidationReport;
  onOpenValidationModal: () => void;
}

const FACTOR_OPTIONS: Array<{ value: FactorTag | 'ALL'; label: string }> = [
  { value: 'ALL', label: '전체 요인 (All)' },
  { value: 'POLITICAL', label: '정치·권력 (Political)' },
  { value: 'MILITARY', label: '군사·전쟁 (Military)' },
  { value: 'ECONOMIC', label: '경제·조세 (Economic)' },
  { value: 'DIPLOMATIC', label: '외교·국제 (Diplomatic)' },
  { value: 'SOCIAL', label: '사회·호족·유민 (Social)' },
  { value: 'IDEOLOGICAL', label: '사상·이론·명분 (Ideological)' },
];

export const TopControlBar: React.FC<TopControlBarProps> = React.memo(
  ({
    packs,
    activePack,
    onSelectPack,
    activeFactor,
    onSelectFactor,
    validationReport,
    onOpenValidationModal,
  }) => {
    return (
      <header className="top-bar">
        <div className="brand-group">
          <span className="brand-badge">
            <Layers size={14} />
            CHRONO-NEXUS ORACLE ENGINE
          </span>

          <select
            className="pack-select"
            value={activePack.id}
            onChange={(e) => onSelectPack(e.target.value)}
            aria-label="도메인 타임라인 팩 선택"
          >
            {packs.map((pack) => (
              <option key={pack.id} value={pack.id}>
                [{pack.domainType}] {pack.title}
              </option>
            ))}
          </select>
        </div>

        <div className="factor-bar" role="group" aria-label="변화 요인별 필터">
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 12,
              color: '#94a3b8',
              marginRight: 4,
            }}
          >
            <Filter size={13} />
            인과 요인 필터:
          </span>
          {FACTOR_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`factor-btn ${activeFactor === opt.value ? 'active' : ''}`}
              onClick={() => onSelectFactor(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="contract-badge-btn"
          onClick={onOpenValidationModal}
          title="클릭하여 12대 오라클 스키마 및 인과 무결성 검증 리포트 확인"
        >
          <ShieldCheck size={15} />
          Oracle Contract: {validationReport.passedRulesCount}/
          {validationReport.totalRulesChecked} Verified
        </button>
      </header>
    );
  }
);
