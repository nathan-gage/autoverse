// Development server for Flow Lenia Viewer
import { existsSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";

const PORT = 3000;
const PKG_DIR = "../pkg";

const MIME_TYPES: Record<string, string> = {
	".html": "text/html",
	".css": "text/css",
	".js": "application/javascript",
	".ts": "application/javascript",
	".json": "application/json",
	".wasm": "application/wasm",
	".png": "image/png",
	".jpg": "image/jpeg",
	".svg": "image/svg+xml",
};

console.log(`Starting development server on http://localhost:${PORT}\n`);

Bun.serve({
	port: PORT,
	async fetch(req) {
		const url = new URL(req.url);
		let path = url.pathname;

		// Default to index.html
		if (path === "/") {
			path = "/index.html";
		}

		// Handle TypeScript files - transpile on the fly
		if (path.endsWith(".ts")) {
			const filePath = `.${path}`;
			if (existsSync(filePath)) {
				const result = await Bun.build({
					entrypoints: [filePath],
					target: "browser",
				});

				if (result.success && result.outputs.length > 0) {
					const output = await result.outputs[0].text();
					return new Response(output, {
						headers: {
							"Content-Type": "application/javascript",
							"Access-Control-Allow-Origin": "*",
						},
					});
				}
			}
		}

		// Handle WASM package requests
		if (path.startsWith("/pkg/")) {
			const filePath = join(PKG_DIR, path.slice(5));
			if (existsSync(filePath)) {
				const content = readFileSync(filePath);
				const ext = extname(filePath);
				return new Response(content, {
					headers: {
						"Content-Type": MIME_TYPES[ext] || "application/octet-stream",
						"Access-Control-Allow-Origin": "*",
					},
				});
			}
		}

		// Handle source files
		const filePath = `.${path}`;
		if (existsSync(filePath)) {
			const content = readFileSync(filePath);
			const ext = extname(filePath);
			return new Response(content, {
				headers: {
					"Content-Type": MIME_TYPES[ext] || "application/octet-stream",
					"Access-Control-Allow-Origin": "*",
				},
			});
		}

		// 404
		return new Response("Not Found", { status: 404 });
	},
});

console.log("Watching for changes...");
console.log("Press Ctrl+C to stop.\n");
