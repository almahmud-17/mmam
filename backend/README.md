# SchoolSpace Backend — Express.js API
Deployed on: **Render**

এই ফোল্ডারে SchoolSpace এর জন্য একটি সম্পূর্ণ Express.js API server আছে যা Render বা অন্য কোনো Node.js হোস্টিং-এ deploy করার উপযোগী।

## 📁 প্রজেক্ট স্ট্রাকচার

```
backend/
├── prisma/
│   └── schema.prisma    ← Neon/PostgreSQL schema configuration
├── src/
│   ├── lib/
│   │   ├── db.ts        ← Prisma Client singleton
│   │   └── auth.ts      ← JWT and hashing utilities
│   ├── middleware/
│   │   └── auth.ts      ← JWT authentication middleware
│   ├── routes/
│   │   ├── auth.ts      ← /api/auth routes (login, registration)
│   │   ├── students.ts  ← /api/students routes (CRUD)
│   │   └── teachers.ts  ← /api/teachers routes (CRUD)
│   ├── server.ts        ← Main entry point (Express setup)
│   └── seed.ts          ← Database seeding script
├── package.json         ← Dependencies and build scripts
└── tsconfig.json        ← TypeScript configuration
```

## 🛠️ লোকাল সেটআপ

১. Dependencies ইন্সটল করুন:
   ```bash
   cd backend
   npm install
   ```

২. `.env` ফাইলে আপনার **Neon Database URL** দিন:
   ```env
   DATABASE_URL="postgres://user:pass@ep-host.region.aws.neon.tech/neondb?sslmode=require"
   DIRECT_URL="postgres://user:pass@ep-host.region.aws.neon.tech/neondb?sslmode=require"
   JWT_SECRET="your_secret_key"
   FRONTEND_URL="http://localhost:3000"
   ```

৩. Database migrate এবং generate করুন:
   ```bash
   # Schema generate করুন
   npm run db:generate
   
   # Database-এ push করুন (for prototyping)
   npm run db:push
   ```

৪. Development server চালু করুন:
   ```bash
   npm run dev
   ```

## 🚀 Deployment (Render)

১. **New Web Service** তৈরি করুন।
২. **Root Directory**: `backend/` দিন (যদি main repo-তে থাকে)।
৩. **Build Command**: `npm install && npm run build && npm run db:generate`
৪. **Start Command**: `npm run start`
৫. **Environment Variables**: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL` দিন।

## 🛡️ Authentication Flow

প্রজেক্টটিতে **JWT (JSON Web Token)** ভিত্তিক authentication ব্যবহার করা হয়েছে।
- Login করার পর একটি `token` পাবেন যা Authorization header-এ `Bearer <token>` হিসেবে পাঠাতে হবে।
- প্রতিটি sensitive route-এ `authenticate` এবং `requireRole` middleware দিয়ে সুরক্ষা নিশ্চিত করা হয়েছে।
