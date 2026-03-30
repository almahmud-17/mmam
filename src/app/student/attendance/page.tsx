"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Clock, CalendarDays } from "lucide-react";

export default function StudentAttendancePage() {
    const attendanceData = [
        { date: "Oct 25, 2026", status: "Present", time: "08:45 AM" },
        { date: "Oct 24, 2026", status: "Present", time: "08:50 AM" },
        { date: "Oct 23, 2026", status: "Absent", time: "-" },
        { date: "Oct 22, 2026", status: "Late", time: "09:15 AM" },
        { date: "Oct 21, 2026", status: "Present", time: "08:40 AM" },
        { date: "Oct 20, 2026", status: "Present", time: "08:48 AM" },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-foreground dark:text-white mb-2">My Attendance</h1>
                    <p className="text-foreground/60 dark:text-gray-400">Track your daily presence and punctuality.</p>
                </div>

                {/* Month Selector */}
                <div className="glass px-4 py-2 rounded-xl flex items-center gap-3 border border-foreground/10 dark:border-white/5 cursor-pointer hover:bg-foreground/5 dark:bg-white/5 transition-colors">
                    <CalendarDays className="w-5 h-5 text-brand-pink" />
                    <span className="text-foreground dark:text-white font-medium">October 2026</span>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-6">
                {[
                    { label: "Present", val: "18", color: "text-green-400" },
                    { label: "Absent", val: "2", color: "text-red-400" },
                    { label: "Late", val: "1", color: "text-yellow-400" },
                ].map((s, i) => (
                    <div key={i} className="glass p-6 rounded-2xl border border-foreground/10 dark:border-white/5 text-center">
                        <h3 className={`text-3xl font-heading font-extrabold mb-1 ${s.color}`}>{s.val}</h3>
                        <p className="text-sm font-semibold text-foreground/60 dark:text-gray-400 uppercase tracking-wider">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Detail Table */}
            <div className="glass rounded-3xl border border-foreground/10 dark:border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-foreground/5 dark:bg-white/5 text-foreground/60 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider">
                                <th className="p-6">Date</th>
                                <th className="p-6">Time Checked In</th>
                                <th className="p-6">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {attendanceData.map((record, i) => (
                                <motion.tr
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                    key={i} className="hover:bg-foreground/5 dark:bg-white/5 transition-colors group"
                                >
                                    <td className="p-6 font-medium text-foreground dark:text-white">{record.date}</td>
                                    <td className="p-6 text-foreground/60 dark:text-gray-400">{record.time}</td>
                                    <td className="p-6">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${record.status === 'Present' ? 'bg-green-500/20 text-green-400 border border-green-500/20' :
                                                record.status === 'Absent' ? 'bg-red-500/20 text-red-400 border border-red-500/20' :
                                                    'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20'
                                            }`}>
                                            {record.status === 'Present' && <CheckCircle2 className="w-3.5 h-3.5" />}
                                            {record.status === 'Absent' && <XCircle className="w-3.5 h-3.5" />}
                                            {record.status === 'Late' && <Clock className="w-3.5 h-3.5" />}
                                            {record.status}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
