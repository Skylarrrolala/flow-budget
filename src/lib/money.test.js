import { describe, it, expect } from 'vitest';
import { parseToMinor, formatMoney, minorToInput } from './money';

describe('parseToMinor', () => {
  it('converts USD dollars to cents', () => {
    expect(parseToMinor('12.50', 'USD')).toBe(1250);
  });

  it('rounds USD to nearest cent', () => {
    expect(parseToMinor('9.999', 'USD')).toBe(1000);
  });

  it('keeps KHR as whole numbers', () => {
    expect(parseToMinor('25000', 'KHR')).toBe(25000);
  });

  it('rejects fractional KHR instead of rounding contributions', () => {
    expect(parseToMinor('1.5', 'KHR')).toBeNaN();
  });

  it('returns NaN for empty input', () => {
    expect(parseToMinor('', 'USD')).toBeNaN();
  });

  it('returns NaN for negative numbers', () => {
    expect(parseToMinor('-5', 'USD')).toBeNaN();
  });
});

describe('formatMoney', () => {
  it('formats USD cents to dollar string', () => {
    expect(formatMoney(1250, 'USD')).toBe('$12.50');
  });

  it('formats zero USD', () => {
    expect(formatMoney(0, 'USD')).toBe('$0.00');
  });

  it('formats KHR with riel symbol', () => {
    expect(formatMoney(25000, 'KHR')).toBe('25,000៛');
  });
});

describe('minorToInput', () => {
  it('converts USD cents to decimal string', () => {
    expect(minorToInput(1250, 'USD')).toBe('12.50');
  });

  it('converts KHR to plain number string', () => {
    expect(minorToInput(25000, 'KHR')).toBe('25000');
  });
});
