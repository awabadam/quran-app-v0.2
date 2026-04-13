// Canvas utilities for generating shareable verse images

function wrapText(
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

  ctx.beginPath();
  ctx.moveTo(cx, cy - 8);
  ctx.lineTo(cx + 8, cy);
  ctx.lineTo(cx, cy + 8);
  ctx.lineTo(cx - 8, cy);
  ctx.closePath();
  ctx.fill();

  ctx.globalAlpha = 0.4;
  ctx.beginPath();
  ctx.moveTo(cx - 160, cy);
  ctx.lineTo(cx - 18, cy);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 18, cy);
  ctx.lineTo(cx + 160, cy);
  ctx.stroke();

  ctx.globalAlpha = 0.5;
  for (const off of [-130, -90, -50, 50, 90, 130]) {
    ctx.beginPath();
    ctx.arc(cx + off, cy, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number
) {
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#030a07");
  bg.addColorStop(0.3, "#081810");
  bg.addColorStop(0.5, "#0a1d16");
  bg.addColorStop(0.7, "#0b1420");
  bg.addColorStop(1, "#030a07");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 500);
  glow.addColorStop(0, "rgba(16, 185, 129, 0.07)");
  glow.addColorStop(1, "rgba(16, 185, 129, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
}

function drawBorders(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number
) {
  const b = 36;
  ctx.strokeStyle = "rgba(16, 185, 129, 0.18)";
  ctx.lineWidth = 1.5;
  strokeRoundRect(ctx, b, b, W - b * 2, H - b * 2, 20);
  ctx.strokeStyle = "rgba(16, 185, 129, 0.07)";
  ctx.lineWidth = 1;
  strokeRoundRect(ctx, b + 14, b + 14, W - (b + 14) * 2, H - (b + 14) * 2, 14);

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
}

function drawBranding(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number
) {
  const emerald = "#10b981";
  drawOrnament(ctx, W / 2, H - 130, emerald);
  ctx.direction = "ltr";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "600 28px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
  ctx.fillText("quran.awab.design", W / 2, H - 70);
}

export async function generateVerseShareImage(opts: {
  verseText: string;
  translation: string;
  surahName: string;
  arabicName: string;
  verseKey: string;
}): Promise<Blob> {
  const { verseText, translation, surahName, arabicName, verseKey } = opts;
  const W = 1080;
  const H = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const arabicFont =
    '"Scheherazade New", "Traditional Arabic", "Arabic Typesetting", serif';
  const contentW = W - 200;
  const emerald = "#10b981";

  // Measure Arabic text
  let arabicSize = 52;
  ctx.font = `${arabicSize}px ${arabicFont}`;
  let arabicLines = wrapText(ctx, verseText, contentW);
  while (arabicLines.length > 8 && arabicSize > 30) {
    arabicSize -= 4;
    ctx.font = `${arabicSize}px ${arabicFont}`;
    arabicLines = wrapText(ctx, verseText, contentW);
  }
  const arabicLineH = Math.round(arabicSize * 1.9);

  // Measure translation
  ctx.font = "italic 24px system-ui, -apple-system, sans-serif";
  const transLines = translation
    ? wrapText(ctx, `\u201C${translation}\u201D`, contentW - 40)
    : [];
  const transLineH = 38;

  // Calculate content height for vertical centering
  const headerH = 140; // ornament + arabic name + english name
  const arabicH = arabicLines.length * arabicLineH;
  const dividerH = 70;
  const transH = transLines.length > 0 ? transLines.length * transLineH : 0;
  const refH = 60;
  const totalH = headerH + arabicH + dividerH + transH + refH;
  const startY = (H - totalH) / 2;

  // Draw
  drawBackground(ctx, W, H);
  drawBorders(ctx, W, H);

  let y = startY;

  // Top ornament
  drawOrnament(ctx, W / 2, y, emerald);
  y += 40;

  // Arabic surah name (large, decorative)
  ctx.font = `44px ${arabicFont}`;
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.direction = "rtl";
  ctx.fillText(arabicName, W / 2, y);
  y += 50;

  // English surah name
  ctx.direction = "ltr";
  ctx.font = "500 26px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = emerald;
  ctx.fillText(surahName, W / 2, y);
  y += 60;

  // Arabic verse text
  ctx.font = `${arabicSize}px ${arabicFont}`;
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.direction = "rtl";
  ctx.textBaseline = "top";
  arabicLines.forEach((line, i) => {
    ctx.fillText(line, W / 2, y + i * arabicLineH);
  });
  y += arabicH + 35;

  // Divider
  drawOrnament(ctx, W / 2, y, emerald);
  y += 45;

  // Translation
  if (transLines.length > 0) {
    ctx.direction = "ltr";
    ctx.font = "italic 24px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "#9ca3af";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    transLines.forEach((line, i) => {
      ctx.fillText(line, W / 2, y + i * transLineH);
    });
    y += transLines.length * transLineH + 30;
  }

  // Verse reference
  ctx.direction = "ltr";
  ctx.font = "500 24px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "rgba(16, 185, 129, 0.6)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`\u2014 ${verseKey} \u2014`, W / 2, y);

  // Branding at bottom
  drawBranding(ctx, W, H);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Failed to generate image")),
      "image/png"
    );
  });
}
