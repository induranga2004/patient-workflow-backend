const pool = require("../db/pool");

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

module.exports = { listDoctors, createDoctor };
