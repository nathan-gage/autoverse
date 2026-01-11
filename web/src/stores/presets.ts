// Presets store - wraps PresetManager with Svelte reactivity
import { get, writable } from "svelte/store";
import { PresetManager } from "../presets";
import type { Preset, PresetRegion } from "../types";
import { triggerRender } from "./interaction";
import { log } from "./simulation";

// Initialize the preset manager
const manager = new PresetManager();

// Create a writable store from the manager's state
export const presets = writable<Preset[]>(manager.getAllPresets());

// Subscribe to manager changes and update the store
manager.subscribe((newPresets) => {
	presets.set(newPresets);
});

// Preset operations
export function savePreset(name: string, region: PresetRegion): void {
	manager.savePreset(name, region);
	log(`Saved preset: ${name}`, "success");
}

export function deletePreset(id: string): void {
	const preset = manager.getAllPresets().find((p) => p.id === id);
	manager.deletePreset(id);
	if (preset) {
		log(`Deleted preset: ${preset.name}`, "info");
	}
}

export function getPreset(id: string): Preset | undefined {
	return manager.getAllPresets().find((p) => p.id === id);
}

export function exportPresets(): string {
	const json = manager.exportPresets();
	log(`Exported ${get(presets).length} presets`, "success");
	return json;
}

export function importPresets(json: string): number {
	try {
		const count = manager.importPresets(json);
		log(`Imported ${count} presets`, "success");
		triggerRender();
		return count;
	} catch (err) {
		log(`Import failed: ${err}`, "error");
		throw err;
	}
}

export function downloadPresets(): void {
	const json = exportPresets();
	const blob = new Blob([json], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "flow-lenia-presets.json";
	a.click();
	URL.revokeObjectURL(url);
}
