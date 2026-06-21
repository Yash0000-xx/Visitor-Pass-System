# Visitor Pass Management System

A full-stack MERN application to digitize the visitor management process with role-based authentication, pre-registration, and QR-code pass issuance.

## 🚀 Features
* **Role-Based Login:** Admin, Security, Employee, and Visitor access.
* **Visitor Registration:** Capture details and purpose of visit.
* **Smart Dashboard:** View all registered visitors and pending approvals.
* **Digital Pass Issuance:** 1-click QR code generation for approved visitors.

## 🛠️ Tech Stack
* **Frontend:** React.js, Vite, React Router DOM, Axios
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Local/Atlas)
* **Tools:** JWT for Authentication, bcryptjs for password hashing, qrcode for pass generation.

## ⚙️ Local Setup Guide

### 1. Backend Setup
1. Open a terminal and navigate to the backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file in the backend directory and add your MongoDB connection string and JWT Secret:
   \`\`\`env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/visitor-pass
   JWT_SECRET=supersecretkey123
   \`\`\`
4. Run the seed script to load demo data: `node seed.js`
   *(This creates an admin account: admin@office.com / password123)*
5. Start the backend server: `node server.js`

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open the provided localhost link (usually http://localhost:5173) in your browser.