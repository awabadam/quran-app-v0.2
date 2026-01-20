"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type ReadingMode = "flow" | "spread";

type SettingsContextType = {
  fontSize: number;
  setFontSize: (size: number) => void;
  fontFace: string;
  setFontFace: (font: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
  readingMode: ReadingMode;
  setReadingMode: (mode: ReadingMode) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState(24);
  const [fontFace, setFontFace] = useState("Scheherazade_New");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [readingMode, setReadingMode] = useState<ReadingMode>("flow");

  // Load from local storage
  useEffect(() => {
    const savedSize = localStorage.getItem("quran-font-size");
    if (savedSize) setFontSize(Number(savedSize));
    
    const savedMode = localStorage.getItem("quran-reading-mode") as ReadingMode;
    if (savedMode) setReadingMode(savedMode);
    
    // Listen for Ctrl+K
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSetFontSize = (size: number) => {
    setFontSize(size);
    localStorage.setItem("quran-font-size", size.toString());
  };

  const handleSetReadingMode = (mode: ReadingMode) => {
    setReadingMode(mode);
    localStorage.setItem("quran-reading-mode", mode);
  };

  return (
    <SettingsContext.Provider
      value={{ 
        fontSize, 
        setFontSize: handleSetFontSize, 
        fontFace, 
        setFontFace,
        isSearchOpen,
        setIsSearchOpen,
        readingMode,
        setReadingMode: handleSetReadingMode
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
