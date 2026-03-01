# 🎓 SchoolSpace - Comprehensive School Management System
একটি আধুনিক, dark-themed স্কুল ম্যানেজমেন্ট সিস্টেম। 

---

## 🏗️ Architecture & Deployment Overview

এই প্রজেক্টটি **Frontend (Vercel)**, **Backend (Render)**, এবং **Database (Neon)** এই তিনটি লেয়ারে বিভক্ত করে ডিজাইন করা হয়েছে যাতে এটি স্কেলেবল এবং প্রডাকশন-রেডি থাকে।

| Layer | Hosting | Technology |
|-------|---------|------------|
| **Frontend** | **Vercel** | Next.js 16 (App Router), React 19, TailwindCSS v4, Framer Motion |
| **Backend** | **Render** | Express.js, Node.js, TypeScript |
| **Database** | **Neon** | PostgreSQL, Prisma ORM |

---

## 📁 প্রজেক্ট স্ট্রাকচার

```
schoolproject/
│
├── 📁 frontend/                    ← UI Components & Premium Pages design
│   └── styles/globals.css          ← Gradient tokens & Glassmorphism styles
│
├── 📁 backend/                     ← Express.js API Server (Render-Ready)
│   ├── src/
│   │   ├── routes/                 ← Auth, Students, Teachers, etc.
│   │   ├── server.ts               ← Main Express Entry Point
│   │   └── seed.ts                 ← DB Seeder script
│   └── prisma/
│       └── schema.prisma           ← Neon/PostgreSQL models
│
├── 📁 src/                         ← Next.js App Router (Frontend Deployment)
│   └── app/                        ← Live pages for Vercel deployment
│       ├── page.tsx                ← Home Page
│       ├── login/page.tsx          ← Auth Logic & Login
│       └── [roles]/                ← Dashboards (Admin, Student, Teacher)
│
└── package.json                    ← Next.js frontend dependencies
```

---

## 🚀 Deployment Instructions

### ১. Database (Neon.tech)
- Neon.tech-এ একটি প্রজেক্ট খুলুন এবং `DATABASE_URL` কপি করুন।
- `backend/prisma/schema.prisma` তে provider "postgresql" আছে কিনা নিশ্চিত করুন।

### ২. Backend (Render.com)
- Render-এ একটি **Web Service** তৈরি করুন এবং `backend/` ফোল্ডারটি রুট হিসেবে দিন।
- **Build Command**: `npm install && npm run build && npm run db:generate`
- **Start Command**: `npm run start`
- **Env Vars**: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL` দিন।

### ৩. Frontend (Vercel.com)
- Vercel-এ রুট ডিরেক্টরি `schoolproject/` কানেক্ট করুন।
- **Build Command**: `next build`
- **Start Command**: `next start`
- **Env Vars**: 
  - `NEXT_PUBLIC_API_URL`: Render-এ হোস্ট করা আপনার API-র URL দিন।

---

## 🛠️ Local Development

১. **Root Folder**-এ Dependencies ইন্সটল করুন:
   ```bash
   npm install
   npm run dev # Next.js চলবে http://localhost:3000 এ
   ```

২. **Backend Folder**-এ আলাদা টার্মিনালে:
   ```bash
   cd backend
   npm install
   npm run dev # API চলবে http://localhost:5000 এ
   ```

---

## 🔑 Demo Access

| Role | Email | Password |
|------|-------|----------|
| 🔴 Admin | admin@school.com | password123 |
| 🟡 Teacher | rafiqul@school.com | password123 |
| 🟢 Student | john@school.com | password123 |

---

*Made with ❤️ by almahmud_17 — Designed for Excellence.*
