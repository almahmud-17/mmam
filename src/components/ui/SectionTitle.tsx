import React from "react";
import { motion } from "framer-motion";

export function SectionTitle({
    title,
    subtitle,
    centered = true,
}: {
    title: string;
    subtitle?: string;
    centered?: boolean;
}) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`mb-12 ${centered ? "text-center" : "text-left"}`}
        >
            {subtitle && (
                <span className="text-brand-pink font-semibold tracking-wider text-sm uppercase block mb-3 relative inline-block after:content-[''] after:block after:w-1/2 after:h-0.5 after:bg-gradient-to-r after:from-brand-pink after:to-transparent after:mt-1">
                    {subtitle}
                </span>
            )}
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-foreground leading-tight">
                {title.split(" ").map((word, i) =>
                    word.startsWith("[gradient]") ? (
                        <span key={i} className="text-gradient">
                            {word.replace("[gradient]", "")}{" "}
                        </span>
                    ) : (
                        <span key={i}>{word} </span>
                    )
                )}
            </h2>
        </motion.div>
    );
}
