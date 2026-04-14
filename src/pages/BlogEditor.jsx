import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Save, X } from 'lucide-react';
import {
  getPostById,
  savePost,
  generateId,
  CATEGORIES,
} from '../utils/blogStorage';

const C = {
  bg: '#DCF4F1',
  primary: '#062926',
  accent: '#2AB5A5',
  muted: '#4A7C78',
  surface: 'rgba(255,255,255,0.9)',
  border: 'rgba(6,41,38,0.14)',
};

const EMPTY_POST = {
  id: '',
  title: '',
  category: CATEGORIES[0],
  author: 'Dr. Divya Gautam',
  coverImage: '',
  date: new Date().toISOString().slice(0, 10),
  shortDescription: '',
  content: '',
  tags: '',
  published: false,
};

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({ ...EMPTY_POST });
  const [preview, setPreview] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      getPostById(id)
        .then((existing) => {
          if (existing) {
            setForm({ ...existing, tags: existing.tags?.join(', ') || '' });
          }
        })
        .catch(() => {});
    } else {
      setForm({ ...EMPTY_POST, id: generateId() });
    }
  }, [id, isEditing]);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  const toggle = (field) => () => setForm((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleSave = async () => {
    if (!form.title.trim()) { setToast('Title is required.'); setTimeout(() => setToast(''), 3000); return; }
    if (!form.shortDescription.trim()) { setToast('Short description is required.'); setTimeout(() => setToast(''), 3000); return; }
    setSaving(true);
    try {
      const saved = await savePost(form);
      setForm((prev) => ({ ...prev, id: saved.id }));
      setToast('Post saved successfully!');
      setTimeout(() => {
        setToast('');
        navigate('/admin');
      }, 1500);
    } catch (err) {
      setToast(err.message || 'Save failed. Please try again.');
      setTimeout(() => setToast(''), 4000);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    background: '#fff',
    border: `1px solid ${C.border}`,
    color: C.primary,
    borderRadius: '8px',
    padding: '10px 14px',
    width: '100%',
    fontSize: '14px',
    outline: 'none',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: C.muted,
    marginBottom: '6px',
  };

  return (
    <main
      className="min-h-screen p-6 md:p-10"
      style={{ background: `linear-gradient(160deg, ${C.bg} 0%, #C8EDE9 100%)` }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="p-2 rounded-lg"
              style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.muted }}
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: C.primary }}>
                {isEditing ? 'Edit Post' : 'New Post'}
              </h1>
              <p className="text-xs" style={{ color: C.muted }}>
                {isEditing ? `Editing: ${form.title || 'Untitled'}` : 'Create a new blog post'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreview((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.muted }}
            >
              {preview ? <EyeOff size={14} /> : <Eye size={14} />}
              {preview ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ background: saving ? '#90cbc4' : C.accent, cursor: saving ? 'not-allowed' : 'pointer' }}
            >
              <Save size={14} /> {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>

        {toast && (
          <div
            className="px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-between"
            style={{ background: `${C.accent}18`, border: `1px solid ${C.accent}40`, color: C.primary }}
          >
            {toast}
            <button onClick={() => setToast('')}><X size={14} /></button>
          </div>
        )}

        {preview ? (
          /* Preview Mode */
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: C.surface, border: `1px solid ${C.border}` }}
          >
            {form.coverImage && !imageError && (
              <img
                src={form.coverImage}
                alt="Cover"
                className="w-full h-56 object-cover"
                onError={() => setImageError(true)}
              />
            )}
            <div className="p-8">
              <span
                className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full"
                style={{ background: '#D1FAE5', color: '#065F46' }}
              >
                {form.category}
              </span>
              <h1 className="text-3xl font-bold mt-4 mb-2" style={{ color: C.primary }}>{form.title || 'Untitled Post'}</h1>
              <p className="text-sm mb-6" style={{ color: C.muted }}>{form.author} · {form.date}</p>
              <p className="text-base font-medium mb-6" style={{ color: C.primary }}>{form.shortDescription}</p>
              <div style={{ color: C.muted, lineHeight: '1.85' }}>
                {form.content?.split('\n').map((para, idx) =>
                  para.trim() ? <p key={idx} className="mb-4">{para}</p> : <br key={idx} />
                )}
              </div>
              {form.tags && (
                <div className="flex flex-wrap gap-2 mt-6 pt-6" style={{ borderTop: `1px solid ${C.border}` }}>
                  {form.tags.split(',').map((t) => t.trim()).filter(Boolean).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full"
                      style={{ background: `${C.accent}15`, color: C.accent }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <div
            className="rounded-2xl p-6 md:p-8 space-y-6"
            style={{ background: C.surface, border: `1px solid ${C.border}` }}
          >
            {/* Title */}
            <div>
              <label style={labelStyle}>Title *</label>
              <input
                style={inputStyle}
                placeholder="Enter post title..."
                value={form.title}
                onChange={set('title')}
              />
            </div>

            {/* Category + Date row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Category *</label>
                <select style={inputStyle} value={form.category} onChange={set('category')}>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Date *</label>
                <input
                  type="date"
                  style={inputStyle}
                  value={form.date}
                  onChange={set('date')}
                />
              </div>
            </div>

            {/* Author */}
            <div>
              <label style={labelStyle}>Author</label>
              <input
                style={inputStyle}
                placeholder="Author name"
                value={form.author}
                onChange={set('author')}
              />
            </div>

            {/* Cover Image URL */}
            <div>
              <label style={labelStyle}>Cover Image URL</label>
              <input
                style={inputStyle}
                placeholder="https://example.com/image.jpg"
                value={form.coverImage}
                onChange={(e) => { setImageError(false); set('coverImage')(e); }}
              />
              {form.coverImage && (
                <div className="mt-2 rounded-lg overflow-hidden h-32 bg-gray-100">
                  {imageError ? (
                    <div className="h-full flex items-center justify-center text-xs" style={{ color: C.muted }}>
                      ⚠️ Could not load image — check the URL
                    </div>
                  ) : (
                    <img
                      src={form.coverImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Short Description */}
            <div>
              <label style={labelStyle}>Short Description * <span style={{ color: C.muted, fontWeight: 400 }}>(shown on card)</span></label>
              <textarea
                style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                placeholder="A brief 1–2 sentence summary..."
                value={form.shortDescription}
                onChange={set('shortDescription')}
              />
            </div>

            {/* Full Content */}
            <div>
              <label style={labelStyle}>Full Content</label>
              <textarea
                style={{ ...inputStyle, minHeight: '280px', resize: 'vertical', lineHeight: '1.7' }}
                placeholder="Write the full post content here. Each new line will be a new paragraph."
                value={form.content}
                onChange={set('content')}
              />
              <p className="text-xs mt-1" style={{ color: C.muted }}>Each new line becomes a new paragraph.</p>
            </div>

            {/* Tags */}
            <div>
              <label style={labelStyle}>Tags <span style={{ color: C.muted, fontWeight: 400 }}>(comma-separated)</span></label>
              <input
                style={inputStyle}
                placeholder="Diabetes, Nutrition, Lifestyle"
                value={form.tags}
                onChange={set('tags')}
              />
            </div>

            {/* Published Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: '#F0FAF9', border: `1px solid ${C.accent}30` }}>
              <div>
                <p className="font-semibold text-sm" style={{ color: C.primary }}>
                  {form.published ? '✅ Published' : '📝 Draft'}
                </p>
                <p className="text-xs mt-0.5" style={{ color: C.muted }}>
                  {form.published ? 'Visible to everyone on /blogs' : 'Only visible to admins'}
                </p>
              </div>
              <button
                onClick={toggle('published')}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200"
                style={{ background: form.published ? C.accent : '#D1D5DB' }}
              >
                <span
                  className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200"
                  style={{ transform: `translateX(${form.published ? '22px' : '4px'})` }}
                />
              </button>
            </div>
          </div>
        )}

        {/* Bottom Save */}
        <div className="flex justify-end gap-3">
          <Link
            to="/admin"
            className="px-5 py-2.5 rounded-lg text-sm font-medium"
            style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.muted }}
          >
            Cancel
          </Link>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white"
            style={{ background: C.accent }}
          >
            <Save size={14} />
            {form.published ? 'Save & Publish' : 'Save as Draft'}
          </button>
        </div>
      </div>
    </main>
  );
}
