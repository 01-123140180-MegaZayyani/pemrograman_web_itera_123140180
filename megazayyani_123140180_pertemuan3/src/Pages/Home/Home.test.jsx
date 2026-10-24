import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import Home from './Home';
import { BookProvider } from '../../Context/BookContext';

const seedBooks = [
  { id: 'a', title: 'Atomic Habits', author: 'James Clear', status: 'milik', createdAt: 3 },
  { id: 'b', title: 'Clean Code', author: 'Robert Martin', status: 'baca', createdAt: 2 },
  { id: 'c', title: 'Dune', author: 'Frank Herbert', status: 'beli', createdAt: 1 },
];

const renderHome = (books = seedBooks) => {
  window.localStorage.setItem('books_data', JSON.stringify(books));
  return render(
    <BookProvider>
      <Home />
    </BookProvider>,
  );
};

const savedBooks = () => JSON.parse(window.localStorage.getItem('books_data'));

describe('Home (integrasi: Context + localStorage + komponen)', () => {
  beforeEach(() => vi.restoreAllMocks());

  test('menampilkan pesan kosong jika belum ada buku', () => {
    renderHome([]);
    expect(screen.getByText(/belum ada buku/i)).toBeInTheDocument();
  });

  test('menambah buku baru: muncul di daftar dan tersimpan di localStorage', () => {
    renderHome([]);
    fireEvent.change(screen.getByLabelText(/judul buku/i), { target: { value: 'Bumi' } });
    fireEvent.change(screen.getByLabelText(/penulis/i), { target: { value: 'Tere Liye' } });
    fireEvent.change(screen.getByLabelText(/^status/i), { target: { value: 'milik' } });
    fireEvent.click(screen.getByRole('button', { name: /tambah buku/i }));

    expect(screen.getByRole('heading', { name: 'Bumi' })).toBeInTheDocument();
    expect(savedBooks()).toHaveLength(1);
    expect(savedBooks()[0].title).toBe('Bumi');
  });

  test('filter status hanya menampilkan buku dengan status tersebut', () => {
    renderHome();
    fireEvent.click(screen.getByRole('button', { name: 'Sedang Dibaca' }));
    expect(screen.getByRole('heading', { name: 'Clean Code' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Atomic Habits' })).not.toBeInTheDocument();
  });

  test('pencarian bisa berdasarkan judul maupun nama penulis (tidak case-sensitive)', () => {
    renderHome();
    const search = screen.getByLabelText(/cari buku/i);

    fireEvent.change(search, { target: { value: 'dune' } }); // judul
    expect(screen.getByRole('heading', { name: 'Dune' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Clean Code' })).not.toBeInTheDocument();

    fireEvent.change(search, { target: { value: 'ROBERT' } }); // penulis
    expect(screen.getByRole('heading', { name: 'Clean Code' })).toBeInTheDocument();
  });

  test('mengedit buku: data berubah di daftar dan di localStorage', () => {
    renderHome();
    fireEvent.click(screen.getByRole('button', { name: /edit buku dune/i }));

    const titleInput = screen.getByLabelText(/judul buku/i);
    expect(titleInput).toHaveValue('Dune');
    fireEvent.change(titleInput, { target: { value: 'Dune Messiah' } });
    fireEvent.click(screen.getByRole('button', { name: /simpan perubahan/i }));

    expect(screen.getByRole('heading', { name: 'Dune Messiah' })).toBeInTheDocument();
    expect(savedBooks().find((b) => b.id === 'c').title).toBe('Dune Messiah');
  });

  test('menghapus buku setelah konfirmasi', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderHome();
    fireEvent.click(screen.getByRole('button', { name: /hapus buku dune/i }));

    expect(screen.queryByRole('heading', { name: 'Dune' })).not.toBeInTheDocument();
    expect(savedBooks()).toHaveLength(2);
  });

  test('TIDAK menghapus buku jika konfirmasi dibatalkan', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    renderHome();
    fireEvent.click(screen.getByRole('button', { name: /hapus buku dune/i }));
    expect(screen.getByRole('heading', { name: 'Dune' })).toBeInTheDocument();
    expect(savedBooks()).toHaveLength(3);
  });

  test('menampilkan jumlah hasil sesuai filter', () => {
    renderHome();
    fireEvent.click(screen.getByRole('button', { name: 'Dimiliki' }));
    expect(screen.getByText(/menampilkan 1 dari 3 buku/i)).toBeInTheDocument();
    // pastikan hanya satu kartu di daftar
    expect(within(screen.getByRole('list')).getAllByRole('listitem')).toHaveLength(1);
  });
});