import PropTypes from 'prop-types';
import { STATUS_LABELS, bookShape } from '../../constants/bookStatus';
import './BookItem.css';

// Satu kartu buku: judul, penulis, badge status, dan tombol aksi
function BookItem({ book, onEdit, onDelete }) {
  return (
    <li className="book-item">
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">oleh {book.author}</p>
        <span className={`badge badge-${book.status}`}>{STATUS_LABELS[book.status]}</span>
      </div>
      <div className="book-actions">
        <button
          type="button"
          className="btn btn-small btn-secondary"
          onClick={() => onEdit(book)}
          aria-label={`Edit buku ${book.title}`}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn-small btn-danger"
          onClick={() => onDelete(book)}
          aria-label={`Hapus buku ${book.title}`}
        >
          Hapus
        </button>
      </div>
    </li>
  );
}

BookItem.propTypes = {
  book: bookShape.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default BookItem;