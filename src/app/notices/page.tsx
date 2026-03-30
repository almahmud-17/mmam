"use client";

import { motion } from "framer-motion";
import { Search, Bell, Calendar, ChevronRight, FileText, AlertTriangle, Info, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Notice {
    id: string;
    title: string;
    content: string;
    type: "GENERAL" | "ACADEMIC" | "EMERGENCY";
    createdAt: string;
}

export default function NoticesPage() {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/notices`);
                const data = await response.json();
                if (data.success) {
                    setNotices(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch notices:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNotices();
    }, []);

    const filteredNotices = notices.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getTypeStyles = (type: string) => {
        switch (type) {
            case "EMERGENCY": return "bg-red-500/10 text-red-400 border-red-500/20";
            case "ACADEMIC": return "bg-brand-purple/10 text-brand-purple border-brand-purple/20";
            default: return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "EMERGENCY": return <AlertTriangle className="w-4 h-4" />;
            case "ACADEMIC": return <FileText className="w-4 h-4" />;
            default: return <Info className="w-4 h-4" />;
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-5xl mx-auto space-y-12">

                {/* Hero Section */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-sm font-bold uppercase tracking-widest"
                    >
                        <Bell className="w-4 h-4 animate-bounce" />
                        Notice Board
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-heading font-extrabold text-foreground dark:text-white"
                    >
                        Notices & <span className="text-gradient">Announcements</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-foreground/60 dark:text-gray-400 text-lg max-w-2xl mx-auto font-bangla"
                    >
                        মহিষাবান এম আলিম মাদরাসার সকল প্রাতিষ্ঠানিক ও একাডেমিক খবরাখবর এবং জরুরি নোটিশসমূহ এখানে পাবেন।
                    </motion.p>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-2xl mx-auto">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50 dark:text-gray-500 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search for notices, exams, or holidays..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-foreground/5 dark:bg-white/5 border border-foreground/15 dark:border-white/10 rounded-3xl py-5 pl-14 pr-8 text-foreground dark:text-white text-lg focus:outline-none focus:border-brand-pink transition-all backdrop-blur-md shadow-2xl"
                    />
                </div>

                {/* Notice List */}
                <div className="space-y-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-10 h-10 text-brand-purple animate-spin" />
                            <p className="text-foreground/60 dark:text-gray-400 font-medium font-bangla">নোটিশ লোড হচ্ছে...</p>
                        </div>
                    ) : filteredNotices.length > 0 ? (
                        filteredNotices.map((notice, i) => (
                            <motion.div
                                key={notice.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group glass p-6 md:p-8 rounded-[2rem] border border-foreground/10 dark:border-white/5 hover:border-brand-purple/30 transition-all duration-500 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/5 blur-[50px] -z-10 group-hover:bg-brand-purple/10 transition-colors" />

                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                    <div className="space-y-4 flex-1">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border flex items-center gap-2 ${getTypeStyles(notice.type)}`}>
                                                {getTypeIcon(notice.type)}
                                                {notice.type}
                                            </span>
                                            <span className="text-foreground/50 dark:text-gray-500 text-xs font-medium flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(notice.createdAt).toLocaleDateString("en-US", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric"
                                                })}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-foreground dark:text-white mb-3 group-hover:text-brand-purple transition-colors">
                                                {notice.title}
                                            </h3>
                                            <p className="text-foreground/60 dark:text-gray-400 leading-relaxed font-bangla whitespace-pre-wrap">
                                                {notice.content}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <button aria-label="Open notice" className="p-4 rounded-2xl bg-foreground/5 dark:bg-white/5 text-foreground/60 dark:text-gray-400 group-hover:bg-brand-purple group-hover:text-white transition-all duration-300 transform group-hover:translate-x-1 shadow-xl">
                                            <ChevronRight className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : filteredNotices.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <Bell className="w-12 h-12 text-gray-600" />
                            <p className="text-foreground/60 dark:text-gray-400 font-bangla text-base">
                                বর্তমানে কোনো নোটিশ পাওয়া যায়নি। Admin panel থেকে নতুন নোটিশ যোগ করুন।
                            </p>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-foreground/5 dark:bg-white/5 rounded-[2.5rem] border border-dashed border-foreground/15 dark:border-white/10">
                            <div className="p-6 rounded-full bg-foreground/5 dark:bg-white/5 inline-block mb-4">
                                <FileText className="w-12 h-12 text-gray-700" />
                            </div>
                            <p className="text-foreground/50 dark:text-gray-500 text-lg font-bangla">বর্তমানে কোনো নোটিশ পাওয়া যায়নি।</p>
                        </div>
                    )}
                </div>

                {/* Archive Button */}
                <div className="text-center">
                    <button className="px-8 py-4 rounded-2xl bg-foreground/5 dark:bg-white/5 hover:bg-foreground/10 dark:bg-white/10 border border-foreground/15 dark:border-white/10 text-foreground dark:text-white font-bold transition-all flex items-center gap-3 mx-auto group">
                        View Notice Archive
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

            </div>
        </div>
    );
}
