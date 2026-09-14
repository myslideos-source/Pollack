import "server-only";
import { createPublicClient } from "@/lib/supabase/public";

export type PublicOffer = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  priceNote: string | null;
  features: string[];
  highlighted: boolean;
};

export async function loadPublishedOffers(): Promise<PublicOffer[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("offers")
    .select("id, title, category, description, price_note, features, highlighted")
    .eq("published", true)
    .order("sort_order");
  if (error) console.error("[loadPublishedOffers]", error);

  return (data ?? []).map((o) => ({
    id: o.id,
    title: o.title,
    category: o.category,
    description: o.description,
    priceNote: o.price_note,
    features: Array.isArray(o.features) ? (o.features as string[]) : [],
    highlighted: o.highlighted,
  }));
}
