import { resolve } from "node:path";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [svelte()],
	// Use BASE_PATH env var for GitHub Pages preview deployments
	base: process.env.BASE_PATH || "/",
	resolve: {
		alias: {
			"/pkg": resolve(__dirname, "../pkg"),
		},
	},
	server: {
		port: 3000,
		fs: {
			allow: [".", "../pkg"],
		},
	},
	build: {
		outDir: "dist",
		target: "esnext",
		rollupOptions: {
			input: {
				main: resolve(__dirname, "index.html"),
				viewer3d: resolve(__dirname, "viewer3d.html"),
			},
		},
	},
	optimizeDeps: {
		exclude: ["flow_lenia"],
	},
	assetsInclude: ["**/*.wasm"],
});
