import Link from "next/link";
import { GraduationCap, LogIn } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-gradient-to-tr from-brand-pink to-brand-purple p-2 rounded-xl group-hover:neon-glow transition-all">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-heading font-extrabold text-white tracking-tight">
                            Mohishaban M Alim <span className="text-gradient">Madrasah</span>
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-sm font-medium text-text-light/80 hover:text-white transition-colors">Home</Link>
                        <Link href="/about" className="text-sm font-medium text-text-light/80 hover:text-white transition-colors">About</Link>
                        <Link href="/notices" className="text-sm font-medium text-text-light/80 hover:text-white transition-colors">Notices</Link>
                        <Link href="/gallery" className="text-sm font-medium text-text-light/80 hover:text-white transition-colors">Gallery</Link>
                        <Link href="/contact" className="text-sm font-medium text-text-light/80 hover:text-white transition-colors">Contact</Link>
                    </div>

                    {/* Auth Action Buttons */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="/login"
                            className="hidden sm:flex items-center gap-2 text-sm font-medium text-white hover:text-brand-pink transition-colors"
                        >
                            <LogIn className="w-4 h-4" />
                            Log In
                        </Link>
                        <Link
                            href="/admission"
                            className="px-5 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-brand-pink to-brand-purple hover:neon-glow transition-all duration-300"
                        >
                            Get Started
                        </Link>
                    </div>

                </div>
            </div>
        </nav>
    );
}
