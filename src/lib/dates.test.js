import { describe, it, expect } from 'vitest';
import { todayString, currentMonthString, formatDate } from './dates';

describe('todayString', () => {
  it('returns a YYYY-MM-DD format', () => {
    const result = todayString();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
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