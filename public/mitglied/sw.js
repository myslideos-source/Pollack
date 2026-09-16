// App-shell service worker for the member portal (/mitglied), scoped so installability and a
// graceful offline fallback work without ever writing personalized or authenticated responses
// into a cache. Only the manifest, the app icons and a static, content-free offline page are
// precached. Everything else — page navigations with real member data, and every API/auth call
// to Supabase — is left to the network; a navigation is NEVER served from cache, only the
// generic offline.html is, and only when the network genuinely fails. Active-workout resilience
// already lives in localStorage (see ActiveWorkout's autosave), not in this cache, so narrowing
// it down here doesn't regress that.
const CACHE_VERSION = "mitglied-shell-v2";
const OFFLINE_URL = "/mitglied/offline.html";
const PRECACHE_URLS = [
  OFFLINE_URL,
  "/mitglied/manifest.webmanifest",
  "/icons/pwa/icon-192.png",
  "/icons/pwa/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch(() => {}),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  // Only ever intervene for full-page navigations into the member area — every other request
  // (JS/CSS chunks, images, and above all every Supabase/API call) passes straight through to
  // the network untouched and uncached.
  if (request.mode !== "navigate") return;
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/mitglied")) return;

  event.respondWith(
    fetch(request).catch(() => caches.match(OFFLINE_URL)),
  );
});
