"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name");
        const email = formData.get("email");
        const message = formData.get("message");

        try {
            const response = await fetch(`${API_BASE_URL}/api/contacts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message }),
            });

            const data = await response.json();
            if (data.success) {
                setIsSent(true);
                e.currentTarget.reset();
            } else {
                setError(data.error || "Something went wrong. Please try again.");
            }
        } catch (err) {
            setError("Network error. Could not connect to the server.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-black -z-50" />
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-pink/10 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[120px] -z-10 animate-pulse delay-1000" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Left: Contact Info */}
                    <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="space-y-12">
                        <div>
                            <motion.span variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 border-brand-pink/30 text-sm font-bold text-gradient uppercase tracking-widest">
                                Get In Touch
                            </motion.span>
                            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-heading font-extrabold text-white leading-tight mb-6">
                                Contact Our <br />
                                <span className="text-gradient drop-shadow-[0_0_15px_rgba(255,45,125,0.3)]">Admissions Office</span>
                            </motion.h1>
                            <motion.p variants={fadeInUp} className="text-lg text-gray-400 max-w-lg leading-relaxed font-bangla">
                                আমাদের মাদরাসা ম্যানেজমেন্ট সিস্টেম বা ভর্তি সংক্রান্ত যেকোনো জিজ্ঞাসার জন্য আমাদের সাথে যোগাযোগ করুন।
                            </motion.p>
                        </div>

                        <div className="space-y-6">
                            {[
                                { icon: Mail, label: "Email Us", val: "contact@mohishaban.edu.bd", sub: "Response within 24 hours" },
                                { icon: Phone, label: "Call Us", val: "+880 1711 000 000", sub: "Available 9 AM - 5 PM" },
                                { icon: MapPin, label: "Visit Us", val: "Mohishaban, Bogura, Bangladesh", sub: "Main Campus" },
                            ].map((item, i) => (
                                <motion.div
                                    key={i} variants={fadeInUp}
                                    className="flex items-start gap-5 glass p-6 rounded-3xl border-white/5 hover:border-brand-purple/30 group transition-all"
                                >
                                    <div className="p-4 rounded-2xl bg-gradient-to-tr from-brand-pink/10 to-brand-purple/10 border border-white/5 group-hover:scale-110 transition-transform">
                                        <item.icon className="w-6 h-6 text-brand-purple group-hover:text-brand-pink" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{item.label}</p>
                                        <p className="text-xl font-bold text-white mb-0.5">{item.val}</p>
                                        <p className="text-sm text-gray-500">{item.sub}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right: Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="glass p-8 md:p-12 rounded-[40px] border-white/5 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-brand-pink to-brand-purple opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="mb-10 flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-brand-pink/20">
                                    <MessageSquare className="w-6 h-6 text-brand-pink" />
                                </div>
                                <h2 className="text-3xl font-heading font-bold text-white tracking-tight">Send a Message</h2>
                            </div>

                            <AnimatePresence mode="wait">
                                {isSent ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                        className="py-12 flex flex-col items-center justify-center text-center gap-6"
                                    >
                                        <div className="w-24 h-24 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center animate-bounce">
                                            <CheckCircle2 className="w-12 h-12 text-green-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-2">Message Received!</h3>
                                            <p className="text-gray-400">Thank you for reaching out. <br /> Our team will get back to you shortly.</p>
                                        </div>
                                        <button
                                            onClick={() => setIsSent(false)}
                                            className="px-8 py-3 rounded-full glass hover:bg-white/10 text-white font-bold transition-all flex items-center gap-2"
                                        >
                                            Send Another Message <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-400 ml-1 uppercase tracking-widest text-[10px]">Full Name</label>
                                            <input
                                                name="name" required
                                                placeholder="Enter your name"
                                                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white text-lg focus:outline-none focus:border-brand-purple transition-all placeholder:text-gray-600"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-400 ml-1 uppercase tracking-widest text-[10px]">Email Address</label>
                                            <input
                                                name="email" type="email" required
                                                placeholder="yourname@domain.com"
                                                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white text-lg focus:outline-none focus:border-brand-purple transition-all placeholder:text-gray-600"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-400 ml-1 uppercase tracking-widest text-[10px]">Message Details</label>
                                            <textarea
                                                name="message" required rows={5}
                                                placeholder="Tell us what you need help with..."
                                                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white text-lg focus:outline-none focus:border-brand-purple transition-all placeholder:text-gray-600 resize-none font-bangla"
                                            ></textarea>
                                        </div>

                                        {error && (
                                            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                                                {error}
                                            </div>
                                        )}

                                        <button
                                            disabled={isSubmitting}
                                            type="submit"
                                            className="w-full py-5 rounded-2xl text-xl font-extrabold text-white bg-gradient-to-r from-brand-pink to-brand-purple hover:neon-glow transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
                                        >
                                            {isSubmitting ? <Loader2 className="w-8 h-8 animate-spin" /> : <>Send Your Message <Send className="w-6 h-6" /></>}
                                        </button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
