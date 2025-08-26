

# 🏥 Patient Workflow Management System

A simple MERN/Next.js + PostgreSQL project for managing doctors, patients, and appointments.  
Includes **JWT authentication**, **role-based access** (Patient/Admin), and a basic **Next.js frontend** with a clean **white + dark-blue theme**.

---

## ✨ Features

### Authentication
- Register & Login with **JWT**
- Role-based access control (Patient / Admin)

### Patient Side
- Browse doctors by **specialty** and **location**
- View doctor profiles and **book appointments**
- View personal **appointment history**

### Admin Side
- Manage doctors (Add / Edit / Delete)
- Manage appointments (Approve / Cancel / Complete)
- Dashboard with analytics (charts using **Recharts**)

### Database Models
- **User**: `id, name, email, password_hash, role`
- **Doctor**: `id, name, specialty, location, bio, profile_picture`
- **Appointment**: `id, patient_id, doctor_id, date, time, status, notes`
- (Optional) **MedicalRecord** planned but not implemented in frontend

---

## 🛠 Tech Stack

- **Backend**: Node.js, Express, PostgreSQL (`pg`), bcryptjs, jsonwebtoken
- **Frontend**: Next.js (Pages Router), React, Recharts (charts)
- **Styling**: Custom CSS (white + dark-blue theme)
- **Auth**: JWT stored in `localStorage`
- **Testing**: Postman collection

---

## ⚙️ Setup Instructions

### Backend
1. Clone the repo:
   ```bash
   git clone https://github.com/<your-username>/patient-workflow-management-system.git
   cd patient-workflow-management-system/Backend


2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` file:

   ```
   PORT=3000
   DATABASE_URL=postgresql://postgres:YOURPASSWORD@localhost:5432/hospitaldb
   JWT_SECRET=your_secret_here
   ```

4. Create the database:

   ```sql
   CREATE DATABASE hospitaldb;
   ```

5. Run schema (in pgAdmin / psql):

   * Users table
   * Doctors table
   * Appointments table
     *(SQL already included in `sql/db.sql`)*

6. Start server:

   ```bash
   npm run devStart
   ```

   Runs at: **[http://localhost:3000](http://localhost:3000)**

---

### Frontend

1. Open frontend folder:

   ```bash
   cd ../frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   npm i recharts
   ```

3. Create `.env.local`:

   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
   ```

4. Run frontend (port 3001 to avoid clash with backend):

   ```bash
   npm run dev
   ```

   Open: **[http://localhost:3001](http://localhost:3001)**

---

## 🔑 Authentication

* Register: `POST /api/auth/register`
* Login: `POST /api/auth/login`
* JWT returned; send it in headers:

  ```
  Authorization: Bearer <token>
  ```

---

## 📚 API Endpoints

### Auth

* `POST /api/auth/register` → create new user (default `PATIENT`)
* `POST /api/auth/login` → login, returns `{ token, user }`

### Doctors

* `GET /api/doctors?specialty=&location=` → public list/filter
* `POST /api/doctors` (Admin only)
* `PATCH /api/doctors/:id` (Admin only)
* `DELETE /api/doctors/:id` (Admin only)

### Appointments

* `POST /api/appointments` (Patient/Admin → create)
* `GET /api/appointments/me` (Patient only → own appointments)
* `GET /api/appointments` (Admin only → all appointments)
* `PATCH /api/appointments/:id/status` (Admin only → update status)

---

## 🖥️ Frontend Pages

### Patient

* `/login` → login form
* `/register` → register new user
* `/doctors` → browse/filter doctors
* `/doctors/[id]` → view profile + book appointment
* `/appointments` → view personal appointments

### Admin

* `/admin/dashboard` → analytics (charts with Recharts)
* `/admin/doctors` → manage doctor profiles
* `/admin/appointments` → manage appointments

---

## 📊 Admin Dashboard (Recharts)

* **Bar Chart** → appointments by status (Pending/Approved/Cancelled/Completed)
* **Pie Chart** → distribution of statuses

---

## 🧪 Postman Testing Checklist

### Auth

* Register Patient → `POST /api/auth/register`
* Login Patient → save `patient_token`
* Login Admin → save `admin_token`

### Doctors

* List Doctors (public)
* Create Doctor (Admin, use `admin_token`)
* Edit Doctor (PATCH)
* Delete Doctor (DELETE)

### Appointments

* Create Appointment (Patient, use `patient_token`)
* View My Appointments (`/me`)
* List All Appointments (Admin)
* Update Appointment Status (Admin → PATCH status)

### Negative Tests

* Create doctor without token → 401
* Create doctor with patient token → 403
* List all appointments with patient token → 403
* Create appointment without token → 401

---

## 📦 Project Structure

```
Backend/
  server.js
  src/
    db/pool.js
    middleware/auth.js
    controllers/
      auth.controller.js
      doctorsController.js
      appointmentsController.js
    routes/
      doctor.js
      appointment.js
  sql/db.sql

Frontend/
  pages/
    login.js
    register.js
    doctors/
      index.js
      [id].js
    appointments/index.js
    admin/
      dashboard.js
      doctors.js
      appointments.js
  components/
    Navbar.js
    Layout.js
    Guard.js
  lib/
    api.js
    auth.js
  styles/globals.css
```

---

## 🚀 Quick Demo Flow

1. **Admin** login → get `admin_token`
2. Create a doctor
3. **Patient** register/login → get `patient_token`
4. Browse doctors → book appointment
5. Patient → see appointment in `/appointments`
6. Admin → see appointment in `/admin/appointments`, update status
7. Admin → view `/admin/dashboard` charts update

---

## 👨‍💻 Author

Developed as an interview test project with **Node.js, PostgreSQL, and Next.js**.


