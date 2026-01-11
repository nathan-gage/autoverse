import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
	plugins: [svelte()],
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
