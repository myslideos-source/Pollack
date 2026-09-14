"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle2, XCircle, Loader2 } from "lucide-react";

const FOLDERS = [
  { value: "hero", label: "Hero (Startseite)" },
  { value: "training", label: "Training / Fitness" },
  { value: "gesundheit", label: "Gesundheit (Milon, FIVE, InBody)" },
  { value: "kampfkunst", label: "Kampfkunst (Karate, Selbstverteidigung)" },
  { value: "regeneration", label: "Regeneration (Massage, Yoga, Solarium)" },
  { value: "community", label: "Community / Team" },
  { value: "partner", label: "Partner & Produkte (Hansefit, MORE, ESN)" },
  { value: "video", label: "Video" },
  { value: "uploads", label: "Noch unsortiert" },
] as const;

type UploadResult = {
  fileName: string;
  status: "pending" | "success" | "error";
  message?: string;
  publicPath?: string;
};

export default function AdminUploadPage() {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [folder, setFolder] = useState<(typeof FOLDERS)[number]["value"]>("uploads");
  const [files, setFiles] = useState<FileList | null>(null);
  const [results, setResults] = useState<UploadResult[]>([]);
  const [busy, setBusy] = useState(false);

  async function handleUpload() {
    if (!files || files.length === 0) return;
    setBusy(true);
    const initial: UploadResult[] = Array.from(files).map((f) => ({
      fileName: f.name,
      status: "pending",
    }));
    setResults(initial);

    const updated = [...initial];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const body = new FormData();
      body.set("file", file);
      body.set("folder", folder);

      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { "x-admin-password": password },
          body,
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          updated[i] = { fileName: file.name, status: "success", publicPath: data.publicPath };
        } else {
          updated[i] = { fileName: file.name, status: "error", message: data.error ?? "Unbekannter Fehler" };
        }
      } catch (err) {
        updated[i] = {
          fileName: file.name,
          status: "error",
          message: err instanceof Error ? err.message : "Netzwerkfehler",
        };
      }
      setResults([...updated]);
    }
    setBusy(false);
  }

  if (!unlocked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (password.trim()) setUnlocked(true);
          }}
          className="w-full max-w-sm rounded-2xl border border-paper/10 bg-anthracite p-8"
        >
          <h1 className="font-display text-2xl uppercase tracking-wide text-paper">
            Sportpark Medien-Upload
          </h1>
          <p className="mt-2 text-sm text-paper/60">Interner Bereich. Bitte Passwort eingeben.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            className="mt-6 w-full rounded-xl border border-paper/20 bg-ink px-4 py-3 text-paper focus-visible:border-red"
            placeholder="Passwort"
          />
          <button
            type="submit"
            className="mt-4 w-full rounded-full bg-red px-6 py-3 font-display text-sm uppercase tracking-wide text-paper hover:bg-red-dark"
          >
            Entsperren
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ink px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl uppercase tracking-wide text-paper">
          Sportpark Medien-Upload
        </h1>
        <p className="mt-2 text-sm text-paper/60">
          Lade hier Fotos oder Videos hoch. Sie werden direkt ins Website-Repository übernommen.
          Sag anschließend im Chat mit Claude kurz Bescheid, welche Datei(en) du hochgeladen hast
          und wofür sie gedacht sind (z. B. „InBody-Foto hochgeladen, bitte auf der
          InBody-Seite einbauen&ldquo;) — die Einsortierung in die Seite passiert danach im nächsten
          Schritt, nicht automatisch.
        </p>

        <div className="mt-8 rounded-2xl border border-paper/10 bg-anthracite p-6 sm:p-8">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-paper/70">Bereich</span>
            <select
              value={folder}
              onChange={(e) => setFolder(e.target.value as typeof folder)}
              className="rounded-xl border border-paper/20 bg-ink px-4 py-3 text-paper focus-visible:border-red"
            >
              {FOLDERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>

          <label className="mt-5 flex flex-col gap-1.5 text-sm">
            <span className="text-paper/70">Dateien (JPG, PNG, WebP, MP4, MOV — max. 25 MB je Datei)</span>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
              onChange={(e) => setFiles(e.target.files)}
              className="rounded-xl border border-paper/20 bg-ink px-4 py-3 text-paper file:mr-4 file:rounded-full file:border-0 file:bg-red file:px-4 file:py-2 file:text-sm file:text-paper"
            />
          </label>

          <button
            type="button"
            onClick={handleUpload}
            disabled={busy || !files || files.length === 0}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-red px-6 py-3 font-display text-sm uppercase tracking-wide text-paper hover:bg-red-dark disabled:opacity-40"
          >
            {busy ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
            Hochladen
          </button>
        </div>

        {results.length > 0 ? (
          <ul className="mt-6 space-y-2">
            {results.map((r) => (
              <li
                key={r.fileName}
                className="flex items-start gap-3 rounded-xl border border-paper/10 bg-anthracite p-4 text-sm"
              >
                {r.status === "pending" ? <Loader2 size={18} className="mt-0.5 shrink-0 animate-spin text-paper/50" /> : null}
                {r.status === "success" ? <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-moss" /> : null}
                {r.status === "error" ? <XCircle size={18} className="mt-0.5 shrink-0 text-red" /> : null}
                <div>
                  <div className="text-paper">{r.fileName}</div>
                  {r.status === "success" ? (
                    <div className="mt-1 text-paper/60">Gespeichert als {r.publicPath}</div>
                  ) : null}
                  {r.status === "error" ? <div className="mt-1 text-red/90">{r.message}</div> : null}
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </main>
  );
}
