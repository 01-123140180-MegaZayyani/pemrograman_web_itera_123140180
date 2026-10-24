import { describe, test, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useLocalStorage from './useLocalStorage';

describe('useLocalStorage', () => {
  test('mengembalikan nilai awal jika localStorage kosong', () => {
    const { result } = renderHook(() => useLocalStorage('kunci', ['awal']));
    expect(result.current[0]).toEqual(['awal']);
  });

  test('membaca nilai yang sudah tersimpan di localStorage', () => {
    window.localStorage.setItem('kunci', JSON.stringify({ nama: 'Mega' }));
    const { result } = renderHook(() => useLocalStorage('kunci', {}));
    expect(result.current[0]).toEqual({ nama: 'Mega' });
  });

  test('menyimpan ke localStorage ketika nilai diubah', () => {
    const { result } = renderHook(() => useLocalStorage('kunci', []));
    act(() => result.current[1](['buku 1']));
    expect(JSON.parse(window.localStorage.getItem('kunci'))).toEqual(['buku 1']);
  });

  test('memakai nilai awal jika isi localStorage rusak (bukan JSON valid)', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    window.localStorage.setItem('kunci', '{rusak');
    const { result } = renderHook(() => useLocalStorage('kunci', 'cadangan'));
    expect(result.current[0]).toBe('cadangan');
    spy.mockRestore();
  });
});