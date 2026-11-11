import { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export function SiteHeader() {
  const { user, logout, loading } = useContext(AuthContext);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" to="/" aria-label="Review Kantin, beranda">
          <span className="brand__mark" aria-hidden="true">R</span>
          <span className="brand__name">Review Kantin</span>
        </Link>
        <nav className="site-nav" aria-label="Navigasi utama">
          <NavLink className="site-nav__link" to="/" end>Jelajahi warung</NavLink>
          <div className="site-nav__actions">
            {loading ? (
              <span className="nav-loading" role="status">Memuat akun...</span>
            ) : user ? (
              <>
                <span className="user-pill">
                  <span className="user-pill__avatar" aria-hidden="true">{user.name.charAt(0).toUpperCase()}</span>
                  <span className="user-pill__copy">
                    <strong>{user.name}</strong>
                    <span className="user-pill__role">{user.role}</span>
                  </span>
                </span>
                <button className="button button--soft" type="button" onClick={logout}>Keluar</button>
              </>
            ) : (
              <>
                <a className="button button--soft" href="/login">Masuk</a>
                <a className="button button--primary" href="/register">Daftar</a>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}