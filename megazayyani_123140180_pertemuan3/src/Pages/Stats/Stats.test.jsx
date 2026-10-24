import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BookProvider } from '../../Context/BookContext';
import Stats from './Stats';

describe('Stats', () => {
  beforeEach(() => {
    window.localStorage.setItem(
      'books_data',
      JSON.stringify([
        { id: '1', title: 'Buku Satu', author: 'Penulis Satu', status: 'milik' },
        { id: '2', title: 'Buku Dua', author: 'Penulis Dua', status: 'baca' },
      ]),
    );
  });

  test('menampilkan statistik tiap status dalam tabel dengan total koleksi', () => {
    render(
      <BookProvider>
        <Stats />
      </BookProvider>,
    );

    expect(screen.getByText('Total koleksi: 2 buku')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Status buku' })).toBeInTheDocument();
    expect(screen.getByRole('row', { name: /Dimiliki 1 50%/ })).toBeInTheDocument();
    expect(screen.getByRole('row', { name: /Sedang Dibaca 1 50%/ })).toBeInTheDocument();
    expect(screen.getByRole('row', { name: /Ingin Dibeli 0 0%/ })).toBeInTheDocument();
    expect(screen.getByRole('row', { name: /Total koleksi 2 100%/ })).toBeInTheDocument();
  });
});
