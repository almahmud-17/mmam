"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="p-2 w-10 h-10" />; // Spacer
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2.5 rounded-xl bg-foreground/5 dark:bg-white/5 border border-foreground/15 dark:border-white/10 text-foreground transition-all hover:bg-foreground/10 dark:bg-white/10 hover:scale-110"
            aria-label="Toggle theme"
        >
            {theme === "dark" ? (
                <Sun className="w-5 h-5 text-brand-pink" />
            ) : (
                <Moon className="w-5 h-5 text-brand-purple" />
            )}
        </button>
    );
}
