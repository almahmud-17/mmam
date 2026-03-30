"use client";

import { motion } from "framer-motion";
import { Users, UserCog, Building, DollarSign, Activity, FileText } from "lucide-react";

export default function AdminDashboardHome() {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const stagger = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-foreground dark:text-foreground dark:text-white mb-2">
                        <span className="hidden dark:inline">School Admin Console</span>
                        <span className="inline dark:hidden text-gradient-premium">School Admin Console</span>
                    </h1>
                    <p className="text-foreground/60">System overview and institutional metrics.</p>
                </div>

                <div className="flex gap-3">
                    <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-foreground bg-background/5 dark:bg-foreground/5 dark:bg-white/5 border border-border hover:bg-background/10 dark:hover:bg-foreground/10 dark:bg-white/10 transition-colors flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Generate Report
                    </button>
                </div>
            </div>

            {/* Main Stats Grid */}
            <motion.div
                initial="hidden" animate="visible" variants={stagger}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {[
                    { title: "Total Students", value: "1,542", trend: "+5% this year", icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
                    { title: "Total Staff", value: "128", trend: "Fully staffed", icon: UserCog, color: "text-brand-purple", bg: "bg-brand-purple/10" },
                    { title: "Active Classes", value: "45", trend: "+2 sections", icon: Building, color: "text-brand-pink", bg: "bg-brand-pink/10" },
                    { title: "Monthly Revenue", value: "$45,200", trend: "+12% vs last month", icon: DollarSign, color: "text-green-400", bg: "bg-green-400/10" },
                ].map((stat, i) => (
                    <motion.div key={i} variants={fadeIn} className="glass p-6 rounded-3xl border border-border relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-background/5 dark:bg-foreground/5 dark:bg-white/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <p className="text-foreground/60 text-sm font-medium mb-1">{stat.title}</p>
                        <h3 className="text-3xl font-heading font-bold text-foreground mb-1">{stat.value}</h3>
                        <p className="text-xs text-foreground/40 font-medium">{stat.trend}</p>
                    </motion.div>
                ))}
            </motion.div>

            {/* Charts & Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Placeholder Chart */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="lg:col-span-2 glass rounded-3xl p-6 md:p-8 border border-border">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-heading font-bold text-foreground">Attendance Analytics</h2>
                        <select className="bg-background/5 dark:bg-foreground/5 dark:bg-background/40 border border-border rounded-lg text-sm text-foreground/80 px-3 py-1.5 focus:outline-none">
                            <option>This Week</option>
                            <option>This Month</option>
                            <option>This Year</option>
                        </select>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-2 pb-6 border-b border-border relative">
                        {/* Y axis labels */}
                        <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs text-foreground/40 font-medium">
                            <span>100%</span>
                            <span>75%</span>
                            <span>50%</span>
                            <span>25%</span>
                            <span>0%</span>
                        </div>

                        {/* Chart Bars */}
                        <div className="flex-1 flex items-end justify-around pl-8 h-full">
                            {[85, 92, 88, 95, 90, 75, 82].map((height, i) => (
                                <div key={i} className="w-1/12 md:w-8 group relative flex flex-col justify-end h-full">
                                    <div
                                        className="w-full bg-gradient-to-t from-brand-purple to-brand-pink rounded-t-sm group-hover:opacity-80 transition-opacity"
                                        style={{ height: `${height}%` }}
                                    />
                                    {/* Tooltip */}
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-card text-foreground text-xs font-bold py-1 px-2 rounded border border-border opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        {height}%
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-around pl-8 pt-4 text-xs font-semibold text-foreground/40 uppercase tracking-wider">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </motion.div>

                {/* System Activity */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="glass rounded-3xl p-6 md:p-8 border border-border flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
                            <Activity className="w-5 h-5 text-brand-pink" />
                            Live Activity
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                        {[
                            { time: "2 mins ago", text: "New student admission application received", type: "system" },
                            { time: "15 mins ago", text: "Mr. Rafiqul published Class 10 Mid-Term marks", type: "user" },
                            { time: "1 hr ago", text: "Database daily backup completed successfully", type: "success" },
                            { time: "3 hrs ago", text: "Login attempt failed from unknown IP", type: "alert" },
                            { time: "5 hrs ago", text: "System automated attendance reminder sent", type: "system" },
                        ].map((log, i) => (
                            <div key={i} className="flex gap-4 relative">
                                <div className="shrink-0 mt-1">
                                    <div className={`w-2.5 h-2.5 rounded-full ${log.type === 'alert' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' :
                                        log.type === 'success' ? 'bg-green-500' :
                                            log.type === 'user' ? 'bg-brand-purple' : 'bg-gray-500'
                                        }`} />
                                </div>
                                <div>
                                    <p className="text-sm text-foreground/80 font-medium mb-1 leading-snug">{log.text}</p>
                                    <p className="text-xs text-foreground/40">{log.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-6 py-3 rounded-xl border border-border text-sm font-semibold text-foreground/60 hover:text-foreground hover:bg-background/5 dark:hover:bg-foreground/5 dark:bg-white/5 transition-colors">
                        View All Logs
                    </button>
                </motion.div>

            </div>
        </div>
    );
}
