"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, MoreVertical, Edit2, Trash2, X, GraduationCap, User, Mail, Phone, Book, Hash, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface Student {
    id: string;
    rollNo: number;
    user: {
        id: string;
        name: string;
        email: string;
        phone: string | null;
        avatar: string | null;
        createdAt: string;
    };
    section: {
        name: string;
        class: {
            name: string;
        };
    };
}

export default function AdminStudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [sections, setSections] = useState<{ id: string; name: string; class: { name: string } }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [classFilter, setClassFilter] = useState("All Classes");

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const headers = { "Authorization": `Bearer ${token}` };

            const [stuRes, secRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/students`, { headers }),
                fetch(`${API_BASE_URL}/api/metadata/sections`, { headers })
            ]);

            const stuData = await stuRes.json();
            const secData = await secRes.json();

            if (stuData.success) setStudents(stuData.data);
            if (secData.success) setSections(secData.data);

            if (!stuData.success || !secData.success) {
                setError("Some data failed to load.");
            }
        } catch (err) {
            setError("Network error. Backend might be offline.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/api/students`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setIsAdding(false);
                fetchData();
            } else {
                setError(data.error || "Failed to create student.");
            }
        } catch (err) {
            setError("Network error.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditStudent = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingStudent) return;
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/api/students/${editingStudent.id}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setEditingStudent(null);
                fetchData();
            } else {
                setError(data.error || "Failed to update student.");
            }
        } catch (err) {
            setError("Network error.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteStudent = async (id: string) => {
        if (!confirm("Delete this student?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/api/students/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.success) {
                fetchData();
            } else {
                alert(data.error || "Failed to delete.");
            }
        } catch (err) {
            console.error(err);
            alert("Network error.");
        }
    };

    const filteredStudents = students.filter(s => {
        const matchesSearch = s.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.section.class.name.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesClass = classFilter === "All Classes" || s.section.class.name === classFilter;

        return matchesSearch && matchesClass;
    });

    return (
        <div className="max-w-7xl mx-auto space-y-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-foreground dark:text-foreground dark:text-white mb-2">
                        <span className="hidden dark:inline">Student Registry</span>
                        <span className="inline dark:hidden text-gradient-premium">Student Registry</span>
                    </h1>
                    <p className="text-foreground/60">Comprehensive list and management of all enrolled students.</p>
                </div>

                <button
                    onClick={() => setIsAdding(true)}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-pink to-brand-purple hover:neon-glow transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add New Student
                </button>
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                    {error}
                </div>
            )}

            {/* Datatable Wrapper */}
            <div className="glass rounded-3xl border border-border overflow-hidden flex flex-col">
                {/* Table Toolbar */}
                <div className="p-4 md:p-6 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-background/5 dark:bg-foreground/5 dark:bg-background/40">
                    <div className="relative w-full sm:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Find by name, ID or email..."
                            className="w-full bg-background/5 dark:bg-card/50 border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:border-brand-purple transition-all"
                        />
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto min-h-[300px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-10 h-10 text-brand-purple animate-spin" />
                            <p className="text-foreground/60 dark:text-gray-400">Fetching student records...</p>
                        </div>
                    ) : filteredStudents.length > 0 ? (
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-background/5 dark:bg-foreground/5 dark:bg-white/5 text-foreground/40 text-xs font-semibold uppercase tracking-wider text-left">
                                    <th className="p-4 pl-6">Full Name</th>
                                    <th className="p-4">Roll/ID</th>
                                    <th className="p-4">Academic</th>
                                    <th className="p-4">Parent Info</th>
                                    <th className="p-4 text-right pr-6">Management</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredStudents.map((student, i) => (
                                    <motion.tr
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                        key={student.id} className="hover:bg-foreground/5 dark:bg-white/5 transition-colors group relative"
                                    >
                                        <td className="p-4 pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full border-2 border-border p-0.5 overflow-hidden">
                                                    {student.user.avatar ? (
                                                        <img
                                                            src={student.user.avatar.startsWith("http") || student.user.avatar.startsWith("data:") ? student.user.avatar : `${API_BASE_URL}${student.user.avatar}`}
                                                            alt={student.user.name}
                                                            className="w-full h-full object-cover rounded-full"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-brand-pink to-brand-purple flex items-center justify-center text-xs font-black text-white rounded-full">
                                                            {student.user.name.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-foreground">{student.user.name}</span>
                                                    <span className="text-[10px] text-foreground/40">{student.user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-foreground/60">#{student.rollNo}</span>
                                                <span className="text-[10px] text-foreground/30">{student.id.slice(0, 8)}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-foreground/70 dark:text-gray-300 text-sm font-medium">
                                            {student.section.class.name} <span className="text-foreground/50 dark:text-gray-500 mx-1">•</span> <span className="text-brand-purple font-bold">Sec {student.section.name}</span>
                                        </td>
                                        <td className="p-4 text-foreground/60 dark:text-gray-400 text-sm">{student.user.phone || "N/A"}</td>
                                        <td className="p-4 text-right pr-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setEditingStudent(student)}
                                                    className="p-2 text-foreground/40 hover:text-foreground bg-background/5 dark:bg-foreground/5 dark:bg-white/5 hover:bg-background/10 dark:hover:bg-foreground/10 dark:bg-white/10 rounded-lg transition-colors border border-border"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteStudent(student.id)}
                                                    className="p-2 text-foreground/40 hover:text-red-500 bg-background/5 dark:bg-foreground/5 dark:bg-white/5 hover:bg-red-500/10 rounded-lg transition-colors border border-border"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-foreground/50 dark:text-gray-500 hover:text-foreground dark:text-white transition-colors">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <GraduationCap className="w-12 h-12 text-gray-600" />
                            <p className="text-foreground/60 dark:text-gray-400">No students found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Student Modal */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setIsAdding(false)}
                        className="fixed inset-0 bg-foreground/5 dark:bg-background/60 backdrop-blur-sm z-50 px-4 flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-xl glass p-8 rounded-3xl relative"
                        >
                            <button onClick={() => setIsAdding(false)} className="absolute top-6 right-6 p-2 text-foreground/60 dark:text-gray-400 hover:text-foreground dark:text-white rounded-full">
                                <X className="w-6 h-6" />
                            </button>

                            <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Register New Student</h2>

                            <form onSubmit={handleAddStudent} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-foreground/50 dark:text-gray-500 uppercase tracking-widest pl-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 dark:text-gray-500" />
                                            <input name="name" required className="w-full bg-background/5 dark:bg-foreground/5 dark:bg-background/40 border border-border rounded-xl py-3 pl-11 text-foreground text-sm focus:border-brand-pink outline-none" placeholder="Ali Hasan" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-foreground/50 dark:text-gray-500 uppercase tracking-widest pl-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 dark:text-gray-500" />
                                            <input name="email" type="email" required className="w-full bg-background/5 dark:bg-foreground/5 dark:bg-background/40 border border-border rounded-xl py-3 pl-11 text-foreground text-sm focus:border-brand-pink outline-none" placeholder="ali@school.com" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-foreground/50 dark:text-gray-500 uppercase tracking-widest pl-1">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 dark:text-gray-500" />
                                            <input name="password" type="password" required className="w-full bg-background/5 dark:bg-foreground/5 dark:bg-background/40 border border-border rounded-xl py-3 pl-11 text-foreground text-sm focus:border-brand-pink outline-none" placeholder="••••••••" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-foreground/50 dark:text-gray-500 uppercase tracking-widest pl-1">Roll Number</label>
                                        <div className="relative">
                                            <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 dark:text-gray-500" />
                                            <input name="rollNo" type="number" required className="w-full bg-background/5 dark:bg-foreground/5 dark:bg-background/40 border border-border rounded-xl py-3 pl-11 text-foreground text-sm focus:border-brand-pink outline-none" placeholder="101" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-foreground/50 dark:text-gray-500 uppercase tracking-widest pl-1">Class Section</label>
                                        <div className="relative">
                                            <Book className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 dark:text-gray-500" />
                                            <select name="sectionId" required className="w-full bg-foreground/5 dark:bg-background/40 border border-foreground/10 dark:border-white/5 rounded-xl py-3 pl-11 text-foreground dark:text-white text-sm focus:border-brand-pink outline-none appearance-none cursor-pointer">
                                                <option value="" disabled selected>Select Section</option>
                                                {sections.map(sec => (
                                                    <option key={sec.id} value={sec.id} className="bg-card text-foreground dark:text-white">
                                                        {sec.class.name} - Sec {sec.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-foreground/50 dark:text-gray-500 uppercase tracking-widest pl-1">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 dark:text-gray-500" />
                                            <input name="phone" className="w-full bg-foreground/5 dark:bg-background/40 border border-foreground/10 dark:border-white/5 rounded-xl py-3 pl-11 text-foreground dark:text-white text-sm focus:border-brand-pink outline-none" placeholder="01711000000" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-foreground/40 uppercase tracking-widest pl-1">Photo</label>
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        className="w-full bg-background/5 dark:bg-foreground/5 dark:bg-white/5 border border-border rounded-xl py-3 px-4 text-foreground text-sm focus:outline-none focus:border-brand-pink transition-all file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-brand-pink file:text-white hover:file:bg-brand-pink/80"
                                    />
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="w-full py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-brand-pink to-brand-purple flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                                >
                                    {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Enroll Student"}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Student Modal */}
            <AnimatePresence>
                {editingStudent && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setEditingStudent(null)}
                        className="fixed inset-0 bg-foreground/5 dark:bg-background/60 backdrop-blur-sm z-50 px-4 flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-xl glass p-8 rounded-3xl relative"
                        >
                            <button onClick={() => setEditingStudent(null)} className="absolute top-6 right-6 p-2 text-foreground/60 dark:text-gray-400 hover:text-foreground dark:text-white rounded-full">
                                <X className="w-6 h-6" />
                            </button>

                            <h2 className="text-2xl font-heading font-bold text-foreground dark:text-white mb-6">Update Student Profile</h2>

                            <form onSubmit={handleEditStudent} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-foreground/50 dark:text-gray-500 uppercase tracking-widest pl-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 dark:text-gray-500" />
                                            <input name="name" required defaultValue={editingStudent.user.name} className="w-full bg-foreground/5 dark:bg-background/40 border border-foreground/10 dark:border-white/5 rounded-xl py-3 pl-11 text-foreground dark:text-white text-sm focus:border-brand-pink outline-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-foreground/50 dark:text-gray-500 uppercase tracking-widest pl-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 dark:text-gray-500" />
                                            <input name="email" type="email" required defaultValue={editingStudent.user.email} className="w-full bg-foreground/5 dark:bg-background/40 border border-foreground/10 dark:border-white/5 rounded-xl py-3 pl-11 text-foreground dark:text-white text-sm focus:border-brand-pink outline-none" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-foreground/50 dark:text-gray-500 uppercase tracking-widest pl-1">Role/Section Change</label>
                                        <div className="relative">
                                            <Book className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 dark:text-gray-500" />
                                            <select name="sectionId" required className="w-full bg-foreground/5 dark:bg-background/40 border border-foreground/10 dark:border-white/5 rounded-xl py-3 pl-11 text-foreground dark:text-white text-sm focus:border-brand-pink outline-none appearance-none cursor-pointer">
                                                {sections.map(sec => (
                                                    <option key={sec.id} value={sec.id} selected={sec.id === (editingStudent as any).sectionId}>
                                                        {sec.class.name} - Sec {sec.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-foreground/50 dark:text-gray-500 uppercase tracking-widest pl-1">Roll Number</label>
                                        <div className="relative">
                                            <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 dark:text-gray-500" />
                                            <input name="rollNo" type="number" required defaultValue={editingStudent.rollNo} className="w-full bg-foreground/5 dark:bg-background/40 border border-foreground/10 dark:border-white/5 rounded-xl py-3 pl-11 text-foreground dark:text-white text-sm focus:border-brand-pink outline-none" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-foreground/50 dark:text-gray-500 uppercase tracking-widest pl-1">New Password (Optional)</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 dark:text-gray-500" />
                                            <input name="password" type="password" className="w-full bg-foreground/5 dark:bg-background/40 border border-foreground/10 dark:border-white/5 rounded-xl py-3 pl-11 text-foreground dark:text-white text-sm focus:border-brand-pink outline-none" placeholder="Keep current" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-foreground/50 dark:text-gray-500 uppercase tracking-widest pl-1">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 dark:text-gray-500" />
                                            <input name="phone" defaultValue={editingStudent.user.phone || ""} className="w-full bg-foreground/5 dark:bg-background/40 border border-foreground/10 dark:border-white/5 rounded-xl py-3 pl-11 text-foreground dark:text-white text-sm focus:border-brand-pink outline-none" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-foreground/40 uppercase tracking-widest pl-1">Photo</label>
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        className="w-full bg-background/5 dark:bg-foreground/5 dark:bg-white/5 border border-border rounded-xl py-3 px-4 text-foreground text-sm focus:outline-none focus:border-brand-pink transition-all file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-brand-pink file:text-white hover:file:bg-brand-pink/80"
                                    />
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="w-full py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-brand-pink to-brand-purple flex items-center justify-center gap-2 disabled:opacity-50 mt-4 shadow-lg"
                                >
                                    {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Save Changes"}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}

const Lock = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
);
