# Frontend Layer - SchoolSpace

এই ফোল্ডারে সকল UI components, pages, এবং styles আছে।

## 📁 ফাইল স্ট্রাকচার

```
frontend/
├── styles/
│   └── globals.css                 ← Design tokens, utility classes (glass, neon-glow, text-gradient)
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx              ← Fixed top navigation bar
│   │   ├── Footer.tsx             ← Footer with links & WhatsApp bubble
│   │   └── DashboardLayout.tsx    ← Reusable sidebar layout for portals
│   └── ui/
│       └── SectionTitle.tsx       ← Section heading with gradient support
│
├── pages/
│   ├── HomePage.tsx               ← Public landing page (hero, stats, features, team)
│   ├── LoginPage.tsx              ← Role-based login page (Student/Teacher/Admin)
│   └── dashboard/
│       ├── AdminDashboard.tsx     ← Admin portal overview
│       ├── StudentDashboard.tsx   ← Student portal overview
│       └── TeacherDashboard.tsx   ← Teacher portal overview
│
└── README.md                      ← এই ফাইল
```

> **Next.js App Router তে ব্যবহার:**
> এই `frontend/pages/` ফাইলগুলো `src/app/` এর corresponding pages এর কন্টেন্ট হিসেবে export করা হয়।

## 🎨 Design System

### Color Palette
| Token | Value | Use |
|-------|-------|-----|
| `--brand-pink` | `#FF2D7D` | Primary accent, CTAs |
| `--brand-purple` | `#A855F7` | Secondary accent, gradients |
| `--background` | `#0B0B0D` | Page background |
| `--card` | `#1A1A1D` | Card/panel background |

### Utility Classes
| Class | Description |
|-------|-------------|
| `.glass` | Glassmorphism effect (blur + translucent bg) |
| `.neon-glow` | Pink-purple glow shadow |
| `.text-gradient` | Pink → Purple gradient text |

### Fonts
| Variable | Font | Use |
|----------|------|-----|
| `--font-sans` / `--font-inter` | Inter | Body text |
| `--font-heading` / `--font-poppins` | Poppins | Headings |
| `--font-bangla` / `--font-noto-bengali` | Noto Sans Bengali | Bangla text |

## 📱 Pages Overview

### Public Pages
- **`/`** → `HomePage.tsx` — Hero, stats, features, leadership team
- **`/login`** → `LoginPage.tsx` — Role selector + login form

### Admin Portal (`/admin/*`)
- **`/admin`** → `AdminDashboard.tsx` — Stats overview + charts

### Teacher Portal (`/teacher/*`)
- **`/teacher`** → `TeacherDashboard.tsx` — Schedule + action items

### Student Portal (`/student/*`)
- **`/student`** → `StudentDashboard.tsx` — Grades, notices, schedule

## 🧩 Components Usage

### DashboardLayout
```tsx
// Admin sidebar navigation example
<DashboardLayout
    links={[
        { href: "/admin",          label: "Dashboard",       icon: LayoutDashboard },
        { href: "/admin/students", label: "Manage Students", icon: Users },
    ]}
    role="admin"
    userName="System Administrator"
>
    <AdminDashboard />
</DashboardLayout>
```

### SectionTitle
```tsx
// "[gradient]" keyword makes that text pink-purple gradient
<SectionTitle
    title="All-in-One [gradient]School Platform"
    subtitle="Core Features"
/>
```
