"use client";

import { motion } from "framer-motion";
import { CreditCard, Smartphone, ShieldCheck, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function PaymentPage() {
    const [copiedContent, setCopiedContent] = useState<string | null>(null);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedContent(text);
        setTimeout(() => setCopiedContent(null), 2000);
    };

    const paymentMethods = [
        {
            name: "bKash",
            number: "01714923634",
            type: "Personal",
            bgColor: "bg-[#E2136E]",
            textColor: "text-[#E2136E]",
            lightBg: "bg-[#E2136E]/10",
        },
        {
            name: "Nagad",
            number: "01714923634",
            type: "Personal",
            bgColor: "bg-[#F37021]",
            textColor: "text-[#F37021]",
            lightBg: "bg-[#F37021]/10",
        }
    ];

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center relative">
            {/* Background elements */}
            <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-brand-pink/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-brand-purple/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <div className="max-w-3xl w-full mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-sm font-bold uppercase tracking-widest leading-none"
                    >
                        <CreditCard className="w-4 h-4" />
                        Online Payment
                    </motion.div>
                    
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-heading font-extrabold text-foreground dark:text-white"
                    >
                        অনলাইন পেমেন্ট <span className="text-gradient drop-shadow-[0_0_15px_rgba(255,45,125,0.3)]">নির্দেশিকা</span>
                    </motion.h1>
                    
                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-foreground/70 dark:text-gray-400 text-xl font-bangla font-medium bg-foreground/5 py-4 px-8 rounded-2xl border border-foreground/10 inline-block shadow-sm"
                    >
                        দয়া করে নিচের যেকোনো একটি নম্বরে পেমেন্ট করুন
                    </motion.p>
                </div>

                {/* Payment Methods */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
                    {paymentMethods.map((method, i) => (
                        <motion.div
                            key={method.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + (i * 0.1) }}
                            className="glass p-8 md:p-10 rounded-[2.5rem] border border-foreground/10 dark:border-white/5 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
                        >
                            <div className={`absolute top-0 right-0 w-48 h-48 ${method.bgColor} opacity-0 blur-[80px] -z-10 group-hover:opacity-20 transition-opacity duration-500`} />
                            
                            <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                                <div className={`p-5 rounded-3xl ${method.lightBg} ${method.textColor} shadow-inner transition-transform group-hover:scale-110 duration-500`}>
                                    <Smartphone className="w-12 h-12" />
                                </div>
                                
                                <div>
                                    <h2 className={`text-4xl font-extrabold ${method.textColor} mb-2 tracking-tight`}>
                                        {method.name}
                                    </h2>
                                    <p className="text-foreground/50 dark:text-gray-500 font-bold text-xs tracking-[0.2em] uppercase">
                                        {method.type} Number
                                    </p>
                                </div>
                                
                                <div 
                                    onClick={() => handleCopy(method.number)}
                                    className="bg-foreground/5 dark:bg-white/5 border border-foreground/10 dark:border-white/10 px-6 py-5 rounded-2xl w-full flex items-center justify-between cursor-pointer hover:bg-foreground/10 hover:border-foreground/20 transition-colors group/copy mt-2"
                                    title={`Copy ${method.name} number`}
                                >
                                    <span className="text-2xl font-bold tracking-widest text-foreground font-mono">
                                        {method.number}
                                    </span>
                                    {copiedContent === method.number ? (
                                        <CheckCircle2 className="w-6 h-6 text-green-500 scale-110 transition-transform" />
                                    ) : (
                                        <Copy className="w-5 h-5 text-foreground/40 group-hover/copy:text-foreground transition-colors" />
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer instructions */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                    className="mt-16 text-center"
                >
                    <div className="inline-flex items-center justify-center gap-3 glass px-6 py-3 rounded-2xl border-brand-purple/20">
                        <ShieldCheck className="w-5 h-5 text-brand-purple" />
                        <p className="text-foreground/80 dark:text-gray-300 font-bangla text-base font-semibold">
                            পেমেন্ট করার পর ট্রানজেকশন আইডি (TrxID) সংরক্ষণ করুন।
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
