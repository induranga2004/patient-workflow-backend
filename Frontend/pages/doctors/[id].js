// pages/doctors/[id].js
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import Layout from '../../components/Layout';
import { api } from '../../lib/api';
import { withAuth } from '../../components/Guard';

function DoctorDetail(){
  const router = useRouter();
  const { id } = router.query;
  const [list,setList] = useState([]);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState('');
  const [form,setForm] = useState({ date:'', time:'', notes:'' });
  const [saving,setSaving] = useState(false);
  const [msg,setMsg] = useState('');

  const doc = useMemo(()=> list.find(x => String(x.id) === String(id)), [list,id]);

  useEffect(()=>{
    if(!id) return;
    (async()=>{
      try{ setLoading(true); setError(''); const data = await api('/api/doctors'); setList(data); }
      catch(err){ setError(err.message); }
      finally{ setLoading(false); }
    })();
  },[id]);

  const book = async (e)=>{
    e.preventDefault();
    setMsg(''); setError(''); setSaving(true);
    try{
      await api('/api/appointments', { method:'POST', body:{
        doctor_id: Number(id), date: form.date, time: form.time, notes: form.notes
      }});
      setMsg('Appointment booked! Check your appointments page.');
      setForm({ date:'', time:'', notes:'' });
    }catch(err){ setError(err.message); }
    finally{ setSaving(false); }
  };

  if(loading) return <Layout title="Doctor"><p>Loading…</p></Layout>;
  if(error) return <Layout title="Doctor"><p style={{color:'red'}}>{error}</p></Layout>;
  if(!doc) return <Layout title="Doctor"><p>Doctor not found.</p></Layout>;

  return (
    <Layout title="Doctor Profile">
      <div className="card" style={{marginBottom:16}}>
        <h3 style={{marginTop:0}}>{doc.name}</h3>
        <div style={{color:'var(--muted)'}}>{doc.specialty} · {doc.location}</div>
        {doc.bio && <p style={{marginTop:10}}>{doc.bio}</p>}
      </div>

      <div className="card">
        <h4 style={{marginTop:0}}>Book an appointment</h4>
        {msg && <p style={{color:'green'}}>{msg}</p>}
        {error && <p style={{color:'red'}}>{error}</p>}

        <form onSubmit={book}>
          <label className="label">Date</label>
          <input className="input" type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} required />

          <label className="label">Time</label>
          <input className="input" type="time" value={form.time} onChange={e=>setForm({...form, time:e.target.value})} required />

          <label className="label">Notes (optional)</label>
          <textarea className="input" rows={3} value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} />

          <button className="btn" type="submit" disabled={saving} style={{marginTop:12}}>
            {saving ? 'Booking…' : 'Book Appointment'}
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default withAuth(['PATIENT','ADMIN'])(DoctorDetail);
