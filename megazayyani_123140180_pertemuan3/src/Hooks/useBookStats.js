import { STATUS_OPTIONS } from '../constants/bookStatus';

/**
 * Custom hook #2 menghitung statistik koleksi buku.
 * Mengembalikan total, jumlah & persentase per status, serta daftar siap tampil.
 */
function useBookStats(books) {
  const total = books.length;

  const counts = { milik: 0, baca: 0, beli: 0 };
  books.forEach((book) => {
    if (book.status in counts) counts[book.status] += 1;
  });

  const percent = (count) => (total > 0 ? Math.round((count / total) * 100) : 0);

  const byStatus = STATUS_OPTIONS.map(({ value, label }) => ({
    value,
    label,
    count: counts[value],
    percentage: percent(counts[value]),
  }));

  return { total, ...counts, byStatus };
}

export default useBookStats;