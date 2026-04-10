import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const email = params.get('email');
  
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !email) {
      setError('Invalid or missing reset token.');
    }
  }, [token, email]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus('');
    setError('');
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/v1/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword: password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }
      setStatus('Password reset successfully. You can now log in.');
    } catch (e) {
      setError(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-slate-100">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Choose New Password</h1>
        <p className="text-sm text-slate-500">Pick a secure 8-character password.</p>
        
        <input
          className="w-full border rounded-lg px-4 py-3"
          type="email"
          value={email || ''}
          disabled
        />

        <input
          className="w-full border rounded-lg px-4 py-3"
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-sm text-red-600">{error}</p>}
        {status && <p className="text-sm text-emerald-700 bg-emerald-50 p-3 rounded-lg border border-emerald-200">{status}</p>}

        <button
          className="w-full rounded-lg bg-emerald-600 text-white font-semibold py-3 disabled:opacity-60"
          type="submit"
          disabled={isSubmitting || !!error && !password}
        >
          {isSubmitting ? 'Saving...' : 'Save Password'}
        </button>

        {status && (
          <div className="flex justify-center w-full mt-4">
            <button 
               type="button" 
               className="text-sm font-semibold text-emerald-600 hover:text-emerald-800"
               onClick={() => navigate('/admin/login')}
            >
               Go to Login
            </button>
          </div>
        )}
      </form>
    </main>
  );
}
