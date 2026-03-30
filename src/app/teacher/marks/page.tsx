"use client";

import { motion } from "framer-motion";
import { Search, Save, Settings, FileText } from "lucide-react";

export default function TeacherMarksPage() {
    const students = [
        { id: 101, name: "Ali Hasan", roll: 1, ct_marks: 18, final_marks: 75 },
        { id: 102, name: "Sadiya Akter", roll: 2, ct_marks: 20, final_marks: 88 },
        { id: 103, name: "Tanvir Rahman", roll: 3, ct_marks: 15, final_marks: 62 },
        { id: 104, name: "Nusrat Jahan", roll: 4, ct_marks: 19, final_marks: 80 },
        { id: 105, name: "Fahim Faysal", roll: 5, ct_marks: 14, final_marks: 55 },
        { id: 106, name: "Sumaiya Islam", roll: 6, ct_marks: 17, final_marks: 70 },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-foreground dark:text-white mb-2">Manage Subject Marks</h1>
                    <p className="text-foreground/60 dark:text-gray-400">Higher Mathematics | Mid Term 2026 | Class 10 - Sec A</p>
                </div>

                <div className="flex gap-3">
                    <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-foreground dark:text-white bg-card hover:bg-foreground/10 dark:bg-white/10 border border-foreground/15 dark:border-white/10 transition-colors flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Evaluation Setup
                    </button>
                    <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-pink to-brand-purple hover:neon-glow transition-all flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Publish Marks
                    </button>
                </div>
            </div>

            {/* Grid view of input */}
            <div className="glass rounded-3xl border border-foreground/10 dark:border-white/5 overflow-hidden">
                <div className="p-4 border-b border-foreground/10 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-foreground/5 dark:bg-background/40">
                    <div className="relative w-full sm:max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 dark:text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by name or roll..."
                            className="w-full bg-card border border-foreground/15 dark:border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-foreground dark:text-white focus:outline-none focus:border-brand-purple transition-colors"
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto">
                        <div className="flex items-center gap-2 text-xs bg-card px-3 py-1.5 rounded-lg border border-foreground/15 dark:border-white/10">
                            <span className="text-foreground/60 dark:text-gray-400">Max CT:</span>
                            <span className="text-foreground dark:text-white font-bold">20</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs bg-card px-3 py-1.5 rounded-lg border border-foreground/15 dark:border-white/10">
                            <span className="text-foreground/60 dark:text-gray-400">Max Final:</span>
                            <span className="text-foreground dark:text-white font-bold">80</span>
                        </div>
                        <button className="flex items-center justify-center p-1.5 rounded-md bg-brand-pink/10 text-brand-pink hover:bg-brand-pink/20 transition-colors" title="Export CSV">
                            <FileText className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-foreground/5 dark:bg-white/5 text-foreground/60 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
                                <th className="p-4 pl-6 w-20">Roll</th>
                                <th className="p-4">Student Name</th>
                                <th className="p-4 text-center w-32">Class Test (20)</th>
                                <th className="p-4 text-center w-32">Final Exam (80)</th>
                                <th className="p-4 text-center w-32 pr-6">Total (100)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {students.map((student, i) => {
                                const total = student.ct_marks + student.final_marks;
                                const letterGrade = total >= 80 ? 'A+' : total >= 70 ? 'A' : total >= 60 ? 'A-' : total >= 50 ? 'B' : total >= 40 ? 'C' : 'F';
                                const gradeColor = letterGrade === 'A+' ? 'text-green-400' : letterGrade === 'F' ? 'text-red-400' : 'text-brand-pink';

                                return (
                                    <motion.tr
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                        key={student.id} className="hover:bg-foreground/5 dark:bg-white/5 transition-colors group"
                                    >
                                        <td className="p-4 pl-6 font-bold text-foreground/50 dark:text-gray-500">{student.roll}</td>
                                        <td className="p-4 font-bold text-foreground dark:text-white flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-foreground/5 dark:bg-background/40 flex items-center justify-center text-xs border border-foreground/15 dark:border-white/10">
                                                {student.name.charAt(0)}
                                            </div>
                                            {student.name}
                                        </td>
                                        <td className="p-4 text-center">
                                            <input
                                                type="number"
                                                defaultValue={student.ct_marks}
                                                max={20} min={0}
                                                className="w-16 bg-foreground/5 dark:bg-background/60 border border-foreground/15 dark:border-white/10 rounded-lg py-1.5 px-2 text-center text-foreground dark:text-white font-bold focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
                                            />
                                        </td>
                                        <td className="p-4 text-center">
                                            <input
                                                type="number"
                                                defaultValue={student.final_marks}
                                                max={80} min={0}
                                                className="w-16 bg-foreground/5 dark:bg-background/60 border border-foreground/15 dark:border-white/10 rounded-lg py-1.5 px-2 text-center text-foreground dark:text-white font-bold focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
                                            />
                                        </td>
                                        <td className="p-4 text-center pr-6 flex items-center justify-center gap-2">
                                            <span className="font-heading font-bold text-foreground dark:text-white text-lg">{total}</span>
                                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded uppercase ${gradeColor} bg-current/10 border border-current/20`}>
                                                {letterGrade}
                                            </span>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
