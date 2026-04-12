"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function VerseHighlighter() {
  const searchParams = useSearchParams();
  const verse = searchParams.get("verse");

  useEffect(() => {
    if (!verse) return;

    const timeout = setTimeout(() => {
      const el = document.getElementById(`verse-${verse}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("verse-highlight");
        setTimeout(() => el.classList.remove("verse-highlight"), 2000);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [verse]);

  return null;
}
