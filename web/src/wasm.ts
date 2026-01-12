export function resolveWasmUrls(): { wasmJsUrl: string; wasmBinaryUrl: URL } {
	const baseUrl = import.meta.env.BASE_URL ?? "/";
	const baseHref = new URL(baseUrl, window.location.href);
	const wasmJsUrl = new URL("pkg/flow_lenia.js", baseHref).toString();
	const wasmBinaryUrl = new URL("pkg/flow_lenia_bg.wasm", baseHref);

	return { wasmJsUrl, wasmBinaryUrl };
}
