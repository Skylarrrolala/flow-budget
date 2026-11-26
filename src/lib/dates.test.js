import { describe, it, expect } from 'vitest';
import { todayString, shiftDate, currentMonthString, formatDate } from './dates';

describe('todayString', () => {
  it('returns a YYYY-MM-DD format', () => {
    const result = todayString();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('shiftDate', () => {
  it('shifts dates across month and year boundaries', () => {
    expect(shiftDate('2026-12-31', 1)).toBe('2027-01-01');
    expect(shiftDate('2026-03-01', -1)).toBe('2026-02-28');
  });
});

describe('currentMonthString', () => {
  it('returns a YYYY-MM format', () => {
    const result = currentMonthString();
    expect(result).toMatch(/^\d{4}-\d{2}$/);
  });
});

describe('formatDate', () => {
  it('formats a date string to readable format', () => {
    const result = formatDate('2026-11-25');
    expect(result).toBe('Nov 25, 2026');
  });

  it('handles single digit months and days', () => {
    const result = formatDate('2026-01-05');
    expect(result).toBe('Jan 5, 2026');
  });
});