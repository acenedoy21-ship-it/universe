/* COI-SW: enables SharedArrayBuffer via service worker headers */
if (typeof window === "undefined") {
  self.addEventListener("install", () => self.skipWaiting());
  self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
  self.addEventListener("fetch", (event) => {
    const r = event.request;
    if (r.cache === "only-if-cached" && r.mode !== "same-origin") return;
    event.respondWith(
      fetch(r).then((response) => {
        if (response.status === 0) return response;
        const h = new Headers(response.headers);
        h.set("Cross-Origin-Embedder-Policy", "credentialless");
        h.set("Cross-Origin-Opener-Policy", "same-origin");
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: h,
        });
      })
    );
  });
} else {
  if (!window.crossOriginIsolated && "serviceWorker" in navigator) {
    navigator.serviceWorker.register("./coi-serviceworker.js").then((reg) => {
      if (reg.active && !navigator.serviceWorker.controller) {
        location.reload();
      }
    });
  }
}
