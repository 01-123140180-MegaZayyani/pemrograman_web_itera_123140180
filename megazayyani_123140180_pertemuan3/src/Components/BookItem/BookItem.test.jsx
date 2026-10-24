import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BookItem from './BookItem';

const book = { id: '1', title: 'Laskar Pelangi', author: 'Andrea Hirata', status: 'baca' };

// BookItem merender <li>, jadi dibungkus <ul> agar HTML valid
const renderItem = (props = {}) =>
  render(
    <ul>
      <BookItem book={book} onEdit={vi.fn()} onDelete={vi.fn()} {...props} />
    </ul>,
  );

describe('BookItem', () => {
  test('menampilkan judul, penulis, dan label status', () => {
    renderItem();
    expect(screen.getByText('Laskar Pelangi')).toBeInTheDocument();
    expect(screen.getByText(/andrea hirata/i)).toBeInTheDocument();
    expect(screen.getByText('Sedang Dibaca')).toBeInTheDocument();
  });

  test('tombol Edit memanggil onEdit dengan objek buku', () => {
    const onEdit = vi.fn();
    renderItem({ onEdit });
    fireEvent.click(screen.getByRole('button', { name: /edit buku laskar pelangi/i }));
    expect(onEdit).toHaveBeenCalledWith(book);
  });

  test('tombol Hapus memanggil onDelete dengan objek buku', () => {
    const onDelete = vi.fn();
    renderItem({ onDelete });
    fireEvent.click(screen.getByRole('button', { name: /hapus buku laskar pelangi/i }));
    expect(onDelete).toHaveBeenCalledWith(book);
  });
});
