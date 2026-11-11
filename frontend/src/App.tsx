import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { StallsPage } from './pages/StallsPage';
import StallDetailPage from './pages/StallDetailPage';
import './App.css';
import { SiteHeader } from './components/SiteHeader';

function App() {
  return (
    <Router>
      <SiteHeader />
      <Routes>
        <Route path="/" element={<StallsPage />} />
        <Route path="/stalls/:id" element={<StallDetailPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <footer className="site-footer">Review Kantin · Temukan pilihan makanmu hari ini</footer>
    </Router>
  );
}

function NotFoundPage() {
  return (
    <main className="page-container not-found-page">
      <p className="eyebrow">404 · Halaman tidak ditemukan</p>
      <h1 className="page-title">Halaman ini tidak tersedia</h1>
      <p className="page-subtitle">Alamat yang dibuka mungkin salah atau halaman sudah dipindahkan.</p>
      <div className="not-found-page__actions">
        <a className="button button--primary" href="/">Kembali ke beranda</a>
        <a className="button button--soft" href="/login">Masuk</a>
        <a className="button button--soft" href="/register">Daftar</a>
      </div>
    </main>
  );
}

export default App;