"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import QLogo from "./QLogo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/athkar", label: "Athkar" },
    { href: "/about", label: "About" },
  ];

  const featuredSurahs = [
    { id: 1, name: "Al-Fatihah" },
    { id: 36, name: "Ya-Sin" },
    { id: 55, name: "Ar-Rahman" },
    { id: 67, name: "Al-Mulk" },
    { id: 112, name: "Al-Ikhlas" },
  ];

  return (
    <footer className="relative mt-auto border-t border-gray-800/50 hidden md:block pb-0 md:pb-0">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/50 to-transparent pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4 group">
              <div className="h-10 fill-gray-400 group-hover:fill-emerald-400 transition-colors duration-300">
                <QLogo />
              </div>
            </Link>
            <p className="text-gray-500 text-sm font-english leading-relaxed mb-4">
              A modern, beautiful, and ad-free Quran reading experience. 
              Read the Holy Quran with elegance.
            </p>
            <p dir="rtl" className="text-gray-600 font-Scheherazade_New text-lg">
              اقرأ القرآن الكريم بتصميم عصري
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-300 font-english font-semibold mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-500 hover:text-emerald-400 transition-colors duration-300 text-sm font-english
                      flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-700 group-hover:bg-emerald-400 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Featured Surahs */}
          <div>
            <h3 className="text-gray-300 font-english font-semibold mb-4 text-sm uppercase tracking-wider">
              Featured Surahs
            </h3>
            <ul className="space-y-3">
              {featuredSurahs.map((surah) => (
                <li key={surah.id}>
                  <Link 
                    href={`/${surah.id}`}
                    className="text-gray-500 hover:text-emerald-400 transition-colors duration-300 text-sm font-english
                      flex items-center gap-2 group"
                  >
                    <span className="w-5 text-gray-600 group-hover:text-emerald-500 transition-colors">{surah.id}</span>
                    {surah.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Developer */}
          <div>
            <h3 className="text-gray-300 font-english font-semibold mb-4 text-sm uppercase tracking-wider">
              Developer
            </h3>
            <div className="space-y-4">
              <p className="text-gray-500 text-sm font-english">
                Designed & Developed by
              </p>
              <Link 
                href="https://awab.design" 
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 
                  flex items-center justify-center text-emerald-400 font-english font-bold text-sm
                  group-hover:bg-emerald-500/30 group-hover:scale-105 transition-all duration-300">
                  AE
                </div>
                <div>
                  <p className="text-gray-300 font-english text-sm group-hover:text-emerald-400 transition-colors">
                    Awab Elkhalil
                  </p>
                  <p className="text-gray-600 font-english text-xs">
                    awab.design
                  </p>
                </div>
              </Link>
              
              <div className="pt-2">
                <Link 
                  href="https://awab.design"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-emerald-500 hover:text-emerald-400 
                    transition-colors font-english group"
                >
                  Visit Portfolio
                  <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-gray-600 text-xs font-english">
              © {currentYear} Quran App. All rights reserved.
            </p>
            
            {/* Credits */}
            <p className="text-gray-600 text-xs font-english flex items-center gap-2">
              <span>Data provided by</span>
              <Link 
                href="https://quran.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-emerald-400 transition-colors"
              >
                Quran.com API
              </Link>
            </p>
            
            {/* Made with love */}
            <p className="text-gray-600 text-xs font-english flex items-center gap-1">
              Made with
              <motion.span 
                className="text-red-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ♥
              </motion.span>
              for the Ummah
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
