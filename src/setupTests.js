// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import {describe, expect, test} from '@jest/globals';
import {CallAPI, getAggCounts, groupJobsByDate, getMonthAbrvName, formatTimeStamp, getYears, sortDateIndex} from './utilities';

describe('formatTimeStamp', () => {
  test('converts January 3rd, 2023 to 01-03-2023', () => {
    const date1 = new Date(2023, 01, 03, 3, 24, 0);
    const date2 = new Date("2023-01-03T03:24:00");
    expect(formatTimeStamp(date1)).toBe('01-03-2023');
    expect(formatTimeStamp(date2)).toBe('01-03-2023');
  });
});
