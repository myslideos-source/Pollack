"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, Star, Eye, EyeOff, X } from "lucide-react";
import { saveOfferAction, deleteOfferAction, togglePublishedOfferAction } from "@/app/admin/actions/offers";

type Offer = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  price_cents: number | null;
  price_note: string | null;
  billing_period: string | null;
  contract_duration: string | null;
  features: unknown;
  highlighted: boolean;
  published: boolean;
  valid_from: string | null;
  valid_to: string | null;
};

function formatPrice(cents: number | null): string {
  if (cents == null) return "";
  return (cents / 100).toFixed(2).replace(".", ",");
}

function OfferForm({ offer, onDone }: { offer?: Offer; onDone: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function submit(formData: FormData) {
    if (offer) formData.set("id", offer.id);
    startTransition(async () => {
      const res = await saveOfferAction(formData);
      if (res.error) setError(res.error);
      else onDone();
    });
  }

  return (
    <form action={submit} className="space-y-3 rounded-2xl border border-paper/10 bg-anthracite p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-paper/50">Titel</label>
          <input
            name="title"
            defaultValue={offer?.title}
            required
            className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-paper/50">Kategorie</label>
          <input
            name="category"
            defaultValue={offer?.category}
            placeholder="z. B. Mitgliedschaft, Probetraining, Aktion"
            required
            className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs text-paper/50">Beschreibung</label>
        <textarea
          name="description"
          defaultValue={offer?.description ?? ""}
          rows={2}
          className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs text-paper/50">Preis (€)</label>
          <input
            name="priceCents"
            type="number"
            step="1"
            defaultValue={offer?.price_cents ?? undefined}
            placeholder="z. B. 3990 = 39,90 €"
            className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-paper/50">Preishinweis</label>
          <input
            name="priceNote"
            defaultValue={offer?.price_note ?? ""}
            placeholder="z. B. Preis auf Anfrage"
            className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-paper/50">Abrechnung</label>
          <input
            name="billingPeriod"
            defaultValue={offer?.billing_period ?? ""}
            placeholder="z. B. monatlich"
            className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-paper/50">Laufzeit</label>
          <input
            name="contractDuration"
            defaultValue={offer?.contract_duration ?? ""}
            placeholder="z. B. 12 Monate"
            className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs text-paper/50">Leistungen (eine pro Zeile)</label>
        <textarea
          name="features"
          defaultValue={Array.isArray(offer?.features) ? (offer.features as string[]).join("\n") : ""}
          rows={4}
          className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs text-paper/50">Gültig ab</label>
          <input
            name="validFrom"
            type="date"
            defaultValue={offer?.valid_from?.slice(0, 10) ?? ""}
            className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-paper/50">Gültig bis</label>
          <input
            name="validTo"
            type="date"
            defaultValue={offer?.valid_to?.slice(0, 10) ?? ""}
            className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
          />
        </div>
        <label className="flex items-center gap-2 pt-5 text-sm text-paper">
          <input type="checkbox" name="highlighted" defaultChecked={offer?.highlighted} /> Empfohlen
        </label>
        <label className="flex items-center gap-2 pt-5 text-sm text-paper">
          <input type="checkbox" name="published" defaultChecked={offer?.published ?? true} /> Veröffentlicht
        </label>
      </div>

      {error ? <p className="text-sm text-red">{error}</p> : null}

      <div className="flex items-center gap-3 border-t border-paper/10 pt-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-red px-5 py-2 text-sm font-medium text-paper hover:bg-red-dark disabled:opacity-60"
        >
          {isPending ? "Speichert …" : "Speichern"}
        </button>
        <button type="button" onClick={onDone} className="text-sm text-paper/50 hover:text-paper">
          Abbrechen
        </button>
      </div>
    </form>
  );
}

export function OffersManager({ offers }: { offers: Offer[] }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    const fd = new FormData();
    fd.set("id", id);
    startTransition(async () => {
      await deleteOfferAction(fd);
      setConfirmDeleteId(null);
    });
  }

  function handleToggle(offer: Offer) {
    const fd = new FormData();
    fd.set("id", offer.id);
    fd.set("published", String(offer.published));
    startTransition(async () => {
      await togglePublishedOfferAction(fd);
    });
  }

  return (
    <div className="space-y-4">
      {!adding ? (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 rounded-full bg-red px-5 py-2.5 text-sm font-medium text-paper hover:bg-red-dark"
        >
          <Plus size={16} /> Neues Angebot
        </button>
      ) : (
        <OfferForm onDone={() => setAdding(false)} />
      )}

      <div className="space-y-3">
        {offers.map((offer) =>
          editingId === offer.id ? (
            <OfferForm key={offer.id} offer={offer} onDone={() => setEditingId(null)} />
          ) : (
            <div key={offer.id} className="flex items-start justify-between gap-4 rounded-2xl border border-paper/10 bg-anthracite p-5">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-paper">{offer.title}</p>
                  {offer.highlighted ? <Star size={14} className="text-sand" /> : null}
                  <span className="rounded-full border border-paper/15 px-2 py-0.5 text-[11px] text-paper/50">{offer.category}</span>
                  {!offer.published ? (
                    <span className="rounded-full border border-paper/15 px-2 py-0.5 text-[11px] text-paper/40">Entwurf</span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-paper/60">
                  {offer.price_note || (offer.price_cents != null ? `${formatPrice(offer.price_cents)} €` : "")}
                  {offer.billing_period ? ` / ${offer.billing_period}` : ""}
                </p>
                {offer.description ? <p className="mt-1 text-xs text-paper/40">{offer.description}</p> : null}
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <button type="button" onClick={() => handleToggle(offer)} disabled={isPending} className="text-paper/50 hover:text-paper">
                  {offer.published ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button type="button" onClick={() => setEditingId(offer.id)} className="text-paper/50 hover:text-paper">
                  <Pencil size={16} />
                </button>
                {confirmDeleteId === offer.id ? (
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => handleDelete(offer.id)} className="text-xs text-red hover:text-red-dark">
                      Löschen?
                    </button>
                    <button type="button" onClick={() => setConfirmDeleteId(null)} className="text-paper/40 hover:text-paper">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => setConfirmDeleteId(offer.id)} className="text-paper/50 hover:text-red">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ),
        )}
        {offers.length === 0 ? <p className="text-sm text-paper/40">Noch keine Angebote angelegt.</p> : null}
      </div>
    </div>
  );
}
