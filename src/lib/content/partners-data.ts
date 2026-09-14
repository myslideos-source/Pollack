import "server-only";
import { createClient } from "@/lib/supabase/server";
import { resolveMediaSrc } from "@/lib/content/media";

export type PublicPartner = {
  id: string;
  name: string;
  description: string | null;
  linkUrl: string | null;
  logoSrc: string | null;
};

export type PublicProduct = {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  imageSrc: string | null;
  recommended: boolean;
  partnerId: string | null;
};

export async function loadPartners(): Promise<PublicPartner[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("partners")
    .select("id, name, description, link_url, logo_media_id")
    .eq("visible", true)
    .order("sort_order");
  if (error) console.error("[loadPartners]", error);

  return Promise.all(
    (data ?? []).map(async (p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      linkUrl: p.link_url,
      logoSrc: await resolveMediaSrc(p.logo_media_id),
    })),
  );
}

export async function loadProducts(): Promise<PublicProduct[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, name, category, description, image_media_id, recommended, partner_id")
    .eq("visible", true)
    .order("sort_order");
  if (error) console.error("[loadProducts]", error);

  return Promise.all(
    (data ?? []).map(async (p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      description: p.description,
      imageSrc: await resolveMediaSrc(p.image_media_id),
      recommended: p.recommended,
      partnerId: p.partner_id,
    })),
  );
}
