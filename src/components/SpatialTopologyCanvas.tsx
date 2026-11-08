/**
 * @file SpatialTopologyCanvas.tsx
 * @description Educational, textbook-grade interactive Spatial Topology Canvas.
 * Renders authentic Natural Earth coastlines & rivers with dynamic territory fills
 * clipped strictly to land contours (Namuwiki Later Three Kingdoms grade quality),
 * capital city pins, and watershed battle markers.
 */

import React, { useMemo, useState } from 'react';
import { Map as MapIcon, MapPin, Zap, Compass, Shield, Crown } from 'lucide-react';
import type {
  DomainPack,
  HistoricalEvent,
  LocusRegion,
  TerritoryShape,
} from '../contracts/timeline.contract';
import type { TimelineSnapshot } from '../contracts/worker.contract';
import {
  createProjectionFrame,
  projectPoint,
  ringsToSvgPath,
  ringCentroid,
} from '../core/projection';

export interface SpatialTopologyCanvasProps {
  pack: DomainPack;
  snapshot: TimelineSnapshot;
  selectedFocusType: 'ENTITY' | 'TRANSITION' | 'EVENT';
  selectedFocusId: string;
  onSelectEntity: (entityId: string) => void;
  onSelectEvent: (eventId: string, year: number) => void;
  onSelectTransition: (transitionId: string, year: number) => void;
}

interface ActiveTerritoryRenderItem {
  territory: TerritoryShape;
  entityName: string;
  officialName?: string;
  color: string;
  pathData: string;
  labelPosition: [number, number];
  isContested: boolean;
  powerWeight?: number;
}

export const SpatialTopologyCanvas: React.FC<SpatialTopologyCanvasProps> = React.memo(
  ({
    pack,
    snapshot,
    selectedFocusType,
    selectedFocusId,
    onSelectEntity,
    onSelectEvent,
    onSelectTransition,
  }) => {
    const topology = pack.topology;
    const [hoveredTerritoryId, setHoveredTerritoryId] = useState<string | null>(null);
    const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);

    // Entity lookup map
    const entityMap = useMemo(() => {
      return new Map(pack.entities.map((e) => [e.id, e]));
    }, [pack.entities]);

    // Active segment lookup map by entityId
    const activeSegmentMap = useMemo(() => {
      const map = new Map<string, typeof snapshot.activeEntities[0]['activeSegment']>();
      for (const item of snapshot.activeEntities) {
        map.set(item.entity.id, item.activeSegment);
      }
      return map;
    }, [snapshot.activeEntities]);

    // Setup coordinate projection frame
    const frame = useMemo(() => {
      if (!topology) return null;
      return createProjectionFrame(topology.projection, topology.viewBox.width);
    }, [topology]);

    // Extract base layers (Land and River)
    const landLayer = useMemo(() => {
      return topology?.baseLayers?.find((l) => l.kind === 'LAND');
    }, [topology]);

    const riverLayer = useMemo(() => {
      return topology?.baseLayers?.find((l) => l.kind === 'RIVER');
    }, [topology]);

    // Active territories at current snapshot year
    const activeTerritories = useMemo(() => {
      if (!pack.territories || !frame) return [];
      const currentYear = snapshot.year;

      const filtered = pack.territories.filter(
        (ter) => currentYear >= ter.startYear && currentYear <= ter.endYear
      );

      // Sort by layer order (e.g. enclaves like Naju render on top)
      filtered.sort((a, b) => (a.layer ?? 1) - (b.layer ?? 1));

      return filtered.map((ter): ActiveTerritoryRenderItem => {
        const ent = entityMap.get(ter.entityId);
        const seg = activeSegmentMap.get(ter.entityId);
        const pathData = ringsToSvgPath(frame, ter.rings);

        let labelCoord = ter.labelCoord;
        if (!labelCoord && ter.rings[0] && ter.rings[0].length > 0) {
          labelCoord = ringCentroid(ter.rings[0]);
        }
        const labelPos = labelCoord
          ? projectPoint(frame, labelCoord)
          : ([0, 0] as [number, number]);

        return {
          territory: ter,
          entityName: ent?.name ?? ter.entityId,
          officialName: seg?.officialName,
          color: ent?.color ?? '#3b82f6',
          pathData,
          labelPosition: labelPos,
          isContested: ter.level === 'CONTESTED',
          powerWeight: seg?.powerWeight,
        };
      });
    }, [pack.territories, frame, snapshot.year, entityMap, activeSegmentMap]);

    // Active battlefield and event markers at snapshot year (+- 15 years)
    const activeMapEvents = useMemo(() => {
      if (!frame) return [];
      return pack.events
        .filter(
          (evt): evt is HistoricalEvent & { mapCoord: { x: number; y: number } } =>
            Boolean(evt.mapCoord) && Math.abs(evt.time.year - snapshot.year) <= 15
        )
        .sort((a, b) => a.time.sortKey - b.time.sortKey)
        .map((evt) => {
          const [px, py] = projectPoint(frame, evt.mapCoord);
          return {
            event: evt,
            projectedCoord: [px, py] as [number, number],
          };
        });
    }, [pack.events, snapshot.year, frame]);

    // Capital pins for active states
    const activeCapitals = useMemo(() => {
      if (!frame) return [];
      const list: Array<{
        entityId: string;
        color: string;
        name: string;
        capitalLabel: string;
        coord: [number, number];
      }> = [];

      for (const item of snapshot.activeEntities) {
        const seg = item.activeSegment;
        if (seg.capitalCoord) {
          const [cx, cy] = projectPoint(frame, seg.capitalCoord);
          list.push({
            entityId: item.entity.id,
            color: item.entity.color,
            name: item.entity.name,
            capitalLabel: seg.capitalOrCenter ?? '수도',
            coord: [cx, cy],
          });
        }
      }
      return list;
    }, [snapshot.activeEntities, frame]);

    if (!topology || !frame) {
      return null;
    }

    const { width, height } = topology.viewBox;
    const hasTerritoryShapes = activeTerritories.length > 0;

    return (
      <section className="panel-card spatial-canvas-card" aria-label="고정 공간 지도 및 영토 판도 캔버스">
        <div className="section-header">
          <div className="section-title">
            <MapIcon size={16} color="#38bdf8" />
            <span>
              [영토 판도 지도] {snapshot.year}년 세력 형세 · 수도 및 격전지
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                color: '#38bdf8',
                backgroundColor: '#0c2340',
                padding: '3px 8px',
                borderRadius: 4,
                border: '1px solid #1e40af',
              }}
            >
              실제 해안선·수계 마스크 적용
            </span>
          </div>
        </div>

        <div className="panel-body" style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              backgroundColor: '#070c16',
              border: '1px solid #1e293b',
              borderRadius: 6,
              overflow: 'hidden',
            }}
          >
            <svg
              viewBox={`0 0 ${width} ${height}`}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                maxHeight: '520px',
              }}
            >
              <defs>
                {/* Land mask clipping path for textbook-grade coastline bounds */}
                {landLayer && (
                  <clipPath id="ne-land-mask">
                    <path d={landLayer.svgPath} />
                  </clipPath>
                )}

                {/* Zero-blur hatch pattern for contested border regions */}
                <pattern
                  id="hatch-contested-map"
                  width="10"
                  height="10"
                  patternTransform="rotate(45 0 0)"
                  patternUnits="userSpaceOnUse"
                >
                  <line x1="0" y1="0" x2="0" y2="10" stroke="#f59e0b" strokeWidth="2.5" />
                </pattern>
              </defs>

              {/* 1. Sea Water Background */}
              <rect x="0" y="0" width={width} height={height} fill="#070c16" />

              {/* Ocean Region Watermark Labels */}
              {topology.canvasType === 'GEOGRAPHIC_MAP' && (
                <g style={{ userSelect: 'none', pointerEvents: 'none' }}>
                  <text x={width * 0.16} y={height * 0.58} fill="#13243d" fontSize="14" fontWeight="800" letterSpacing="0.1em">
                    황해 (West Sea)
                  </text>
                  <text x={width * 0.65} y={height * 0.45} fill="#13243d" fontSize="14" fontWeight="800" letterSpacing="0.1em">
                    동해 (East Sea)
                  </text>
                  <text x={width * 0.42} y={height * 0.88} fill="#13243d" fontSize="13" fontWeight="800" letterSpacing="0.08em">
                    남해 · 대한해협
                  </text>
                </g>
              )}

              {/* 2. Base Landmass (Neutral Dark Slate before territory fill) */}
              {landLayer && (
                <path
                  d={landLayer.svgPath}
                  fill="#121b2b"
                  stroke="#1e293b"
                  strokeWidth="1"
                />
              )}

              {/* 3. DYNAMIC TERRITORIAL FILLS (Strictly clipped to land mask!) */}
              {hasTerritoryShapes && landLayer && (
                <g clipPath="url(#ne-land-mask)">
                  {activeTerritories.map((item) => {
                    const isSelected =
                      selectedFocusType === 'ENTITY' && selectedFocusId === item.territory.entityId;
                    const isHovered = hoveredTerritoryId === item.territory.id;

                    const fillOpacity = isSelected ? 0.72 : isHovered ? 0.62 : 0.46;
                    const strokeWidth = isSelected ? 3 : isHovered ? 2.5 : 1.5;

                    return (
                      <g
                        key={item.territory.id}
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={() => setHoveredTerritoryId(item.territory.id)}
                        onMouseLeave={() => setHoveredTerritoryId(null)}
                        onClick={() => onSelectEntity(item.territory.entityId)}
                      >
                        {/* Solid entity color fill */}
                        <path
                          d={item.pathData}
                          fill={item.color}
                          fillOpacity={fillOpacity}
                          stroke={item.color}
                          strokeWidth={strokeWidth}
                          strokeLinejoin="round"
                        >
                          <title>
                            {item.entityName} ({item.officialName ?? item.entityName}) | {item.territory.startYear}~{item.territory.endYear}년
                          </title>
                        </path>

                        {/* Contested hatched overlay */}
                        {item.isContested && (
                          <path
                            d={item.pathData}
                            fill="url(#hatch-contested-map)"
                            fillOpacity="0.4"
                            stroke="none"
                          />
                        )}
                      </g>
                    );
                  })}
                </g>
              )}

              {/* Fallback for conceptual or non-territory topologies */}
              {!hasTerritoryShapes && topology.regions.map((reg) => {
                if (!reg.rings || !frame) return null;
                const pathData = ringsToSvgPath(frame, reg.rings);
                const isHovered = hoveredRegionId === reg.id;
                return (
                  <path
                    key={reg.id}
                    d={pathData}
                    fill={isHovered ? '#1e3a8a' : '#172554'}
                    fillOpacity={isHovered ? 0.6 : 0.3}
                    stroke="#3b82f6"
                    strokeWidth="1.2"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredRegionId(reg.id)}
                    onMouseLeave={() => setHoveredRegionId(null)}
                  />
                );
              })}

              {/* 4. Natural Earth River Systems (Overlayed onto territories) */}
              {riverLayer && (
                <path
                  d={riverLayer.svgPath}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.2"
                  opacity={0.7}
                  strokeDasharray="4 2"
                  style={{ pointerEvents: 'none' }}
                />
              )}

              {/* 5. Coastline Outline Stroke */}
              {landLayer && (
                <path
                  d={landLayer.svgPath}
                  fill="none"
                  stroke="#475569"
                  strokeWidth="1.3"
                  style={{ pointerEvents: 'none' }}
                />
              )}

              {/* 6. Territory Badges / Labels on the Map */}
              {activeTerritories.map((item) => {
                const [lx, ly] = item.labelPosition;
                if (lx <= 0 || ly <= 0) return null;
                const isSelected =
                  selectedFocusType === 'ENTITY' && selectedFocusId === item.territory.entityId;

                return (
                  <g
                    key={`label_${item.territory.id}`}
                    transform={`translate(${lx}, ${ly})`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => onSelectEntity(item.territory.entityId)}
                  >
                    <rect
                      x="-48"
                      y="-14"
                      width="96"
                      height="28"
                      rx="4"
                      fill="#070d18"
                      fillOpacity="0.92"
                      stroke={isSelected ? '#f59e0b' : item.color}
                      strokeWidth={isSelected ? 2 : 1.2}
                    />
                    <text
                      x="0"
                      y="-1"
                      textAnchor="middle"
                      fill="#f8fafc"
                      fontSize="11"
                      fontWeight="800"
                    >
                      {item.officialName?.split('(')[0] ?? item.entityName}
                    </text>
                    <text
                      x="0"
                      y="9.5"
                      textAnchor="middle"
                      fill={item.color}
                      fontSize="9"
                      fontWeight="700"
                    >
                      {item.entityName}
                    </text>
                  </g>
                );
              })}

              {/* 7. Capital City Star Pins (★) */}
              {activeCapitals.map((cap) => {
                const [cx, cy] = cap.coord;
                const isSelected =
                  selectedFocusType === 'ENTITY' && selectedFocusId === cap.entityId;

                return (
                  <g
                    key={`cap_${cap.entityId}_${cap.capitalLabel}`}
                    transform={`translate(${cx}, ${cy})`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => onSelectEntity(cap.entityId)}
                  >
                    <circle
                      r="9"
                      fill={cap.color}
                      fillOpacity="0.3"
                      stroke={cap.color}
                      strokeWidth="1.2"
                    />
                    <circle
                      r="4"
                      fill="#ffffff"
                      stroke={cap.color}
                      strokeWidth="1.8"
                    />
                    <rect
                      x="8"
                      y="-10"
                      width={cap.capitalLabel.split('(')[0].length * 10 + 18}
                      height="18"
                      rx="3"
                      fill="#0f172a"
                      fillOpacity="0.95"
                      stroke={isSelected ? '#f59e0b' : cap.color}
                      strokeWidth={isSelected ? 1.8 : 1}
                    />
                    <text
                      x="14"
                      y="2"
                      fill="#fef08a"
                      fontSize="9.5"
                      fontWeight="800"
                      style={{ pointerEvents: 'none' }}
                    >
                      ★ {cap.capitalLabel.split('(')[0]}
                    </text>
                  </g>
                );
              })}

              {/* 8. Active Watershed Battles & Key Event Lightning Pins (⚡) */}
              {activeMapEvents.map(({ event: evt, projectedCoord: [ex, ey] }) => {
                const isSelected =
                  selectedFocusType === 'EVENT' && selectedFocusId === evt.id;

                return (
                  <g
                    key={`map_evt_${evt.id}`}
                    transform={`translate(${ex}, ${ey})`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      onSelectEvent(evt.id, evt.time.year);
                      if (evt.relatedTransitionId) {
                        onSelectTransition(evt.relatedTransitionId, evt.time.year);
                      }
                    }}
                  >
                    <circle
                      r={isSelected ? 10 : 7}
                      fill="#ef4444"
                      fillOpacity="0.45"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    <circle r="3.5" fill="#fef08a" />
                    <rect
                      x="9"
                      y="-11"
                      width={evt.locationOrContext ? evt.locationOrContext.length * 8 + 24 : 60}
                      height="18"
                      rx="3"
                      fill="#78350f"
                      stroke={isSelected ? '#ffffff' : '#fcd34d'}
                      strokeWidth={isSelected ? 1.5 : 1}
                    />
                    <text
                      x="14"
                      y="2"
                      fill="#fef08a"
                      fontSize="9.5"
                      fontWeight="800"
                    >
                      ⚡ {evt.time.year}년 {evt.locationOrContext?.split('·')[0].trim() ?? evt.title.slice(0, 5)}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Quick Status Bar */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                backgroundColor: '#0c121d',
                borderTop: '1px solid #1e293b',
                fontSize: 11.5,
                color: '#94a3b8',
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Crown size={13} color="#f59e0b" />
                  영역 클릭 시 지배 세력 및 인과 추적
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={13} color="#38bdf8" />
                  ★ 수도 / ⚡ 결전지 사료 연동
                </span>
              </div>
              <span style={{ color: '#fcd34d', fontWeight: 700 }}>
                현재 {snapshot.year}년 판도 실시간 동기화
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }
);
