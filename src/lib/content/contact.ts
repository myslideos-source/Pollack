import "server-only";
import { getSection, sectionField } from "@/lib/content/sections";
import { contact as staticContact } from "@/content/site";

export type ContactContent = {
  street: string;
  zip: string;
  city: string;
  phone: string;
  email: string;
  whatsapp: string;
  phoneHref: string;
  whatsappHref: string;
  instagramUrl: string;
  facebookUrl: string;
};

/** German mobile/landline display strings ("0172 / 86 44 603") to a dialable +49 E.164 string. */
function toE164(display: string): string {
  const digits = display.replace(/\D/g, "").replace(/^0/, "");
  return `+49${digits}`;
}

const FALLBACK: ContactContent = {
  street: staticContact.street,
  zip: staticContact.zip,
  city: staticContact.city,
  phone: staticContact.phoneDisplay,
  email: staticContact.email,
  whatsapp: staticContact.whatsappDisplay,
  phoneHref: staticContact.phoneHref,
  whatsappHref: staticContact.whatsappHref,
  instagramUrl: "",
  facebookUrl: "",
};

export async function loadContact(): Promise<ContactContent> {
  const section = await getSection("site.contact");
  if (!section) return FALLBACK;
  const c = section.content;
  const phone = sectionField.str(c, "phone") ?? FALLBACK.phone;
  const whatsapp = sectionField.str(c, "whatsapp") ?? FALLBACK.whatsapp;
  return {
    street: sectionField.str(c, "street") ?? FALLBACK.street,
    zip: sectionField.str(c, "zip") ?? FALLBACK.zip,
    city: sectionField.str(c, "city") ?? FALLBACK.city,
    phone,
    email: sectionField.str(c, "email") ?? FALLBACK.email,
    whatsapp,
    phoneHref: `tel:${toE164(phone)}`,
    whatsappHref: `https://wa.me/${toE164(whatsapp).replace("+", "")}`,
    instagramUrl: sectionField.str(c, "instagramUrl") ?? "",
    facebookUrl: sectionField.str(c, "facebookUrl") ?? "",
  };
}
