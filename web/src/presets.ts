// Preset Manager - Save, load, and manage creature presets

import type { Preset, PresetRegion } from "./types";

const STORAGE_KEY = "flow-lenia-presets";

export class PresetManager {
	private presets: Map<string, Preset> = new Map();
	private listeners: Set<(presets: Preset[]) => void> = new Set();

	constructor() {
		this.loadFromStorage();
	}

	// Generate a unique ID
	private generateId(): string {
		return `preset-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
	}

	// Create a thumbnail from region data
	private createThumbnail(region: PresetRegion, size = 64): string {
		const canvas = document.createElement("canvas");
		canvas.width = size;
		canvas.height = size;
		const ctx = canvas.getContext("2d")!;

		// Create scaled image
		const imageData = ctx.createImageData(region.width, region.height);
		const data = region.channels[0];

		for (let i = 0; i < data.length; i++) {
			const value = Math.max(0, Math.min(1, data[i]));
			const gray = Math.floor(value * 255);
			imageData.data[i * 4 + 0] = gray;
			imageData.data[i * 4 + 1] = gray;
			imageData.data[i * 4 + 2] = gray;
			imageData.data[i * 4 + 3] = 255;
		}

		// Put at full size first
		const tempCanvas = document.createElement("canvas");
		tempCanvas.width = region.width;
		tempCanvas.height = region.height;
		const tempCtx = tempCanvas.getContext("2d")!;
		tempCtx.putImageData(imageData, 0, 0);

		// Scale down to thumbnail
		ctx.imageSmoothingEnabled = true;
		ctx.fillStyle = "#1a1a1a";
		ctx.fillRect(0, 0, size, size);

		// Maintain aspect ratio
		const scale = Math.min(size / region.width, size / region.height);
		const scaledWidth = region.width * scale;
		const scaledHeight = region.height * scale;
		const offsetX = (size - scaledWidth) / 2;
		const offsetY = (size - scaledHeight) / 2;

		ctx.drawImage(tempCanvas, offsetX, offsetY, scaledWidth, scaledHeight);

		return canvas.toDataURL("image/png");
	}

	// Save a new preset
	savePreset(name: string, region: PresetRegion, description?: string): Preset {
		const preset: Preset = {
			id: this.generateId(),
			name,
			description,
			thumbnail: this.createThumbnail(region),
			region,
			createdAt: Date.now(),
		};

		this.presets.set(preset.id, preset);
		this.persistToStorage();
		this.notifyListeners();

		return preset;
	}

	// Get a preset by ID
	getPreset(id: string): Preset | undefined {
		return this.presets.get(id);
	}

	// Get all presets
	getAllPresets(): Preset[] {
		return Array.from(this.presets.values()).sort((a, b) => b.createdAt - a.createdAt);
	}

	// Delete a preset
	deletePreset(id: string): boolean {
		const deleted = this.presets.delete(id);
		if (deleted) {
			this.persistToStorage();
			this.notifyListeners();
		}
		return deleted;
	}

	// Rename a preset
	renamePreset(id: string, newName: string): boolean {
		const preset = this.presets.get(id);
		if (preset) {
			preset.name = newName;
			this.persistToStorage();
			this.notifyListeners();
			return true;
		}
		return false;
	}

	// Update preset description
	updateDescription(id: string, description: string): boolean {
		const preset = this.presets.get(id);
		if (preset) {
			preset.description = description;
			this.persistToStorage();
			this.notifyListeners();
			return true;
		}
		return false;
	}

	// Export presets to JSON
	exportPresets(ids?: string[]): string {
		const presetsToExport = ids
			? ids.map((id) => this.presets.get(id)).filter(Boolean)
			: this.getAllPresets();

		return JSON.stringify(presetsToExport, null, 2);
	}

	// Import presets from JSON
	importPresets(json: string): number {
		try {
			const imported = JSON.parse(json) as Preset[];
			let count = 0;

			for (const preset of imported) {
				// Generate new ID to avoid conflicts
				const newPreset: Preset = {
					...preset,
					id: this.generateId(),
					createdAt: Date.now(),
				};
				this.presets.set(newPreset.id, newPreset);
				count++;
			}

			this.persistToStorage();
			this.notifyListeners();
			return count;
		} catch {
			throw new Error("Invalid preset JSON format");
		}
	}

	// Subscribe to preset changes
	subscribe(listener: (presets: Preset[]) => void): () => void {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	private notifyListeners(): void {
		const presets = this.getAllPresets();
		for (const listener of this.listeners) {
			listener(presets);
		}
	}

	private persistToStorage(): void {
		try {
			const data = JSON.stringify(Array.from(this.presets.entries()));
			localStorage.setItem(STORAGE_KEY, data);
		} catch (e) {
			console.warn("Failed to persist presets to storage:", e);
		}
	}

	private loadFromStorage(): void {
		try {
			const data = localStorage.getItem(STORAGE_KEY);
			if (data) {
				const entries = JSON.parse(data) as [string, Preset][];
				this.presets = new Map(entries);
			}
		} catch (e) {
			console.warn("Failed to load presets from storage:", e);
			this.presets = new Map();
		}
	}

	// Clear all presets
	clearAll(): void {
		this.presets.clear();
		this.persistToStorage();
		this.notifyListeners();
	}
}

// Built-in preset patterns
export const BUILTIN_PRESETS: Array<{ name: string; description: string; seed: object }> = [
	{
		name: "Glider",
		description: "A simple glider that moves across the grid",
		seed: {
			pattern: {
				type: "GaussianBlob",
				center: [0.5, 0.5],
				radius: 0.1,
				amplitude: 1.0,
				channel: 0,
			},
		},
	},
	{
		name: "Ring",
		description: "A ring pattern that expands",
		seed: {
			pattern: {
				type: "Ring",
				center: [0.5, 0.5],
				inner_radius: 0.05,
				outer_radius: 0.1,
				amplitude: 1.0,
				channel: 0,
			},
		},
	},
	{
		name: "Dual Blobs",
		description: "Two interacting blobs",
		seed: {
			pattern: {
				type: "MultiBlob",
				blobs: [
					{ center: [0.35, 0.5], radius: 0.08, amplitude: 1.0, channel: 0 },
					{ center: [0.65, 0.5], radius: 0.08, amplitude: 1.0, channel: 0 },
				],
			},
		},
	},
	{
		name: "Random Noise",
		description: "Random initial conditions",
		seed: {
			pattern: {
				type: "Noise",
				seed: 42,
				amplitude: 0.5,
				channel: 0,
			},
		},
	},
];
