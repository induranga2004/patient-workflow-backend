//pool
const pool = require("../db/pool");


//create Appointment
async function createAppointment(req, res) {
  try {
    const userId = req.user.id;
    const { doctor_id, date, time, notes } = req.body;

    //check doctor exists

    const doc = await pool.query(`SELECT id FROM doctors WHERE id=$1`, [
      doctor_id,
    ]);

    if (!doc.rowCount) {
      return res.status(400).json({ message: "invailed doctor id" });
    }

    const r = await pool.query(
      `
            INSERT INTO appointments (patient_id, doctor_id, date, time, notes)
            VALUES ($1,$2,$3,$4,$5)
            RETURNING id, patient_id, doctor_id, date, time, status, notes
            `,
      [userId, doctor_id, date, time, notes]
    );

    return res.status(201).json(r.rows[0]);
  } catch (err) {
    console.error("Error In Appoinment creation", err.message);
    return res.status(500).json({ message: "Appointment creation failed" });
  }
}

//list my appointments

async function listMyAppointments(req,res) {

    try{

        const userId = req.user.id

        const r = await pool.query(

            `
            SELECT 	        a.id,
                            a.date,
                            a.time,
                            a.status,
                            a.notes,
                            a.doctor_id,
                            d.name   AS doctor_name,
                            d.specialty,
                            d.location
            FROM appointments a
            JOIN doctors d ON d.id = a.doctor_id
            WHERE a.patient_id = $1
            ORDER BY a.date DESC, a.time DESC
            `
            ,[userId]


        )

        return res.json(r.rows)

    } catch (err) {
    console.error("Error In Appoinment listing", err.message);
    return res.status(500).json({ message: "Appointment listing failed" });
  }
    
}

//ADMIN- list all appointments

async function listAllAppointments(req, res) {
  try {
    const r = await pool.query(
      `
      SELECT a.id,
             a.patient_id,
             u.name   AS patient_name,
             a.doctor_id,
             d.name   AS doctor_name,
             d.specialty,
             d.location,
             a.date,
             a.time,
             a.status,
             a.notes
      FROM appointments a
      JOIN users u    ON u.id = a.patient_id
      JOIN doctors d  ON d.id = a.doctor_id
      ORDER BY a.date DESC, a.time DESC
      `
    );
    return res.json(r.rows);
  } catch (err) {
    console.error("Error In Admin List All Appointments", err.message);
    return res.status(500).json({ message: "Failed to list all appointments" });
  }
}



//Admin - update appointment status


async function updateAppointmentStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['PENDING','APPROVED','CANCELLED','COMPLETED'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const r = await pool.query(
      `
      UPDATE appointments
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, patient_id, doctor_id, date, time, status, notes
      `,
      [status, id]
    );

    if (!r.rowCount) return res.status(404).json({ message: "Appointment not found" });

    return res.json(r.rows[0]);
  } catch (err) {
    console.error("Error In Update Appointment Status", err.message);
    return res.status(500).json({ message: "Failed to update status" });
  }
}



module.exports = {createAppointment,listMyAppointments,listAllAppointments,updateAppointmentStatus}




