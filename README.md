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
 
