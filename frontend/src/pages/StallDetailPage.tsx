import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axiosInstance';
import { getMenuPhoto } from '../data/menuMedia';

interface Stall {
  id: number;
  name: string;
  category?: string;
  location?: string;
  description?: string;
}


interface MenuItem {
  id: number;
  stallId: number;
  name: string;
  price: number;
  isAvailable: boolean;
}

const formatPrice = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});
export default function StallDetailPage() {
  const { id } = useParams();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [stall, setStall] = useState<Stall | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const fetchStall = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/stalls/${id}`);
        if (active) setStall(response.data.data ?? response.data);
      } catch (requestError: any) {
        if (active) {
          setError(requestError.response?.data?.message || 'Gagal memuat detail warung.');
          setStall(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchStall();
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    let active = true;

    const fetchMenuItems = async () => {
      setMenuLoading(true);
      try {
        const response = await api.get('/menu-items');
        const payload = response.data.data ?? response.data;
        if (active && Array.isArray(payload)) {
          setMenuItems(payload.filter((item: MenuItem) => item.stallId === Number(id)));
        }
      } catch {
        if (active) setMenuItems([]);
      } finally {
        if (active) setMenuLoading(false);
      }
    };

    fetchMenuItems();
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <>
      <main className="page-container">
        <Link className="text-link" to="/">&larr; Kembali ke daftar warung</Link>
        {loading && <div className="loading-state" role="status" aria-live="polite">Memuat detail warung...</div>}
        {!loading && error && (
          <div className="empty-state" role="alert">
            <div className="empty-state__mark" aria-hidden="true">!</div>
            <h2>Detail belum bisa dimuat</h2>
            <p>{error}</p>
          </div>
        )}
        {!loading && !error && !stall && (
          <div className="empty-state" role="status">
            <div className="empty-state__mark" aria-hidden="true">?</div>
            <h2>Warung tidak ditemukan</h2>
            <p>Warung yang kamu cari mungkin sudah tidak tersedia.</p>
          </div>
        )}
        {!loading && stall && (
          <article className="detail-panel">
            <div className="detail-banner">
              <span className="detail-banner__monogram" aria-hidden="true">{stall.name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="detail-content">
              <span className="eyebrow">Kantin pilihan</span>
              <h1>{stall.name}</h1>
              <p className="detail-description">{stall.description || 'Belum ada deskripsi untuk warung ini.'}</p>
              <div className="detail-meta">
                <span className="detail-meta__item">Kategori: {stall.category || 'Umum'}</span>
                {stall.location && <span className="detail-meta__item">Lokasi: {stall.location}</span>}
              </div>
            </div>
          </article>
        )}

        {!loading && !error && stall && (
          <section className="menu-section" aria-labelledby="menu-title">
            <div className="menu-section__heading">
              <div>
                <p className="eyebrow">Dari dapur warung</p>
                <h2 id="menu-title">Menu pilihan</h2>
              </div>
              {!menuLoading && menuItems.length > 0 && (
                <span className="result-count">{menuItems.length} menu</span>
              )}
            </div>
            {menuLoading && <div className="loading-state" role="status">Memuat menu...</div>}
            {!menuLoading && menuItems.length === 0 && (
              <div className="menu-empty">Menu belum tersedia untuk warung ini.</div>
            )}
            {!menuLoading && menuItems.length > 0 && (
              <div className="menu-grid">
                {menuItems.map((item) => {
                  const photo = getMenuPhoto(item.name);
                  const photoUrl = photo?.src;

                  return (
                    <article className="menu-card" key={item.id}>
                      <div className={`menu-card__visual${photoUrl ? ' menu-card__visual--photo' : ''}`}>
                        {photoUrl ? (
                          <img
                            className="menu-card__image"
                            src={photoUrl}
                            alt={`Foto representatif ${item.name}`}
                            loading="lazy"
                            onError={(event) => {
                              event.currentTarget.remove();
                              event.currentTarget.parentElement?.classList.remove('menu-card__visual--photo');
                            }}
                          />
                        ) : (
                          <span className="menu-card__placeholder" aria-hidden="true">{item.name.charAt(0).toUpperCase()}</span>
                        )}
                        {photoUrl && (photo?.creditUrl ? (
                          <a className="menu-card__photo-label" href={photo.creditUrl} target="_blank" rel="noreferrer">
                            Foto: {photo.credit}
                          </a>
                        ) : (
                          <span className="menu-card__photo-label">Foto ilustrasi</span>
                        ))}
                      </div>
                      <div className="menu-card__content">
                        <div className="menu-card__title-row">
                          <h3>{item.name}</h3>
                          <span className={`availability-dot${item.isAvailable ? '' : ' availability-dot--off'}`} aria-label={item.isAvailable ? 'Tersedia' : 'Tidak tersedia'} />
                        </div>
                        <div className="menu-card__footer">
                          <strong>{formatPrice.format(item.price)}</strong>
                          <span>{item.isAvailable ? 'Tersedia' : 'Habis'}</span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>
    </>
  );
}