"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, X } from "lucide-react";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { saveProductAction, deleteProductAction } from "@/app/admin/actions/partners";

type Product = {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  partner_id: string | null;
  image_media_id: string | null;
  recommended: boolean;
  available_in_store: boolean;
  visible: boolean;
};

type Partner = { id: string; name: string };

function ProductForm({ product, partners, onDone }: { product?: Product; partners: Partner[]; onDone: () => void }) {
  const [imageMediaId, setImageMediaId] = useState<string | null>(product?.image_media_id ?? null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function submit(formData: FormData) {
    if (product) formData.set("id", product.id);
    if (imageMediaId) formData.set("imageMediaId", imageMediaId);
    startTransition(async () => {
      const res = await saveProductAction(formData);
      if (res.error) setError(res.error);
      else onDone();
    });
  }

  return (
    <form action={submit} className="space-y-3 rounded-2xl border border-paper/10 bg-anthracite p-5">
      <div>
        <label className="mb-1 block text-xs text-paper/50">Produktbild</label>
        <MediaPicker value={imageMediaId} onChange={setImageMediaId} fileType="image" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-paper/50">Name</label>
          <input
            name="name"
            defaultValue={product?.name}
            required
            className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-paper/50">Kategorie</label>
          <input
            name="category"
            defaultValue={product?.category ?? ""}
            placeholder="z. B. Supplements, Zubehör"
            className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs text-paper/50">Beschreibung</label>
        <textarea
          name="description"
          defaultValue={product?.description ?? ""}
          rows={2}
          className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-paper/50">Partner</label>
        <select
          name="partnerId"
          defaultValue={product?.partner_id ?? ""}
          className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2 text-sm text-paper"
        >
          <option value="">Kein Partner</option>
          {partners.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-paper">
          <input type="checkbox" name="recommended" defaultChecked={product?.recommended} /> Empfohlen
        </label>
        <label className="flex items-center gap-2 text-sm text-paper">
          <input type="checkbox" name="availableInStore" defaultChecked={product?.available_in_store} /> Vor Ort erhältlich
        </label>
        <label className="flex items-center gap-2 text-sm text-paper">
          <input type="checkbox" name="visible" defaultChecked={product?.visible ?? true} /> Sichtbar
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

export function ProductsManager({ products, partners }: { products: Product[]; partners: Partner[] }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    const fd = new FormData();
    fd.set("id", id);
    startTransition(async () => {
      await deleteProductAction(fd);
      setConfirmDeleteId(null);
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
          <Plus size={16} /> Neues Produkt
        </button>
      ) : (
        <ProductForm partners={partners} onDone={() => setAdding(false)} />
      )}

      <div className="space-y-3">
        {products.map((product) =>
          editingId === product.id ? (
            <ProductForm key={product.id} product={product} partners={partners} onDone={() => setEditingId(null)} />
          ) : (
            <div key={product.id} className="flex items-center justify-between gap-4 rounded-2xl border border-paper/10 bg-anthracite p-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-paper">{product.name}</p>
                  {product.recommended ? <Star size={13} className="text-sand" /> : null}
                  {product.category ? (
                    <span className="rounded-full border border-paper/15 px-2 py-0.5 text-[11px] text-paper/50">{product.category}</span>
                  ) : null}
                </div>
                {product.description ? <p className="mt-0.5 text-xs text-paper/40">{product.description}</p> : null}
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {product.visible ? <Eye size={15} className="text-paper/30" /> : <EyeOff size={15} className="text-paper/30" />}
                <button type="button" onClick={() => setEditingId(product.id)} className="text-paper/50 hover:text-paper">
                  <Pencil size={15} />
                </button>
                {confirmDeleteId === product.id ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(product.id)}
                      disabled={isPending}
                      className="text-xs text-red hover:text-red-dark disabled:opacity-60"
                    >
                      Löschen?
                    </button>
                    <button type="button" onClick={() => setConfirmDeleteId(null)} className="text-paper/40 hover:text-paper">
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => setConfirmDeleteId(product.id)} className="text-paper/50 hover:text-red">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          ),
        )}
        {products.length === 0 ? <p className="text-sm text-paper/40">Noch keine Produkte angelegt.</p> : null}
      </div>
    </div>
  );
}
