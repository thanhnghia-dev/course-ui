# 📚 Course Management Web App (ReactJS)

## 🌟 Overview
**Course Management Web App** is a responsive web application built with **ReactJS**, designed exclusively for **teachers and administrators** at IT training centers.  
It provides a simple and efficient interface to manage **students, courses, and enrollments**, supporting the staff in handling daily academic operations with ease.

---

## 🖥️ Features

### 👨‍🏫 Teacher
- 🔐 **Authentication** using authorized teacher account (JWT-based)
- 🎓 **View & update** assigned student information
- 📘 **Manage courses** they are responsible for (view, edit course details)
- 🗂️ **Manage enrollments** in their own courses
- 📊 **View statistics** related to their classes and students

### 👨‍💻 Administrator
- 🔐 **Authentication** with admin privileges
- 👨‍🏫 **Full teacher management** (add, edit, delete, view)
- 🎓 **Full student management** (add, edit, delete, view)
- 📘 **Full course management** (create, edit, delete)
- 🗂️ **Full enrollment management** across all teachers
- 📊 **Dashboard** displaying overall statistics (students, courses, enrollments)

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | ReactJS (JavaScript, JSX) |
| **Backend** | Spring Boot (REST API) |
| **Database** | MySQL |
| **HTTP Client** | Axios (for data fetching) |
| **State Management** | React Context API / Redux (depending on implementation) |
| **Authentication** | JSON Web Token (JWT) |
| **Deployment** | Vercel |

---

## 🚀 How to Run

### 1️⃣ Prerequisites
Before running the app, ensure you have:
- Node.js (v18 or higher) installed
- npm or yarn package manager
- Backend API (Spring Boot) running locally or deployed
- Database (MySQL) connected to backend

---

### 2️⃣ Clone and Setup Project

```bash
# Clone repository
git clone https://github.com/thanhnghia-dev/course-ui.git

# Navigate into project folder
cd course-ui

# Install dependencies
npm install
# or
yarn install
