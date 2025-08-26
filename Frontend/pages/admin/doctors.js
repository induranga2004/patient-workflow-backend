import Layout from "@/components/Layout";
import {api} from '../../lib/api'
import { withAuth } from "@/components/Guard";
import { useEffect,useState } from "react";


function AdminDoctors(){
  const [list,setList] = useState([]);
  const [form,setForm] = useState({ name:'', specialty:'', location:'', bio:'', profile_picture:'' });
  const [editingId,setEditingId] = useState(null);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState('');

  const load = async ()=>{
    try{ setLoading(true); setError(''); setList(await api('/api/doctors')); }
    catch(err){ setError(err.message); }
    finally{ setLoading(false); }
  };

  useEffect(()=>{ load(); },[]);

  const submit = async (e)=>{
    e.preventDefault();
    try{
      setError('');
      if(editingId){
        await api(`/api/doctors/${editingId}`, { method:'PATCH', body: form });
      }else{
        await api('/api/doctors', { method:'POST', body: form });
      }
      setForm({ name:'', specialty:'', location:'', bio:'', profile_picture:'' });
      setEditingId(null);
      await load();
    }catch(err){ setError(err.message); }
  };

  const onEdit = (d)=>{
    setEditingId(d.id);
    setForm({
      name: d.name || '',
      specialty: d.specialty || '',
      location: d.location || '',
      bio: d.bio || '',
      profile_picture: d.profile_picture || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onDelete = async (id)=>{
    if(!confirm('Delete this doctor?')) return;
    try{ await api(`/api/doctors/${id}`, { method:'DELETE' }); await load(); }
    catch(err){ alert(err.message); }
  };

  return (
    <Layout title="Manage Doctors">
      {error && <p style={{color:'red'}}>{error}</p>}

      <div className="card" style={{marginBottom:16}}>
        <h3 style={{marginTop:0}}>{editingId ? 'Edit Doctor' : 'Add Doctor'}</h3>
        <form onSubmit={submit}>
          <label className="label">Name</label>
          <input className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
          <label className="label">Specialty</label>
          <input className="input" value={form.specialty} onChange={e=>setForm({...form,specialty:e.target.value})} required />
          <label className="label">Location</label>
          <input className="input" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} required />
          <label className="label">Bio</label>
          <textarea className="input" rows={3} value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} />
          <label className="label">Profile Picture (URL)</label>
          <input className="input" value={form.profile_picture} onChange={e=>setForm({...form,profile_picture:e.target.value})} />
          <button className="btn" type="submit" style={{marginTop:12}}>{editingId ? 'Save Changes' : 'Create Doctor'}</button>
          {editingId && <button type="button" className="btn" onClick={()=>{ setEditingId(null); setForm({ name:'', specialty:'', location:'', bio:'', profile_picture:'' }); }} style={{marginLeft:8, background:'#163d8a'}}>Cancel</button>}
        </form>
      </div>

      {loading && <p>Loading…</p>}
      <div className="grid">
        {list.map(d=>(
          <div key={d.id} className="card">
            <div style={{fontWeight:600}}>{d.name}</div>
            <div style={{color:'var(--muted)'}}>{d.specialty} · {d.location}</div>
            {d.bio && <p style={{marginTop:8}}>{d.bio}</p>}
            <div style={{display:'flex', gap:8}}>
              <button className="btn" onClick={()=>onEdit(d)}>Edit</button>
              <button className="btn" onClick={()=>onDelete(d.id)} style={{background:'#8b0000'}}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}


export default withAuth(['ADMIN'])(AdminDoctors)
