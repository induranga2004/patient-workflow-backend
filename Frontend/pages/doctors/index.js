// pages/doctors/index.js
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { api } from '../../lib/api';
import Link from 'next/link';
import { withAuth } from '../../components/Guard';

function DoctorsPage(){
  const [q,setQ] = useState({ specialty:'', location:'' });
  const [list,setList] = useState([]);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState('');

  const fetchDocs = async () => {
    try{
      setLoading(true); setError('');
      const params = new URLSearchParams();
      if(q.specialty) params.set('specialty', q.specialty);
      if(q.location) params.set('location', q.location);
      const data = await api(`/api/doctors${params.toString() ? `?${params}`:''}`);
      setList(data);
    }catch(err){ setError(err.message); }
    finally{ setLoading(false); }
  };

  useEffect(()=>{ fetchDocs(); },[]);

  const onSearch = (e)=>{
    e.preventDefault();
    fetchDocs();
  };

  return (
    <Layout title="Find a Doctor">
      <form onSubmit={onSearch} className="card" style={{marginBottom:16}}>
        <div className="row">
          <div className="col-4">
            <label className="label">Specialty</label>
            <input className="input" value={q.specialty} onChange={e=>setQ({...q, specialty:e.target.value})} placeholder="Cardiology, Dermatology..." />
          </div>
          <div className="col-4">
            <label className="label">Location</label>
            <input className="input" value={q.location} onChange={e=>setQ({...q, location:e.target.value})} placeholder="Colombo, Kandy..." />
          </div>
          <div className="col-4" style={{display:'flex',alignItems:'flex-end'}}>
            <button className="btn" type="submit" style={{width:'100%'}}>Search</button>
          </div>
        </div>
      </form>

      {error && <p style={{color:'red'}}>{error}</p>}
      {loading && <p>Loading…</p>}

      <div className="grid">
        {list.map(d=>(
          <div key={d.id} className="card">
            <div style={{fontWeight:600}}>{d.name}</div>
            <div style={{color:'var(--muted)'}}>{d.specialty} · {d.location}</div>
            {d.bio && <p style={{marginTop:8}}>{d.bio}</p>}
            <Link href={`/doctors/${d.id}`} className="btn" style={{marginTop:10, display:'inline-block'}}>View Profile</Link>
          </div>
        ))}
        {!loading && !list.length && <p>No doctors found.</p>}
      </div>
    </Layout>
  );
}

export default withAuth(['PATIENT','ADMIN'])(DoctorsPage); // allow patient (and admin for checking)
