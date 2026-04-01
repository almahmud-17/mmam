"use client";

import { motion } from "framer-motion";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    label?: string;
    className?: string;
}

const sizes = {
    sm: "w-5 h-5",
    md: "w-10 h-10",
    lg: "w-16 h-16",
};

export function LoadingSpinner({ size = "md", label, className = "" }: LoadingSpinnerProps) {
    return (
        <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
            <div className="relative">
                {/* Outer ring */}
                <motion.div
                    className={`${sizes[size]} rounded-full border-2 border-foreground/10`}
                    style={{ borderTopColor: "var(--brand-pink)", borderRightColor: "var(--brand-purple)" }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                {/* Inner pulse */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <div
                        className={`rounded-full bg-gradient-to-tr from-brand-pink to-brand-purple ${
                            size === "sm" ? "w-1.5 h-1.5" : size === "md" ? "w-3 h-3" : "w-5 h-5"
                        }`}
                    />
                </motion.div>
            </div>
            {label && (
                <p className="text-sm text-foreground/60 font-medium animate-pulse">{label}</p>
            )}
        </div>
    );
}

/** Full-page loading overlay */
export function PageLoader({ label = "Loading..." }: { label?: string }) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <LoadingSpinner size="lg" label={label} />
        </div>
    );
}
