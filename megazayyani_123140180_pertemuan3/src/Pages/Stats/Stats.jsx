import { useEffect } from 'react';
import Header from '../../Components/Header/Header';
import { useBooks } from '../../Context/BookContext';
import useBookStats from '../../Hooks/useBookStats';
import './Stats.css';

function Stats() {
  const { books } = useBooks();
  const { total, byStatus } = useBookStats(books);

  useEffect(() => {
    document.title = 'Statistik | Rak Buku Saya';
  }, []);

  return (
    <main className="container stats-page">
      <Header title="Statistik Buku" description="Ringkasan koleksi buku berdasarkan status." />
      <p className="stats-total">Total koleksi: {total} buku</p>
      <div className="stats-table-wrap">
        <table className="stats-table">
          <thead>
            <tr>
              <th scope="col">Status buku</th>
              <th scope="col">Jumlah</th>
              <th scope="col">Persentase</th>
            </tr>
          </thead>
          <tbody>
            {byStatus.map(({ value, label, count, percentage }) => (
              <tr key={value}>
                <th scope="row">
                  <span className={`badge badge-${value}`}>{label}</span>
                </th>
                <td className="stats-count">{count}</td>
                <td className="stats-percentage">{percentage}%</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">Total koleksi</th>
              <td className="stats-count">{total}</td>
              <td className="stats-percentage">{total > 0 ? '100%' : '0%'}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </main>
  );
}

export default Stats;