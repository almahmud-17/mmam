"use client";

import { motion } from "framer-motion";
import { Search, Image as ImageIcon, Calendar, Filter, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

interface GalleryItem {
    id: string;
    title: string;
    url: string;
    description: string | null;
    createdAt: string;
}

export default function GalleryPage() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/gallery`);
                const data = await response.json();
                if (data.success) {
                    setItems(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch gallery:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchGallery();
    }, []);

    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Hero Section */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-pink/10 border border-brand-pink/20 text-brand-pink text-sm font-bold uppercase tracking-widest"
                    >
                        <ImageIcon className="w-4 h-4" />
                        Campus Life
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-heading font-extrabold text-foreground dark:text-white"
                    >
                        Our <span className="text-gradient">Gallery</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-foreground/60 dark:text-gray-400 text-lg max-w-2xl mx-auto font-bangla"
                    >
                        মহিষাবান এম আলিম মাদরাসার ক্যাম্পাস, অনুষ্ঠান ও শিক্ষা কার্যক্রমের কিছু বিশেষ মুহূর্ত।
                    </motion.p>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-foreground/5 dark:bg-white/5 p-4 rounded-3xl border border-foreground/15 dark:border-white/10 backdrop-blur-md">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50 dark:text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search moments..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-foreground/5 dark:bg-background/40 border border-foreground/15 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-6 text-foreground dark:text-white text-sm focus:outline-none focus:border-brand-purple transition-all placeholder:text-gray-600"
                        />
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        {["All", "Events", "Campus", "Sports", "Academic"].map((cat) => (
                            <button
                                key={cat}
                                className="whitespace-nowrap px-6 py-2.5 rounded-xl bg-foreground/5 dark:bg-white/5 hover:bg-foreground/10 dark:bg-white/10 border border-foreground/10 dark:border-white/5 text-foreground/60 dark:text-gray-400 hover:text-foreground dark:text-white text-sm font-semibold transition-all"
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Gallery Grid */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <Loader2 className="w-12 h-12 text-brand-pink animate-spin" />
                        <p className="text-foreground/60 dark:text-gray-400 font-medium">Coming into focus...</p>
                    </div>
                ) : filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredItems.map((item, i) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => setSelectedImage(item.url)}
                                className="group relative aspect-[4/3] rounded-3xl overflow-hidden cursor-zoom-in"
                            >
                                <Image
                                    src={item.url}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                                    <h3 className="text-xl font-bold text-foreground dark:text-white mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        {item.title}
                                    </h3>
                                    {item.description && (
                                        <p className="text-foreground/70 dark:text-gray-300 text-sm line-clamp-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                                            {item.description}
                                        </p>
                                    )}
                                    <div className="mt-4 flex items-center gap-2 text-brand-pink text-xs font-bold uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <div className="p-6 rounded-full bg-foreground/5 dark:bg-white/5">
                            <ImageIcon className="w-12 h-12 text-gray-700" />
                        </div>
                        <p className="text-foreground/50 dark:text-gray-500 text-lg font-bangla">
                            এখনো কোনো গ্যালারির ছবি যোগ করা হয়নি। Admin panel থেকে নতুন ছবি যোগ করুন।
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <div className="p-6 rounded-full bg-foreground/5 dark:bg-white/5">
                            <ImageIcon className="w-12 h-12 text-gray-700" />
                        </div>
                        <p className="text-foreground/50 dark:text-gray-500 text-lg">No gallery items found.</p>
                    </div>
                )}
            </div>

            {/* Lightbox Alternative */}
            {selectedImage && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="fixed inset-0 z-[100] bg-background/95 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl">
                        <Image src={selectedImage} alt="Fullscreen" fill className="object-contain" />
                    </div>
                    <button aria-label="Close gallery preview" className="absolute top-8 right-8 text-foreground dark:text-white hover:text-brand-pink transition-colors">
                        <X className="w-8 h-8" />
                    </button>
                </motion.div>
            )}
        </div>
    );
}

const X = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
);
