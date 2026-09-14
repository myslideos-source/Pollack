import { NextRequest, NextResponse } from "next/server";

/**
 * Internal media-upload endpoint for the Sportpark Pollack team.
 *
 * This site is a static Next.js app with no database and no persistent server
 * filesystem in most hosting setups (e.g. Vercel's serverless functions reset their
 * filesystem on every invocation). So instead of writing to disk, an uploaded file is
 * committed directly to this GitHub repository via the GitHub Contents API — the same
 * place every photo in `public/media/` already lives. That commit is real and durable;
 * getting it to actually appear on the live site still depends on how the site is
 * deployed (an auto-deploy-on-push host picks it up on its own; anything else needs a
 * redeploy).
 *
 * Required environment variables (set these at your hosting provider — see
 * TODO_CLIENT.md for the full explanation, including why these can't be pre-filled):
 * - ADMIN_UPLOAD_PASSWORD: the password gate for /admin/upload.
 * - GITHUB_TOKEN: a GitHub Personal Access Token (fine-grained, scoped to just this
 *   repo, "Contents: Read and write" permission) authorized to push to GITHUB_REPO.
 * - GITHUB_OWNER / GITHUB_REPO / GITHUB_BRANCH: default to this repo/branch below,
 *   override only if the repo is forked or renamed.
 */
export const runtime = "nodejs";

const GITHUB_OWNER = process.env.GITHUB_OWNER || "myslideos-source";
const GITHUB_REPO = process.env.GITHUB_REPO || "Pollack";
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "claude/sportpark-pollack-redesign-7ohoet";

const ALLOWED_FOLDERS = [
  "hero",
  "training",
  "gesundheit",
  "kampfkunst",
  "regeneration",
  "community",
  "partner",
  "video",
  "uploads",
] as const;

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "video/mp4": "mp4",
  "video/quicktime": "mov",
};

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB — see README/TODO_CLIENT for hosting-specific request-size limits

function sanitizeFilename(name: string): string {
  const base = name.normalize("NFKD").replace(/[^\w.\-]+/g, "-");
  return base.replace(/-+/g, "-").replace(/^-|-$/g, "").toLowerCase() || "datei";
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function POST(request: NextRequest) {
  const configuredPassword = process.env.ADMIN_UPLOAD_PASSWORD;
  const githubToken = process.env.GITHUB_TOKEN;

  if (!configuredPassword || !githubToken) {
    return NextResponse.json(
      {
        error:
          "Upload ist noch nicht konfiguriert. Es fehlen die Umgebungsvariablen ADMIN_UPLOAD_PASSWORD und/oder GITHUB_TOKEN beim Hosting. Siehe TODO_CLIENT.md.",
      },
      { status: 503 },
    );
  }

  const suppliedPassword = request.headers.get("x-admin-password") ?? "";
  if (!timingSafeEqual(suppliedPassword, configuredPassword)) {
    return NextResponse.json({ error: "Falsches Passwort." }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const file = formData.get("file");
  const folder = String(formData.get("folder") ?? "uploads");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Keine Datei erhalten." }, { status: 400 });
  }
  if (!ALLOWED_FOLDERS.includes(folder as (typeof ALLOWED_FOLDERS)[number])) {
    return NextResponse.json({ error: "Unbekannter Zielordner." }, { status: 400 });
  }
  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: `Dateityp „${file.type || "unbekannt"}" wird nicht unterstützt (erlaubt: JPG, PNG, WebP, MP4, MOV).` },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `Datei ist zu groß (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximal ${MAX_BYTES / 1024 / 1024} MB.` },
      { status: 400 },
    );
  }

  const rawName = sanitizeFilename(file.name.replace(/\.[^.]+$/, ""));
  const timestamp = Date.now();
  const filename = `${rawName}-${timestamp}.${extension}`;
  const repoPath = `public/media/${folder}/${filename}`;

  const arrayBuffer = await file.arrayBuffer();
  const base64Content = Buffer.from(arrayBuffer).toString("base64");

  const githubApiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${repoPath}`;
  const githubHeaders = {
    Authorization: `Bearer ${githubToken}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  try {
    const commitResponse = await fetch(githubApiUrl, {
      method: "PUT",
      headers: { ...githubHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `Medien-Upload: ${repoPath}`,
        content: base64Content,
        branch: GITHUB_BRANCH,
      }),
    });

    if (!commitResponse.ok) {
      const errorBody = await commitResponse.text();
      return NextResponse.json(
        { error: `GitHub-Commit fehlgeschlagen (${commitResponse.status}): ${errorBody.slice(0, 300)}` },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      path: repoPath,
      publicPath: `/media/${folder}/${filename}`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Verbindung zu GitHub fehlgeschlagen: ${err instanceof Error ? err.message : String(err)}` },
      { status: 502 },
    );
  }
}
