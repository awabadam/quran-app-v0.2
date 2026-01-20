"use client";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ThikrProps {
  Count: number;
  thikr: string;
  source?: string;
  benefit?: string;
  // Optional external state management
  externalCount?: number;
  onCountChange?: (count: number, completed: boolean) => void;
}

// Confetti particle component
function ConfettiParticle({ index }: { index: number }) {
  const colors = ['#10b981', '#34d399', '#6ee7b7', '#d4af37', '#fbbf24'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomX = Math.random() * 200 - 100;
  const randomRotation = Math.random() * 720;
  
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{ 
        backgroundColor: randomColor,
        left: '50%',
        top: '50%',
      }}
      initial={{ 
        x: 0, 
        y: 0, 
        scale: 1, 
        opacity: 1 
      }}
      animate={{ 
        x: randomX, 
        y: -150 - Math.random() * 100, 
        scale: 0,
        opacity: 0,
        rotate: randomRotation,
      }}
      transition={{ 
        duration: 0.8 + Math.random() * 0.4,
        ease: "easeOut",
      }}
    />
  );
}

export default function Thikr({ Count, thikr, source, benefit, externalCount, onCountChange }: ThikrProps) {
  const [internalCount, setInternalCount] = useState(externalCount ?? 0);
  const [showRipple, setShowRipple] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 });

  // Sync with external count if provided
  useEffect(() => {
    if (externalCount !== undefined) {
      setInternalCount(externalCount);
    }
  }, [externalCount]);

  const count = externalCount ?? internalCount;
  const completed = count >= Count;
  const progress = (count / Count) * 100;

  const handleCount = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (completed) return;
    
    // Get click position for ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    setRipplePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    
    // Show ripple
    setShowRipple(true);
    setTimeout(() => setShowRipple(false), 600);
    
    if (count < Count) {
      const newCount = count + 1;
      const isCompleted = newCount === Count;
      
      if (onCountChange) {
        onCountChange(newCount, isCompleted);
      } else {
        setInternalCount(newCount);
      }
      
      if (isCompleted) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1500);
      }
    }
  }, [count, Count, completed, onCountChange]);

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCountChange) {
      onCountChange(0, false);
    } else {
      setInternalCount(0);
    }
  };

  return (
    <motion.div 
      onClick={handleCount}
      className={`
        relative overflow-hidden
        w-full p-6 rounded-2xl border transition-all duration-300 cursor-pointer select-none
        ${completed 
          ? "bg-emerald-900/20 border-emerald-500/50" 
          : "bg-gray-900/50 border-gray-800 hover:border-gray-700 hover:bg-gray-800/80"
        }
      `}
      whileTap={{ scale: completed ? 1 : 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Ripple Effect */}
      <AnimatePresence>
        {showRipple && (
          <motion.div
            className="absolute rounded-full bg-emerald-500/20 pointer-events-none"
            style={{
              left: ripplePosition.x,
              top: ripplePosition.y,
            }}
            initial={{ width: 0, height: 0, x: 0, y: 0, opacity: 0.5 }}
            animate={{ 
              width: 400, 
              height: 400, 
              x: -200, 
              y: -200, 
              opacity: 0 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-visible z-50">
            {[...Array(20)].map((_, i) => (
              <ConfettiParticle key={i} index={i} />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      <motion.div 
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-600 to-emerald-400"
        style={{ 
          boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
        }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />

      {/* Glow effect when near completion */}
      {progress > 70 && !completed && (
        <div className="absolute inset-0 bg-emerald-500/5 animate-pulse pointer-events-none rounded-2xl" />
      )}

      <div className="flex flex-col gap-5 relative z-10">
        {/* Header: Count & Reset */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Counter Circle */}
            <motion.div 
              className={`
                w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold font-english
                transition-all duration-300
                ${completed 
                  ? "bg-emerald-500 text-white" 
                  : "bg-gray-800/80 text-emerald-400 border border-gray-700"
                }
              `}
              animate={completed ? {
                boxShadow: ['0 0 0px rgba(16,185,129,0)', '0 0 30px rgba(16,185,129,0.6)', '0 0 15px rgba(16,185,129,0.3)'],
                scale: [1, 1.1, 1],
              } : {}}
              transition={{ duration: 0.5 }}
            >
              <AnimatePresence mode="wait">
                {completed ? (
                  <motion.svg 
                    key="check"
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor" 
                    className="w-7 h-7"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </motion.svg>
                ) : (
                  <motion.span
                    key={count}
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {Count - count}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
            
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-english">
                {completed ? "Completed!" : "Remaining"}
              </span>
              {!completed && (
                <span className="text-xs text-gray-600 font-english">
                  {count}/{Count}
                </span>
              )}
            </div>
          </div>

          {/* Reset Button */}
          <AnimatePresence>
            {count > 0 && (
              <motion.button 
                onClick={handleReset}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors 
                  px-3 py-1.5 rounded-lg hover:bg-red-500/10 
                  border border-transparent hover:border-red-500/20 font-english"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reset
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <p 
            dir="rtl"
            className={`
              text-xl md:text-2xl leading-[2.5] font-Scheherazade_New transition-colors duration-500 text-right
              ${completed ? "text-emerald-200" : "text-gray-200"}
            `}
          >
            {thikr}
          </p>
          
          {/* Source & Benefit */}
          {(source || benefit) && (
            <div dir="rtl" className="pt-4 border-t border-gray-800/50 space-y-2 text-right">
              {source && (
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-sm text-gray-500 font-Scheherazade_New">
                    {source}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                </div>
              )}
              {benefit && (
                <p className="text-xs text-gray-600 leading-relaxed font-Scheherazade_New">
                  {benefit}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Completion Overlay */}
      <AnimatePresence>
        {completed && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent pointer-events-none rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
