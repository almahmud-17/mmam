"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Trash2, Mail, User, Clock, CheckCircle2, Circle, Loader2, Search } from "lucide-react";
import { useState, useEffect } from "react";

interface ContactRequest {
    id: string;
    name: string;
    email: string;
    message: string;
    createdAt: string;
    isRead: boolean;
}

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<ContactRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

    const fetchMessages = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/api/contacts`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setMessages(data.data);
            } else {
                setError(data.error || "Failed to fetch messages.");
            }
        } catch (err) {
            setError("Network error.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const toggleRead = async (id: string, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/api/contacts/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ isRead: !currentStatus })
            });
            const data = await response.json();
            if (data.success) {
                setMessages(messages.map(m => m.id === id ? { ...m, isRead: !currentStatus } : m));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const deleteMessage = async (id: string) => {
        if (!confirm("Delete this message?")) return;
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/api/contacts/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setMessages(messages.filter(m => m.id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const filteredMessages = messages.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-foreground dark:text-foreground dark:text-white mb-2">
                        <span className="hidden dark:inline">Message Center</span>
                        <span className="inline dark:hidden text-gradient-premium">Message Center</span>
                    </h1>
                    <p className="text-foreground/60">View and manage inquiries from the public contact form.</p>
                </div>
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                    {error}
                </div>
            )}

            <div className="glass rounded-3xl border border-border overflow-hidden min-h-[500px]">
                <div className="p-4 md:p-6 border-b border-border bg-background/5 dark:bg-foreground/5 dark:bg-background/40">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search messages..."
                            className="w-full bg-background/5 dark:bg-card border border-border rounded-lg py-2.5 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:border-brand-purple transition-colors"
                        />
                    </div>
                </div>

                <div className="divide-y divide-border">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-10 h-10 text-brand-pink animate-spin" />
                            <p className="text-foreground/40">Loading messages...</p>
                        </div>
                    ) : filteredMessages.length > 0 ? (
                        filteredMessages.map((msg, i) => (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                key={msg.id}
                                className={`p-6 flex flex-col md:flex-row gap-6 transition-colors ${msg.isRead ? 'opacity-60 grayscale-[0.5]' : 'bg-background/5 dark:bg-white/[0.02]'}`}
                            >
                                <div className="flex-1 space-y-4">
                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                                            <User className="w-4 h-4 text-brand-pink" />
                                            {msg.name}
                                        </div>
                                        <div className="flex items-center gap-2 text-foreground/60 text-xs font-medium">
                                            <Mail className="w-4 h-4" />
                                            {msg.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-foreground/40 text-[10px] font-medium uppercase tracking-wider">
                                            <Clock className="w-3.5 h-3.5" />
                                            {new Date(msg.createdAt).toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="text-foreground/80 text-base leading-relaxed bg-background/5 dark:bg-foreground/5 dark:bg-white/5 p-4 rounded-2xl border border-border">
                                        {msg.message}
                                    </div>
                                </div>

                                <div className="flex md:flex-col items-center justify-end gap-3 min-w-[120px]">
                                    <button
                                        onClick={() => toggleRead(msg.id, msg.isRead)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${msg.isRead
                                            ? 'bg-background/5 dark:bg-foreground/5 dark:bg-white/5 text-foreground/40 border-border hover:bg-background/10 dark:hover:bg-foreground/10 dark:bg-white/10'
                                            : 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20'
                                            }`}
                                    >
                                        {msg.isRead ? <Circle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                        {msg.isRead ? 'Mark Unread' : 'Mark Read'}
                                    </button>
                                    <button
                                        onClick={() => deleteMessage(msg.id)}
                                        className="p-2.5 text-foreground/40 hover:text-red-500 bg-background/5 dark:bg-foreground/5 dark:bg-white/5 hover:bg-red-500/10 rounded-xl transition-all border border-border hover:border-red-500/20"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <MessageSquare className="w-12 h-12 text-foreground/20" />
                            <p className="text-foreground/40">No inquiries found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
