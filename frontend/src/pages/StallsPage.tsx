import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import { getMenuPhoto } from '../data/menuMedia';

interface Stall {
  id: number;
  name: string;
  category?: string;
  location?: string;
  description?: string;
  owner_id?: number;
}

interface MenuItem {
  id: number;
  stallId: number;
  name: string;
  price: number;
  isAvailable: boolean;
}

interface Notice {
  type: 'success' | 'error';
  text: string;
}

export function StallsPage() {
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [featuredMenus, setFeaturedMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Stall | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const { user } = useContext(AuthContext);
  const canManage = user?.role === 'admin' || user?.role === 'owner';

  useEffect(() => {
    let active = true;
    const fetchStalls = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/stalls', { params: { search } });
        const payload = response.data.data ?? response.data;
        if (active) setStalls(Array.isArray(payload) ? payload : []);
      } catch (requestError: any) {
        if (active) {
          setError(requestError.response?.data?.message || 'Gagal memuat data warung.');
          setStalls([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchStalls();
    return () => { active = false; };
  }, [search, refreshKey]);

  useEffect(() => {
    let active = true;

    api.get('/menu-items')
      .then((response) => {
        const payload = response.data.data ?? response.data;
        if (active && Array.isArray(payload)) {
          setFeaturedMenus(
            payload
              .filter((item: MenuItem) => {
                const photo = getMenuPhoto(item.name);
                return item.isAvailable && photo !== null && !photo.creditUrl;
              })
              .slice(0, 3),
          );
        }
      })
      .catch(() => {
        if (active) setFeaturedMenus([]);
      });

    return () => { active = false; };
  }, []);

  const resetForm = () => {
    setName('');
    setCategory('');
    setDescription('');
    setEditId(null);
  };

  const openCreateForm = () => {
    resetForm();
    setNotice(null);
    setFormOpen(true);
  };

  const openEditForm = (stall: Stall) => {
    setName(stall.name);
    setCategory(stall.category || '');
    setDescription(stall.description || '');
    setEditId(stall.id);
    setNotice(null);
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setNotice(null);
    try {
      if (editId !== null) {
        await api.put(`/stalls/${editId}`, { name, category, description });
        setNotice({ type: 'success', text: 'Warung berhasil diperbarui.' });
      } else {
        await api.post('/stalls', { name, category, description });
        setNotice({ type: 'success', text: 'Warung berhasil ditambahkan.' });
      }
      resetForm();
      setFormOpen(false);
      setRefreshKey((current) => current + 1);
    } catch (requestError: any) {
      setNotice({ type: 'error', text: requestError.response?.data?.message || 'Perubahan warung gagal disimpan.' });
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setBusy(true);
    try {
      await api.delete(`/stalls/${pendingDelete.id}`);
      setNotice({ type: 'success', text: `${pendingDelete.name} berhasil dihapus.` });
      setPendingDelete(null);
      setRefreshKey((current) => current + 1);
    } catch (requestError: any) {
      setNotice({ type: 'error', text: requestError.response?.data?.message || 'Warung gagal dihapus.' });
      setPendingDelete(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="page-container">
      <section className="page-heading" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">Jelajahi rasa di sekitar</p>
          <h1 className="page-title" id="page-title">Temukan warung favoritmu</h1>
          <p className="page-subtitle">Cari pilihan makan di kantin kampus, lalu temukan tempat yang pas untuk hari ini.</p>
        </div>
        {canManage && <button className="button button--primary" type="button" onClick={openCreateForm}>Tambah warung</button>}
      </section>

      {featuredMenus.length > 0 && (
        <section className="featured-menu" aria-labelledby="featured-menu-title">
          <div className="featured-menu__heading">
            <p className="eyebrow">Intip dari dapur</p>
            <h2 id="featured-menu-title">Beberapa menu yang tersedia</h2>
          </div>
          <div className="featured-menu__grid">
            {featuredMenus.map((item) => {
              const photo = getMenuPhoto(item.name);
              if (!photo) return null;

              return (
                <Link className="featured-menu__item" key={item.id} to={`/stalls/${item.stallId}`}>
                  <img src={photo.src} alt={`Foto representatif ${item.name}`} loading="lazy" />
                  <span className="featured-menu__caption">
                    <strong>{item.name}</strong>
                    <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.price)}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {notice && <div className={`status-message status-message--${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'}>{notice.text}</div>}

      {canManage && formOpen && (
        <section className="management-panel" aria-labelledby="management-title">
          <div className="management-panel__heading">
            <div>
              <h2 id="management-title">{editId !== null ? 'Perbarui warung' : 'Tambah warung baru'}</h2>
              <p>Lengkapi informasi dasar agar mudah ditemukan.</p>
            </div>
            <button className="button button--soft button--small" type="button" onClick={() => { setFormOpen(false); resetForm(); }}>Tutup</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <label className="form-field">Nama warung<input className="form-control" value={name} onChange={(event) => setName(event.target.value)} required /></label>
              <label className="form-field">Kategori<input className="form-control" value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Contoh: Makanan berat" /></label>
              <label className="form-field form-field--wide">Deskripsi<textarea className="form-control" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Ceritakan singkat tentang warung ini" /></label>
            </div>
            <div className="form-actions">
              <button className="button button--soft" type="button" onClick={() => { setFormOpen(false); resetForm(); }}>Batal</button>
              <button className="button button--primary" type="submit" disabled={busy}>{busy ? 'Menyimpan...' : editId !== null ? 'Simpan perubahan' : 'Simpan warung'}</button>
            </div>
          </form>
        </section>
      )}

      <div className="search-wrap">
        <label className="visually-hidden" htmlFor="stall-search">Cari nama atau kategori warung</label>
        <input className="search-input" id="stall-search" type="search" placeholder="Cari nama atau kategori warung..." value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>

      <section aria-labelledby="result-title">
        <div className="result-heading">
          <h2 id="result-title">Warung di kantin</h2>
          {!loading && <span className="result-count">{stalls.length} ditemukan</span>}
        </div>
        {loading && <div className="loading-state" role="status" aria-live="polite">Memuat daftar warung...</div>}
        {!loading && error && (
          <div className="empty-state" role="alert">
            <div className="empty-state__mark" aria-hidden="true">!</div>
            <h2>Daftar belum bisa dimuat</h2>
            <p>{error}</p>
            <button className="button button--soft" type="button" onClick={() => setRefreshKey((current) => current + 1)}>Coba lagi</button>
          </div>
        )}
        {!loading && !error && stalls.length === 0 && (
          <div className="empty-state">
            <div className="empty-state__mark" aria-hidden="true">R</div>
            <h2>{search ? 'Warung belum ditemukan' : 'Belum ada warung'}</h2>
            <p>{search ? 'Coba kata kunci lain untuk menemukan pilihanmu.' : 'Daftar warung akan muncul di sini saat tersedia.'}</p>
          </div>
        )}
        {!loading && !error && stalls.length > 0 && (
          <div className="stall-grid">
            {stalls.map((stall, index) => (
              <article className="stall-card" key={stall.id} style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}>
                <div className="stall-card__top">
                  <span className="stall-card__monogram" aria-hidden="true">{stall.name.charAt(0).toUpperCase()}</span>
                  <span className="category-chip">{stall.category || 'Umum'}</span>
                </div>
                <h3 className="stall-card__title">{stall.name}</h3>
                <p className="stall-card__description">{stall.description || 'Temukan informasi dan detail warung ini.'}</p>
                <div className="stall-card__footer">
                  <Link className="text-link" to={`/stalls/${stall.id}`}>Lihat detail <span aria-hidden="true">&rarr;</span></Link>
                  {canManage && (
                    <div className="card-actions">
                      <button className="button button--soft button--small" type="button" onClick={() => openEditForm(stall)}>Edit</button>
                      {user?.role === 'admin' && <button className="button button--danger button--small" type="button" onClick={() => setPendingDelete(stall)}>Hapus</button>}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {pendingDelete && (
        <div className="dialog-backdrop">
          <section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-copy">
            <h2 id="delete-title">Hapus warung?</h2>
            <p id="delete-copy">“{pendingDelete.name}” akan dihapus dari daftar. Tindakan ini tidak dapat dibatalkan.</p>
            <div className="form-actions">
              <button className="button button--soft" type="button" onClick={() => setPendingDelete(null)} disabled={busy}>Batal</button>
              <button className="button button--danger" type="button" onClick={handleDelete} disabled={busy}>{busy ? 'Menghapus...' : 'Ya, hapus warung'}</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}