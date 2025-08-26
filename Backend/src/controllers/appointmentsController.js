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



module.exports = {createAppointment,listMyAppointments}


