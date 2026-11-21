import axios from 'axios';
import { useContext, useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';

interface AuditItem {
  id: number;
  userId: number | null;
  userName: string | null;
  userEmail: string | null;
  action: string;
  targetTable: string;
  targetId: number;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

interface AuditFilters {
  userId: string;
  targetId: string;
  action: string;
  targetTable: string;
  from: string;
  to: string;
}

const emptyFilters: AuditFilters = {
  userId: '',
  targetId: '',
  action: '',
  targetTable: '',
  from: '',
  to: '',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getErrorMessages(error: unknown, fallback: string): string[] {
  if (!axios.isAxiosError(error) || !isRecord(error.response?.data)) return [fallback];

  const response = error.response.data;
  const message = typeof response.message === 'string' ? response.message : fallback;
  const fieldErrors = Array.isArray(response.errors)
    ? response.errors.flatMap((entry) => {
      if (!isRecord(entry)) return [];
      const field = typeof entry.field === 'string' ? entry.field : 'field';
      const detail = typeof entry.message === 'string' ? entry.message : '';
      return detail ? [`${field}: ${detail}`] : [];
    })
    : [];

  return [message, ...fieldErrors];
}

function metadataValue(item: AuditItem, key: string): string {
  const value = item.metadata?.[key];
  if (value === undefined || value === null || value === '') return '-';
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
    ? String(value)
    : JSON.stringify(value);
}

export default function AuditLogsPage() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [items, setItems] = useState<AuditItem[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [draftFilters, setDraftFilters] = useState<AuditFilters>(emptyFilters);
  const [filters, setFilters] = useState<AuditFilters>(emptyFilters);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [detail, setDetail] = useState<AuditItem | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailErrors, setDetailErrors] = useState<string[]>([]);
  const detailRequestId = useRef(0);

  const closeDetail = () => {
    detailRequestId.current += 1;
    setDetail(null);
    setDetailErrors([]);
    setDetailLoading(false);
  };

  const detailOpen = detailLoading || detailErrors.length > 0 || detail !== null;

  useEffect(() => {
    if (!detailOpen) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDetail();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [detailOpen]);

  useEffect(() => {
    if (user?.role !== 'admin') return undefined;

    const controller = new AbortController();
    const load = async () => {
      setLoading(true);
      setErrors([]);
      try {
        const params: Record<string, string | number> = { page, pageSize };
        (Object.keys(filters) as Array<keyof AuditFilters>).forEach((key) => {
          if (filters[key]) params[key] = filters[key];
        });
        const response = await api.get('/audit-logs', { params, signal: controller.signal });
        setItems(response.data.data.items);
        setPagination(response.data.data.pagination);
      } catch (error: unknown) {
        if (!axios.isCancel(error)) {
          setItems([]);
          setErrors(getErrorMessages(error, 'Gagal memuat audit log.'));
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void load();
    return () => controller.abort();
  }, [page, pageSize, filters, user?.role]);

  const openDetail = async (id: number) => {
    const requestId = detailRequestId.current + 1;
    detailRequestId.current = requestId;
    setDetail(null);
    setDetailErrors([]);
    setDetailLoading(true);
    try {
      const response = await api.get(`/audit-logs/${id}`);
      if (requestId === detailRequestId.current) setDetail(response.data.data);
    } catch (error: unknown) {
      if (requestId === detailRequestId.current) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setDetailErrors(['Catatan audit tidak ditemukan.']);
        } else {
          setDetailErrors(getErrorMessages(error, 'Gagal memuat detail audit log.'));
        }
      }
    } finally {
      if (requestId === detailRequestId.current) setDetailLoading(false);
    }
  };

  const updateDraft = (key: keyof AuditFilters, value: string) => {
    setDraftFilters((current) => ({ ...current, [key]: value }));
  };

  const applyFilters = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setFilters({ ...draftFilters });
  };

  const resetFilters = () => {
    setDraftFilters(emptyFilters);
    setFilters(emptyFilters);
    setPage(1);
  };

  if (authLoading) return <main className="page-container"><p>Memuat akun...</p></main>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;

  return (
    <main className="page-container audit-page">
      <div className="audit-heading">
        <div><p className="eyebrow">Administrasi</p><h1 className="page-title">Audit Log</h1></div>
        <span className="audit-total">Total: {pagination.total}</span>
      </div>

      <form className="audit-filters" aria-label="Filter audit log" onSubmit={applyFilters}>
        <label className="form-field">User ID
          <input className="form-control" type="number" min="1" value={draftFilters.userId} onChange={(event) => updateDraft('userId', event.target.value)} />
        </label>
        <label className="form-field">Target ID
          <input className="form-control" type="number" min="1" value={draftFilters.targetId} onChange={(event) => updateDraft('targetId', event.target.value)} />
        </label>
        <label className="form-field">Action
          <input className="form-control" maxLength={50} value={draftFilters.action} onChange={(event) => updateDraft('action', event.target.value)} />
        </label>
        <label className="form-field">Target Table
          <input className="form-control" maxLength={50} value={draftFilters.targetTable} onChange={(event) => updateDraft('targetTable', event.target.value)} />
        </label>
        <label className="form-field">Dari
          <input className="form-control" type="date" value={draftFilters.from} onChange={(event) => updateDraft('from', event.target.value)} />
        </label>
        <label className="form-field">Sampai
          <input className="form-control" type="date" value={draftFilters.to} onChange={(event) => updateDraft('to', event.target.value)} />
        </label>
        <div className="audit-filter-actions">
          <button type="submit" className="button button--primary">Terapkan</button>
          <button type="button" className="button button--soft" onClick={resetFilters}>Reset</button>
        </div>
      </form>

      {errors.length > 0 && (
        <div className="status-message status-message--error" role="alert">
          <ul>{errors.map((error, index) => <li key={`${error}-${index}`}>{error}</li>)}</ul>
        </div>
      )}
      {loading ? <p role="status">Memuat audit log...</p> : (
        <div className="audit-table-wrap">
          <table className="audit-table">
            <thead>
              <tr><th>Waktu</th><th>Pengguna</th><th>Action</th><th>Target</th><th>Hasil</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{new Date(item.createdAt).toLocaleString('id-ID')}</td>
                  <td>{item.userName || 'Tidak diketahui'}<br />{item.userEmail || '-'}</td>
                  <td>{item.action}</td>
                  <td>{item.targetTable} #{item.targetId}</td>
                  <td>{metadataValue(item, 'result')}</td>
                  <td><button type="button" className="button button--soft" onClick={() => openDetail(item.id)}>Detail</button></td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={6}>Tidak ada audit log.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <div className="audit-pagination">
        <label>Per halaman
          <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }}>
            {[10, 20, 50, 100].map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
        </label>
        <span>Halaman {page} dari {pagination.totalPages}</span>
        <button type="button" className="button button--soft" disabled={page <= 1} onClick={() => setPage(page - 1)}>Sebelumnya</button>
        <button type="button" className="button button--soft" disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)}>Berikutnya</button>
      </div>

      {detailOpen && (
        <div className="audit-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDetail(); }}>
          <section className="audit-modal" role="dialog" aria-modal="true" aria-labelledby="audit-detail-title">
            <button className="audit-modal__close" type="button" aria-label="Tutup" onClick={closeDetail}>×</button>
            <p className="eyebrow">Detail audit</p>
            <h2 id="audit-detail-title">ID {detail?.id ?? '...'}</h2>
            {detailLoading && <p role="status">Memuat detail...</p>}
            {detailErrors.length > 0 && (
              <div className="status-message status-message--error" role="alert">
                <ul>{detailErrors.map((error, index) => <li key={`${error}-${index}`}>{error}</li>)}</ul>
              </div>
            )}
            {detail && (
              <dl className="audit-detail">
                <dt>User ID</dt><dd>{detail.userId ?? '-'}</dd>
                <dt>Nama</dt><dd>{detail.userName || 'Tidak diketahui'}</dd>
                <dt>Email</dt><dd>{detail.userEmail || '-'}</dd>
                <dt>Action</dt><dd>{detail.action}</dd>
                <dt>Target</dt><dd>{detail.targetTable} #{detail.targetId}</dd>
                <dt>Result</dt><dd>{metadataValue(detail, 'result')}</dd>
                <dt>Role</dt><dd>{metadataValue(detail, 'role')}</dd>
                <dt>IP Address</dt><dd>{metadataValue(detail, 'ip_address')}</dd>
                <dt>User Agent</dt><dd>{metadataValue(detail, 'user_agent')}</dd>
                <dt>Waktu</dt><dd>{new Date(detail.createdAt).toLocaleString('id-ID')}</dd>
                <dt>Metadata JSON</dt><dd><pre>{JSON.stringify(detail.metadata, null, 2)}</pre></dd>
              </dl>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
