"use client";

import { motion } from "framer-motion";
import { Check, X, Clock, Save, Search, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function TeacherAttendancePage() {
    // Mock students
    const [students, setStudents] = useState([
        { id: 101, name: "Ali Hasan", roll: 1, status: "Present" },
        { id: 102, name: "Sadiya Akter", roll: 2, status: "Present" },
        { id: 103, name: "Tanvir Rahman", roll: 3, status: "Absent" },
        { id: 104, name: "Nusrat Jahan", roll: 4, status: "Present" },
        { id: 105, name: "Fahim Faysal", roll: 5, status: "Late" },
        { id: 106, name: "Sumaiya Islam", roll: 6, status: "Present" },
    ]);

    const setStatus = (id: number, status: string) => {
        setStudents(students.map(s => s.id === id ? { ...s, status } : s));
    };

    const markAll = (status: string) => {
        setStudents(students.map(s => ({ ...s, status })));
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-foreground dark:text-white mb-2">Take Attendance</h1>
                    <p className="text-foreground/60 dark:text-gray-400">Class 10 - Section A | October 25, 2026</p>
                </div>

                <div className="flex gap-3">
                    <button onClick={() => markAll("Present")} className="px-5 py-2.5 rounded-xl text-sm font-bold text-green-400 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 transition-colors">
                        Mark All Present
                    </button>
                    <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-pink to-brand-purple hover:neon-glow transition-all flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Submit Daily Log
                    </button>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass p-5 rounded-2xl border border-foreground/10 dark:border-white/5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-foreground/5 dark:bg-white/5 flex items-center justify-center text-foreground dark:text-white font-bold">{students.length}</div>
                    <span className="text-sm font-semibold text-foreground/60 dark:text-gray-400 uppercase tracking-wider">Total</span>
                </div>
                <div className="glass p-5 rounded-2xl border border-green-500/20 flex items-center gap-4 bg-green-500/5">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold">
                        {students.filter(s => s.status === 'Present').length}
                    </div>
                    <span className="text-sm font-semibold text-green-400 uppercase tracking-wider">Present</span>
                </div>
                <div className="glass p-5 rounded-2xl border border-red-500/20 flex items-center gap-4 bg-red-500/5">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-bold">
                        {students.filter(s => s.status === 'Absent').length}
                    </div>
                    <span className="text-sm font-semibold text-red-400 uppercase tracking-wider">Absent</span>
                </div>
                <div className="glass p-5 rounded-2xl border border-yellow-500/20 flex items-center gap-4 bg-yellow-500/5">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-bold">
                        {students.filter(s => s.status === 'Late').length}
                    </div>
                    <span className="text-sm font-semibold text-yellow-400 uppercase tracking-wider">Late</span>
                </div>
            </div>

            {/* Student List */}
            <div className="glass rounded-3xl border border-foreground/10 dark:border-white/5 overflow-hidden">
                <div className="p-4 border-b border-foreground/10 dark:border-white/5 flex items-center gap-4 bg-foreground/5 dark:bg-background/40">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 dark:text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search student..."
                            className="w-full bg-card border border-foreground/15 dark:border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-foreground dark:text-white focus:outline-none focus:border-brand-purple transition-colors"
                        />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-foreground/60 dark:text-gray-400">
                        <AlertCircle className="w-4 h-4 text-brand-pink" />
                        Ensure all students are marked before submitting.
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-foreground/5 dark:bg-white/5 text-foreground/60 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
                                <th className="p-4 pl-6 w-20">Roll</th>
                                <th className="p-4">Student Name</th>
                                <th className="p-4">Student ID</th>
                                <th className="p-4 text-right pr-6">Attendance Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {students.map((student, i) => (
                                <motion.tr
                                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                    key={student.id} className="hover:bg-foreground/5 dark:bg-white/5 transition-colors group"
                                >
                                    <td className="p-4 pl-6 font-bold text-foreground/50 dark:text-gray-500">{student.roll}</td>
                                    <td className="p-4 font-bold text-foreground dark:text-white flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-pink/20 to-brand-purple/20 flex items-center justify-center text-xs border border-foreground/15 dark:border-white/10">
                                            {student.name.charAt(0)}
                                        </div>
                                        {student.name}
                                    </td>
                                    <td className="p-4 text-foreground/60 dark:text-gray-400 text-sm">STU-{student.id}</td>
                                    <td className="p-4 text-right pr-6">
                                        <div className="inline-flex bg-foreground/5 dark:bg-background/40 rounded-lg p-1 border border-foreground/10 dark:border-white/5 overflow-hidden">
                                            <button
                                                onClick={() => setStatus(student.id, "Present")}
                                                className={`flex items-center justify-center w-10 h-8 rounded-md transition-all ${student.status === 'Present' ? 'bg-green-500 text-foreground dark:text-white shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'text-foreground/50 dark:text-gray-500 hover:text-foreground dark:text-white hover:bg-foreground/5 dark:bg-white/5'}`}
                                                title="Present"
                                            ><Check className="w-4 h-4" /></button>

                                            <button
                                                onClick={() => setStatus(student.id, "Absent")}
                                                className={`flex items-center justify-center w-10 h-8 rounded-md transition-all ${student.status === 'Absent' ? 'bg-red-500 text-foreground dark:text-white shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'text-foreground/50 dark:text-gray-500 hover:text-foreground dark:text-white hover:bg-foreground/5 dark:bg-white/5'}`}
                                                title="Absent"
                                            ><X className="w-4 h-4" /></button>

                                            <button
                                                onClick={() => setStatus(student.id, "Late")}
                                                className={`flex items-center justify-center w-10 h-8 rounded-md transition-all ${student.status === 'Late' ? 'bg-yellow-500 text-foreground dark:text-white shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'text-foreground/50 dark:text-gray-500 hover:text-foreground dark:text-white hover:bg-foreground/5 dark:bg-white/5'}`}
                                                title="Late"
                                            ><Clock className="w-4 h-4" /></button>
                                        </div>
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
