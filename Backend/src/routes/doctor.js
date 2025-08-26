const express = require("express");
const { listDoctors, createDoctor } = require("../controllers/doctorsController");
const { authRequired } = require("../middleware/auth");

const router = express.Router();

router.get("/", listDoctors); // public browse
router.post("/", authRequired(["ADMIN"]), createDoctor); // admin create

module.exports = router;
