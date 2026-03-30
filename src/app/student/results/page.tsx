"use client";

import { motion } from "framer-motion";
import { Download, Award, Target, BookOpen } from "lucide-react";

export default function StudentResultsPage() {
    const marks = [
        { subject: "Mathematics", marks: 95, grade: "A+", gpa: 5.0 },
        { subject: "Physics", marks: 88, grade: "A", gpa: 4.0 },
        { subject: "Chemistry", marks: 92, grade: "A+", gpa: 5.0 },
        { subject: "Biology", marks: 85, grade: "A", gpa: 4.0 },
        { subject: "English", marks: 78, grade: "B", gpa: 3.0 },
        { subject: "Bengali", marks: 90, grade: "A+", gpa: 5.0 },
    ];

    const totalMarks = marks.reduce((acc, curr) => acc + curr.marks, 0);
    const avgGpa = (marks.reduce((acc, curr) => acc + curr.gpa, 0) / marks.length).toFixed(2);

    return (
        <div className="max-w-4xl mx-auto space-y-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-foreground dark:text-white mb-2">Examination Results</h1>
                    <p className="text-foreground/60 dark:text-gray-400">Mid-Term Examination 2026</p>
                </div>

                {/* Download BTN */}
                <button className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-pink to-brand-purple hover:neon-glow transition-all duration-300 flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Download PDF Marksheet
                </button>
            </div>

            {/* Summary Highlight */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                <div className="glass p-6 rounded-3xl border border-foreground/10 dark:border-white/5 flex items-center gap-6 group hover:border-brand-pink/50 transition-colors">
                    <div className="w-14 h-14 rounded-full bg-brand-pink/20 flex items-center justify-center">
                        <Target className="w-7 h-7 text-brand-pink" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-foreground/60 dark:text-gray-400 uppercase tracking-wider mb-1">Total Marks</p>
                        <h3 className="text-3xl font-heading font-bold text-foreground dark:text-white">{totalMarks} <span className="text-lg text-foreground/50 dark:text-gray-500 font-medium">/ 600</span></h3>
                    </div>
                </div>

                <div className="glass p-6 rounded-3xl border border-foreground/10 dark:border-white/5 flex items-center gap-6 group hover:border-brand-purple/50 transition-colors">
                    <div className="w-14 h-14 rounded-full bg-brand-purple/20 flex items-center justify-center">
                        <Award className="w-7 h-7 text-brand-purple" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-foreground/60 dark:text-gray-400 uppercase tracking-wider mb-1">Overall GPA</p>
                        <h3 className="text-3xl font-heading font-bold text-foreground dark:text-white">{avgGpa}</h3>
                    </div>
                </div>

                <div className="glass p-6 rounded-3xl border border-brand-pink/30 flex items-center gap-6 bg-gradient-to-br from-brand-pink/10 to-transparent">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-brand-pink to-brand-purple flex items-center justify-center">
                        <BookOpen className="w-7 h-7 text-foreground dark:text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-brand-pink uppercase tracking-wider mb-1">Final Grade</p>
                        <h3 className="text-3xl font-heading font-bold text-foreground dark:text-white">A</h3>
                    </div>
                </div>
            </motion.div>

            {/* Detail Table */}
            <div className="glass rounded-3xl border border-foreground/10 dark:border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-foreground/5 dark:bg-white/5 text-foreground/60 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider">
                                <th className="p-6">Subject Name</th>
                                <th className="p-6 text-center">Marks Obtained</th>
                                <th className="p-6 text-center">Letter Grade</th>
                                <th className="p-6 text-center">GPA</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {marks.map((record, i) => (
                                <motion.tr
                                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                                    key={i} className="hover:bg-foreground/5 dark:bg-white/5 transition-colors"
                                >
                                    <td className="p-6 font-medium text-foreground dark:text-white flex items-center gap-3">
                                        <span className="w-2 h-2 rounded-full bg-gray-500" />
                                        {record.subject}
                                    </td>
                                    <td className="p-6 text-center font-bold text-foreground dark:text-white">{record.marks}</td>
                                    <td className="p-6 text-center">
                                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold ${record.grade === 'A+' ? 'bg-green-500/20 text-green-400' :
                                                record.grade === 'A' ? 'bg-brand-purple/20 text-brand-purple' :
                                                    record.grade === 'B' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-red-500/20 text-red-400'
                                            }`}>
                                            {record.grade}
                                        </span>
                                    </td>
                                    <td className="p-6 text-center text-foreground/60 dark:text-gray-400 font-medium">{record.gpa.toFixed(2)}</td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
