import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { api } from "../../lib/api";
import { withAuth } from "../../components/Guard";

function MyAppointments() {
  const [rows, setRows] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await api("/api/appointments/me");
        setRows(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Layout title="My Appointments">
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading…</p>}

      {!loading && !rows.length && <p>No appointments yet.</p>}

      <div className="grid">
        {rows.map((a) => (
          <div key={a.id} className="card">
            <div style={{ fontWeight: 600 }}>{a.doctor_name}</div>
            <div style={{ color: "var(--muted)" }}>
              {a.specialty} · {a.location}
            </div>
            <div style={{ marginTop: 8 }}>
              <b>{a.date}</b> at <b>{a.time}</b>
            </div>
            <div style={{ marginTop: 8 }}>
              Status: <b>{a.status}</b>
            </div>
            {a.notes && <div style={{ marginTop: 8 }}>Notes: {a.notes}</div>}
          </div>
        ))}
      </div>
    </Layout>
  );
}

export default withAuth(['PATIENT'])(MyAppointments);
