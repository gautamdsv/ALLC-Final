import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus('');
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to request password reset');
      }
      setStatus('If that email exists, we have sent a password reset link to your inbox.');
    } catch (e) {
      setStatus(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-slate-100">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Forgot Password</h1>
        <p className="text-sm text-slate-500">Enter your email and we will send you a reset link.</p>
        
        <input
          className="w-full border rounded-lg px-4 py-3"
          type="email"
          placeholder="admin@allc.local"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {status && (
          <p className="text-sm text-emerald-700 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
            {status}
          </p>
        )}

        <button
          className="w-full rounded-lg bg-emerald-600 text-white font-semibold py-3 disabled:opacity-60"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </button>

        <div className="flex justify-center w-full mt-4">
          <button 
             type="button" 
             className="text-sm text-slate-500 hover:text-slate-800"
             onClick={() => navigate('/admin/login')}
          >
             Back to Login
          </button>
        </div>
      </form>
    </main>
  );
}
