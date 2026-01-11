// Build script for Flow Lenia Viewer
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DIST_DIR = "./dist";
const PKG_DIR = "../pkg";

console.log("Building Flow Lenia Viewer...\n");

// Create dist directory
if (!existsSync(DIST_DIR)) {
	mkdirSync(DIST_DIR, { recursive: true });
}

// Bundle TypeScript with Bun
console.log("Bundling TypeScript...");
const result = await Bun.build({
	entrypoints: ["./src/main.ts"],
	outdir: DIST_DIR,
	minify: true,
	sourcemap: "external",
	target: "browser",
	naming: "[name].[ext]",
});

if (!result.success) {
	console.error("Build failed:");
	for (const log of result.logs) {
		console.error(log);
	}
	process.exit(1);
}

console.log("  Created main.js");

// Copy and process HTML
console.log("Processing HTML...");
const htmlContent = readFileSync("./index.html", "utf-8");
const processedHtml = htmlContent
	.replace("./src/main.ts", "./main.js")
	.replace("./src/styles.css", "./styles.css");
writeFileSync(join(DIST_DIR, "index.html"), processedHtml);
console.log("  Created index.html");

// Copy CSS
console.log("Copying styles...");
copyFileSync("./src/styles.css", join(DIST_DIR, "styles.css"));
console.log("  Created styles.css");

// Copy WASM package if it exists
console.log("Copying WASM package...");
if (existsSync(PKG_DIR)) {
	const pkgDest = join(DIST_DIR, "pkg");
	if (!existsSync(pkgDest)) {
		mkdirSync(pkgDest, { recursive: true });
	}

	const filesToCopy = [
		"flow_lenia.js",
		"flow_lenia_bg.wasm",
		"flow_lenia.d.ts",
		"flow_lenia_bg.wasm.d.ts",
	];

	for (const file of filesToCopy) {
		const src = join(PKG_DIR, file);
		if (existsSync(src)) {
			copyFileSync(src, join(pkgDest, file));
			console.log(`  Copied ${file}`);
		}
	}
} else {
	console.log("  WASM package not found. Run 'bun run build:wasm' first.");
}

console.log("\nBuild complete! Run 'bun run preview' to test.");
