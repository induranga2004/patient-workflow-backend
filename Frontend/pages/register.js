// pages/register.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '../lib/api';
import { setAuth } from '../lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      // 1) create user
      await api('/api/auth/register', { method: 'POST', body: form });
      // 2) login immediately
      const res = await api('/api/auth/login', {
        method: 'POST',
        body: { email: form.email, password: form.password }
      });
      setAuth(res.token, res.user);
      // 3) redirect
      if (res.user.role === 'ADMIN') router.push('/admin/dashboard');
      else router.push('/doctors');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{maxWidth: 420, margin: '80px auto', padding: 24, border: '1px solid #eee', borderRadius: 12}}>
      <h1 style={{marginBottom: 16}}>Register</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={onSubmit}>
        <label>Name</label>
        <input
          name="name" value={form.name} onChange={onChange} required
          style={{display:'block', width:'100%', padding:10, margin:'6px 0 12px', border:'1px solid #ddd', borderRadius:8}}
        />

        <label>Email</label>
        <input
          name="email" type="email" value={form.email} onChange={onChange} required
          style={{display:'block', width:'100%', padding:10, margin:'6px 0 12px', border:'1px solid #ddd', borderRadius:8}}
        />

        <label>Password</label>
        <input
          name="password" type="password" value={form.password} onChange={onChange} required
          style={{display:'block', width:'100%', padding:10, margin:'6px 0 20px', border:'1px solid #ddd', borderRadius:8}}
        />

        <button type="submit" disabled={loading}
          style={{width:'100%', padding:12, border:'none', borderRadius:8, background:'#111827', color:'#fff', cursor:'pointer'}}>
          {loading ? 'Creating…' : 'Create account'}
        </button>
      </form>

      <p style={{marginTop:12, fontSize:14}}>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}
