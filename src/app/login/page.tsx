"use client";

import { motion } from "framer-motion";
import { GraduationCap, ArrowRight, Lock, User, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [role, setRole] = useState<"student" | "teacher" | "admin">("student");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        // Use base URL from environment or default to local for preview
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!data.success) {
                setError(data.error ?? "Login failed. Please check your credentials.");
                return;
            }

            // Store token
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Redirect based on role
            const userRole = data.user.role;
            if (userRole === "ADMIN") router.push("/admin");
            else if (userRole === "TEACHER") router.push("/teacher");
            else if (userRole === "STUDENT") router.push("/student");

        } catch (err) {
            setError("Network error. Make sure the backend server is running.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh_-_80px)] flex items-center justify-center py-20 px-4 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-pink/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[120px] -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="w-full max-w-lg glass p-8 md:p-10 rounded-3xl relative"
            >
                <div className="absolute inset-0 rounded-3xl border border-foreground/15 dark:border-white/10 [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none" />

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-brand-pink to-brand-purple mb-4 shadow-[0_0_30px_rgba(255,45,125,0.4)]">
                        <GraduationCap className="w-8 h-8 text-foreground dark:text-white" />
                    </div>
                    <h2 className="text-3xl font-heading font-extrabold text-foreground dark:text-white mb-2">Welcome Back</h2>
                    <p className="text-foreground/60 dark:text-gray-400 text-sm">Please select your role and sign in to continue.</p>
                </div>

                {/* Role Selector */}
                <div className="flex bg-foreground/5 dark:bg-background/40 p-1 rounded-xl mb-8">
                    {(["student", "teacher", "admin"] as const).map((r) => (
                        <button
                            key={r}
                            onClick={() => setRole(r)}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg capitalize transition-all duration-300 ${role === r ? "bg-card text-foreground dark:text-white shadow-lg" : "text-foreground/50 dark:text-gray-500 hover:text-foreground dark:text-white"
                                }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>

                {/* Error Alert */}
                {error && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                        {error}
                    </motion.div>
                )}

                {/* Login Form */}
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-xs font-semibold text-foreground/60 dark:text-gray-400 uppercase tracking-wider mb-2">
                            {role === "student" ? "Student ID / Email" : "Email Address"}
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                {role === "student" ? <User className="h-5 w-5 text-foreground/50 dark:text-gray-500" /> : <Mail className="h-5 w-5 text-foreground/50 dark:text-gray-500" />}
                            </div>
                            <input
                                name="email"
                                required
                                type={role === "student" ? "text" : "email"}
                                className="w-full bg-foreground/5 dark:bg-background/40 border border-foreground/10 dark:border-white/5 rounded-xl py-3 pl-11 pr-4 text-foreground dark:text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple/50 transition-all font-medium"
                                placeholder={role === "student" ? "Enter your ID or Email" : "admin@school.com"}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-semibold text-foreground/60 dark:text-gray-400 uppercase tracking-wider">Password</label>
                            <Link href="#" className="text-xs text-brand-pink hover:text-brand-purple transition-colors font-medium">Forgot Password?</Link>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-foreground/50 dark:text-gray-500" />
                            </div>
                            <input
                                name="password"
                                required
                                type="password"
                                className="w-full bg-foreground/5 dark:bg-background/40 border border-foreground/10 dark:border-white/5 rounded-xl py-3 pl-11 pr-4 text-foreground dark:text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple/50 transition-all font-medium"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-brand-pink to-brand-purple hover:neon-glow transition-all duration-300 flex items-center justify-center gap-2 mt-4 group disabled:opacity-50"
                    >
                        {isLoading ? "Signing In..." : "Sign In to Portal"}
                        {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <p className="text-center text-sm text-foreground/60 dark:text-gray-400 mt-8">
                    Don&apos;t have an account?{" "}
                    <Link href="/admission" className="text-foreground dark:text-white hover:text-brand-pink font-semibold transition-colors">Apply for Admission</Link>
                </p>
            </motion.div>
        </div>
    );
}

