if (typeof window === "undefined") {
  self.addEventListener("install", function () { self.skipWaiting(); });
  self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });
  self.addEventListener("fetch", function (event) {
    var r = event.request;
    if (r.cache === "only-if-cached" && r.mode !== "same-origin") return;
    event.respondWith(
      fetch(r).then(function (response) {
        if (response.status === 0) return response;
        var h = new Headers(response.headers);
        h.set("Cross-Origin-Embedder-Policy", "credentialless");
        h.set("Cross-Origin-Opener-Policy", "same-origin");
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: h
        });
      })
    );
  });
} else {
  (function () {
    if (window.crossOriginIsolated) return;
    if (!("serviceWorker" in navigator)) return;
    var KEY = "coi-sw-ok";
    if (sessionStorage.getItem(KEY)) {
      sessionStorage.removeItem(KEY);
      return;
    }
    navigator.serviceWorker.register("./coi-serviceworker.js").then(function (reg) {
      function reload() {
        if (!sessionStorage.getItem(KEY)) {
          sessionStorage.setItem(KEY, "1");
          location.reload();
        }
      }
      if (navigator.serviceWorker.controller) { reload(); return; }
      var sw = reg.installing || reg.waiting;
      if (sw) {
        sw.addEventListener("statechange", function () {
          if (sw.state === "activated") reload();
        });
      }
    });
  })();
}
