import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { AuthFoodGallery } from '../components/AuthFoodGallery';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api.post('/auth/register', { name, email, password });
      navigate('/login', { state: { notice: 'Registrasi berhasil. Silakan masuk dengan akun barumu.' } });
    } catch (err: any) {
      const msg = err.response?.data?.errors 
        ? err.response.data.errors.map((e: any) => `${e.field}: ${e.message}`).join(', ')
        : err.response?.data?.message || 'Registrasi gagal';
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="page-container auth-layout">
      <section className="auth-intro">
        <p className="eyebrow">Mulai dari satu langkah</p>
        <h1 className="auth-intro__title">Temukan tempat makan yang terasa <em>seperti rumah.</em></h1>
        <p className="auth-intro__copy">Buat akun untuk jadi bagian dari cerita kantin dan temukan warung yang ingin kamu kunjungi.</p>
        <div className="auth-note"><span aria-hidden="true">✳</span> Satu akun untuk banyak pilihan.</div>
        <AuthFoodGallery />
      </section>
      <section className="auth-panel" aria-labelledby="register-title">
        <h2 id="register-title">Buat akun</h2>
        <p className="auth-panel__copy">Daftar dengan informasi dasar kamu.</p>
        {error && <div className="status-message status-message--error" role="alert">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="form-field" htmlFor="register-name">Nama
            <input className="form-control" id="register-name" type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
          <label className="form-field" htmlFor="register-email">Email
            <input className="form-control" id="register-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label className="form-field" htmlFor="register-password">Password
            <input className="form-control" id="register-password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          <button className="button button--primary" type="submit" disabled={busy}>{busy ? 'Membuat akun...' : 'Daftar'}</button>
        </form>
        <p className="auth-switch">Sudah punya akun? <a href="/login">Masuk</a></p>
      </section>
    </main>
  );
};