const pool = require("../db/pool");

//read doctor
async function listDoctors(req, res) {
  try {
    const { specialty, location } = req.query;

    let sql = `
      SELECT id,name,specialty,location,bio,profile_picture 
      FROM doctors 
      WHERE 1=1
    `;
    const params = [];

    if (specialty) {
      params.push(`%${specialty}%`);
      sql += ` AND specialty ILIKE $${params.length}`;
    }
    if (location) {
      params.push(`%${location}%`);
      sql += ` AND location ILIKE $${params.length}`;
    }

    sql += ` ORDER BY name ASC`;

    const r = await pool.query(sql, params);
    return res.json(r.rows);
  } catch (err) {
    console.error("Error In List Docs", err.message);
    return res.status(500).json({ message: "Doctor listing failed" });
  }
}

// create doctor

async function createDoctor(req, res) {
  try {
    const { name, specialty, location, bio, profile_picture } = req.body;

    if (!name || !specialty || !location) {
      return res
        .status(400)
        .json({ message: "name, specialty, and location are required" });
    }

    const r = await pool.query(
      `INSERT INTO doctors (name,specialty,location,bio,profile_picture)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id,name,specialty,location,bio,profile_picture`,
      [name, specialty, location, bio || null, profile_picture || null]
    );

    return res.status(201).json(r.rows[0]);
  } catch (err) {
    console.error("Error In Create Doc", err.message);
    return res.status(500).json({ message: "Doctor creation failed" });
  }
}

//Admin - edit doctor

async function updateDoctor(req, res) {
  try {
    const { id } = req.params;
    const { name, specialty, location, bio, profile_picture } = req.body;

    // fetch current row
    const cur = await pool.query("SELECT * FROM doctors WHERE id=$1", [id]);
    if (!cur.rowCount)
      return res.status(404).json({ message: "Doctor not found" });

    const d = cur.rows[0];
    const r = await pool.query(
      `
      UPDATE doctors
      SET name = $1,
          specialty = $2,
          location = $3,
          bio = $4,
          profile_picture = $5,
          updated_at = NOW()
      WHERE id = $6
      RETURNING id, name, specialty, location, bio, profile_picture
      `,
      [
        name ?? d.name,
        specialty ?? d.specialty,
        location ?? d.location,
        bio ?? d.bio,
        profile_picture ?? d.profile_picture,
        id,
      ]
    );

    return res.json(r.rows[0]);
  } catch (err) {
    console.error("Error In Update Doctor", err.message);
    return res.status(500).json({ message: "Failed to update doctor" });
  }
}

// Admin delete doc

async function deleteDoctor(req, res) {
  try {
    const { id } = req.params;
    const r = await pool.query("DELETE FROM doctors WHERE id = $1", [id]);
    if (!r.rowCount)
      return res.status(404).json({ message: "Doctor not found" });
    return res.json({ ok: true });
  } catch (err) {
    console.error("Error In Delete Doctor", err.message);
    return res.status(500).json({ message: "Failed to delete doctor" });
  }
}

module.exports = { listDoctors, createDoctor, updateDoctor, deleteDoctor };
