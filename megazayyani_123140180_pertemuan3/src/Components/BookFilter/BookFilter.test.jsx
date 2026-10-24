import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BookFilter from './BookFilter';

const setup = (props = {}) => {
  const handlers = { onStatusChange: vi.fn(), onSearchChange: vi.fn() };
  render(<BookFilter statusFilter="semua" searchQuery="" {...handlers} {...props} />);
  return handlers;
};

describe('BookFilter', () => {
  test('mengetik di kolom cari memanggil onSearchChange', () => {
    const { onSearchChange } = setup();
    fireEvent.change(screen.getByLabelText(/cari buku/i), { target: { value: 'react' } });
    expect(onSearchChange).toHaveBeenCalledWith('react');
  });

  test('klik tombol status memanggil onStatusChange dengan nilai yang benar', () => {
    const { onStatusChange } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Ingin Dibeli' }));
    expect(onStatusChange).toHaveBeenCalledWith('beli');
  });

  test('tombol filter aktif ditandai aria-pressed', () => {
    setup({ statusFilter: 'baca' });
    expect(screen.getByRole('button', { name: 'Sedang Dibaca' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Semua' })).toHaveAttribute('aria-pressed', 'false');
  });
});
