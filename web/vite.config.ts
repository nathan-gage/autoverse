import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [svelte()],
	// Use BASE_PATH env var for GitHub Pages preview deployments
	base: process.env.BASE_PATH || "/",
	server: {
		port: 3000,
		fs: {
			allow: [".", "../pkg"],
		},
	},
	build: {
		outDir: "dist",
		target: "esnext",
	},
	optimizeDeps: {
		exclude: ["flow_lenia"],
	},
	assetsInclude: ["**/*.wasm"],
});
