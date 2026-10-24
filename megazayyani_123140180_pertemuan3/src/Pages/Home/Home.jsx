import { useEffect, useState } from 'react';
import Header from '../../Components/Header/Header';
import BookForm from '../../Components/BookForm/BookForm';
import BookFilter from '../../Components/BookFilter/BookFilter';
import BookList from '../../Components/BookList/BookList';
import { useBooks } from '../../Context/BookContext';
import './Home.css';

function Home() {
  // Semua state & aksi diambil langsung dari Context (tanpa props drilling)
  const {
    books,
    filteredBooks,
    addBook,
    updateBook,
    deleteBook,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
  } = useBooks();

  const [editingBook, setEditingBook] = useState(null); // null = mode tambah
  const [notice, setNotice] = useState(''); // pesan sukses singkat

  // useEffect #1: ubah judul tab browser
  useEffect(() => {
    document.title = 'Beranda | Rak Buku Saya';
  }, []);

  // useEffect #2: hilangkan pesan sukses otomatis setelah 3 detik (dengan cleanup timer)
  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(''), 3000);
    return () => clearTimeout(timer);
  }, [notice]);

  const handleSubmit = (data) => {
    if (editingBook) {
      updateBook(editingBook.id, data);
      setEditingBook(null);
      setNotice('Perubahan buku berhasil disimpan.');
    } else {
      addBook(data);
      setNotice('Buku baru berhasil ditambahkan.');
    }
  };

  const handleDelete = (book) => {
    if (!window.confirm(`Hapus buku "${book.title}"?`)) return;
    deleteBook(book.id);
    if (editingBook?.id === book.id) setEditingBook(null);
    setNotice('Buku berhasil dihapus.');
  };

  const isFiltering = statusFilter !== 'semua' || searchQuery.trim() !== '';
  const emptyMessage = isFiltering
    ? 'Tidak ada buku yang cocok dengan pencarian/filter.'
    : 'Belum ada buku. Tambahkan buku pertamamu lewat form di samping!';

  return (
    <div className="home">
      <main className="container">
        <Header
          title="Rak Buku Saya"
          description="Catat buku yang dimiliki, sedang dibaca, atau ingin dibeli."
        />
        <div className="home-layout">
          <aside className="home-sidebar">
            {/* key berubah saat pindah buku yang diedit -> form di-reset dengan nilai awal yang benar */}
            <BookForm
              key={editingBook ? editingBook.id : 'new'}
              initialBook={editingBook}
              onSubmit={handleSubmit}
              onCancel={() => setEditingBook(null)}
            />
          </aside>

          <section className="home-content">
            {notice && (
              <p className="notice" role="status">
                ✓ {notice}
              </p>
            )}
            <BookFilter
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <p className="result-count">
              Menampilkan {filteredBooks.length} dari {books.length} buku
            </p>
            <BookList
              books={filteredBooks}
              onEdit={setEditingBook}
              onDelete={handleDelete}
              emptyMessage={emptyMessage}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

export default Home;
