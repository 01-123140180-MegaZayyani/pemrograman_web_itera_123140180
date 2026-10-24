import { describe, test, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import useBookStats from './useBookStats';

const books = [
  { id: '1', title: 'A', author: 'X', status: 'milik' },
  { id: '2', title: 'B', author: 'Y', status: 'baca' },
  { id: '3', title: 'C', author: 'Z', status: 'beli' },
  { id: '4', title: 'D', author: 'W', status: 'milik' },
];

describe('useBookStats', () => {
  test('menghitung total dan jumlah per status', () => {
    const { result } = renderHook(() => useBookStats(books));
    expect(result.current.total).toBe(4);
    expect(result.current.milik).toBe(2);
    expect(result.current.baca).toBe(1);
    expect(result.current.beli).toBe(1);
  });

  test('menghitung persentase per status', () => {
    const { result } = renderHook(() => useBookStats(books));
    const milik = result.current.byStatus.find((s) => s.value === 'milik');
    expect(milik.percentage).toBe(50);
  });

  test('aman untuk daftar kosong (persentase 0, tidak NaN)', () => {
    const { result } = renderHook(() => useBookStats([]));
    expect(result.current.total).toBe(0);
    expect(result.current.byStatus.every((s) => s.percentage === 0)).toBe(true);
  });
});