"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bell, Plus, Trash2, Loader2, X, AlertTriangle, FileText, Info } from "lucide-react";
import { useState, useEffect } from "react";

interface Notice {
    id: string;
    title: string;
    content: string;
    type: string;
    createdAt: string;
}

export default function AdminNoticesPage() {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

    const fetchNotices = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/notices`);
            const data = await response.json();
            if (data.success) setNotices(data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.currentTarget);
        const title = formData.get("title");
        const content = formData.get("content");
        const type = formData.get("type");

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/api/notices`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ title, content, type })
            });

            const data = await response.json();
            if (data.success) {
                setIsAdding(false);
                fetchNotices();
            } else {
                setError(data.error || "Failed to add notice.");
            }
        } catch (err) {
            setError("Network error.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this notice?")) return;
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/api/notices/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setNotices(notices.filter(n => n.id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "EMERGENCY": return <AlertTriangle className="w-5 h-5 text-red-500" />;
            case "ACADEMIC": return <FileText className="w-5 h-5 text-brand-purple" />;
            default: return <Info className="w-5 h-5 text-brand-pink" />;
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-white mb-2">Notice Management</h1>
                    <p className="text-gray-400">Post announcements and important updates for students and teachers.</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-pink to-brand-purple text-white font-bold hover:neon-glow transition-all"
                >
                    <Plus className="w-5 h-5" /> Post New Notice
                </button>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 text-brand-pink animate-spin" />
                    <p className="text-gray-400">Loading notices...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notices.map((notice) => (
                        <motion.div
                            layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                            key={notice.id} className="glass p-6 md:p-8 rounded-[32px] border border-white/5 flex flex-col md:flex-row gap-6 relative overflow-hidden group"
                        >
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                                        {getTypeIcon(notice.type)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-0.5">{notice.title}</h3>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{new Date(notice.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="text-gray-400 leading-relaxed font-bangla">
                                    {notice.content}
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-3 min-w-[120px]">
                                <button
                                    onClick={() => handleDelete(notice.id)}
                                    className="p-3 text-gray-500 hover:text-red-500 bg-white/5 hover:bg-red-500/10 rounded-2xl transition-all border border-transparent hover:border-red-500/20"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                    {notices.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <Bell className="w-12 h-12 text-gray-600" />
                            <p className="text-gray-400">No notices posted yet.</p>
                        </div>
                    )}
                </div>
            )}

            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsAdding(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass w-full max-w-xl p-8 rounded-[40px] border-white/10 relative z-10"
                        >
                            <button onClick={() => setIsAdding(false)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white bg-white/5 rounded-xl transition-all">
                                <X className="w-6 h-6" />
                            </button>
                            <h2 className="text-3xl font-heading font-bold text-white mb-8 flex items-center gap-3">
                                <Bell className="text-brand-pink" /> Create Notice
                            </h2>
                            <form onSubmit={handleAdd} className="space-y-6">
                                {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Title</label>
                                    <input name="title" required className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white focus:border-brand-purple outline-none" placeholder="Notice Title" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Notice Content</label>
                                    <textarea name="content" required className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white focus:border-brand-purple outline-none resize-none font-bangla" rows={4} placeholder="Write notice content here..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Category</label>
                                    <select name="type" required className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white focus:border-brand-purple outline-none appearance-none cursor-pointer">
                                        <option value="GENERAL" className="bg-card">General Notice</option>
                                        <option value="ACADEMIC" className="bg-card">Academic Update</option>
                                        <option value="EMERGENCY" className="bg-card">Emergency Announcement</option>
                                    </select>
                                </div>
                                <button type="submit" className="w-full py-5 rounded-2xl text-lg font-bold text-white bg-gradient-to-r from-brand-pink to-brand-purple hover:neon-glow transition-all">
                                    Post Notice
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
