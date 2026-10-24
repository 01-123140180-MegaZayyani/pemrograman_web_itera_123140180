import { NavLink } from 'react-router-dom';
import './Navbar.css';

// NavLink otomatis menambahkan class "active" pada halaman yang sedang dibuka
function Navbar() {
  const linkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <NavLink to="/" className="nav-logo">
          Rak Buku Saya
        </NavLink>
        <ul className="nav-links">
          <li>
            <NavLink to="/" end className={linkClass}>
              Beranda
            </NavLink>
          </li>
          <li>
            <NavLink to="/stats" className={linkClass}>
              Statistik
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;