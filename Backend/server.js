require("dotenv").config();

const express = require("express");
const app = express();
const cors= require('cors')


const pool = require("./src/db/pool");

// bcrypt + jwt
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const doctorsRoutes = require("./src/routes/doctor");
const appointmentRoutes = require("./src/routes/appointment");


app.use(express.json());
app.use(cors({origin:'http://localhost:3001'}))

app.use("/api/doctors", doctorsRoutes);
app.use("/api/appointments",appointmentRoutes);


// health
app.get("/", (req, res) => {
  res.send("running fine");
});

const PORT = process.env.PORT || 3000;

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    // fields
    const { name, email, password, role } = req.body;

    // basic required checks
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "name, email, and password are required" });
    }

    // hash
    const hash = await bcrypt.hash(password, 10);

    // insert user
    const insert = await pool.query(
      `INSERT INTO users (name,email,password_hash,role)
       VALUES ($1,$2,$3,COALESCE($4,'PATIENT'))
       RETURNING id,name,email,role`,
      [name, email, hash, role]
    );

    return res.status(201).json(insert.rows[0]);
  } catch (err) {
    console.error("Error In Register", err.message);
    return res.status(500).json({ message: "registration failed" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // required checks
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    // fetching user
    const result = await pool.query(
      `SELECT id,name,email,role,password_hash FROM users WHERE email = $1`,
      [email]
    );

    if (!result.rowCount) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    // compare password
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // sign jwt
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "dev_secret_change_me",
      { expiresIn: "7d" }
    );

    // return
    return res.json({
      token,
      user: { id: user.id, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error("Error In Login", err.message);
    return res.status(500).json({ message: "login failed" });
  }
});

// start
app.listen(PORT, () => console.log(`API running on ${PORT}`));
