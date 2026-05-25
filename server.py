"""Simple HTTP server with COOP/COEP headers for SharedArrayBuffer support."""
import http.server
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000

class CORSHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cross-Origin-Opener-Policy", "same-origin")
        self.send_header("Cross-Origin-Embedder-Policy", "require-corp")
        self.send_header("Cross-Origin-Resource-Policy", "cross-origin")
        super().end_headers()

    def guess_type(self, path):
        if path.endswith(".js"):
            return "application/javascript"
        if path.endswith(".mjs"):
            return "application/javascript"
        if path.endswith(".json"):
            return "application/json"
        if path.endswith(".wasm"):
            return "application/wasm"
        if path.endswith(".webp"):
            return "image/webp"
        return super().guess_type(path)

print(f"GitUniverse Space Simulator running at http://localhost:{PORT}")
http.server.HTTPServer(("", PORT), CORSHandler).serve_forever()
