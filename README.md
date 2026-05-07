# 📊 CRM Lead Management System

[Insert Demo Video Link Here]

A world-class, full-stack Customer Relationship Management (CRM) application built for modern sales teams. This platform empowers businesses to track leads, manage pipeline progress, log interactions, and visualize performance metrics through a premium, highly optimized interface.

## 🛠 Tech Stack

- **Frontend:** React 18 (Vite), React-Bootstrap, Framer-motion (for micro-animations), Recharts (for data visualization).
- **Backend:** Node.js, Express.
- **Database:** MySQL.

## ✨ Core Features Implemented

- **Authentication (JWT):** Secure, stateless login system utilizing bcrypt for password hashing and HTTP headers for token transport.
- **Lead Management (CRUD):** Complete lifecycle control—create, read, update, and delete sales leads.
- **Notes:** Add timestamped notes to individual leads to track interactions and history.
- **Dashboard Stats:** Real-time metrics overview including total leads, pipeline stages, and estimated deal values.
- **Search & Filtering:** Robust filtering by status, lead source, assigned salesperson, and keyword search across lead names and emails.

## 🚀 Bonus / Advanced Features

- **Premium SaaS UI Architecture:** Features a persistent, collapsible sidebar and a modern glassmorphism navbar for a top-tier user experience.
- **Global Dark/Light Mode Toggle:** Implemented via a React Context API for instant, seamless theme switching across the entire application.
- **Settings Page UI:** Beautifully designed mock integrations panel demonstrating advanced frontend UI/UX skills.
- **Single-Query Optimized Dashboard:** The backend aggregates 7 different complex metrics in a single database round-trip utilizing advanced SQL `SUM(CASE WHEN...)` logic, drastically reducing latency.
- **Partial Updates for Lead Status:** Implemented dynamic query building to support `PATCH`-style partial updates via `PUT`, preventing unnecessary data overwrites.

## 📋 Prerequisites

Ensure you have the following installed before proceeding:
- Node.js (v16 or higher)
- MySQL (v8 or higher)

## 🏁 Getting Started / Local Setup

Follow these steps to run the project locally. You will need two terminal windows to run both the backend and frontend concurrently.

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd crm-assessment
```

### 2. Backend Setup
Open your first terminal window:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory (see Environment Variables below).

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a second terminal window:
```bash
cd frontend
npm install
```

Start the frontend Vite server:
```bash
npm run dev
```

The application should now be running at `http://localhost:5173`.

## 🔐 Environment Variables

Create a `.env` file in the `backend` directory with the following structure:

```env
# .env.example
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=crm_db
JWT_SECRET=super_secret_jwt_key_123
```

## 🗄 Database Setup Instructions

Run the following raw SQL script in your MySQL client (e.g., MySQL Workbench, phpMyAdmin, or CLI) to set up the database, create the necessary tables, and insert the default admin user.

```sql
-- Create and use the database
CREATE DATABASE IF NOT EXISTS crm_db;
USE crm_db;

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Leads Table
CREATE TABLE IF NOT EXISTS leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lead_name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  email VARCHAR(255),
  phone_number VARCHAR(50),
  lead_source VARCHAR(100),
  assigned_salesperson VARCHAR(255),
  status ENUM('New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost') NOT NULL DEFAULT 'New',
  estimated_deal_value DECIMAL(15, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Create Notes Table
CREATE TABLE IF NOT EXISTS notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lead_id INT NOT NULL,
  content TEXT NOT NULL,
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notes_lead FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);

-- 4. Insert Default Admin User
-- Password is 'password123'
INSERT INTO users (email, password) VALUES 
('admin@example.com', '$2b$10$k3vWWP4fSXIhTJtFMS10ru4W3zDaXbq6rb4H2M3OpxmetLt/GelNu');
```

## 🔑 Test Login Credentials

Once the database is set up and the servers are running, you can log in using:
- **Email:** `admin@example.com`
- **Password:** `password123`

## ⚠️ Known Limitations

- **UI-Only Settings:** The Settings page and mock integrations are UI demonstrations only to showcase frontend layout and styling skills; they do not currently connect to external APIs.
- **File Uploads:** Image/Avatar uploads are not yet supported in this version.
- **Single User Role:** The application currently operates on a single role system without distinct Admin vs. Salesperson access controls.

## 💭 Reflection

Building this CRM was a deeply rewarding exercise that bridged the gap between complex data architecture and premium user experience. When designing the database, I intentionally chose MySQL over MongoDB. A CRM is fundamentally built on highly structured, relational data—leads belong to salespeople, notes belong to leads, and financial metrics require strict aggregation. MySQL’s robust schema enforcement, `ENUM` constraints, and relational capabilities provided the rock-solid data integrity that a financial or sales application demands.

Beyond the backend, my goal was to elevate the project from a standard technical assessment to a production-ready SaaS product. I focused heavily on writing clean, modular code, separating controllers from routes, and implementing reusable React components. On the frontend, I invested significant time into the UI architecture—incorporating glassmorphism, fluid Framer-Motion animations, and a seamless dark mode toggle. I believe that an application’s underlying logic is only as good as the interface that exposes it.

Through this assessment, I solidified my understanding of RESTful API design, JWT stateless authentication, and advanced SQL querying (specifically conditional aggregation for the dashboard). It reinforced the importance of building robust systems that don't just work under the hood, but also feel incredibly fast, intuitive, and professional to the end user.
