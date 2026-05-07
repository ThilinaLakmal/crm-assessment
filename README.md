# 📊 CRM Lead Management System

A premium, full-stack Customer Relationship Management (CRM) application designed for modern sales teams. This platform empowers businesses to track leads, manage pipeline progress, log interactions, and visualize performance metrics through a highly optimized, glassmorphic interface.

---

## 🛠 Tech Stack

### Frontend
- **React 18 (Vite)**: For a lightning-fast development experience and optimized builds.
- **React-Bootstrap**: For a responsive and reliable component foundation.
- **Framer Motion**: Powering smooth micro-animations and page transitions.
- **React Icons (Heroicons)**: For a clean, consistent icon set.
- **React-Hot-Toast**: For elegant, non-intrusive notifications.

### Backend
- **Node.js & Express**: A robust and scalable runtime for the RESTful API.
- **MySQL**: Relational database choice for maximum data integrity and complex querying.
- **JWT & Bcrypt**: Secure stateless authentication and industry-standard password hashing.

---

## ✨ Features Implemented

- **Modern Glassmorphic UI**: A stunning, state-of-the-art interface with dark mode support and responsive design.
- **Lead Management (CRUD)**: Complete lifecycle control—create, view, edit, and delete sales leads.
- **Interactive Dashboard**: Real-time visualization of key metrics (Total Leads, Revenue, Pipeline Stages) powered by optimized SQL aggregation.
- **Notes & Activity History**: Add and manage timestamped notes for individual leads to track every interaction.
- **Advanced Filtering & Search**: Robust system to filter leads by status, source, or salesperson, with integrated keyword search.
- **Smart Navigation**: A persistent, collapsible sidebar and an intelligent navbar with deep-linking to user settings.
- **Secure Authentication**: JWT-based login system with protected routes to ensure data privacy.

---

## 🚀 How to Run Locally

To get the project running on your local machine, follow these steps:

### 1. Prerequisites
- **Node.js** (v16+)
- **MySQL** (v8+)

### 2. Database Setup
1. Open your MySQL client and run the script found in `backend/config/schema.sql`.
2. This will create the database `crm_lead_management`, set up all tables, and insert sample data including the admin user.

### 3. Backend Installation
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder (see Environment Variables below).
```bash
npm run dev
```

### 4. Frontend Installation
```bash
cd frontend
npm install
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=crm_lead_management
JWT_SECRET=your_super_secret_key_123
```

---

## 🔑 Test Login Credentials

Use the following credentials to access the administrative dashboard:
- **Email:** `admin@example.com`
- **Password:** `password123`

---

## 🗄 Database Setup

The database uses a relational schema designed for high performance:
- **`users`**: Stores authentication data.
- **`leads`**: Stores comprehensive lead data including status and deal value.
- **`notes`**: Linked to leads via a foreign key with `ON DELETE CASCADE` to maintain data integrity.

Full schema definition is available in [schema.sql](file:///c:/Users/User/Desktop/crm-assessment/backend/config/schema.sql).

---

## ⚠️ Known Limitations

- **Search Precision**: Current search implementation uses basic SQL `LIKE` matching; full-text search indexing is not yet implemented for massive datasets.
- **Mock Integrations**: The "Integrations" section in Settings is a UI demonstration; actual third-party API connections (Gmail/Slack) are not active.
- **File Uploads**: The user profile currently uses initials; image upload functionality is planned for a future update.

---

## 💭 Reflection

Building this CRM was a deep dive into balancing data complexity with user experience. One of the most significant architectural decisions was choosing **MySQL** over a NoSQL alternative. In a CRM environment, data is inherently relational—notes belong to leads, and leads belong to users. The strict schema and relational constraints of MySQL ensure that no lead is left "orphaned" and that financial metrics (like total deal value) are always accurate and consistent.

On the frontend, I focused on creating an interface that feels **alive**. By utilizing **Framer Motion** for subtle micro-interactions and **Context API** for global theme management, the application feels more like a high-end SaaS product than a standard utility. The most rewarding challenge was optimizing the Dashboard; instead of making multiple API calls, I wrote a single, high-performance SQL query using conditional aggregation to retrieve all metrics in one trip to the database. This project reinforced my belief that great software is the intersection of robust engineering and thoughtful design.
