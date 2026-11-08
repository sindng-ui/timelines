/**
 * @file TimeRiverCanvas.tsx
 * @description Sankey-style Time-River stream visualization (Proposal 1).
 * Renders Axis tracks, variable-thickness StateSegment streams, Bezier split/merge Transition ribbons,
 * watershed Event nodes, and an interactive Time Cursor.
 */

import React, { useMemo, useState, useRef, useCallback } from 'react';
import { GitBranch, ZoomIn, ZoomOut } from 'lucide-react';
import type {
  DomainPack,
  FactorTag,
  TransitionType,
} from '../contracts/timeline.contract';
import type { RiverLayoutResult } from '../contracts/worker.contract';

export interface TimeRiverCanvasProps {
  pack: DomainPack;
  layout: RiverLayoutResult;
  currentYear: number;
  activeFactor: FactorTag | 'ALL';
  selectedFocusType: 'ENTITY' | 'TRANSITION' | 'EVENT';
  selectedFocusId: string;
  highlightedEntityIds: string[];
  highlightedTransitionIds: string[];
  onSelectEntity: (entityId: string) => void;
  onSelectTransition: (transitionId: string, year: number) => void;
  onSelectEvent: (eventId: string, year: number) => void;
  onScrubYear: (year: number) => void;
}

const TRANSITION_COLOR_MAP: Record<TransitionType, string> = {
  FOUNDATION: '#10b981',
  SPLIT: '#f43f5e',
  MERGE: '#38bdf8',
  REGIME_CHANGE: '#f59e0b',
  INFLUENCE: '#a855f7',
};

const TRANSITION_LABEL_MAP: Record<TransitionType, string> = {
  FOUNDATION: '창시/건국',
  SPLIT: '분열/독립 (Split)',
  MERGE: '통합/병합 (Merge)',
  REGIME_CHANGE: '역성혁명/교체',
  INFLUENCE: '외부자극/전쟁',
};

export const TimeRiverCanvas: React.FC<TimeRiverCanvasProps> = React.memo(
  ({
    pack,
    layout,
    currentYear,
    activeFactor,
    selectedFocusType,
    selectedFocusId,
    highlightedEntityIds,
    highlightedTransitionIds,
    onSelectEntity,
    onSelectTransition,
    onSelectEvent,
    onScrubYear,
  }) => {
    const [zoomMode, setZoomMode] = useState<'FULL' | 'FOCUS_WINDOW'>('FULL');
    const [isDragging, setIsDragging] = useState(false);
    const svgRef = useRef<SVGSVGElement>(null);

    const { viewStartYear, viewEndYear, canvasWidthPx } = useMemo(() => {
      if (zoomMode === 'FOCUS_WINDOW') {
        const focusEra =
          pack.eraMilestones.find(
            (e) =>
              pack.timeRange.defaultFocusYear >= e.startYear &&
              pack.timeRange.defaultFocusYear <= e.endYear
          ) ?? pack.eraMilestones[0];
        const pad = Math.max(
          15,
          Math.round((focusEra.endYear - focusEra.startYear) * 0.25)
        );
        return {
          viewStartYear: Math.max(pack.timeRange.startYear, focusEra.startYear - pad),
          viewEndYear: Math.min(pack.timeRange.endYear, focusEra.endYear + pad),
          canvasWidthPx: 1480,
        };
      }
      return {
        viewStartYear: pack.timeRange.startYear,
        viewEndYear: pack.timeRange.endYear,
        canvasWidthPx: 1360,
      };
    }, [zoomMode, pack]);

    const LEFT_GUTTER_PX = 215;
    const RIGHT_PADDING_PX = 36;
    const plotWidthPx = canvasWidthPx - LEFT_GUTTER_PX - RIGHT_PADDING_PX;
    const viewSpan = Math.max(1, viewEndYear - viewStartYear);

    const yearToX = (year: number): number => {
      const ratio = (year - viewStartYear) / viewSpan;
      return LEFT_GUTTER_PX + ratio * plotWidthPx;
    };

    const xToYear = (clientX: number, svgRect: DOMRect): number => {
      const relX = clientX - svgRect.left - LEFT_GUTTER_PX;
      const clampedRatio = Math.max(0, Math.min(1, relX / plotWidthPx));
      return Math.round(viewStartYear + clampedRatio * viewSpan);
    };

    const highlightEntitySet = useMemo(
      () => new Set(highlightedEntityIds),
      [highlightedEntityIds]
    );
    const highlightTrnSet = useMemo(
      () => new Set(highlightedTransitionIds),
      [highlightedTransitionIds]
    );

    const yearTicks = useMemo(() => {
      const step = viewSpan <= 120 ? 10 : viewSpan <= 350 ? 25 : 50;
      const firstTick = Math.ceil(viewStartYear / step) * step;
      const ticks: number[] = [];
      for (let y = firstTick; y <= viewEndYear; y += step) {
        ticks.push(y);
      }
      return ticks;
    }, [viewStartYear, viewEndYear, viewSpan]);

    const cursorX = yearToX(currentYear);

    const handleScrub = useCallback(
      (clientX: number) => {
        if (!svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        const year = xToYear(clientX, rect);
        onScrubYear(year);
      },
      [viewStartYear, viewSpan, plotWidthPx, onScrubYear]
    );

    const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
      const target = e.target as SVGElement;
      const isCursorHit = target.dataset.cursorHit === 'true';
      const isRulerHit = target.dataset.rulerHit === 'true';
      const isInteractive = target.dataset.interactive === 'true';

      // Start drag if clicking cursor, top ruler strip, or non-interactive background
      if (isCursorHit || isRulerHit || !isInteractive) {
        setIsDragging(true);
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          // ignore
        }
        handleScrub(e.clientX);
      }
    };

    const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
      if (isDragging) {
        handleScrub(e.clientX);
      }
    };

    const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
      if (isDragging) {
        setIsDragging(false);
        try {
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
          // ignore
        }
      }
    };

    return (
      <section className="river-card" aria-label="Time-River 산키 분열·통합 캔버스">
        <div className="section-header">
          <div className="section-title">
            <GitBranch size={16} color="#f59e0b" />
            <span>
              Time-River (산키 시간 강줄기 & 인과 분열·통합 그래프) — 줄기 두께는 시대별 세력·영향력 비중(powerWeight)을 나타냅니다
            </span>
          </div>

          <div className="legend-group">
            {(Object.keys(TRANSITION_COLOR_MAP) as TransitionType[]).map((tType) => (
              <span key={tType} className="legend-item">
                <span
                  className="legend-dot"
                  style={{ backgroundColor: TRANSITION_COLOR_MAP[tType] }}
                />
                {TRANSITION_LABEL_MAP[tType]}
              </span>
            ))}

            <button
              type="button"
              className={`preset-btn ${zoomMode === 'FOCUS_WINDOW' ? 'active' : ''}`}
              onClick={() =>
                setZoomMode((prev) => (prev === 'FULL' ? 'FOCUS_WINDOW' : 'FULL'))
              }
            >
              {zoomMode === 'FULL' ? (
                <>
                  <ZoomIn size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  핵심 격변기(후삼국 등) 집중 확대
                </>
              ) : (
                <>
                  <ZoomOut size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  전체 시대 한눈에 보기 ({pack.timeRange.startYear}~{pack.timeRange.endYear})
                </>
              )}
            </button>
          </div>
        </div>

        <div className="river-scroll-wrapper">
          <svg
            ref={svgRef}
            width={canvasWidthPx}
            height={layout.totalHeightPx}
            style={{
              display: 'block',
              userSelect: 'none',
              cursor: isDragging ? 'ew-resize' : 'default',
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {/* Top Scrubber Ruler Hit Bar */}
            <rect
              data-ruler-hit="true"
              x={LEFT_GUTTER_PX}
              y={0}
              width={plotWidthPx}
              height={26}
              fill="#0d1424"
              fillOpacity={0.8}
              stroke="#1e293b"
              strokeWidth={1}
              style={{ cursor: 'ew-resize' }}
            >
              <title>시간 드래그 스크러버 — 좌우로 드래그하여 시점을 이동하세요</title>
            </rect>

            {/* 1. Macro-Era Background Bands */}
            {pack.eraMilestones.map((era) => {
              const x1 = Math.max(LEFT_GUTTER_PX, yearToX(era.startYear));
              const x2 = Math.min(
                LEFT_GUTTER_PX + plotWidthPx,
                yearToX(era.endYear)
              );
              if (x2 <= x1) return null;
              return (
                <g key={era.id}>
                  <rect
                    x={x1}
                    y={0}
                    width={x2 - x1}
                    height={layout.totalHeightPx}
                    fill={era.color}
                    fillOpacity={0.04}
                  />
                  <text
                    x={x1 + 8}
                    y={18}
                    fill={era.color}
                    fontSize={11}
                    fontWeight={700}
                  >
                    {era.name} ({era.startYear}~{era.endYear})
                  </text>
                </g>
              );
            })}

            {/* 2. Axis Horizontal Swimlanes */}
            {layout.axisBands.map((band, idx) => (
              <g key={band.axis.id}>
                <rect
                  x={0}
                  y={band.topPx}
                  width={canvasWidthPx}
                  height={band.heightPx}
                  fill={idx % 2 === 0 ? '#0c121e' : '#090d16'}
                  stroke="#1e293b"
                  strokeWidth={1}
                />
                {/* Left Axis Header Box */}
                <rect
                  x={0}
                  y={band.topPx}
                  width={LEFT_GUTTER_PX}
                  height={band.heightPx}
                  fill="#111827"
                  stroke="#263248"
                  strokeWidth={1}
                />
                <rect
                  x={0}
                  y={band.topPx}
                  width={5}
                  height={band.heightPx}
                  fill={band.axis.accentColor}
                />
                <text
                  x={14}
                  y={band.topPx + 32}
                  fill="#f8fafc"
                  fontSize={12.5}
                  fontWeight={800}
                >
                  {band.axis.name}
                </text>
                <foreignObject
                  x={14}
                  y={band.topPx + 40}
                  width={LEFT_GUTTER_PX - 24}
                  height={band.heightPx - 46}
                >
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#94a3b8',
                      lineHeight: '1.35',
                    }}
                  >
                    {band.axis.description}
                  </div>
                </foreignObject>
              </g>
            ))}

            {/* 3. Vertical Year Grid Lines */}
            {yearTicks.map((tickYear) => {
              const tx = yearToX(tickYear);
              return (
                <g key={tickYear}>
                  <line
                    x1={tx}
                    y1={28}
                    x2={tx}
                    y2={layout.totalHeightPx}
                    stroke="#1e293b"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={tx}
                    y={36}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize={10.5}
                    fontWeight={600}
                  >
                    {tickYear}년
                  </text>
                </g>
              );
            })}

            {/* 4. Sankey Split & Merge Bezier Ribbons (Transitions) */}
            {layout.ribbons.map((rib, idx) => {
              const trn = rib.transition;
              const matchesFactor =
                activeFactor === 'ALL' || trn.factors.includes(activeFactor);
              const trnX = yearToX(trn.time.year);
              if (
                trnX < LEFT_GUTTER_PX - 40 ||
                trnX > LEFT_GUTTER_PX + plotWidthPx + 40
              ) {
                return null;
              }

              const isSelected =
                selectedFocusType === 'TRANSITION' && selectedFocusId === trn.id;
              const isHighlighted = highlightTrnSet.has(trn.id);
              const ribbonColor = TRANSITION_COLOR_MAP[trn.type];

              const startX = Math.max(LEFT_GUTTER_PX, trnX - 24);
              const endX = Math.min(LEFT_GUTTER_PX + plotWidthPx, trnX + 24);
              const midX = (startX + endX) / 2;
              const dPath = `M ${startX} ${rib.fromY} C ${midX} ${rib.fromY}, ${midX} ${rib.toY}, ${endX} ${rib.toY}`;

              const opacity = !matchesFactor
                ? 0.12
                : isSelected
                ? 0.98
                : isHighlighted
                ? 0.82
                : 0.48;

              return (
                <g
                  key={`${trn.id}_${rib.fromEntityId ?? 'root'}_${rib.toEntityId}_${idx}`}
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTransition(trn.id, trn.time.year);
                  }}
                >
                  <path
                    data-interactive="true"
                    d={dPath}
                    fill="none"
                    stroke={ribbonColor}
                    strokeWidth={isSelected ? rib.strokeWidth + 3 : rib.strokeWidth}
                    strokeOpacity={opacity}
                    strokeLinecap="round"
                  />
                  {/* Clickable Transition Junction Node */}
                  <circle
                    data-interactive="true"
                    cx={trnX}
                    cy={(rib.fromY + rib.toY) / 2}
                    r={isSelected ? 7 : 5}
                    fill={ribbonColor}
                    stroke="#0b0f17"
                    strokeWidth={1.5}
                    opacity={matchesFactor ? 0.95 : 0.2}
                  >
                    <title>
                      [{trn.time.displayLabel}] {trn.title} ({TRANSITION_LABEL_MAP[trn.type]}) — 클릭하여 왜 변했는지 인과·사료 확인
                    </title>
                  </circle>
                </g>
              );
            })}

            {/* 5. Entity & StateSegment Variable-Width River Streams */}
            {layout.streamNodes.map((node) => {
              const ent = node.entity;
              const isSelected =
                selectedFocusType === 'ENTITY' && selectedFocusId === ent.id;
              const isHighlighted = highlightEntitySet.has(ent.id);
              const isActiveAtCurrentYear =
                currentYear >= ent.startTime.year && currentYear <= ent.endTime.year;

              const entStartX = Math.max(
                LEFT_GUTTER_PX,
                yearToX(ent.startTime.year)
              );
              const entEndX = Math.min(
                LEFT_GUTTER_PX + plotWidthPx,
                yearToX(ent.endTime.year)
              );
              if (entEndX <= LEFT_GUTTER_PX || entStartX >= LEFT_GUTTER_PX + plotWidthPx) {
                return null;
              }

              const streamOpacity = isSelected
                ? 1
                : isHighlighted
                ? 0.92
                : isActiveAtCurrentYear
                ? 0.85
                : 0.45;

              return (
                <g
                  key={ent.id}
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectEntity(ent.id);
                  }}
                >
                  {/* Individual StateSegment variable-thickness bars */}
                  {node.segmentBoxes.map((sBox) => {
                    const sx1 = Math.max(
                      LEFT_GUTTER_PX,
                      yearToX(sBox.segment.startTime.year)
                    );
                    const sx2 = Math.min(
                      LEFT_GUTTER_PX + plotWidthPx,
                      yearToX(sBox.segment.endTime.year)
                    );
                    if (sx2 <= sx1) return null;

                    const width = Math.max(6, sx2 - sx1);
                    const topY = sBox.yCenterPx - sBox.heightPx / 2;

                    return (
                      <g key={sBox.segment.id}>
                        <rect
                          data-interactive="true"
                          x={sx1}
                          y={topY}
                          width={width}
                          height={sBox.heightPx}
                          rx={5}
                          fill={ent.color}
                          fillOpacity={streamOpacity}
                          stroke={isSelected ? '#f59e0b' : '#0f172a'}
                          strokeWidth={isSelected ? 2.2 : 1.2}
                        >
                          <title>
                            {ent.name} — [{sBox.segment.officialName}] ({sBox.segment.startTime.year}~{sBox.segment.endTime.year}년) | 세력 비중: {sBox.segment.powerWeight} | 수도/거점: {sBox.segment.capitalOrCenter ?? '-'}
                          </title>
                        </rect>

                        {/* Segment official name label if wide enough */}
                        {width > 58 && (
                          <text
                            data-interactive="true"
                            x={sx1 + width / 2}
                            y={sBox.yCenterPx + 4}
                            textAnchor="middle"
                            fill="#ffffff"
                            fontSize={11}
                            fontWeight={700}
                            style={{ pointerEvents: 'none' }}
                          >
                            {sBox.segment.officialName}
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* Entity Main Header Tag */}
                  <text
                    data-interactive="true"
                    x={Math.max(LEFT_GUTTER_PX + 6, entStartX + 4)}
                    y={node.yCenterPx - 18}
                    fill="#f8fafc"
                    fontSize={11.5}
                    fontWeight={800}
                  >
                    {ent.name} ({ent.startTime.year}~{ent.endTime.year})
                  </text>
                </g>
              );
            })}

            {/* 6. Watershed Event Diamond Markers */}
            {pack.events.map((evt) => {
              const matchesFactor =
                activeFactor === 'ALL' || evt.factors.includes(activeFactor);
              if (!matchesFactor) return null;

              const ex = yearToX(evt.time.year);
              if (ex < LEFT_GUTTER_PX || ex > LEFT_GUTTER_PX + plotWidthPx) {
                return null;
              }

              const primaryEntity = layout.streamNodes.find(
                (n) => n.entity.id === evt.entityIds[0]
              );
              const ey = primaryEntity ? primaryEntity.yCenterPx : 60;
              const isSelected =
                selectedFocusType === 'EVENT' && selectedFocusId === evt.id;

              return (
                <g
                  key={evt.id}
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectEvent(evt.id, evt.time.year);
                  }}
                >
                  <polygon
                    data-interactive="true"
                    points={`${ex},${ey - 7} ${ex + 7},${ey} ${ex},${ey + 7} ${ex - 7},${ey}`}
                    fill={isSelected ? '#ffffff' : '#fcd34d'}
                    stroke="#0b0f17"
                    strokeWidth={1.5}
                  >
                    <title>
                      ⚡ 사건 [{evt.time.displayLabel}] {evt.title} — {evt.summary}
                    </title>
                  </polygon>
                </g>
              );
            })}

            {/* 7. Active Golden Time Cursor Line (Interactive Dragging) */}
            {cursorX >= LEFT_GUTTER_PX &&
              cursorX <= LEFT_GUTTER_PX + plotWidthPx && (
                <g data-cursor-hit="true" style={{ cursor: 'ew-resize' }}>
                  {/* Wide transparent hit zone for grabbing anywhere along the vertical line */}
                  <line
                    data-cursor-hit="true"
                    x1={cursorX}
                    y1={0}
                    x2={cursorX}
                    y2={layout.totalHeightPx}
                    stroke="transparent"
                    strokeWidth={32}
                    style={{ cursor: 'ew-resize' }}
                  />
                  {/* Visible Golden Cursor Line */}
                  <line
                    data-cursor-hit="true"
                    x1={cursorX}
                    y1={0}
                    x2={cursorX}
                    y2={layout.totalHeightPx}
                    stroke="#f59e0b"
                    strokeWidth={isDragging ? 3.5 : 2.5}
                    style={{ cursor: 'ew-resize' }}
                  />
                  {/* Golden Top Drag Badge */}
                  <rect
                    data-cursor-hit="true"
                    x={cursorX - 44}
                    y={2}
                    width={88}
                    height={22}
                    rx={4}
                    fill={isDragging ? '#fbbf24' : '#f59e0b'}
                    stroke="#ffffff"
                    strokeWidth={isDragging ? 2 : 1}
                    style={{ cursor: 'ew-resize' }}
                  />
                  <text
                    data-cursor-hit="true"
                    x={cursorX}
                    y={17}
                    textAnchor="middle"
                    fill="#0b0f17"
                    fontSize={12}
                    fontWeight={900}
                    style={{ cursor: 'ew-resize', userSelect: 'none', pointerEvents: 'none' }}
                  >
                    ◀ {currentYear}년 ▶
                  </text>
                </g>
              )}
          </svg>
        </div>
      </section>
    );
  }
);
