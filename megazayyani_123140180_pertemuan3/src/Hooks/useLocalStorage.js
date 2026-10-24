import { useState, useEffect } from 'react';

/**
 * Custom hook #1 state yang otomatis tersinkron dengan localStorage.
 * - Saat pertama render: baca nilai dari localStorage (lazy initial state).
 * - Setiap nilai berubah: simpan kembali lewat useEffect.
 * Bentuk pemakaiannya sama persis dengan useState: [value, setValue].
 */
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch (error) {
      // JSON rusak / localStorage diblokir: pakai nilai awal agar aplikasi tidak crash
      console.error(`Gagal membaca localStorage "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Gagal menyimpan localStorage "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;