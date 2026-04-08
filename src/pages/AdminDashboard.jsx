import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiDelete, apiGet, apiPatch, apiPost } from '../lib/api';
import { useAuth } from '../context/useAuth';
import DOMPurify from 'dompurify';
import { getAllPostsAdmin, deletePost, savePost } from '../utils/blogStorage';
import { PlusCircle, Pencil, Trash2, Eye, EyeOff, KeyRound } from 'lucide-react';

const statuses = ['NEW', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED'];
const C = {
  bg: '#DCF4F1',
  primary: '#062926',
  accent: '#2AB5A5',
  muted: '#4A7C78',
  border: 'rgba(6,41,38,0.14)',
  surface: 'rgba(255,255,255,0.86)',
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('waitlist');

  // Waitlist state
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, limit: 10 });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [searchDraft, setSearchDraft] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState('');
  const [deletingId, setDeletingId] = useState('');

  // Blog state
  const [blogPosts, setBlogPosts] = useState([]);
  const [blogLoading, setBlogLoading] = useState(false);
  const [toast, setToast] = useState('');

  // Change Password state
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  };

  // Waitlist loaders
  const loadItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sortBy,
        sortOrder,
      });
      if (statusFilter) params.set('status', statusFilter);
      if (search) params.set('search', search);
      const data = await apiGet(`/api/v1/admin/waitlist?${params.toString()}`);
      setItems(data.items || []);
      setPagination(data.pagination || { page: 1, totalPages: 1, total: 0, limit });
    } catch (e) {
      setError(e.message || 'Failed to load waitlist');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, page, limit, sortBy, sortOrder]);

  useEffect(() => { loadItems(); }, [loadItems]);

  // Blog loaders / handlers
  const refreshBlogPosts = useCallback(async () => {
    setBlogLoading(true);
    try {
      const data = await getAllPostsAdmin();
      setBlogPosts(data.items || []);
    } catch {
      setBlogPosts([]);
    } finally {
      setBlogLoading(false);
    }
  }, []);

  useEffect(() => { refreshBlogPosts(); }, [refreshBlogPosts]);

  const handleTogglePublished = async (post) => {
    try {
      await savePost({ ...post, published: !post.published });
      await refreshBlogPosts();
      showToast(post.published ? 'Post set to Draft' : 'Post Published ✓');
    } catch {
      showToast('Failed to update post');
    }
  };

  const handleDeleteBlogPost = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deletePost(id);
      await refreshBlogPosts();
      showToast('Post deleted');
    } catch {
      showToast('Failed to delete post');
    }
  };

  // Change Password handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError('');
    if (pwForm.newPassword !== pwForm.confirm) {
      setPwError('New passwords do not match.');
      return;
    }
    if (pwForm.newPassword.length < 8) {
      setPwError('New password must be at least 8 characters.');
      return;
    }
    setPwSaving(true);
    try {
      await apiPost('/api/v1/auth/password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwSuccess(true);
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
      setTimeout(() => logout(), 2000);
    } catch (err) {
      setPwError(err.message || 'Failed to change password');
    } finally {
      setPwSaving(false);
    }
  };

  // Waitlist handlers
  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    setError('');
    try {
      await apiPatch(`/api/v1/admin/waitlist/${id}`, { status });
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
      showToast('Status updated');
    } catch (e) {
      setError(e.message || 'Failed to update status');
      await loadItems();
    } finally {
      setUpdatingId('');
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this waitlist application? This cannot be undone.')) return;
    setDeletingId(id);
    setError('');
    try {
      await apiDelete(`/api/v1/admin/waitlist/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
      showToast('Application deleted');
      await loadItems();
    } catch (e) {
      setError(e.message || 'Failed to delete application');
    } finally {
      setDeletingId('');
    }
  };

  const applySearch = (event) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchDraft.trim());
  };

  // Render
  return (
    <main
      className="min-h-screen p-6 md:p-8"
      style={{ background: `linear-gradient(160deg, ${C.bg} 0%, #C8EDE9 100%)` }}
    >
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <header className="flex flex-wrap justify-between items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: C.primary }}>Admin Panel</h1>
            <p className="text-sm" style={{ color: C.muted }}>Signed in as {user?.email} ({user?.role})</p>
          </div>
          <button
            className="px-4 py-2 rounded-md text-white"
            style={{ background: C.primary }}
            onClick={logout}
          >
            Logout
          </button>
        </header>

        {/* Tab Switcher */}
        <div className="flex gap-1" style={{ borderBottom: `2px solid ${C.border}` }}>
          {[
            { key: 'waitlist', label: '📋 Waitlist' },
            { key: 'blog',     label: '📝 Blog Posts' },
            { key: 'account',  label: '🔑 Account' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="px-5 py-2.5 rounded-t-lg text-sm font-semibold transition-all"
              style={{
                background: activeTab === key ? '#fff' : 'transparent',
                color: activeTab === key ? C.primary : C.muted,
                borderBottom: activeTab === key ? `2px solid ${C.accent}` : '2px solid transparent',
                marginBottom: '-2px',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Toast */}
        {toast && (
          <p className="text-sm font-medium px-4 py-2 rounded-lg" style={{ background: `${C.accent}18`, color: C.primary }}>
            {toast}
          </p>
        )}

        {/* ── BLOG TAB ───────────────────────────────────────── */}
        {activeTab === 'blog' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm" style={{ color: C.muted }}>
                {blogPosts.length} post{blogPosts.length !== 1 ? 's' : ''} total
              </p>
              <Link
                to="/admin/blog/new"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
                style={{ background: C.accent }}
              >
                <PlusCircle size={15} /> New Post
              </Link>
            </div>

            {blogLoading ? (
              <div className="grid gap-3">
                {[1,2,3].map((n) => (
                  <div key={n} className="h-20 rounded-xl animate-pulse" style={{ background: C.surface, border: `1px solid ${C.border}` }} />
                ))}
              </div>
            ) : blogPosts.length === 0 ? (
              <div
                className="text-center py-16 rounded-xl"
                style={{ background: C.surface, border: `1px solid ${C.border}` }}
              >
                <p className="text-4xl mb-3">📝</p>
                <p className="font-semibold" style={{ color: C.primary }}>No blog posts yet</p>
                <p className="text-sm mt-1" style={{ color: C.muted }}>Click "New Post" to create your first one.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {blogPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl"
                    style={{ background: C.surface, border: `1px solid ${C.border}` }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {post.coverImage && (
                        <img
                          src={post.coverImage}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate" style={{ color: C.primary }}>{post.title}</p>
                        <p className="text-xs" style={{ color: C.muted }}>
                          {post.category} · {post.date ? new Date(post.date).toLocaleDateString('en-IN') : ''}
                          <span
                            className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold"
                            style={{
                              background: post.published ? '#D1FAE5' : '#FEF3C7',
                              color: post.published ? '#065F46' : '#92400E',
                            }}
                          >
                            {post.published ? 'Published' : 'Draft'}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTogglePublished(post)}
                        title={post.published ? 'Set to Draft' : 'Publish'}
                        className="p-2 rounded-lg"
                        style={{ background: '#F0FDF4', border: `1px solid ${C.border}`, color: C.accent }}
                      >
                        {post.published ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <Link
                        to={`/admin/blog/edit/${post.id}`}
                        className="p-2 rounded-lg"
                        style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.muted }}
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => handleDeleteBlogPost(post.id, post.title)}
                        className="p-2 rounded-lg"
                        style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── WAITLIST TAB ───────────────────────────────────── */}
        {activeTab === 'waitlist' && (
          <>
            <form
              className="rounded-xl p-3 md:p-4 flex flex-wrap gap-3 items-center"
              style={{ background: C.surface, border: `1px solid ${C.border}` }}
              onSubmit={applySearch}
            >
              <input
                className="flex-1 min-w-[220px] rounded-md px-3 py-2"
                style={{ background: '#fff', border: `1px solid ${C.border}`, color: C.primary }}
                placeholder="Search by name, email, or rationale"
                value={searchDraft}
                onChange={(e) => setSearchDraft(e.target.value)}
              />
              <select
                className="rounded-md px-3 py-2"
                style={{ background: '#fff', border: `1px solid ${C.border}`, color: C.primary }}
                value={limit}
                onChange={(e) => { setPage(1); setLimit(Number(e.target.value)); }}
              >
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
                <option value={50}>50 / page</option>
              </select>
              <select
                className="rounded-md px-3 py-2"
                style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.primary }}
                value={statusFilter}
                onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }}
              >
                <option value="">All statuses</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <select
                className="rounded-md px-3 py-2"
                style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.primary }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="createdAt">Sort: Created</option>
                <option value="updatedAt">Sort: Updated</option>
              </select>
              <button
                className="px-3 py-2 rounded-md"
                style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.primary }}
                type="button"
                onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
              >
                {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
              </button>
              <button className="px-4 py-2 rounded-md text-white" style={{ background: C.accent }} type="submit">Apply</button>
              <button
                className="px-4 py-2 rounded-md"
                style={{ background: '#fff', border: `1px solid ${C.border}`, color: C.primary }}
                type="button"
                onClick={() => {
                  setSearchDraft('');
                  setSearch('');
                  setStatusFilter('');
                  setSortBy('createdAt');
                  setSortOrder('desc');
                  setPage(1);
                  setLimit(10);
                }}
              >
                Reset
              </button>
              <button
                className="px-4 py-2 rounded-md"
                style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.primary }}
                type="button"
                onClick={loadItems}
              >
                Refresh
              </button>
            </form>

            {error && <p className="text-red-600">{error}</p>}

            {loading ? (
              <div className="grid gap-3">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div key={idx} className="h-24 rounded-xl animate-pulse" style={{ background: '#eef8f6', border: `1px solid ${C.border}` }} />
                ))}
              </div>
            ) : (
              <div className="grid gap-4">
                {items.map((item) => (
                  <article key={item.id} className="rounded-xl p-4 shadow-sm" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                    <div className="flex flex-wrap justify-between gap-2">
                      <div>
                        <h2 className="font-semibold" style={{ color: C.primary }}>{item.fullName}</h2>
                        <p className="text-sm" style={{ color: C.muted }}>{item.email}</p>
                        <p className="text-sm mt-1" style={{ color: C.muted }}>{item.healthVector || 'No health vector selected'}</p>
                      </div>
                      <div className="flex gap-2 items-start flex-wrap justify-end">
                        <span className="text-xs px-2 py-1 rounded" style={{ background: `${C.accent}22`, color: C.primary }}>{item.status}</span>
                        <select
                          className="rounded-md px-2 py-1 text-sm"
                          style={{ background: '#fff', border: `1px solid ${C.border}`, color: C.primary }}
                          value={item.status}
                          disabled={updatingId === item.id || deletingId === item.id}
                          onChange={(e) => updateStatus(item.id, e.target.value)}
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                        <button
                          className="px-3 py-1 rounded-md text-sm text-white disabled:opacity-60"
                          style={{ background: '#b91c1c' }}
                          disabled={deletingId === item.id || updatingId === item.id}
                          onClick={() => deleteItem(item.id)}
                        >
                          {deletingId === item.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 bg-white p-3 rounded border border-[rgba(6,41,38,0.1)]">
                      <p className="text-sm font-semibold mb-1" style={{ color: C.primary }}>Rationale:</p>
                      <p
                        className="text-sm whitespace-pre-wrap"
                        style={{ color: C.muted }}
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.rationale) }}
                      />
                    </div>
                    <div className="mt-3">
                      <label className="text-sm font-semibold block mb-1" style={{ color: C.primary }}>Admin Notes:</label>
                      <div className="flex gap-2">
                        <textarea
                          className="flex-1 rounded-md px-3 py-2 text-sm"
                          style={{ background: '#fff', border: `1px solid ${C.border}`, color: C.primary, minHeight: '60px' }}
                          placeholder="Add private notes here..."
                          defaultValue={item.adminNotes || ''}
                          onBlur={(e) => {
                            if (e.target.value !== (item.adminNotes || '')) {
                              apiPatch(`/api/v1/admin/waitlist/${item.id}`, { adminNotes: e.target.value })
                                .then(() => showToast('Notes saved'))
                                .catch((err) => setError(err.message || 'Failed to save notes'));
                            }
                          }}
                        />
                      </div>
                    </div>
                  </article>
                ))}
                {!items.length && <p style={{ color: C.muted }}>No applications yet.</p>}
              </div>
            )}

            <div
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl p-3"
              style={{ background: C.surface, border: `1px solid ${C.border}` }}
            >
              <p className="text-sm" style={{ color: C.muted }}>
                Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
              </p>
              <div className="flex gap-2">
                <button
                  className="px-3 py-2 rounded-md disabled:opacity-50"
                  style={{ background: '#fff', border: `1px solid ${C.border}`, color: C.primary }}
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                  Previous
                </button>
                <button
                  className="px-3 py-2 rounded-md disabled:opacity-50"
                  style={{ background: '#fff', border: `1px solid ${C.border}`, color: C.primary }}
                  disabled={page >= pagination.totalPages || loading}
                  onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── ACCOUNT TAB ─────────────────────────────────────── */}
        {activeTab === 'account' && (
          <div className="max-w-md">
            <div className="rounded-2xl p-8" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg" style={{ background: `${C.accent}18` }}>
                  <KeyRound size={18} style={{ color: C.accent }} />
                </div>
                <div>
                  <h2 className="font-bold text-lg" style={{ color: C.primary }}>Change Password</h2>
                  <p className="text-xs" style={{ color: C.muted }}>Changing password will log you out of all devices.</p>
                </div>
              </div>

              {pwSuccess ? (
                <div className="text-center py-6">
                  <p className="text-3xl mb-3">✅</p>
                  <p className="font-semibold" style={{ color: C.primary }}>Password changed!</p>
                  <p className="text-sm mt-1" style={{ color: C.muted }}>Logging you out in 2 seconds…</p>
                </div>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  {pwError && (
                    <p className="text-sm px-3 py-2 rounded-lg" style={{ background: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA' }}>
                      {pwError}
                    </p>
                  )}
                  {[['currentPassword','Current Password','password'],['newPassword','New Password','password'],['confirm','Confirm New Password','password']].map(([field, label, type]) => (
                    <div key={field}>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: C.muted }}>{label}</label>
                      <input
                        type={type}
                        required
                        minLength={8}
                        value={pwForm[field]}
                        onChange={(e) => setPwForm((prev) => ({ ...prev, [field]: e.target.value }))}
                        className="w-full rounded-lg px-3 py-2.5 text-sm"
                        style={{ background: '#fff', border: `1px solid ${C.border}`, color: C.primary, outline: 'none' }}
                        placeholder="••••••••"
                      />
                    </div>
                  ))}
                  <button
                    type="submit"
                    disabled={pwSaving}
                    className="w-full py-2.5 rounded-lg text-sm font-semibold text-white mt-2"
                    style={{ background: pwSaving ? '#90cbc4' : C.accent, cursor: pwSaving ? 'not-allowed' : 'pointer' }}
                  >
                    {pwSaving ? 'Changing…' : 'Change Password'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
