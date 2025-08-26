import Layout from "@/components/Layout";
import { api } from "../../lib/api";
import { withAuth } from "@/components/Guard";
import { useEffect, useState } from "react";

const STATUSES = ["PENDING", "APPROVED", "CANCELLED", "COMPLETED"];

function AdminAppointments() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      setRows(await api("/api/appointments"));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api(`/api/appointments/${id}/status`, {
        method: "PATCH",
        body: { status },
      });
      await load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Layout title="Manage Appointments">
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading…</p>}

      <div className="grid">
        {rows.map((a) => (
          <div key={a.id} className="card">
            <div>
              <b>{a.doctor_name}</b> · {a.specialty} · {a.location}
            </div>
            <div>
              Patient: <b>{a.patient_name}</b>
            </div>
            <div style={{ marginTop: 8 }}>
              <b>{a.date}</b> at <b>{a.time}</b>
            </div>
            <div style={{ marginTop: 8 }}>
              Status: <b>{a.status}</b>
            </div>
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <select
                className="select"
                defaultValue={a.status}
                onChange={(e) => updateStatus(a.id, e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            {a.notes && <div style={{ marginTop: 8 }}>Notes: {a.notes}</div>}
          </div>
        ))}
      </div>
    </Layout>
  );
}


export default withAuth(['ADMIN'])(AdminAppointments)
