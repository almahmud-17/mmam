"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Plus, Trash2, Loader2, X, Upload } from "lucide-react";
import { useState, useEffect } from "react";

interface GalleryItem {
    id: string;
    title: string;
    imageUrl: string;
    description?: string;
    createdAt: string;
}

export default function AdminGalleryPage() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

    const fetchGallery = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/gallery`);
            const data = await response.json();
            if (data.success) setItems(data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGallery();
    }, []);

    const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.currentTarget);
        const title = formData.get("title");
        const imageUrl = formData.get("imageUrl");
        const description = formData.get("description");

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/api/gallery`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ title, imageUrl, description })
            });

            const data = await response.json();
            if (data.success) {
                setIsAdding(false);
                fetchGallery();
            } else {
                setError(data.error || "Failed to add item.");
            }
        } catch (err) {
            setError("Network error.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this gallery item?")) return;
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/api/gallery/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setItems(items.filter(item => item.id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-white mb-2">Gallery Management</h1>
                    <p className="text-gray-400">Add or remove photos and media from the madrasah gallery.</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-pink to-brand-purple text-white font-bold hover:neon-glow transition-all"
                >
                    <Plus className="w-5 h-5" /> Add Gallery Item
                </button>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 text-brand-pink animate-spin" />
                    <p className="text-gray-400">Loading gallery...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <motion.div
                            layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            key={item.id} className="glass rounded-3xl border border-white/5 overflow-hidden group relative"
                        >
                            <div className="aspect-video relative overflow-hidden">
                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="absolute top-4 right-4 p-2 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all backdrop-blur-md border border-red-500/30"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                {item.description && <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>}
                            </div>
                        </motion.div>
                    ))}
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
                                <ImageIcon className="text-brand-pink" /> Add To Gallery
                            </h2>
                            <form onSubmit={handleAdd} className="space-y-6">
                                {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Title</label>
                                    <input name="title" required className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white focus:border-brand-purple outline-none" placeholder="Event Name" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Image URL</label>
                                    <div className="relative">
                                        <Upload className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input name="imageUrl" required className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-16 pr-6 text-white focus:border-brand-purple outline-none" placeholder="https://..." />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Description (Optional)</label>
                                    <textarea name="description" className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white focus:border-brand-purple outline-none resize-none" rows={3} placeholder="Briefly describe the photo..." />
                                </div>
                                <button type="submit" className="w-full py-5 rounded-2xl text-lg font-bold text-white bg-gradient-to-r from-brand-pink to-brand-purple hover:neon-glow transition-all">
                                    Upload Item
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
