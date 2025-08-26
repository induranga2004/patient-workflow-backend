const express = require("express");

const {
  listDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctorsController");

const { authRequired } = require("../middleware/auth");

const router = express.Router();

router.get("/", listDoctors); // public browse
router.post("/", authRequired(["ADMIN"]), createDoctor); // admin create
router.patch("/:id", authRequired(["ADMIN"]), updateDoctor); // update by admin 
router.delete("/:id", authRequired(["ADMIN"]), deleteDoctor); // delete by admin 



module.exports = router;
