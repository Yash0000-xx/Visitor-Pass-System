## 📡 API Documentation

### Authentication & Security
* **Middleware (`/middleware/auth.js`):** Routes marked with 🔒 require a valid JWT Bearer token in the `Authorization` header.

### 1. Visitor Routes (`/api/visitors`)
* **`POST /register`** * **Description:** Registers a new visitor. Includes backend input validation (Regex for email, length check for phone).
  * **Body:** `{ name, email, phone, photoUrl, purposeOfVisit, hostId }`
* **`GET /`** 🔒
  * **Description:** Fetches all registered visitors. Restricted to logged-in Admins/Security.

### 2. Appointment Routes (`/api/appointments`)
* **`POST /request`**
  * **Description:** Creates a new appointment request for a visitor.
  * **Body:** `{ visitorId, hostId, date, time }`
* **`PUT /status/:id`**
  * **Description:** Updates the status (Approved/Rejected) of an appointment. Automatically triggers a Nodemailer email notification upon approval.
  * **Body:** `{ status }`

### 3. Pass Generation (`/api/passes`)
* **`POST /generate/:id`**
  * **Description:** Generates a secure QR Code pass for an approved appointment.
  * **Returns:** Base64 QR Code string.

### 4. Security & CheckLog Routes (`/api/checklog`)
* **`POST /scan`** 🔒
  * **Description:** Used by security guards to scan a pass and log entry/exit times. Verifies pass validity and logs the exact timestamp.
  * **Body:** `{ passId, action: "Check-In" | "Check-Out" }`
  "Notification System" explaining: "This project uses Nodemailer with Gmail SMTP for real-time notifications and OTP verification. This approach was chosen to provide a functional, zero-cost alternative to paid SMS gateway APIs for student deployment."


  Backend - https://visitor-pass-backend-qhoo.onrender.com
  Frontend/Main= https://visitor-pass-frontend-eight.vercel.app/