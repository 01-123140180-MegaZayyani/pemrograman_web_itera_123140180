import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BookForm from './BookForm';

const fillForm = ({ title, author, status }) => {
  fireEvent.change(screen.getByLabelText(/judul buku/i), { target: { value: title } });
  fireEvent.change(screen.getByLabelText(/penulis/i), { target: { value: author } });
  fireEvent.change(screen.getByLabelText(/status/i), { target: { value: status } });
};

describe('BookForm', () => {
  test('menampilkan 3 pesan error dan TIDAK submit jika semua kolom kosong', () => {
    const onSubmit = vi.fn();
    render(<BookForm onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: /tambah buku/i }));

    expect(screen.getAllByRole('alert')).toHaveLength(3);
    expect(screen.getByText(/judul buku wajib diisi/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('memberi tanda visual (aria-invalid) pada input yang kosong', () => {
    render(<BookForm onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /tambah buku/i }));
    expect(screen.getByLabelText(/judul buku/i)).toHaveAttribute('aria-invalid', 'true');
  });

  test('menolak input yang hanya berisi spasi', () => {
    const onSubmit = vi.fn();
    render(<BookForm onSubmit={onSubmit} />);
    fillForm({ title: '   ', author: 'Penulis', status: 'milik' });
    fireEvent.click(screen.getByRole('button', { name: /tambah buku/i }));
    expect(screen.getByText(/judul buku wajib diisi/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('memanggil onSubmit dengan data yang sudah di-trim, lalu mengosongkan form', () => {
    const onSubmit = vi.fn();
    render(<BookForm onSubmit={onSubmit} />);

    fillForm({ title: '  Atomic Habits ', author: ' James Clear ', status: 'baca' });
    fireEvent.click(screen.getByRole('button', { name: /tambah buku/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Atomic Habits',
      author: 'James Clear',
      status: 'baca',
    });
    expect(screen.getByLabelText(/judul buku/i)).toHaveValue('');
  });

  test('mode edit: terisi data buku, tombol berubah, dan Batal memanggil onCancel', () => {
    const onCancel = vi.fn();
    const book = { id: '1', title: 'Clean Code', author: 'Robert Martin', status: 'milik' };
    render(<BookForm initialBook={book} onSubmit={vi.fn()} onCancel={onCancel} />);

    expect(screen.getByLabelText(/judul buku/i)).toHaveValue('Clean Code');
    expect(screen.getByRole('button', { name: /simpan perubahan/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /batal/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
