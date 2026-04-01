"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Shield, User, GraduationCap, Lock, Loader2, Search, Check, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

type Tab = "admin" | "teachers" | "students";

interface UserItem {
    id: string;
    name: string;
    email: string;
    profileId: string;
}

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState<Tab>("admin");

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-heading font-bold text-foreground dark:text-white mb-2">
                    <span className="hidden dark:inline">Account Settings</span>
                    <span className="inline dark:hidden text-gradient-premium">Account Settings</span>
                </h1>
                <p className="text-foreground/60">Manage passwords for admin, teacher, and student accounts.</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 bg-background/5 dark:bg-white/5 p-1.5 rounded-2xl border border-border w-fit">
                {([
                    { key: "admin" as Tab, label: "My Password", icon: Shield },
                    { key: "teachers" as Tab, label: "Teacher Passwords", icon: GraduationCap },
                    { key: "students" as Tab, label: "Student Passwords", icon: User },
                ]).map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-200 ${
                            activeTab === key
                                ? "bg-gradient-to-r from-brand-pink to-brand-purple text-white shadow-lg shadow-brand-pink/20"
                                : "text-foreground/50 hover:text-foreground hover:bg-foreground/5 dark:hover:bg-white/5"
                        }`}
                    >
                        <Icon className="w-4 h-4" />
                        {label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                {activeTab === "admin" && <AdminPasswordTab key="admin" />}
                {activeTab === "teachers" && <ResetPasswordTab key="teachers" role="teachers" />}
                {activeTab === "students" && <ResetPasswordTab key="students" role="students" />}
            </AnimatePresence>
        </div>
    );
}

// ─── Admin Password Change ─────────────────────────────────────
function AdminPasswordTab() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (newPassword.length < 6) {
            setMessage({ type: "error", text: "New password must be at least 6 characters." });
            return;
        }
        if (newPassword !== confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match." });
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await api.post("/api/admin/change-password", {
                currentPassword,
                newPassword,
                confirmPassword,
            });
            setMessage({ type: "success", text: res.data?.message || "Password changed successfully!" });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            setMessage({ type: "error", text: err.message || "Failed to change password." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="glass rounded-3xl border border-border p-8 md:p-10"
        >
            <div className="mb-8">
                <h2 className="text-xl font-heading font-bold text-foreground dark:text-white flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-gradient-to-tr from-brand-pink to-brand-purple">
                        <Lock className="w-5 h-5 text-white" />
                    </div>
                    Change Admin Password
                </h2>
                <p className="text-foreground/60 text-sm">Update your own admin account password.</p>
            </div>

            {/* Feedback Message */}
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        className={`mb-6 p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${
                            message.type === "success"
                                ? "bg-green-500/10 border border-green-500/20 text-green-500"
                                : "bg-red-500/10 border border-red-500/20 text-red-400"
                        }`}
                    >
                        {message.type === "success" ? <Check className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground/40 uppercase tracking-widest pl-1">Current Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                        <input
                            type="password" required value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-background/5 dark:bg-background/40 border border-border rounded-xl py-3 pl-11 text-foreground text-sm focus:outline-none focus:border-brand-purple transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground/40 uppercase tracking-widest pl-1">New Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                        <input
                            type="password" required value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Minimum 6 characters"
                            className="w-full bg-background/5 dark:bg-background/40 border border-border rounded-xl py-3 pl-11 text-foreground text-sm focus:outline-none focus:border-brand-purple transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground/40 uppercase tracking-widest pl-1">Confirm New Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                        <input
                            type="password" required value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter new password"
                            className="w-full bg-background/5 dark:bg-background/40 border border-border rounded-xl py-3 pl-11 text-foreground text-sm focus:outline-none focus:border-brand-purple transition-all"
                        />
                    </div>
                </div>

                <button
                    type="submit" disabled={isSubmitting}
                    className="w-full py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-brand-pink to-brand-purple hover:neon-glow transition-all duration-300 flex items-center justify-center gap-2 mt-4 shadow-lg shadow-brand-pink/20 disabled:opacity-50"
                >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Change Password"}
                </button>
            </form>
        </motion.div>
    );
}

// ─── Teacher / Student Password Reset ──────────────────────────
function ResetPasswordTab({ role }: { role: "teachers" | "students" }) {
    const [users, setUsers] = useState<UserItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selected, setSelected] = useState<UserItem | null>(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const endpoint = role === "teachers" ? "/api/teachers" : "/api/students";
                const res = await api.get(endpoint);
                if (res.success) {
                    const items: UserItem[] = (res.data || []).map((item: any) => ({
                        id: item.id,
                        name: item.user?.name || "Unknown",
                        email: item.user?.email || "",
                        profileId: item.id,
                    }));
                    setUsers(items);
                }
            } catch {
                // ignore
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, [role]);

    const filteredUsers = users.filter(
        (u) =>
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selected) return;
        setMessage(null);

        if (newPassword.length < 6) {
            setMessage({ type: "error", text: "Password must be at least 6 characters." });
            return;
        }
        if (newPassword !== confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match." });
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await api.post(`/api/admin/${role}/${selected.profileId}/reset-password`, {
                newPassword,
                confirmPassword,
            });
            setMessage({ type: "success", text: res.data?.message || `Password reset for ${selected.name}.` });
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            setMessage({ type: "error", text: err.message || "Failed to reset password." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const label = role === "teachers" ? "Teacher" : "Student";

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="glass rounded-3xl border border-border p-8 md:p-10"
        >
            <div className="mb-8">
                <h2 className="text-xl font-heading font-bold text-foreground dark:text-white flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-gradient-to-tr from-brand-pink to-brand-purple">
                        {role === "teachers" ? <GraduationCap className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
                    </div>
                    Reset {label} Password
                </h2>
                <p className="text-foreground/60 text-sm">Select a {label.toLowerCase()} and set a new password for their account.</p>
            </div>

            {/* Feedback Message */}
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        className={`mb-6 p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${
                            message.type === "success"
                                ? "bg-green-500/10 border border-green-500/20 text-green-500"
                                : "bg-red-500/10 border border-red-500/20 text-red-400"
                        }`}
                    >
                        {message.type === "success" ? <Check className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* User Selection */}
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                        <input
                            type="text" value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={`Search ${label.toLowerCase()}s by name or email...`}
                            className="w-full bg-background/5 dark:bg-background/40 border border-border rounded-xl py-3 pl-11 pr-4 text-foreground text-sm focus:outline-none focus:border-brand-purple transition-all"
                        />
                    </div>

                    <div className="max-h-[300px] overflow-y-auto space-y-1.5 scrollbar-thin pr-1">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 text-brand-pink animate-spin" />
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <p className="text-foreground/40 text-sm text-center py-8">No {label.toLowerCase()}s found.</p>
                        ) : (
                            filteredUsers.map((u) => (
                                <button
                                    key={u.id}
                                    onClick={() => { setSelected(u); setMessage(null); }}
                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all border ${
                                        selected?.id === u.id
                                            ? "bg-brand-purple/10 border-brand-purple/30 text-foreground"
                                            : "border-transparent hover:bg-foreground/5 dark:hover:bg-white/5 text-foreground/70"
                                    }`}
                                >
                                    <p className="font-semibold">{u.name}</p>
                                    <p className="text-[11px] text-foreground/40">{u.email}</p>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Password Form */}
                <div>
                    {selected ? (
                        <form onSubmit={handleReset} className="space-y-5">
                            <div className="p-4 rounded-xl bg-brand-purple/5 border border-brand-purple/10">
                                <p className="text-xs text-foreground/40 font-semibold uppercase tracking-widest mb-1">Selected {label}</p>
                                <p className="font-bold text-foreground">{selected.name}</p>
                                <p className="text-xs text-foreground/40">{selected.email}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-foreground/40 uppercase tracking-widest pl-1">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                                    <input
                                        type="password" required value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Minimum 6 characters"
                                        className="w-full bg-background/5 dark:bg-background/40 border border-border rounded-xl py-3 pl-11 text-foreground text-sm focus:outline-none focus:border-brand-purple transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-foreground/40 uppercase tracking-widest pl-1">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                                    <input
                                        type="password" required value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Re-enter password"
                                        className="w-full bg-background/5 dark:bg-background/40 border border-border rounded-xl py-3 pl-11 text-foreground text-sm focus:outline-none focus:border-brand-purple transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit" disabled={isSubmitting}
                                className="w-full py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-brand-pink to-brand-purple hover:neon-glow transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-brand-pink/20 disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : `Reset ${selected.name.split(" ")[0]}'s Password`}
                            </button>
                        </form>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full py-12 text-foreground/30">
                            <User className="w-12 h-12 mb-4" />
                            <p className="font-medium text-sm">Select a {label.toLowerCase()} to reset their password.</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
