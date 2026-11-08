/**
 * @file astroTime.ts
 * @description Astronomical year numbering and O(log N) sortKey utility functions.
 */

import type { AstroTime, TimePrecision } from '../contracts/timeline.contract';

export interface AstroTimeOptions {
  month?: number;
  day?: number;
  precision?: TimePrecision;
  customLabel?: string;
}

/**
 * Converts a year, month, and day into a monotonically increasing integer sortKey.
 */
export function yearToSortKey(year: number, month = 1, day = 1): number {
  const clampedMonth = Math.max(1, Math.min(12, month));
  const clampedDay = Math.max(1, Math.min(31, day));
  return year * 10000 + clampedMonth * 100 + clampedDay;
}

/**
 * Formats an astronomical year into a readable Korean historical/scientific label.
 */
export function formatYearDisplay(
  year: number,
  month?: number,
  day?: number,
  precision: TimePrecision = 'YEAR'
): string {
  const absYear = Math.abs(year);
  const eraPrefix = year < 0 ? '기원전 ' : '';
  const approxSuffix = precision === 'APPROXIMATE' ? '경' : '';

  if (month && day) {
    return `${eraPrefix}${absYear}년 ${month}월 ${day}일${approxSuffix}`;
  }
  if (month) {
    return `${eraPrefix}${absYear}년 ${month}월${approxSuffix}`;
  }
  return `${eraPrefix}${absYear}년${approxSuffix}`;
}

/**
 * Factory helper to create a strictly compliant AstroTime object.
 */
export function createAstroTime(year: number, options: AstroTimeOptions = {}): AstroTime {
  const { month, day, precision = 'YEAR', customLabel } = options;
  const sortKey = yearToSortKey(year, month ?? 1, day ?? 1);
  const displayLabel = customLabel ?? formatYearDisplay(year, month, day, precision);

  return {
    year,
    month,
    day,
    precision,
    displayLabel,
    sortKey,
  };
}

/**
 * Checks whether a target year falls within a start and end AstroTime interval (inclusive).
 */
export function isYearWithin(year: number, start: AstroTime, end: AstroTime): boolean {
  return year >= start.year && year <= end.year;
}
