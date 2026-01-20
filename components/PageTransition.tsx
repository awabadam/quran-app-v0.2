"use client";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  },
};

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Staggered children container
export const StaggerContainer = motion.div;

export const staggerContainerVariants: Variants = {
  initial: {},
  enter: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

// Individual item for stagger animations
export const staggerItemVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  },
};

// Fade in animation
export const fadeInVariants: Variants = {
  initial: { opacity: 0 },
  enter: { 
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  },
};

// Scale in animation
export const scaleInVariants: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  enter: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }
  },
};

// Slide in from right
export const slideInRightVariants: Variants = {
  initial: { opacity: 0, x: 30 },
  enter: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }
  },
};

// Slide in from left
export const slideInLeftVariants: Variants = {
  initial: { opacity: 0, x: -30 },
  enter: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }
  },
};
