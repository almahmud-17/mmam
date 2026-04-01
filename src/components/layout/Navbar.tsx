"use client";

import Link from "next/link";
import { GraduationCap, LogIn } from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 32);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`w-full sticky top-0 z-50 transition-[background-color,box-shadow,border-color,backdrop-filter] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                isScrolled
                    ? "border-b border-foreground/[0.08] bg-background/65 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.14)] ring-1 ring-inset ring-white/15 backdrop-blur-3xl backdrop-saturate-150 dark:bg-background/50 dark:shadow-[0_8px_48px_-12px_rgba(0,0,0,0.55)] dark:ring-white/10 supports-[backdrop-filter]:bg-background/55 dark:supports-[backdrop-filter]:bg-background/40"
                    : "border-b border-transparent bg-card shadow-none"
            }`}
        >
            {/* Top Banner Section */}
            <div
                className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-[padding] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                    isScrolled ? "py-3 md:py-4" : "py-6"
                }`}
            >
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    
                    {/* Left: Logo */}
                    <Link href="/" className="flex items-center gap-3 shrink-0 group">
                        <motion.div 
                            whileHover={{ rotate: 5, scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-tr from-brand-pink to-brand-purple p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-lg group-hover:shadow-brand-pink/20 transition-all duration-300"
                        >
                            <GraduationCap className="w-10 h-10 md:w-14 md:h-14 text-white" />
                        </motion.div>
                    </Link>

                    {/* Center: Institution Names */}
                    <div className="flex flex-col items-center text-center max-w-2xl">
                        <motion.h1
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-madrasah-name text-2xl md:text-3xl font-bold text-foreground mb-2 leading-tight"
                        >
                            مدرسة محي شعبان عالم
                        </motion.h1>
                        <h2 className="font-madrasah-name text-xl md:text-2xl font-bold tracking-tight text-brand-purple mb-1">
                            মহিষাবান এম আলিম মাদরাসা
                        </h2>
                        <h3 className="font-madrasah-name text-lg md:text-xl font-bold tracking-[0.08em] uppercase text-foreground mb-2 drop-shadow-sm">
                            Mohishaban M Alim Madrasah
                        </h3>
                        <p className="text-xs md:text-sm font-medium text-foreground/80 mb-3">
                            Mohishaban, Gabtali, Bogura
                        </p>
                        
                        {/* Codes & Info */}
                        <div className="text-[10px] md:text-xs font-semibold text-foreground/70 flex flex-wrap justify-center gap-y-1 gap-x-2 md:gap-x-3 px-2">
                            <span className="font-bold text-foreground whitespace-nowrap">EIIN: 123456</span> <span className="hidden md:inline">|</span> 
                            <span className="whitespace-nowrap">কেন্দ্র কোড : ১৩০</span> <span className="hidden md:inline">|</span> 
                            <span className="whitespace-nowrap">মাদ্রাসা কোড : ১১২৪৬</span> <span className="hidden md:inline">|</span> 
                            <span className="text-brand-pink whitespace-nowrap">Hotline : 09617880099</span> <span className="hidden md:inline">|</span> 
                            <span className="text-brand-green whitespace-nowrap">Office Time: 8:00 AM - 5:00 PM</span>
                        </div>
                    </div>

                    {/* Right: Quick Actions */}
                    <div className="flex flex-row md:flex-col justify-center gap-2 shrink-0 w-full md:w-auto mt-4 md:mt-0">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 md:flex-none">
                            <Link href="/payment" className="block w-full px-6 py-2.5 rounded-xl text-sm font-bold text-foreground bg-foreground/5 hover:bg-foreground/10 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] text-center border border-foreground/10 shadow-sm backdrop-blur-md whitespace-nowrap">
                                Online Payment
                            </Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 md:flex-none">
                            <Link href="/admission" className="block w-full px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-pink to-brand-purple hover:shadow-lg hover:shadow-brand-pink/30 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] text-center shadow-md whitespace-nowrap">
                                Online Admission
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Bottom nav (glass comes from parent header when scrolled) */}
            <div className="w-full">
                <nav className="w-full bg-transparent py-0 transition-colors duration-300 ease-out">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-center md:justify-between h-14">
                            
                            {/* Links with scrolling visual aid */}
                            <div className="relative flex-1 overflow-hidden group/nav">
                                <div className="flex items-center justify-center gap-4 md:gap-8 overflow-x-auto whitespace-nowrap scrollbar-hide pr-8 font-bangla text-sm">
                                    {[
                                        { label: "হোম", href: "/" },
                                        { label: "পরিচিতি", href: "/about" },
                                        { label: "নোটিশ", href: "/notices" },
                                        { label: "একাডেমিক ক্যালেন্ডার", href: "/events" },
                                        { label: "রুটিন", href: "/routine" },
                                        { label: "গ্যালারি", href: "/gallery" },
                                        { label: "যোগাযোগ", href: "/contact" },
                                        { label: "বই", href: "/books" },
                                    ].map((link) => (
                                        <motion.div 
                                            key={link.href} 
                                            whileHover={{ y: -2 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                        >
                                            <Link href={link.href} className="font-bold text-foreground/80 hover:text-brand-pink transition-colors duration-300 ease-out relative group/link">
                                                {link.label}
                                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-pink transition-all duration-300 ease-out group-hover/link:w-full" />
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                                {/* Scroll edge masks for mobile */}
                                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-current via-transparent to-transparent text-background/10 pointer-events-none md:hidden" />
                            </div>

                            {/* Theme & Auth */}
                            <div className="flex items-center gap-2 md:gap-4 shrink-0 pl-3 md:pl-4 border-l border-foreground/10 ml-2">
                                <ThemeToggle />
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden xs:block">
                                    <Link href="/login" className="flex items-center gap-1.5 md:gap-2 text-sm font-bold font-bangla text-foreground/80 hover:text-brand-pink transition-colors duration-300 ease-out whitespace-nowrap">
                                        <LogIn className="w-4 h-4 md:w-5 md:h-5" /> 
                                        <span className="hidden sm:inline">লগইন</span>
                                    </Link>
                                </motion.div>
                            </div>
                            
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
}
