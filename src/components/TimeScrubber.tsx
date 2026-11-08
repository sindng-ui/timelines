/**
 * @file TimeScrubber.tsx
 * @description Precision temporal scrubber bar with EraMilestone quick-jumps, watershed event bookmarks, and Play/Pause controller.
 */

import React, { useMemo } from 'react';
import { Play, Pause, RotateCcw, Compass } from 'lucide-react';
import type { DomainPack } from '../contracts/timeline.contract';
import { formatYearDisplay } from '../core/astroTime';

export interface TimeScrubberProps {
  pack: DomainPack;
  currentYear: number;
  activeEraName: string;
  isPlaying: boolean;
  onYearChange: (year: number) => void;
  onTogglePlay: () => void;
  onResetFocusYear: () => void;
  onSelectEventAndYear: (eventId: string, year: number) => void;
}

export const TimeScrubber: React.FC<TimeScrubberProps> = React.memo(
  ({
    pack,
    currentYear,
    activeEraName,
    isPlaying,
    onYearChange,
    onTogglePlay,
    onResetFocusYear,
    onSelectEventAndYear,
  }) => {
    const watershedEvents = useMemo(
      () =>
        pack.events
          .filter((e) => e.importance === 3)
          .sort((a, b) => a.time.sortKey - b.time.sortKey),
      [pack.events]
    );

    return (
      <section className="scrubber-bar" aria-label="시간축 탐색 및 시대 이동 컨트롤">
        <div className="scrubber-top-row">
          <div className="year-readout">
            <span className="year-number">{formatYearDisplay(currentYear)}</span>
            <span className="era-pill">{activeEraName}</span>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>
              ({pack.subtitle})
            </span>
          </div>

          <div className="preset-group">
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 12,
                color: '#94a3b8',
              }}
            >
              <Compass size={13} />
              시대 점프:
            </span>
            {pack.eraMilestones.map((era) => {
              const isCurrentEra =
                currentYear >= era.startYear && currentYear <= era.endYear;
              return (
                <button
                  key={era.id}
                  type="button"
                  className={`preset-btn ${isCurrentEra ? 'active' : ''}`}
                  onClick={() => onYearChange(era.startYear)}
                  title={era.description}
                >
                  {era.name} ({era.startYear}~{era.endYear})
                </button>
              );
            })}
          </div>
        </div>

        <div className="slider-row">
          <button
            type="button"
            className="play-btn"
            onClick={onTogglePlay}
            title={isPlaying ? '시간 흐름 일시정지' : '시간 흐름 자동 재생'}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            {isPlaying ? '일시정지' : '타임라인 재생'}
          </button>

          <button
            type="button"
            className="preset-btn"
            onClick={onResetFocusYear}
            title="핵심 분기 연도로 복귀"
          >
            <RotateCcw size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            핵심 연도 ({pack.timeRange.defaultFocusYear}년)
          </button>

          <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>
            {pack.timeRange.startYear}년
          </span>

          <input
            type="range"
            className="time-slider"
            min={pack.timeRange.startYear}
            max={pack.timeRange.endYear}
            step={1}
            value={currentYear}
            onChange={(e) => onYearChange(Number(e.target.value))}
            aria-label="연도 조작 슬라이더"
          />

          <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>
            {pack.timeRange.endYear}년
          </span>
        </div>

        <div className="preset-group" style={{ paddingTop: 2 }}>
          <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700 }}>
            ⚡ 결정적 전환 사건 바로가기:
          </span>
          {watershedEvents.map((evt) => (
            <button
              key={evt.id}
              type="button"
              className={`preset-btn ${currentYear === evt.time.year ? 'active' : ''}`}
              onClick={() => onSelectEventAndYear(evt.id, evt.time.year)}
            >
              [{evt.time.year}년] {evt.title.split('—')[0].trim()}
            </button>
          ))}
        </div>
      </section>
    );
  }
);
