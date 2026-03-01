import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function Footer() {
    return (
        <>
            <footer className="bg-card py-12 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">

                    <div className="col-span-1 md:col-span-2">
                        <span className="text-2xl font-heading font-extrabold text-white tracking-tight">
                            School Of <span className="text-gradient">Mahmud</span>
                        </span>
                        <p className="mt-4 text-sm text-gray-400 max-w-sm">
                            Empowering the next generation with modern, premium educational management solutions. Creating a brighter future, today.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-heading font-semibold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/admission" className="hover:text-brand-pink transition-colors">Admission Form</Link></li>
                            <li><Link href="/gallery" className="hover:text-brand-pink transition-colors">Photo Gallery</Link></li>
                            <li><Link href="/about" className="hover:text-brand-pink transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-brand-pink transition-colors">Contact Support</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-heading font-semibold text-white mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="#" className="hover:text-brand-pink transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-brand-pink transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-brand-pink transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>

                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/5 text-center text-xs text-gray-500">
                    <p>© {new Date().getFullYear()} SchoolSpace. All rights reserved.</p>
                </div>
            </footer>

            {/* Floating WhatsApp Bubble */}
            <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noreferrer"
                className="fixed bottom-6 right-6 p-4 rounded-full bg-green-500 text-white shadow-lg hover:shadow-green-500/50 hover:-translate-y-1 transition-all duration-300 z-50 group"
            >
                <MessageCircle className="w-6 h-6" />
                <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-card/90 backdrop-blur border border-white/10 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    Chat with us!
                </span>
            </a>
        </>
    );
}
