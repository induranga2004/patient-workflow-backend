const express = require("express");
const router = express.Router();

const {
  createAppointment,
  listMyAppointments,
  listAllAppointments,
  updateAppointmentStatus,
} = require("../controllers/appointmentsController");

const { authRequired } = require("../middleware/auth");

// create appointment

router.post("/", authRequired(["PATIENT", "ADMIN"]), createAppointment);

//read each appointment list

router.get("/me", authRequired(["PATIENT"]), listMyAppointments);


// Admin list all

router.get("/", authRequired(["ADMIN"]), listAllAppointments);


// Admin - update status

router.patch("/:id/status", authRequired(["ADMIN"]), updateAppointmentStatus);


module.exports = router;
