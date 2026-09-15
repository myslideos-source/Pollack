import { redirect } from "next/navigation";

/**
 * Login is unified at /login now — it detects the signed-in profile's role (Mitglied, Trainer,
 * Admin/Redakteur) and sends each to its own area, so staff no longer need a separate login
 * page. This route stays only so old bookmarks/links to /admin/login keep working.
 */
export default async function AdminLoginRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") query.set(key, value);
  }
  if (!query.has("next")) query.set("next", "/admin");
  redirect(`/login?${query.toString()}`);
}
