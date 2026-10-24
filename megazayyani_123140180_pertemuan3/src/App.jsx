import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BookProvider } from './Context/BookContext';
import Navbar from './Components/Navbar/Navbar';
import Home from './Pages/Home/Home';
import Stats from './Pages/Stats/Stats';
import NotFound from './Pages/NotFound/NotFound';

function App() {
  return (
    <BrowserRouter>
      {/* Provider membungkus seluruh halaman agar semua bisa mengakses data buku */}
      <BookProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BookProvider>
    </BrowserRouter>
  );
}

export default App;