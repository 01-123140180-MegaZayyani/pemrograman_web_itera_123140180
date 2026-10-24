import PropTypes from 'prop-types';
import './Header.css';

// Komponen reusable #1 judul halaman + deskripsi singkat
function Header({ title, description }) {
  return (
    <header className="page-header">
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </header>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
};

export default Header;
