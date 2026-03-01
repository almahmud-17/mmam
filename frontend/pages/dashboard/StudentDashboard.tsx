// ================================================================
// PAGE: Student Dashboard
// Overview page for logged-in students
// Location: frontend/pages/dashboard/StudentDashboard.tsx
// In Next.js App Router → src/app/student/page.tsx
// ================================================================

"use client";

import { motion } from "framer-motion";
import { BookOpen, CalendarCheck, TrendingUp, AlertCircle } from "lucide-react";

export default function StudentDashboard() {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const stagger = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">

            {/* Welcome Banner */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
                className="w-full bg-gradient-to-r from-brand-pink/20 to-brand-purple/20 border border-brand-purple/30 rounded-3xl p-8 md:p-10 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-pink/20 rounded-full blur-[80px] -z-10" />
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">
                    Welcome back, <span className="text-gradient">John!</span> 👋
                </h1>
                <p className="text-gray-300 font-medium">Class 10 - Section A | Roll: 15</p>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
                initial="hidden" animate="visible" variants={stagger}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {[
                    { title: "Attendance", value: "92%", subtitle: "Last 30 days", icon: CalendarCheck, color: "text-green-400", bg: "bg-green-400/10" },
                    { title: "Upcoming Tests", value: "3", subtitle: "Next week", icon: BookOpen, color: "text-brand-pink", bg: "bg-brand-pink/10" },
                    { title: "Overall GPA", value: "4.8", subtitle: "Mid-term results", icon: TrendingUp, color: "text-brand-purple", bg: "bg-brand-purple/10" },
                    { title: "Pending Tasks", value: "1", subtitle: "Math Assignment", icon: AlertCircle, color: "text-yellow-400", bg: "bg-yellow-400/10" },
                ].map((stat, i) => (
                    <motion.div key={i} variants={fadeIn} className="glass p-6 rounded-2xl border border-white/5 hover:-translate-y-1 transition-transform group">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color} group-hover:scale-110 transition-transform`} />
                        </div>
                        <p className="text-gray-400 text-sm font-medium mb-1">{stat.title}</p>
                        <h3 className="text-3xl font-heading font-bold text-white mb-1">{stat.value}</h3>
                        <p className="text-xs text-gray-500">{stat.subtitle}</p>
                    </motion.div>
                ))}
            </motion.div>

            {/* Notice Board + Schedule */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Notice Board */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                    className="glass rounded-3xl p-6 md:p-8 border border-white/5"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-heading font-bold text-white">Notice Board</h2>
                        <button className="text-sm font-semibold text-brand-pink hover:text-brand-purple transition-colors">View All</button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { date: "Oct 15", title: "Monthly Class Test Schedule Published", isNew: true },
                            { date: "Oct 12", title: "School Closed for Autumn Vacation", isNew: false },
                            { date: "Oct 08", title: "Science Fair 2026 Registration Open", isNew: false },
                        ].map((notice, i) => (
                            <div key={i} className="flex gap-4 p-4 rounded-xl bg-black/40 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 group cursor-pointer">
                                <div className="shrink-0 w-14 h-14 rounded-lg bg-white/5 border border-white/10 flex flex-col items-center justify-center">
                                    <span className="text-brand-pink text-xs font-bold uppercase">{notice.date.split(" ")[0]}</span>
                                    <span className="text-white font-bold">{notice.date.split(" ")[1]}</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold text-sm group-hover:text-brand-pink transition-colors line-clamp-2 mb-1">{notice.title}</h4>
                                    {notice.isNew && <span className="text-[10px] uppercase tracking-wider font-bold bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">New</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Today's Schedule */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
                    className="glass rounded-3xl p-6 md:p-8 border border-white/5"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-heading font-bold text-white">Today&apos;s Schedule</h2>
                        <span className="text-sm font-semibold text-gray-400">Wednesday</span>
                    </div>
                    <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-3 before:w-px before:bg-white/10">
                        {[
                            { time: "09:00 AM", subj: "Mathematics", teacher: "Mr. Rafiqul Islam", status: "completed" },
                            { time: "10:30 AM", subj: "Physics", teacher: "Ms. Salma Begum", status: "ongoing" },
                            { time: "12:00 PM", subj: "English", teacher: "Mr. Hasan", status: "upcoming" },
                        ].map((cls, i) => (
                            <div key={i} className="relative pl-8 pb-4 last:pb-0">
                                <span className={`absolute left-[9px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-background ${cls.status === "completed" ? "bg-gray-500" :
                                        cls.status === "ongoing" ? "bg-brand-pink animate-pulse" :
                                            "bg-brand-purple"
                                    }`} />
                                <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                                    <p className="text-xs text-brand-pink font-bold mb-1">{cls.time}</p>
                                    <h4 className="text-white font-bold mb-1">{cls.subj}</h4>
                                    <p className="text-xs text-gray-400">{cls.teacher}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
