import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import useLocalStorage from '../Hooks/useLocalStorage';

const BookContext = createContext(null);

// Hook kecil agar komponen cukup memanggil useBooks() (dan error jelas bila lupa Provider)
// eslint-disable-next-line react-refresh/only-export-components
export function useBooks() {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks harus digunakan di dalam BookProvider');
  }
  return context;
}

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

export function BookProvider({ children }) {
  // Data buku disimpan permanen di localStorage
  const [books, setBooks] = useLocalStorage('books_data', []);
  // State filter & pencarian cukup di memori (tidak perlu persisten)
  const [statusFilter, setStatusFilter] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');

  const addBook = ({ title, author, status }) => {
    const newBook = { id: createId(), title, author, status, createdAt: Date.now() };
    setBooks((prev) => [newBook, ...prev]); // buku terbaru tampil paling atas
  };

  const updateBook = (id, changes) => {
    setBooks((prev) => prev.map((book) => (book.id === id ? { ...book, ...changes } : book)));
  };

  const deleteBook = (id) => {
    setBooks((prev) => prev.filter((book) => book.id !== id));
  };

  // Turunan dari state: filter status + pencarian judul/penulis
  const keyword = searchQuery.trim().toLowerCase();
  const filteredBooks = books.filter((book) => {
    const matchStatus = statusFilter === 'semua' || book.status === statusFilter;
    const matchSearch =
      keyword === '' ||
      book.title.toLowerCase().includes(keyword) ||
      book.author.toLowerCase().includes(keyword);
    return matchStatus && matchSearch;
  });

  const value = {
    books,
    filteredBooks,
    addBook,
    updateBook,
    deleteBook,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
}

BookProvider.propTypes = {
  children: PropTypes.node.isRequired,
};