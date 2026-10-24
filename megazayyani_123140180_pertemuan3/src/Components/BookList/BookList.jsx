import PropTypes from 'prop-types';
import BookItem from '../BookItem/BookItem';
import { bookShape } from '../../constants/bookStatus';
import './BookList.css';

// Daftar buku. Jika kosong, tampilkan pesan (emptyMessage) agar pengguna tidak bingung.
function BookList({ books, onEdit, onDelete, emptyMessage = 'Belum ada buku.' }) {
  if (books.length === 0) {
    return (
      <div className="book-list-empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className="book-list">
      {books.map((book) => (
        <BookItem key={book.id} book={book} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  );
}

BookList.propTypes = {
  books: PropTypes.arrayOf(bookShape).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  emptyMessage: PropTypes.string,
};

export default BookList;