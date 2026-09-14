import "server-only";
import { createClient } from "@/lib/supabase/server";
import { resolveMedia, resolveMediaSrc } from "@/lib/content/media";

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
  imageFocalX: number;
  imageFocalY: number;
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
    (data ?? []).map(async (p) => {
      const image = await resolveMedia(p.image_media_id);
      return {
        id: p.id,
        name: p.name,
        category: p.category,
        description: p.description,
        imageSrc: image?.src ?? null,
        imageFocalX: image?.focalX ?? 50,
        imageFocalY: image?.focalY ?? 50,
        recommended: p.recommended,
        partnerId: p.partner_id,
      };
    }),
  );
}
