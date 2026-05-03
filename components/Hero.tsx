"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

interface DailyVerse {
  text_uthmani: string;
  verse_key: string;
  chapter_id: number;
  translations?: { text: string }[];
}

interface HeroProps {
  dailyVerse?: DailyVerse;
  surahName?: string;
}

// === Canvas helpers for share image ===

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function strokeRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.stroke();
}

function drawOrnament(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  color: string
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;

  // Central diamond
  ctx.beginPath();
  ctx.moveTo(cx, cy - 8);
  ctx.lineTo(cx + 8, cy);
  ctx.lineTo(cx, cy + 8);
  ctx.lineTo(cx - 8, cy);
  ctx.closePath();
  ctx.fill();

  // Side lines
  ctx.globalAlpha = 0.4;
  ctx.beginPath();
  ctx.moveTo(cx - 160, cy);
  ctx.lineTo(cx - 18, cy);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 18, cy);
  ctx.lineTo(cx + 160, cy);
  ctx.stroke();

  // Dots
  ctx.globalAlpha = 0.5;
  for (const off of [-130, -90, -50, 50, 90, 130]) {
    ctx.beginPath();
    ctx.arc(cx + off, cy, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export default function Hero({ dailyVerse, surahName }: HeroProps) {
  const t = useTranslations("hero");
  const [sharing, setSharing] = useState(false);
  const cleanTranslation =
    dailyVerse?.translations?.[0]?.text?.replace(/<[^>]*>/g, "") || "";

  const generateShareImage = useCallback(async (): Promise<Blob> => {
    const W = 1080;
    const H = 1920; // Story size 9:16
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    const arabicFont =
      '"Scheherazade New", "Traditional Arabic", "Arabic Typesetting", serif';
    const contentW = W - 200;

    // === Measure content to center vertically ===

    // Adaptive Arabic font
    let arabicSize = 52;
    ctx.font = `${arabicSize}px ${arabicFont}`;
    let arabicLines = wrapCanvasText(ctx, dailyVerse!.text_uthmani, contentW);
    while (arabicLines.length > 8 && arabicSize > 30) {
      arabicSize -= 4;
      ctx.font = `${arabicSize}px ${arabicFont}`;
      arabicLines = wrapCanvasText(ctx, dailyVerse!.text_uthmani, contentW);
    }
    const arabicLineH = Math.round(arabicSize * 1.9);

    // Translation
    ctx.font = "italic 24px system-ui, -apple-system, sans-serif";
    const transLines = cleanTranslation
      ? wrapCanvasText(
          ctx,
          `\u201C${cleanTranslation}\u201D`,
          contentW - 40
        )
      : [];
    const transLineH = 38;

    // Total content height for centering
    const labelH = 70; // "VERSE OF THE DAY" + gap
    const refH = 50; // Surah reference + gap
    const ornamentH = 30; // Top ornament + gap
    const arabicH = arabicLines.length * arabicLineH;
    const dividerGap = 70; // space + divider + space
    const transH = transLines.length > 0 ? transLines.length * transLineH : 0;
    const totalContentH =
      ornamentH + labelH + refH + arabicH + dividerGap + transH;
    const startY = (H - totalContentH) / 2;

    // === BACKGROUND ===
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#030a07");
    bg.addColorStop(0.3, "#081810");
    bg.addColorStop(0.5, "#0a1d16");
    bg.addColorStop(0.7, "#0b1420");
    bg.addColorStop(1, "#030a07");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Radial glow behind content
    const glow = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 500);
    glow.addColorStop(0, "rgba(16, 185, 129, 0.07)");
    glow.addColorStop(1, "rgba(16, 185, 129, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // === BORDERS ===
    const b = 36;
    ctx.strokeStyle = "rgba(16, 185, 129, 0.18)";
    ctx.lineWidth = 1.5;
    strokeRoundRect(ctx, b, b, W - b * 2, H - b * 2, 20);
    ctx.strokeStyle = "rgba(16, 185, 129, 0.07)";
    ctx.lineWidth = 1;
    strokeRoundRect(
      ctx,
      b + 14,
      b + 14,
      W - (b + 14) * 2,
      H - (b + 14) * 2,
      14
    );

    // === CORNER ORNAMENTS ===
    const corners: [number, number, number][] = [
      [b + 6, b + 6, 0],
      [W - b - 6, b + 6, Math.PI / 2],
      [W - b - 6, H - b - 6, Math.PI],
      [b + 6, H - b - 6, -Math.PI / 2],
    ];
    corners.forEach(([cx, cy, rot]) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.strokeStyle = "rgba(16, 185, 129, 0.3)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 30);
      ctx.lineTo(0, 0);
      ctx.lineTo(30, 0);
      ctx.stroke();
      ctx.fillStyle = "rgba(16, 185, 129, 0.3)";
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    const emerald = "#10b981";
    let y = startY;

    // === TOP ORNAMENT ===
    drawOrnament(ctx, W / 2, y, emerald);
    y += ornamentH + 10;

    // === "VERSE OF THE DAY" ===
    ctx.font = "600 20px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "rgba(16, 185, 129, 0.5)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(t("verseOfTheDayCanvas"), W / 2, y);
    y += 50;

    // === SURAH REFERENCE ===
    const ref = surahName
      ? `${surahName} ${dailyVerse!.verse_key}`
      : dailyVerse!.verse_key;
    ctx.font = "500 28px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = emerald;
    ctx.fillText(ref, W / 2, y);
    y += refH + 10;

    // === ARABIC TEXT ===
    ctx.font = `${arabicSize}px ${arabicFont}`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.direction = "rtl";
    ctx.textBaseline = "top";
    arabicLines.forEach((line, i) => {
      ctx.fillText(line, W / 2, y + i * arabicLineH);
    });
    y += arabicH + 35;

    // === DIVIDER ===
    drawOrnament(ctx, W / 2, y, emerald);
    y += 45;

    // === TRANSLATION ===
    if (transLines.length > 0) {
      ctx.direction = "ltr";
      ctx.font = "italic 24px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = "#9ca3af";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      transLines.forEach((line, i) => {
        ctx.fillText(line, W / 2, y + i * transLineH);
      });
    }

    // === BOTTOM BRANDING (fixed at bottom) ===
    drawOrnament(ctx, W / 2, H - 130, emerald);
    ctx.direction = "ltr";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "600 28px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    ctx.fillText("quran.awab.design", W / 2, H - 70);

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) =>
          blob
            ? resolve(blob)
            : reject(new Error("Failed to generate image")),
        "image/png"
      );
    });
  }, [dailyVerse, surahName, cleanTranslation]);

  const handleShare = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setSharing(true);
      try {
        const blob = await generateShareImage();
        const file = new File([blob], "verse-of-the-day.png", {
          type: "image/png",
        });
        const shareText = `${dailyVerse!.text_uthmani}\n\n\u201C${cleanTranslation}\u201D\n\n\u2014 ${surahName} ${dailyVerse!.verse_key}`;

        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], text: shareText });
        } else {
          // Fallback: download image + open WhatsApp with text
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "verse-of-the-day.png";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          window.open(
            `https://wa.me/?text=${encodeURIComponent(shareText)}`,
            "_blank"
          );
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError")
          console.error("Share failed:", err);
      } finally {
        setSharing(false);
      }
    },
    [dailyVerse, surahName, cleanTranslation, generateShareImage]
  );

  if (!dailyVerse) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div
        className="relative p-6 md:p-8 rounded-2xl overflow-hidden
          bg-white/[0.02] border border-white/[0.05]
          transition-all duration-300"
      >
        {/* Ambient glow */}
        <div
          className="absolute top-0 right-0 w-[300px] h-[200px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(16,185,129,0.05) 0%, transparent 70%)",
          }}
        />

        {/* Label row */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-[11px] text-gray-600 font-english uppercase tracking-widest">
            {t("verseOfTheDay")}
          </p>
          <Link
            href={`/${dailyVerse.chapter_id}`}
            className="text-[11px] text-emerald-500/60 font-english tracking-wider hover:text-emerald-400 transition-colors group"
          >
            {surahName && `${surahName} `}
            {dailyVerse.verse_key}
            <svg
              className="w-3 h-3 inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        {/* Arabic text — tappable link to surah */}
        <Link href={`/${dailyVerse.chapter_id}`} className="block group">
          <p
            dir="rtl"
            className="font-Scheherazade_New text-2xl md:text-3xl text-gray-100 leading-[2.4] mb-5
              group-hover:text-white transition-colors"
          >
            {dailyVerse.text_uthmani}
          </p>
        </Link>

        {/* Translation */}
        {cleanTranslation && (
          <p className="text-sm text-gray-500 font-english leading-relaxed line-clamp-3 mb-4">
            &ldquo;{cleanTranslation}&rdquo;
          </p>
        )}

        {/* Share button */}
        <div className="flex justify-end pt-3 border-t border-white/[0.05]">
          <button
            onClick={handleShare}
            disabled={sharing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl
              bg-[#25D366]/10 border border-[#25D366]/20
              hover:bg-[#25D366]/20 hover:border-[#25D366]/30
              active:scale-95 transition-all duration-200
              text-[#25D366] text-sm font-english
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sharing ? (
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            )}
            {sharing ? t("generating") : t("shareWhatsApp")}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
