import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  return (
    <main className="not-found">
      <p className="not-found-code">404</p>
      <h1>Halaman tidak ditemukan</h1>
      <p>Alamat yang kamu buka tidak tersedia.</p>
      <Link className="btn btn-primary" to="/">
        Kembali ke Beranda
      </Link>
    </main>
  );
}

export default NotFound;