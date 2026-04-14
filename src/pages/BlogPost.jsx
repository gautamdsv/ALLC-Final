import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Tag, ArrowLeft, User } from 'lucide-react';
import { getPostById } from '../utils/blogStorage';

const C = {
  bg: '#DCF4F1',
  primary: '#062926',
  accent: '#2AB5A5',
  muted: '#4A7C78',
  surface: 'rgba(255,255,255,0.9)',
  border: 'rgba(6,41,38,0.12)',
};

const CATEGORY_COLORS = {
  'Event':          { bg: '#FFF3CD', text: '#7A5C00' },
  'Seminar':        { bg: '#D1FAE5', text: '#065F46' },
  'Health Article': { bg: '#DBEAFE', text: '#1E3A5F' },
  'Tip':            { bg: '#FCE7F3', text: '#831843' },
};

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setPost(null);
    setNotFound(false);
    getPostById(id)
      .then((found) => {
        if (found) setPost(found);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <main
        className="w-full min-h-screen pt-[110px] md:pt-[140px] pb-32 px-6 md:px-12 flex items-center justify-center"
        style={{ background: `linear-gradient(160deg, ${C.bg} 0%, #C8EDE9 100%)` }}
      >
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <h1 className="text-3xl font-bold mb-3" style={{ color: C.primary }}>Post not found</h1>
          <p className="mb-6" style={{ color: C.muted }}>This post may have been removed or is not yet published.</p>
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white"
            style={{ background: C.accent }}
          >
            <ArrowLeft size={16} /> Back to Blog
          </Link>
        </div>
      </main>
    );
  }

  if (!post) return null;

  const catColors = CATEGORY_COLORS[post.category] || { bg: '#E5E7EB', text: '#374151' };

  return (
    <main
      className="w-full min-h-screen pt-[110px] md:pt-[140px] pb-32"
      style={{ background: `linear-gradient(160deg, ${C.bg} 0%, #C8EDE9 100%)` }}
    >
      {/* Cover Image */}
      {post.coverImage && (
        <div className="w-full h-64 md:h-96 overflow-hidden mb-0">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.parentElement.style.display = 'none'; }}
          />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 md:px-8">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-8 pb-6"
        >
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:gap-3"
            style={{ color: C.muted }}
          >
            <ArrowLeft size={15} /> Back to Events &amp; Blog
          </Link>
        </motion.div>

        {/* Article */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl overflow-hidden"
          style={{ background: C.surface, border: `1px solid ${C.border}` }}
        >
          <div className="p-8 md:p-12">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span
                className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full"
                style={{ background: catColors.bg, color: catColors.text }}
              >
                {post.category}
              </span>
              <span className="flex items-center gap-1.5 text-sm" style={{ color: C.muted }}>
                <Calendar size={13} />
                {formatDate(post.date)}
              </span>
            </div>

            {/* Title */}
            <h1
              className="text-3xl md:text-4xl font-bold leading-tight mb-4"
              style={{ color: C.primary }}
            >
              {post.title}
            </h1>

            {/* Author */}
            {post.author && (
              <div className="flex items-center gap-2 mb-8 pb-8" style={{ borderBottom: `1px solid ${C.border}` }}>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: `${C.accent}22` }}
                >
                  <User size={14} style={{ color: C.accent }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: C.primary }}>{post.author}</p>
                  <p className="text-xs" style={{ color: C.muted }}>ALLC Clinical Team</p>
                </div>
              </div>
            )}

            {/* Content */}
            <div
              className="prose max-w-none"
              style={{ color: C.muted, lineHeight: '1.85' }}
            >
              {post.content?.split('\n').map((para, idx) => (
                para.trim() ? (
                  <p key={idx} className="mb-5 text-base leading-relaxed" style={{ color: C.muted }}>
                    {para}
                  </p>
                ) : (
                  <br key={idx} />
                )
              ))}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-10 pt-8 flex flex-wrap gap-2" style={{ borderTop: `1px solid ${C.border}` }}>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                    style={{ background: `${C.accent}15`, color: C.accent }}
                  >
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.article>

        {/* Footer CTA */}
        <div className="mt-10 text-center">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all hover:gap-3"
            style={{ background: C.surface, color: C.primary, border: `1px solid ${C.border}` }}
          >
            <ArrowLeft size={15} /> More Posts
          </Link>
        </div>
      </div>
    </main>
  );
}
