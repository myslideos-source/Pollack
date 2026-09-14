import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireStaff } from "@/lib/auth";

/**
 * Enables preview mode and redirects to the public homepage, both in one server round trip.
 * Exists as a plain navigable GET route (rather than a Server Action called from a click
 * handler, then window.open()'d afterwards) because opening a new tab only counts as a
 * user-initiated action — and so is exempt from popup blocking — when window.open() runs
 * synchronously inside the click handler. Awaiting a Server Action first, then calling
 * window.open() in the resumed async callback, happens outside that window and gets silently
 * blocked by every major browser. Pointing window.open() straight at this URL keeps the whole
 * thing inside one synchronous call.
 */
export async function GET(request: Request) {
  await requireStaff();
  const cookieStore = await cookies();
  cookieStore.set("sp_preview", "1", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 4 });
  return NextResponse.redirect(new URL("/", request.url));
}
