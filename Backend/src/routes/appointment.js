const express = require('express')
const router = express.Router()

const {createAppointment,listMyAppointments}= require('../controllers/appointmentsController')

const {authRequired}= require('../middleware/auth')


// create appointment

router.post("/",authRequired(["PATIENT","ADMIN"]),createAppointment)

//read each appointment list

router.get("/me",authRequired(["PATIENT"]),listMyAppointments)

module.exports = router

