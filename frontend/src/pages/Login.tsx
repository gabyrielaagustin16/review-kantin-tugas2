import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import { AuthFoodGallery } from '../components/AuthFoodGallery';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const notice = (location.state as { notice?: string } | null)?.notice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const token = res.data.token || res.data.data?.token;
      if (!token) throw new Error('Token login tidak ditemukan. Silakan coba lagi.');
      login(token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Login gagal. Cek email/password.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="page-container auth-layout">
      <section className="auth-intro">
        <p className="eyebrow">Senang bertemu lagi</p>
        <h1 className="auth-intro__title">Cerita rasa dimulai <em>dari sini.</em></h1>
        <p className="auth-intro__copy">Masuk untuk mengelola warung atau lanjut menjelajahi pilihan makan di kantin.</p>
        <div className="auth-note"><span aria-hidden="true">✳</span> Pilihan lokal, cerita yang dekat.</div>
        <AuthFoodGallery />
      </section>
      <section className="auth-panel" aria-labelledby="login-title">
        <h2 id="login-title">Masuk</h2>
        <p className="auth-panel__copy">Gunakan akun Review Kantin kamu.</p>
        {notice && <div className="status-message status-message--success" role="status">{notice}</div>}
        {error && <div className="status-message status-message--error" role="alert">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="form-field" htmlFor="login-email">Email
            <input className="form-control" id="login-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label className="form-field" htmlFor="login-password">Password
            <input className="form-control" id="login-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          <button className="button button--primary" type="submit" disabled={busy}>{busy ? 'Memeriksa akun...' : 'Masuk ke akun'}</button>
        </form>
        <p className="auth-switch">Belum punya akun? <a href="/register">Daftar sekarang</a></p>
      </section>
    </main>
  );
};