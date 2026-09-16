import { ACHIEVEMENT_ICONS, DEFAULT_ACHIEVEMENT_ICON } from "./icon-map";

/**
 * Renders a share-ready PNG for one unlocked achievement, entirely in the browser (no server
 * round-trip, no new dependency — Canvas 2D + a lazy-loaded react-dom/server for turning the
 * lucide glyph into a rasterizable SVG). Deliberately excludes anything personal: no member
 * name, no body data, nothing pulled from a URL or QR code — just the achievement itself.
 */

const WIDTH = 1080;
const HEIGHT = 1350;

const TIER_COLORS: Record<string, [string, string]> = {
  bronze: ["#5c3a1e", "#e6ad6a"],
  silber: ["#5f5f5f", "#f5f5f5"],
  gold: ["#6b4e10", "#f9dd8f"],
  platin: ["#6a7078", "#ffffff"],
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Bild konnte nicht geladen werden: ${src}`));
    img.src = src;
  });
}

async function iconDataUri(iconKey: string): Promise<string> {
  const { renderToStaticMarkup } = await import("react-dom/server");
  const { createElement } = await import("react");
  const Icon = ACHIEVEMENT_ICONS[iconKey] ?? DEFAULT_ACHIEVEMENT_ICON;
  const markup = renderToStaticMarkup(createElement(Icon, { size: 220, strokeWidth: 1.4, color: "#f7f5f0" }));
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
}

function drawOctagon(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  const cut = r * 0.414; // regular octagon: side-to-diagonal ratio for a 90°-symmetric cut
  const pts: [number, number][] = [
    [cx - cut, cy - r],
    [cx + cut, cy - r],
    [cx + r, cy - cut],
    [cx + r, cy + cut],
    [cx + cut, cy + r],
    [cx - cut, cy + r],
    [cx - r, cy + cut],
    [cx - r, cy - cut],
  ];
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
  ctx.closePath();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;
      if (lines.length === maxLines - 1) break;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, maxLines);
}

export type ShareCardInput = {
  title: string;
  description: string;
  iconKey: string;
  customIconSrc: string | null;
  tier: string | null;
  unlockedAt: string;
};

export async function renderAchievementShareCard(input: ShareCardInput): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas wird von diesem Browser nicht unterstützt.");

  const bg = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  bg.addColorStop(0, "#1d201f");
  bg.addColorStop(1, "#090a0a");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  try {
    const logo = await loadImage("/logo/sportpark-pollack-logo-white.webp");
    const logoW = 300;
    const logoH = (logo.height / logo.width) * logoW;
    ctx.drawImage(logo, (WIDTH - logoW) / 2, 110, logoW, logoH);
  } catch {
    // The card still works without the logo.
  }

  const cx = WIDTH / 2;
  const cy = 600;
  const r = 230;

  const [from, to] = input.tier ? TIER_COLORS[input.tier] : ["rgba(247,245,240,0.3)", "rgba(247,245,240,0.08)"];
  const ringGrad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
  ringGrad.addColorStop(0, from);
  ringGrad.addColorStop(1, to);
  drawOctagon(ctx, cx, cy, r);
  ctx.fillStyle = ringGrad;
  ctx.fill();

  const faceGrad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
  faceGrad.addColorStop(0, "#090a0a");
  faceGrad.addColorStop(1, "#151717");
  drawOctagon(ctx, cx, cy, r * 0.92);
  ctx.fillStyle = faceGrad;
  ctx.fill();

  try {
    const iconSrc = input.customIconSrc ?? (await iconDataUri(input.iconKey));
    const iconImg = await loadImage(iconSrc);
    const size = r * 0.85;
    ctx.drawImage(iconImg, cx - size / 2, cy - size / 2, size, size);
  } catch {
    // A missing icon still leaves a valid medallion behind.
  }

  ctx.textAlign = "center";
  ctx.fillStyle = "#e43b32";
  ctx.font = "600 30px system-ui, sans-serif";
  ctx.fillText("SPORTPARK MILESTONE", cx, 960);

  ctx.fillStyle = "#f7f5f0";
  ctx.font = "700 68px system-ui, sans-serif";
  ctx.fillText(input.title, cx, 1035, WIDTH - 160);

  ctx.font = "32px system-ui, sans-serif";
  ctx.fillStyle = "rgba(247,245,240,0.7)";
  const lines = wrapText(ctx, input.description, WIDTH - 240, 2);
  lines.forEach((line, i) => ctx.fillText(line, cx, 1090 + i * 44));

  ctx.font = "26px system-ui, sans-serif";
  ctx.fillStyle = "#829765";
  const dateLabel = new Date(input.unlockedAt).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
  ctx.fillText(`Erreicht am ${dateLabel}`, cx, 1200);

  ctx.font = "24px system-ui, sans-serif";
  ctx.fillStyle = "rgba(247,245,240,0.4)";
  ctx.fillText("Erreicht im Sportpark Pollack", cx, 1270);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Bild konnte nicht erstellt werden."))), "image/png");
  });
}

/** Hands the rendered PNG to the OS share sheet when available (mobile), otherwise downloads it
 *  directly — either way only after the member has actively pressed the share button. */
export async function shareOrDownloadCard(blob: Blob, filename: string) {
  const file = new File([blob], filename, { type: "image/png" });
  const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean; share?: (data: ShareData) => Promise<void> };
  if (nav.canShare && nav.share && nav.canShare({ files: [file] })) {
    await nav.share({ files: [file], title: "Sportpark Milestone" });
    return;
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
