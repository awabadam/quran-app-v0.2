"use client";
import { motion } from "framer-motion";

// Base Skeleton Component with Shimmer
interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className = "", style }: SkeletonProps) {
  return (
    <div 
      className={`relative overflow-hidden bg-gray-800/50 rounded-lg ${className}`}
      style={style}
    >
      <motion.div
        className="absolute inset-0 -translate-x-full"
        animate={{ translateX: ["0%", "100%"] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
        }}
      />
    </div>
  );
}

// Chapter Card Skeleton
export function ChapterCardSkeleton() {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden min-h-[160px] p-5
      bg-gray-900/60 backdrop-blur-sm border border-white/[0.06]">
      
      {/* Top Row */}
      <div className="flex justify-between items-start">
        <Skeleton className="h-8 w-32" />
        <div className="flex flex-col items-end gap-1.5">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      
      {/* Bottom Row */}
      <div className="flex justify-between items-end mt-auto pt-12">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

// Surahs Grid Skeleton
export function SurahsGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-5">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          <ChapterCardSkeleton />
        </motion.div>
      ))}
    </div>
  );
}

// Surah Header Skeleton
export function SurahHeaderSkeleton() {
  return (
    <div className="glass-card p-5 md:p-6">
      <div className="flex items-center justify-between">
        {/* Left */}
        <div className="flex flex-col items-center">
          <Skeleton className="h-3 w-12 mb-2" />
          <Skeleton className="h-12 w-12 rounded-xl" />
        </div>
        
        {/* Center */}
        <div className="text-center flex-1 px-4">
          <Skeleton className="h-8 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-24 mx-auto" />
        </div>
        
        {/* Right */}
        <div className="flex flex-col items-center">
          <Skeleton className="h-3 w-12 mb-2" />
          <Skeleton className="h-12 w-12 rounded-xl" />
        </div>
      </div>
      
      <div className="flex justify-center mt-4">
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

// Verse Skeleton
export function VerseSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex flex-wrap gap-2">
          {[...Array(Math.floor(Math.random() * 6) + 4)].map((_, j) => (
            <Skeleton 
              key={j} 
              className={`h-8 rounded`}
              style={{ width: `${Math.floor(Math.random() * 80) + 40}px` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// Thikr Skeleton
export function ThikrSkeleton() {
  return (
    <div className="w-full p-6 rounded-2xl border border-gray-800 bg-gray-900/50">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-3">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-10" />
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-6 w-3/4" />
      </div>
      
      <div className="pt-4 mt-4 border-t border-gray-800/50">
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}

// Athkar Grid Skeleton
export function AthkarGridSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="grid gap-4">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        >
          <ThikrSkeleton />
        </motion.div>
      ))}
    </div>
  );
}

// Hero Skeleton
export function HeroSkeleton() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 pt-20">
      {/* Logo */}
      <Skeleton className="h-32 w-32 md:h-48 md:w-48 rounded-full mb-8" />
      
      {/* Title */}
      <Skeleton className="h-12 w-64 md:w-80 mb-4" />
      <Skeleton className="h-6 w-80 md:w-96 mb-8" />
      
      {/* CTA */}
      <div className="flex gap-4 mb-8">
        <Skeleton className="h-12 w-36 rounded-xl" />
        <Skeleton className="h-12 w-36 rounded-xl" />
      </div>
      
      {/* Stats */}
      <div className="flex gap-8">
        <div className="text-center">
          <Skeleton className="h-8 w-16 mx-auto mb-2" />
          <Skeleton className="h-3 w-12 mx-auto" />
        </div>
        <div className="w-px bg-gray-800" />
        <div className="text-center">
          <Skeleton className="h-8 w-16 mx-auto mb-2" />
          <Skeleton className="h-3 w-12 mx-auto" />
        </div>
        <div className="w-px bg-gray-800" />
        <div className="text-center">
          <Skeleton className="h-8 w-16 mx-auto mb-2" />
          <Skeleton className="h-3 w-12 mx-auto" />
        </div>
      </div>
    </div>
  );
}

// Full Page Loading
export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Animated Logo Placeholder */}
        <motion.div
          className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40"
          animate={{ 
            scale: [1, 1.1, 1],
            borderColor: ['rgba(16, 185, 129, 0.4)', 'rgba(16, 185, 129, 0.8)', 'rgba(16, 185, 129, 0.4)']
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        
        {/* Loading Text */}
        <motion.p 
          className="text-gray-500 font-english text-sm"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  );
}
