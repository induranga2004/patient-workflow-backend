import Layout from "@/components/Layout";
import {api} from '../../lib/api'
import { withAuth } from "@/components/Guard";
import { useEffect,useState } from "react";
import { BarChart,Bar,XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

function Dashboard(){
  const [data,setData] = useState([]);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    (async()=>{
      try{
        const appts = await api('/api/appointments'); // ADMIN all
        const counts = {};
        appts.forEach(a => { counts[a.status] = (counts[a.status]||0)+1; });
        setData(Object.entries(counts).map(([status,count])=>({ status, count })));
      }catch(err){ console.error(err); }
      finally{ setLoading(false); }
    })();
  },[]);

  const COLORS = ['#0f2a6b','#163d8a','#2563eb','#60a5fa'];

  return (
    <Layout title="Admin Dashboard">
      {loading && <p>Loading…</p>}
      {!loading && (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
          <div className="card">
            <h3>Appointments by Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <XAxis dataKey="status"/>
                <YAxis allowDecimals={false}/>
                <Tooltip />
                <Bar dataKey="count" fill="#0f2a6b"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h3>Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={data} dataKey="count" nameKey="status" label>
                  {data.map((_, idx)=>(<Cell key={idx} fill={COLORS[idx % COLORS.length]} />))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </Layout>
  );
}


export default withAuth(['ADMIN'])(Dashboard)