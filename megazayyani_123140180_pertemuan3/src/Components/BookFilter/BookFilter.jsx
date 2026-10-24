import { useId } from 'react';
import PropTypes from 'prop-types';
import { STATUS_OPTIONS } from '../../constants/bookStatus';
import './BookFilter.css';

const FILTER_OPTIONS = [{ value: 'semua', label: 'Semua' }, ...STATUS_OPTIONS];

// Komponen reusable #3 kolom pencarian + tombol filter status (controlled component)
function BookFilter({ statusFilter, onStatusChange, searchQuery, onSearchChange }) {
  const searchId = useId();

  return (
    <section className="book-filter" aria-label="Pencarian dan filter buku">
      <div className="search-box">
        <label htmlFor={searchId}>Cari buku</label>
        <input
          id={searchId}
          type="search"
          placeholder="Cari judul atau nama penulis..."
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="filter-buttons" role="group" aria-label="Filter status">
        {FILTER_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            className={statusFilter === value ? 'filter-btn active' : 'filter-btn'}
            aria-pressed={statusFilter === value}
            onClick={() => onStatusChange(value)}
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}

BookFilter.propTypes = {
  statusFilter: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

export default BookFilter;
