import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Tag, ArrowRight } from 'lucide-react';
import { getPosts, CATEGORIES } from '../utils/blogStorage';

const C = {
  bg: '#DCF4F1',
  primary: '#062926',
  accent: '#2AB5A5',
  muted: '#4A7C78',
  surface: 'rgba(255,255,255,0.82)',
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
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

function CategoryBadge({ category }) {
  const colors = CATEGORY_COLORS[category] || { bg: '#E5E7EB', text: '#374151' };
  return (
    <span
      className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full"
      style={{ background: colors.bg, color: colors.text }}
    >
      {category}
    </span>
  );
}

function PostCard({ post, idx }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.06 }}
      className="group flex flex-col rounded-2xl overflow-hidden"
      style={{ background: C.surface, border: `1px solid ${C.border}`, backdropFilter: 'blur(12px)' }}
    >
      {/* Cover Image */}
      <div className="relative overflow-hidden h-48 bg-gray-100 shrink-0">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-4xl"
            style={{ background: `linear-gradient(135deg, ${C.accent}22, ${C.accent}44)` }}
          >
            {post.category === 'Event' ? '🎤' : post.category === 'Seminar' ? '📚' : post.category === 'Tip' ? '💡' : '📝'}
          </div>
        )}
        <div className="absolute top-3 left-3">
          <CategoryBadge category={post.category} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 gap-3">
        <div className="flex items-center gap-2 text-xs" style={{ color: C.muted }}>
          <Calendar size={12} />
          <span>{formatDate(post.date)}</span>
          {post.author && (
            <>
              <span>·</span>
              <span>{post.author}</span>
            </>
          )}
        </div>

        <h2
          className="font-bold text-xl leading-snug group-hover:underline"
          style={{ color: C.primary, textDecorationColor: C.accent }}
        >
          {post.title}
        </h2>

        <p className="text-sm leading-relaxed line-clamp-3 flex-1" style={{ color: C.muted }}>
          {post.shortDescription}
        </p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 text-xs px-2 py-0.5 rounded"
                style={{ background: `${C.accent}15`, color: C.accent }}
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        )}

        <Link
          to={`/blogs/${post.id}`}
          className="mt-3 flex items-center gap-2 text-sm font-semibold transition-all group-hover:gap-3"
          style={{ color: C.accent }}
        >
          Read More <ArrowRight size={15} />
        </Link>
      </div>
    </motion.div>
  );
}

export default function Blogs() {
  const [posts, setPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchPosts = async () => {
      try {
        const data = await getPosts({ category: activeCategory === 'All' ? undefined : activeCategory });
        if (!cancelled) {
          setPosts(data.items || []);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setPosts([]);
          setLoading(false);
        }
      }
    };
    fetchPosts();
    return () => { cancelled = true; };
  }, [activeCategory]);

  const filtered = posts;

  return (
    <main
      className="w-full min-h-screen pt-[110px] md:pt-[140px] pb-32 px-6 md:px-12 overflow-hidden"
      style={{ background: `linear-gradient(160deg, ${C.bg} 0%, #C8EDE9 100%)` }}
    >
      {/* Header */}
      <motion.div
        className="max-w-6xl mx-auto flex flex-col items-start gap-4 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div
          className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold tracking-[0.15em] uppercase"
          style={{ border: `1px solid ${C.accent}40`, background: `${C.accent}15`, color: C.accent }}
        >
          Events & Blog
        </div>
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]"
          style={{ color: C.primary }}
        >
          Insights, Events &{' '}
          <span style={{ color: C.accent }}>Health Wisdom.</span>
        </h1>
        <p
          className="text-base md:text-lg leading-relaxed max-w-2xl mt-2"
          style={{ color: C.muted }}
        >
          Stay updated with our seminars, clinical events, health articles, and expert tips
          from Dr. Divya Gautam and the ALLC team.
        </p>
      </motion.div>

      {/* Category Filter */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-wrap gap-3">
          {['All', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
              style={{
                background: activeCategory === cat ? C.accent : C.surface,
                color: activeCategory === cat ? '#fff' : C.muted,
                border: `1px solid ${activeCategory === cat ? C.accent : C.border}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map((n) => (
              <div key={n} className="rounded-2xl overflow-hidden animate-pulse" style={{ background: C.surface, border: `1px solid ${C.border}`, height: 340 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="text-center py-24 rounded-2xl"
            style={{ background: C.surface, border: `1px solid ${C.border}` }}
          >
            <p className="text-5xl mb-4">📭</p>
            <p className="text-lg font-semibold" style={{ color: C.primary }}>
              No posts yet
            </p>
            <p className="text-sm mt-1" style={{ color: C.muted }}>
              Check back soon for updates from the ALLC team.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, idx) => (
              <PostCard key={post.id} post={post} idx={idx} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
