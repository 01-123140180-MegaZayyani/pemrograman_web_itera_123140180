import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BookProvider, useBooks } from './BookContext';

function Consumer() {
  const { books } = useBooks();
  return <p>jumlah: {books.length}</p>;
}

describe('BookContext', () => {
  test('menyediakan data buku ke komponen di dalam Provider', () => {
    render(
      <BookProvider>
        <Consumer />
      </BookProvider>,
    );
    expect(screen.getByText('jumlah: 0')).toBeInTheDocument();
  });

  test('melempar error jika useBooks dipakai di luar Provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Consumer />)).toThrow(/BookProvider/);
    spy.mockRestore();
  });
});