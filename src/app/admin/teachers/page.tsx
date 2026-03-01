"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, MoreVertical, Edit2, Trash2, X, User, Mail, Phone, BookOpen, GraduationCap, Lock, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface Teacher {
    id: string;
    specialization: string | null;
    user: {
        id: string;
        name: string;
        email: string;
        phone: string | null;
        avatar: string | null;
        createdAt: string;
    };
}

export default function AdminTeachersPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
    const [departmentFilter, setDepartmentFilter] = useState("All Departments");

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

    const fetchTeachers = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/api/teachers`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setTeachers(data.data);
            } else {
                setError(data.error || "Failed to fetch teachers.");
            }
        } catch (err) {
            setError("Network error. Make sure the backend is running.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const handleAddTeacher = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name");
        const email = formData.get("email");
        const password = formData.get("password");
        const phone = formData.get("phone");
        const specialization = formData.get("specialization");

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/api/teachers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name, email, password, phone, specialization }),
            });

            const data = await response.json();

            if (data.success) {
                setIsAdding(false);
                fetchTeachers(); // Refresh list
            } else {
                setError(data.error || "Failed to create teacher.");
            }
        } catch (err) {
            setError("Network error. Could not connect to the server.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditTeacher = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingTeacher) return;
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name");
        const email = formData.get("email");
        const phone = formData.get("phone");
        const specialization = formData.get("specialization");
        const password = formData.get("password"); // Optional

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/api/teachers/${editingTeacher.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    specialization,
                    ...(password ? { password } : {})
                }),
            });

            const data = await response.json();

            if (data.success) {
                setEditingTeacher(null);
                fetchTeachers();
            } else {
                setError(data.error || "Failed to update teacher.");
            }
        } catch (err) {
            setError("Network error.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteTeacher = async (id: string) => {
        if (!confirm("Are you sure you want to delete this teacher?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/api/teachers/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.success) {
                fetchTeachers();
            } else {
                alert(data.error || "Failed to delete.");
            }
        } catch (err) {
            console.error(err);
            alert("Network error.");
        }
    };

    const filteredTeachers = teachers.filter(t => {
        const matchesSearch = t.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.specialization && t.specialization.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesDept = departmentFilter === "All Departments" ||
            (t.specialization && t.specialization.toLowerCase().includes(departmentFilter.toLowerCase()));

        return matchesSearch && matchesDept;
    });

    return (
        <div className="max-w-7xl mx-auto space-y-8 relative">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-white mb-2">Teacher Database</h1>
                    <p className="text-gray-400">Manage all faculty members and their specializations.</p>
                </div>

                <button
                    onClick={() => setIsAdding(true)}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-pink to-brand-purple hover:neon-glow transition-all flex items-center justify-center gap-2 group"
                >
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                    Add New Teacher
                </button>
            </div>

            {/* Error Display */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium"
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Datatable Wrapper */}
            <div className="glass rounded-3xl border border-white/5 overflow-hidden flex flex-col">
                {/* Table Toolbar */}
                <div className="p-4 md:p-6 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/40">
                    <div className="relative w-full sm:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name, email, or specialization..."
                            className="w-full bg-card border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-brand-purple transition-colors"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <select
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                            className="bg-card border border-white/10 rounded-lg text-sm text-gray-300 px-4 py-2.5 focus:outline-none focus:border-brand-purple transition-colors"
                        >
                            <option>All Departments</option>
                            <option>Mathematics</option>
                            <option>Science</option>
                            <option>English</option>
                            <option>Arabic</option>
                        </select>
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto min-h-[300px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-10 h-10 text-brand-pink animate-spin" />
                            <p className="text-gray-400 font-medium">Loading faculty list...</p>
                        </div>
                    ) : filteredTeachers.length > 0 ? (
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-white/5 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                                    <th className="p-4 pl-6">ID</th>
                                    <th className="p-4">Full Name</th>
                                    <th className="p-4">Specialization</th>
                                    <th className="p-4">Contact Info</th>
                                    <th className="p-4">Joined At</th>
                                    <th className="p-4 text-right pr-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredTeachers.map((teacher, i) => (
                                    <motion.tr
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                        key={teacher.id} className="hover:bg-white/5 transition-colors group relative"
                                    >
                                        <td className="p-4 pl-6 font-bold text-gray-400 text-xs">{teacher.id.slice(0, 8)}...</td>
                                        <td className="p-4 font-bold text-white flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-pink to-brand-purple p-[1px]">
                                                <div className="w-full h-full bg-card rounded-full flex items-center justify-center text-xs font-bold border border-white/10">
                                                    {teacher.user.name.charAt(0)}
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm">{teacher.user.name}</span>
                                                <span className="text-[10px] text-gray-500 font-medium">{teacher.user.email}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-300 text-sm font-medium">
                                            <span className="px-3 py-1 rounded-lg bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-bold uppercase tracking-wider">
                                                {teacher.specialization || "N/A"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-400 text-sm">
                                            {teacher.user.phone || "No phone"}
                                        </td>
                                        <td className="p-4 text-gray-500 text-xs font-medium">
                                            {new Date(teacher.user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right pr-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setEditingTeacher(teacher)}
                                                    className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/10"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTeacher(teacher.id)}
                                                    className="p-2 text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                                                >
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
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <Search className="w-12 h-12 text-gray-600" />
                            <p className="text-gray-400 font-medium">No teachers found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Teacher Sidebar/Modal Offset */}
            <AnimatePresence>
                {isAdding && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsAdding(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 px-4 flex items-center justify-center"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full max-w-xl glass p-8 md:p-10 rounded-3xl relative shadow-[0_0_100px_rgba(255,45,125,0.1)]"
                            >
                                <button
                                    onClick={() => setIsAdding(false)}
                                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
                                >
                                    <X className="w-6 h-6" />
                                </button>

                                <div className="mb-8">
                                    <h2 className="text-2xl font-heading font-bold text-white mb-2 flex items-center gap-3">
                                        <div className="p-2.5 rounded-xl bg-gradient-to-tr from-brand-pink to-brand-purple">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        Add New Faculty
                                    </h2>
                                    <p className="text-gray-400 text-sm">Fill in the details to register a new teacher in the institutional system.</p>
                                </div>

                                <form onSubmit={handleAddTeacher} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">Name</label>
                                            <div className="relative">
                                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <input name="name" required placeholder="John Doe" className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-11 text-white text-sm focus:outline-none focus:border-brand-purple transition-all" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <input name="email" type="email" required placeholder="name@school.com" className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-11 text-white text-sm focus:outline-none focus:border-brand-purple transition-all" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <input name="password" type="password" required placeholder="••••••••" className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-11 text-white text-sm focus:outline-none focus:border-brand-purple transition-all" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">Phone (Optional)</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <input name="phone" placeholder="01711000000" className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-11 text-white text-sm focus:outline-none focus:border-brand-purple transition-all" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">Specialization / Department</label>
                                        <div className="relative">
                                            <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                            <input name="specialization" required placeholder="Mathematics, Physics, English..." className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-11 text-white text-sm focus:outline-none focus:border-brand-purple transition-all" />
                                        </div>
                                    </div>

                                    <button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="w-full py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-brand-pink to-brand-purple hover:neon-glow transition-all duration-300 flex items-center justify-center gap-2 mt-4 shadow-lg shadow-brand-pink/20 disabled:opacity-50"
                                    >
                                        {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Register Teacher <GraduationCap className="w-5 h-5" /></>}
                                    </button>
                                </form>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Edit Teacher Modal */}
            <AnimatePresence>
                {editingTeacher && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setEditingTeacher(null)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 px-4 flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-xl glass p-8 md:p-10 rounded-3xl relative"
                        >
                            <button
                                onClick={() => setEditingTeacher(null)}
                                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="mb-8">
                                <h2 className="text-2xl font-heading font-bold text-white mb-2 flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-gradient-to-tr from-brand-pink to-brand-purple">
                                        <Edit2 className="w-5 h-5 text-white" />
                                    </div>
                                    Update Faculty Details
                                </h2>
                                <p className="text-gray-400 text-sm">Modify the information for {editingTeacher.user.name}.</p>
                            </div>

                            <form onSubmit={handleEditTeacher} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                            <input name="name" required defaultValue={editingTeacher.user.name} className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-11 text-white text-sm focus:border-brand-purple outline-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                            <input name="email" type="email" required defaultValue={editingTeacher.user.email} className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-11 text-white text-sm focus:border-brand-purple outline-none" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">New Password (Optional)</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                            <input name="password" type="password" placeholder="Leave blank to keep current" className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-11 text-white text-sm focus:border-brand-purple outline-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">Phone</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                            <input name="phone" defaultValue={editingTeacher.user.phone || ""} className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-11 text-white text-sm focus:border-brand-purple outline-none" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">Specialization / Department</label>
                                    <div className="relative">
                                        <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input name="specialization" required defaultValue={editingTeacher.specialization || ""} className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-11 text-white text-sm focus:border-brand-purple outline-none" />
                                    </div>
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="w-full py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-brand-pink to-brand-purple hover:neon-glow transition-all duration-300 flex items-center justify-center gap-2 mt-4 shadow-lg shadow-brand-pink/20 disabled:opacity-50"
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
