import { useId, useState } from 'react';
import PropTypes from 'prop-types';
import { STATUS_OPTIONS, isValidStatus } from '../../constants/bookStatus';
import './BookForm.css';

// Validasi kolom wajib isi: mengembalikan objek { namaField: pesanError }
function validate({ title, author, status }) {
  const errors = {};
  if (!title.trim()) errors.title = 'Judul buku wajib diisi.';
  if (!author.trim()) errors.author = 'Nama penulis wajib diisi.';
  if (!isValidStatus(status)) errors.status = 'Pilih status buku.';
  return errors;
}

// Komponen reusable #2 dipakai untuk TAMBAH (initialBook = null) dan EDIT (initialBook = buku)
function BookForm({ initialBook, onSubmit, onCancel }) {
  const uid = useId(); // id unik agar label <-> input terhubung (aksesibilitas)
  const isEditing = Boolean(initialBook);

  const [values, setValues] = useState({
    title: initialBook?.title ?? '',
    author: initialBook?.author ?? '',
    status: initialBook?.status ?? '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Hapus pesan error field ini begitu pengguna mulai memperbaikinya
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const foundErrors = validate(values);
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length > 0) return; // ada yang kosong = berhenti

    onSubmit({
      title: values.title.trim(),
      author: values.author.trim(),
      status: values.status,
    });

    if (!isEditing) setValues({ title: '', author: '', status: '' }); // kosongkan form setelah tambah
  };

  // Helper kecil agar props aksesibilitas tiap field konsisten
  const fieldProps = (name) => ({
    id: `${uid}-${name}`,
    name,
    value: values[name],
    onChange: handleChange,
    className: errors[name] ? 'input-error' : '',
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `${uid}-${name}-error` : undefined,
  });

  const renderError = (name) =>
    errors[name] && (
      <p className="field-error" id={`${uid}-${name}-error`} role="alert">
        ⚠ {errors[name]}
      </p>
    );

  return (
    <form className="book-form" onSubmit={handleSubmit} noValidate>
      <h2>{isEditing ? 'Edit Buku' : 'Tambah Buku Baru'}</h2>

      <div className="form-group">
        <label htmlFor={`${uid}-title`}>
          Judul Buku <span aria-hidden="true">*</span>
        </label>
        <input type="text" placeholder="Contoh: Atomic Habits" {...fieldProps('title')} />
        {renderError('title')}
      </div>

      <div className="form-group">
        <label htmlFor={`${uid}-author`}>
          Penulis <span aria-hidden="true">*</span>
        </label>
        <input type="text" placeholder="Contoh: James Clear" {...fieldProps('author')} />
        {renderError('author')}
      </div>

      <div className="form-group">
        <label htmlFor={`${uid}-status`}>
          Status <span aria-hidden="true">*</span>
        </label>
        <select {...fieldProps('status')}>
          <option value="">-- Pilih status --</option>
          {STATUS_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {renderError('status')}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {isEditing ? 'Simpan Perubahan' : 'Tambah Buku'}
        </button>
        {isEditing && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Batal
          </button>
        )}
      </div>
    </form>
  );
}

BookForm.propTypes = {
  initialBook: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
};

export default BookForm;