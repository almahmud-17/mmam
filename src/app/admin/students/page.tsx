"use client";

import { motion } from "framer-motion";
import { Search, Plus, MoreVertical, Edit2, Trash2 } from "lucide-react";

export default function AdminStudentsPage() {
    const students = [
        { id: "STU-1001", name: "Ali Hasan", class: "Class 10", section: "A", phone: "+8801700000001", status: "Active" },
        { id: "STU-1002", name: "Sadiya Akter", class: "Class 10", section: "A", phone: "+8801700000002", status: "Active" },
        { id: "STU-1003", name: "Tanvir Rahman", class: "Class 9", section: "C", phone: "+8801700000003", status: "Inactive" },
        { id: "STU-1004", name: "Nusrat Jahan", class: "Class 8", section: "B", phone: "+8801700000004", status: "Active" },
        { id: "STU-1005", name: "Fahim Faysal", class: "Class 10", section: "B", phone: "+8801700000005", status: "Active" },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-white mb-2">Student Database</h1>
                    <p className="text-gray-400">Manage all registered students across the institution.</p>
                </div>

                <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-pink to-brand-purple hover:neon-glow transition-all flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add New Student
                </button>
            </div>

            {/* Datatable Wrapper */}
            <div className="glass rounded-3xl border border-white/5 overflow-hidden flex flex-col">
                {/* Table Toolbar */}
                <div className="p-4 md:p-6 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/40">
                    <div className="relative w-full sm:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by student ID, name, or phone..."
                            className="w-full bg-card border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-brand-purple transition-colors"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <select className="bg-card border border-white/10 rounded-lg text-sm text-gray-300 px-4 py-2.5 focus:outline-none focus:border-brand-purple transition-colors">
                            <option>Filter by Class</option>
                            <option>Class 10</option>
                            <option>Class 9</option>
                            <option>Class 8</option>
                        </select>
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-white/5 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                                <th className="p-4 pl-6">Student ID</th>
                                <th className="p-4">Full Name</th>
                                <th className="p-4">Class & Section</th>
                                <th className="p-4">Contact Phone</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {students.map((student, i) => (
                                <motion.tr
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                    key={student.id} className="hover:bg-white/5 transition-colors group relative"
                                >
                                    <td className="p-4 pl-6 font-bold text-gray-400 text-sm">{student.id}</td>
                                    <td className="p-4 font-bold text-white flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-pink/20 to-brand-purple/20 flex items-center justify-center text-xs border border-white/10">
                                            {student.name.charAt(0)}
                                        </div>
                                        {student.name}
                                    </td>
                                    <td className="p-4 text-gray-300 text-sm font-medium">
                                        {student.class} <span className="text-gray-500 mx-1">•</span> <span className="text-brand-purple font-bold">Sec {student.section}</span>
                                    </td>
                                    <td className="p-4 text-gray-400 text-sm">{student.phone}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${student.status === 'Active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                            }`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right pr-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/10" title="Edit Student">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20" title="Delete Student">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-500 hover:text-white transition-colors">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination placeholder */}
                <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm text-gray-400 bg-black/40">
                    <span>Showing 1 to 5 of 1,542 students</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 rounded-lg bg-card border border-white/10 hover:text-white transition-colors disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1.5 rounded-lg bg-card border border-white/10 hover:text-white transition-colors">Next</button>
                    </div>
                </div>
            </div>

        </div>
    );
}
