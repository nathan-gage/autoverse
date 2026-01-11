// Canvas Renderer with color schemes and overlays

import type {
	PresetRegion,
	SelectionRect,
	SimulationState,
	ViewerSettings,
	VisualizationMode,
} from "./types";

export class Renderer {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private offscreenCanvas: HTMLCanvasElement;
	private offscreenCtx: CanvasRenderingContext2D;
	private settings: ViewerSettings;

	// Color map caches
	private grayscaleMap: Uint8ClampedArray;
	private thermalMap: Uint8ClampedArray;
	private viridisMap: Uint8ClampedArray;

	constructor(canvas: HTMLCanvasElement, settings: ViewerSettings) {
		this.canvas = canvas;
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("Failed to get 2D context");
		this.ctx = ctx;

		// Create offscreen canvas for simulation data
		this.offscreenCanvas = document.createElement("canvas");
		const offCtx = this.offscreenCanvas.getContext("2d");
		if (!offCtx) throw new Error("Failed to get offscreen 2D context");
		this.offscreenCtx = offCtx;

		this.settings = settings;

		// Pre-compute color maps
		this.grayscaleMap = this.buildGrayscaleMap();
		this.thermalMap = this.buildThermalMap();
		this.viridisMap = this.buildViridisMap();
	}

	updateSettings(settings: Partial<ViewerSettings>): void {
		this.settings = { ...this.settings, ...settings };
	}

	render(
		state: SimulationState,
		selection?: SelectionRect | null,
		ghostPreview?: { region: PresetRegion; x: number; y: number } | null,
		paramField?: number[] | null,
	): void {
		const { width, height, channels } = state;

		// Resize offscreen canvas if needed
		if (this.offscreenCanvas.width !== width || this.offscreenCanvas.height !== height) {
			this.offscreenCanvas.width = width;
			this.offscreenCanvas.height = height;
		}

		// Get the appropriate color map
		const colorMap = this.getColorMap();

		// Render simulation data or parameter field
		const imageData = this.offscreenCtx.createImageData(width, height);

		// Use parameter field if provided and visualization mode is not mass
		const visualizingParams =
			paramField && this.settings.visualizationMode !== "mass";
		const data = visualizingParams ? paramField : channels[0];

		// Determine normalization for the current field
		const { min, max } = visualizingParams
			? this.getParamFieldRange(this.settings.visualizationMode)
			: { min: 0, max: 1 };

		for (let i = 0; i < data.length; i++) {
			// Normalize value to [0, 1] range
			const rawValue = data[i];
			const normalizedValue = max > min ? (rawValue - min) / (max - min) : 0;
			const value = Math.max(0, Math.min(1, normalizedValue));
			const colorIndex = Math.floor(value * 255) * 4;

			imageData.data[i * 4 + 0] = colorMap[colorIndex + 0];
			imageData.data[i * 4 + 1] = colorMap[colorIndex + 1];
			imageData.data[i * 4 + 2] = colorMap[colorIndex + 2];
			imageData.data[i * 4 + 3] = 255;
		}

		this.offscreenCtx.putImageData(imageData, 0, 0);

		// Clear main canvas and draw scaled simulation
		this.ctx.imageSmoothingEnabled = false;
		this.ctx.fillStyle = "#000";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.drawImage(
			this.offscreenCanvas,
			0,
			0,
			width,
			height,
			0,
			0,
			this.canvas.width,
			this.canvas.height,
		);

		// Draw grid if enabled
		if (this.settings.showGrid) {
			this.drawGrid(width, height);
		}

		// Draw ghost preview of dragged creature
		if (ghostPreview) {
			this.drawGhostPreview(ghostPreview, width, height);
		}

		// Draw selection rectangle
		if (selection && this.settings.showSelection) {
			this.drawSelection(selection, width, height);
		}
	}

	private drawGrid(simWidth: number, simHeight: number): void {
		const scaleX = this.canvas.width / simWidth;
		const scaleY = this.canvas.height / simHeight;

		this.ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
		this.ctx.lineWidth = 1;

		// Only draw grid if cells are large enough
		if (scaleX >= 4 && scaleY >= 4) {
			this.ctx.beginPath();
			for (let x = 0; x <= simWidth; x++) {
				const px = x * scaleX;
				this.ctx.moveTo(px, 0);
				this.ctx.lineTo(px, this.canvas.height);
			}
			for (let y = 0; y <= simHeight; y++) {
				const py = y * scaleY;
				this.ctx.moveTo(0, py);
				this.ctx.lineTo(this.canvas.width, py);
			}
			this.ctx.stroke();
		}
	}

	private drawSelection(selection: SelectionRect, simWidth: number, simHeight: number): void {
		const scaleX = this.canvas.width / simWidth;
		const scaleY = this.canvas.height / simHeight;

		const x = Math.min(selection.startX, selection.endX) * scaleX;
		const y = Math.min(selection.startY, selection.endY) * scaleY;
		const w = Math.abs(selection.endX - selection.startX) * scaleX;
		const h = Math.abs(selection.endY - selection.startY) * scaleY;

		// Selection fill
		this.ctx.fillStyle = "rgba(79, 195, 247, 0.2)";
		this.ctx.fillRect(x, y, w, h);

		// Selection border
		this.ctx.strokeStyle = "#4fc3f7";
		this.ctx.lineWidth = 2;
		this.ctx.setLineDash([5, 5]);
		this.ctx.strokeRect(x, y, w, h);
		this.ctx.setLineDash([]);

		// Size indicator
		const selWidth = Math.abs(selection.endX - selection.startX);
		const selHeight = Math.abs(selection.endY - selection.startY);
		if (selWidth > 0 && selHeight > 0) {
			this.ctx.fillStyle = "#4fc3f7";
			this.ctx.font = "12px monospace";
			this.ctx.fillText(`${selWidth} x ${selHeight}`, x + 4, y - 4);
		}
	}

	private drawGhostPreview(
		preview: { region: PresetRegion; x: number; y: number },
		simWidth: number,
		simHeight: number,
	): void {
		const scaleX = this.canvas.width / simWidth;
		const scaleY = this.canvas.height / simHeight;
		const { region, x, y } = preview;

		// Create temporary image data for the ghost
		const ghostCanvas = document.createElement("canvas");
		ghostCanvas.width = region.width;
		ghostCanvas.height = region.height;
		const ghostCtx = ghostCanvas.getContext("2d")!;
		const imageData = ghostCtx.createImageData(region.width, region.height);
		const colorMap = this.getColorMap();

		for (let i = 0; i < region.channels[0].length; i++) {
			const value = Math.max(0, Math.min(1, region.channels[0][i]));
			const colorIndex = Math.floor(value * 255) * 4;

			imageData.data[i * 4 + 0] = colorMap[colorIndex + 0];
			imageData.data[i * 4 + 1] = colorMap[colorIndex + 1];
			imageData.data[i * 4 + 2] = colorMap[colorIndex + 2];
			imageData.data[i * 4 + 3] = value > 0.01 ? 180 : 0; // Semi-transparent
		}

		ghostCtx.putImageData(imageData, 0, 0);

		// Draw ghost on main canvas
		this.ctx.globalAlpha = 0.7;
		this.ctx.drawImage(
			ghostCanvas,
			0,
			0,
			region.width,
			region.height,
			x * scaleX,
			y * scaleY,
			region.width * scaleX,
			region.height * scaleY,
		);
		this.ctx.globalAlpha = 1.0;

		// Draw border around ghost
		this.ctx.strokeStyle = "#4fc3f7";
		this.ctx.lineWidth = 2;
		this.ctx.setLineDash([3, 3]);
		this.ctx.strokeRect(x * scaleX, y * scaleY, region.width * scaleX, region.height * scaleY);
		this.ctx.setLineDash([]);
	}

	// Convert canvas coordinates to simulation coordinates
	canvasToSim(
		canvasX: number,
		canvasY: number,
		simWidth: number,
		simHeight: number,
	): { x: number; y: number } {
		const rect = this.canvas.getBoundingClientRect();
		const scaleX = simWidth / this.canvas.width;
		const scaleY = simHeight / this.canvas.height;

		return {
			x: Math.floor((canvasX - rect.left) * scaleX),
			y: Math.floor((canvasY - rect.top) * scaleY),
		};
	}

	private getColorMap(): Uint8ClampedArray {
		switch (this.settings.colorScheme) {
			case "thermal":
				return this.thermalMap;
			case "viridis":
				return this.viridisMap;
			default:
				return this.grayscaleMap;
		}
	}

	private getParamFieldRange(mode: VisualizationMode): { min: number; max: number } {
		// Define expected ranges for each parameter type
		switch (mode) {
			case "mu":
				return { min: 0, max: 0.5 };
			case "sigma":
				return { min: 0, max: 0.1 };
			case "weight":
				return { min: 0, max: 3 };
			case "beta_a":
				return { min: 0, max: 3 };
			case "n":
				return { min: 0, max: 5 };
			default:
				return { min: 0, max: 1 };
		}
	}

	private buildGrayscaleMap(): Uint8ClampedArray {
		const map = new Uint8ClampedArray(256 * 4);
		for (let i = 0; i < 256; i++) {
			map[i * 4 + 0] = i;
			map[i * 4 + 1] = i;
			map[i * 4 + 2] = i;
			map[i * 4 + 3] = 255;
		}
		return map;
	}

	private buildThermalMap(): Uint8ClampedArray {
		const map = new Uint8ClampedArray(256 * 4);
		for (let i = 0; i < 256; i++) {
			const t = i / 255;
			// Black -> Blue -> Cyan -> Yellow -> Red -> White
			let r: number, g: number, b: number;
			if (t < 0.2) {
				const s = t / 0.2;
				r = 0;
				g = 0;
				b = Math.floor(s * 128);
			} else if (t < 0.4) {
				const s = (t - 0.2) / 0.2;
				r = 0;
				g = Math.floor(s * 255);
				b = 128 + Math.floor(s * 127);
			} else if (t < 0.6) {
				const s = (t - 0.4) / 0.2;
				r = Math.floor(s * 255);
				g = 255;
				b = 255 - Math.floor(s * 255);
			} else if (t < 0.8) {
				const s = (t - 0.6) / 0.2;
				r = 255;
				g = 255 - Math.floor(s * 255);
				b = 0;
			} else {
				const s = (t - 0.8) / 0.2;
				r = 255;
				g = Math.floor(s * 255);
				b = Math.floor(s * 255);
			}
			map[i * 4 + 0] = r;
			map[i * 4 + 1] = g;
			map[i * 4 + 2] = b;
			map[i * 4 + 3] = 255;
		}
		return map;
	}

	private buildViridisMap(): Uint8ClampedArray {
		// Simplified viridis colormap
		const viridisColors = [
			[68, 1, 84],
			[72, 35, 116],
			[64, 67, 135],
			[52, 94, 141],
			[41, 120, 142],
			[32, 144, 140],
			[34, 167, 132],
			[68, 190, 112],
			[121, 209, 81],
			[189, 222, 38],
			[253, 231, 36],
		];

		const map = new Uint8ClampedArray(256 * 4);
		for (let i = 0; i < 256; i++) {
			const t = i / 255;
			const idx = t * (viridisColors.length - 1);
			const low = Math.floor(idx);
			const high = Math.min(low + 1, viridisColors.length - 1);
			const frac = idx - low;

			map[i * 4 + 0] = Math.floor(
				viridisColors[low][0] + frac * (viridisColors[high][0] - viridisColors[low][0]),
			);
			map[i * 4 + 1] = Math.floor(
				viridisColors[low][1] + frac * (viridisColors[high][1] - viridisColors[low][1]),
			);
			map[i * 4 + 2] = Math.floor(
				viridisColors[low][2] + frac * (viridisColors[high][2] - viridisColors[low][2]),
			);
			map[i * 4 + 3] = 255;
		}
		return map;
	}

	getCanvas(): HTMLCanvasElement {
		return this.canvas;
	}
}
