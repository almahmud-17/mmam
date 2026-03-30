"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, FileText, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

type StatKey = "students" | "staff" | "teachers" | "classes";

const DEFAULT_STATS: Record<StatKey, { title: string; subtitle: string; icon: React.ElementType; color: string; bg: string }> = {
    students: { title: "Total Students", subtitle: "Across all sections", icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
    staff: { title: "Total Staff", subtitle: "Academic & non-academic", icon: Users, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    teachers: { title: "Total Teachers", subtitle: "Active this session", icon: Users, color: "text-purple-400", bg: "bg-purple-400/10" },
    classes: { title: "Active Classes", subtitle: "Running today", icon: Clock, color: "text-yellow-400", bg: "bg-yellow-400/10" },
};

export default function TeacherDashboardHome() {
    const [isEditing, setIsEditing] = useState(false);
    const [values, setValues] = useState<Record<StatKey, string>>({
        students: "145",
        staff: "25",
        teachers: "32",
        classes: "12",
    });

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    const stagger = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const handleChange = (key: StatKey, value: string) => {
        setValues((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">

            {/* Welcome Banner */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full bg-gradient-to-r from-brand-purple/20 to-brand-pink/20 border border-brand-pink/30 rounded-3xl p-8 md:p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between"
            >
                <div className="absolute top-0 left-0 w-64 h-64 bg-brand-purple/20 rounded-full blur-[80px] -z-10" />
                <div>
                    <p className="text-xs font-semibold text-brand-pink uppercase tracking-[0.25em] mb-2">
                        Mohishaban M Alim Madrasah
                    </p>
                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground dark:text-white mb-2">
                        Welcome, <span className="text-gradient">Taznurul!</span> 🍎
                    </h1>
                    <p className="text-foreground/70 dark:text-gray-300 font-medium">Senior Mathematics Teacher | Class 10 Coordinator</p>
                </div>

                <div className="mt-6 md:mt-0 flex items-center gap-4">
                    <Link
                        href="/teacher/attendance"
                        className="px-5 py-2.5 rounded-full text-sm font-bold text-foreground dark:text-white bg-foreground/10 dark:bg-white/10 hover:bg-foreground/20 dark:bg-white/20 border border-foreground/20 dark:border-white/20 transition-all shadow-lg backdrop-blur"
                    >
                        Take Attendance
                    </Link>
                    <Link
                        href="/teacher/marks"
                        className="px-5 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-brand-pink to-brand-purple hover:neon-glow transition-all shadow-[0_0_15px_rgba(255,45,125,0.4)]"
                    >
                        Update Marks
                    </Link>
                </div>
            </motion.div>

            {/* Quick Stats Grid (editable) */}
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-heading font-semibold text-foreground dark:text-white">School Overview</h2>
                <button
                    type="button"
                    onClick={() => setIsEditing((v) => !v)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-foreground/5 dark:bg-white/5 border border-foreground/15 dark:border-white/10 text-foreground/70 dark:text-gray-300 hover:text-foreground dark:text-white hover:bg-foreground/10 dark:bg-white/10 transition-colors"
                >
                    {isEditing ? "Save Values" : "Edit Overview"}
                </button>
            </div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={stagger}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {(Object.keys(DEFAULT_STATS) as StatKey[]).map((key) => {
                    const meta = DEFAULT_STATS[key];
                    const Icon = meta.icon;

                    return (
                        <motion.div
                            key={key}
                            variants={fadeIn}
                            className="glass p-6 rounded-2xl border border-foreground/10 dark:border-white/5 hover:-translate-y-1 transition-transform group"
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${meta.bg}`}>
                                <Icon className={`w-6 h-6 ${meta.color} group-hover:scale-110 transition-transform`} />
                            </div>
                            <p className="text-foreground/60 dark:text-gray-400 text-sm font-medium mb-1">{meta.title}</p>
                            {isEditing ? (
                                <input
                                    value={values[key]}
                                    onChange={(e) => handleChange(key, e.target.value)}
                                    inputMode="numeric"
                                    aria-label={`${meta.title} value`}
                                    placeholder={meta.title}
                                    className="w-full bg-foreground/5 dark:bg-background/40 border border-foreground/15 dark:border-white/10 rounded-lg px-3 py-2 text-foreground dark:text-white text-lg font-heading font-semibold focus:outline-none focus:ring-2 focus:ring-brand-pink/50"
                                />
                            ) : (
                                <h3 className="text-3xl font-heading font-bold text-foreground dark:text-white mb-1">{values[key]}</h3>
                            )}
                            <p className="text-xs text-foreground/50 dark:text-gray-500">{meta.subtitle}</p>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Grid: Todays Classes & recent acts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Today's Classes */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="glass rounded-3xl p-6 md:p-8 border border-foreground/10 dark:border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-heading font-bold text-foreground dark:text-white">Your Classes Today</h2>
                        <span className="text-sm font-semibold text-foreground/60 dark:text-gray-400">Wednesday</span>
                    </div>
                    <div className="space-y-4">
                        {[
                            { time: "09:00 AM - 09:45 AM", subj: "Mathematics", section: "Class 10 - Section A", status: "completed" },
                            { time: "11:00 AM - 11:45 AM", subj: "Higher Math", section: "Class 9 - Section C", status: "ongoing" },
                            { time: "01:00 PM - 01:45 PM", subj: "Mathematics", section: "Class 8 - Section B", status: "upcoming" },
                        ].map((cls, i) => (
                            <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-foreground/5 dark:bg-background/40 hover:bg-foreground/5 dark:bg-white/5 transition-colors border border-transparent hover:border-foreground/15 dark:border-white/10 items-start sm:items-center justify-between">
                                <div>
                                    <p className="text-xs text-brand-pink font-bold mb-1">{cls.time}</p>
                                    <h4 className="text-foreground dark:text-white font-bold">{cls.subj}</h4>
                                    <p className="text-xs text-foreground/60 dark:text-gray-400 mt-0.5">{cls.section}</p>
                                </div>
                                <div className="mt-2 sm:mt-0">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${cls.status === 'completed' ? 'bg-gray-500/20 text-foreground/60 dark:text-gray-400' :
                                            cls.status === 'ongoing' ? 'bg-green-500/20 text-green-400 animate-pulse' :
                                                'bg-brand-purple/20 text-brand-purple'
                                        }`}>
                                        {cls.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Action Items */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="glass rounded-3xl p-6 md:p-8 border border-foreground/10 dark:border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-heading font-bold text-foreground dark:text-white">Recent Actions Needed</h2>
                    </div>
                    <div className="space-y-4">
                        {[
                            { title: "Grade Math Mid-Term Papers", desc: "Class 10 Section A (45 students)", urgent: true },
                            { title: "Submit Monthly Attendance Report", desc: "Due by Friday, 30th Oct", urgent: true },
                            { title: "Review Scholarship Applications", desc: "2 pending reviews", urgent: false },
                        ].map((task, i) => (
                            <div key={i} className="flex gap-4 p-4 rounded-xl bg-foreground/5 dark:bg-background/40 border border-foreground/10 dark:border-white/5">
                                <div className="shrink-0 pt-1">
                                    <div className={`w-3 h-3 rounded-full ${task.urgent ? 'bg-brand-pink shadow-[0_0_8px_rgba(255,45,125,0.8)]' : 'bg-brand-purple'}`} />
                                </div>
                                <div>
                                    <h4 className="text-foreground dark:text-white font-semibold text-sm mb-1">{task.title}</h4>
                                    <p className="text-xs text-foreground/60 dark:text-gray-400">{task.desc}</p>
                                    <div className="mt-3 flex gap-3">
                                        <button className="text-xs font-bold text-brand-pink hover:text-foreground dark:text-white transition-colors">Resolve</button>
                                        <button className="text-xs font-bold text-foreground/50 dark:text-gray-500 hover:text-foreground dark:text-white transition-colors">Dismiss</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
