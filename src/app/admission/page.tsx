"use client";

import { motion } from "framer-motion";
import { GraduationCap, ArrowRight, User, Mail, Phone, BookOpen, MapPin } from "lucide-react";

export default function AdmissionPage() {
    return (
        <div className="min-h-screen py-24 px-4 relative overflow-hidden">
            {/* Background glow effects */}
            <div className="absolute top-32 left-0 w-96 h-96 bg-brand-pink/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="absolute bottom-32 right-0 w-96 h-96 bg-brand-purple/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex p-4 rounded-2xl bg-white/5 border border-white/10 mb-6">
                        <GraduationCap className="w-10 h-10 text-brand-pink" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-4">
                        Student <span className="text-gradient">Admission</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto font-bangla">
                        মহিষাবান এম আলিম মাদরাসায় নতুন শিক্ষাবর্ষে ভর্তির জন্য নিচের ফর্মটি সঠিকভাবে পূরণ করুন।
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                    className="glass p-8 md:p-12 rounded-3xl border border-white/10 relative"
                >
                    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* First Name */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">First Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User className="h-5 w-5 text-gray-500" /></div>
                                    <input type="text" className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-white focus:ring-2 focus:ring-brand-purple/50 transition-all" placeholder="John" />
                                </div>
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Last Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User className="h-5 w-5 text-gray-500" /></div>
                                    <input type="text" className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-white focus:ring-2 focus:ring-brand-purple/50 transition-all" placeholder="Doe" />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-500" /></div>
                                    <input type="email" className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-white focus:ring-2 focus:ring-brand-purple/50 transition-all" placeholder="john@example.com" />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Phone Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Phone className="h-5 w-5 text-gray-500" /></div>
                                    <input type="tel" className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-white focus:ring-2 focus:ring-brand-purple/50 transition-all" placeholder="+880 1..." />
                                </div>
                            </div>

                            {/* Class Selection */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Admission For Class</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><BookOpen className="h-5 w-5 text-gray-500" /></div>
                                    <select className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-white focus:ring-2 focus:ring-brand-purple/50 transition-all appearance-none cursor-pointer">
                                        <option value="" className="bg-card text-gray-400">Select a Class</option>
                                        {[6, 7, 8, 9, 10].map(c => (
                                            <option key={c} value={c} className="bg-card">Class {c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Current Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><MapPin className="h-5 w-5 text-gray-500" /></div>
                                    <input type="text" className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-white focus:ring-2 focus:ring-brand-purple/50 transition-all" placeholder="City, Region" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/10">
                            <button className="w-full md:w-auto px-10 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-brand-pink to-brand-purple hover:neon-glow transition-all duration-300 flex items-center justify-center gap-2 group mx-auto">
                                Submit Application
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                    </form>
                </motion.div>
            </div>
        </div>
    );
}
