import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function AdminLogin() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      const nextPath = location.state?.from?.pathname || '/admin';
      navigate(nextPath, { replace: true });
    } catch (e) {
      setError(e.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-slate-100">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Admin Sign In</h1>
        <p className="text-sm text-slate-500">Use your admin credentials to access the panel.</p>
        <input
          className="w-full border rounded-lg px-4 py-3"
          type="email"
          placeholder="admin@allc.local"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full border rounded-lg px-4 py-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="flex justify-end w-full pb-2">
          <button 
             type="button" 
             className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
             onClick={() => navigate('/admin/forgot-password')}
          >
             Forgot password?
          </button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          className="w-full rounded-lg bg-emerald-600 text-white font-semibold py-3 disabled:opacity-60"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </main>
  );
}
