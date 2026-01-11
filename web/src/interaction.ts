// Interaction Handler - Mouse events, drag & drop, selection

import type { Renderer } from "./renderer";
import type { SimulationManager } from "./simulation";
import type {
	DraggedCreature,
	InteractionMode,
	Preset,
	PresetRegion,
	SelectionRect,
} from "./types";

export interface InteractionCallbacks {
	onSelectionChange?: (selection: SelectionRect | null) => void;
	onSelectionComplete?: (selection: SelectionRect) => void;
	onDrop?: (preset: Preset, x: number, y: number) => void;
	onDraw?: (x: number, y: number) => void;
	onErase?: (x: number, y: number) => void;
	onModeChange?: (mode: InteractionMode) => void;
}

export class InteractionHandler {
	private canvas: HTMLCanvasElement;
	private simulation: SimulationManager;
	private callbacks: InteractionCallbacks;

	private mode: InteractionMode = "view";
	private selection: SelectionRect | null = null;
	private isSelecting = false;
	private isDrawing = false;
	private isDragging = false;

	private draggedCreature: DraggedCreature | null = null;
	private ghostPreview: { region: PresetRegion; x: number; y: number } | null = null;

	private brushSize = 3;
	private brushIntensity = 0.5;

	constructor(
		canvas: HTMLCanvasElement,
		simulation: SimulationManager,
		_renderer: Renderer,
		callbacks: InteractionCallbacks = {},
	) {
		this.canvas = canvas;
		this.simulation = simulation;
		this.callbacks = callbacks;

		this.setupEventListeners();
		this.setupDragDrop();
	}

	setMode(mode: InteractionMode): void {
		this.mode = mode;
		this.selection = null;
		this.isSelecting = false;
		this.isDrawing = false;

		// Update cursor
		switch (mode) {
			case "select":
				this.canvas.style.cursor = "crosshair";
				break;
			case "draw":
				this.canvas.style.cursor = "cell";
				break;
			case "erase":
				this.canvas.style.cursor = "not-allowed";
				break;
			default:
				this.canvas.style.cursor = "default";
		}

		this.callbacks.onModeChange?.(mode);
	}

	getMode(): InteractionMode {
		return this.mode;
	}

	getSelection(): SelectionRect | null {
		return this.selection;
	}

	clearSelection(): void {
		this.selection = null;
		this.callbacks.onSelectionChange?.(null);
	}

	setBrushSize(size: number): void {
		this.brushSize = Math.max(1, Math.min(20, size));
	}

	setBrushIntensity(intensity: number): void {
		this.brushIntensity = Math.max(0, Math.min(1, intensity));
	}

	getGhostPreview(): { region: PresetRegion; x: number; y: number } | null {
		return this.ghostPreview;
	}

	// Start dragging a creature from the preset library
	startDragFromLibrary(preset: Preset, event: MouseEvent | DragEvent): void {
		this.isDragging = true;
		this.draggedCreature = {
			preset,
			offsetX: preset.region.width / 2,
			offsetY: preset.region.height / 2,
		};

		// Set up ghost preview
		const pos = this.getSimCoords(event);
		this.ghostPreview = {
			region: preset.region,
			x: pos.x - this.draggedCreature.offsetX,
			y: pos.y - this.draggedCreature.offsetY,
		};
	}

	private setupEventListeners(): void {
		this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
		this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
		this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
		this.canvas.addEventListener("mouseleave", this.handleMouseLeave.bind(this));

		// Keyboard shortcuts
		document.addEventListener("keydown", this.handleKeyDown.bind(this));
	}

	private setupDragDrop(): void {
		this.canvas.addEventListener("dragover", (e) => {
			e.preventDefault();
			e.dataTransfer!.dropEffect = "copy";

			if (this.draggedCreature) {
				const pos = this.getSimCoords(e);
				this.ghostPreview = {
					region: this.draggedCreature.preset.region,
					x: pos.x - this.draggedCreature.offsetX,
					y: pos.y - this.draggedCreature.offsetY,
				};
			}
		});

		this.canvas.addEventListener("drop", (e) => {
			e.preventDefault();

			if (this.draggedCreature) {
				const pos = this.getSimCoords(e);
				const dropX = Math.floor(pos.x - this.draggedCreature.offsetX);
				const dropY = Math.floor(pos.y - this.draggedCreature.offsetY);

				this.callbacks.onDrop?.(this.draggedCreature.preset, dropX, dropY);

				this.draggedCreature = null;
				this.ghostPreview = null;
				this.isDragging = false;
			}
		});

		this.canvas.addEventListener("dragleave", () => {
			this.ghostPreview = null;
		});
	}

	private handleMouseDown(e: MouseEvent): void {
		const pos = this.getSimCoords(e);

		switch (this.mode) {
			case "select":
				this.isSelecting = true;
				this.selection = {
					startX: pos.x,
					startY: pos.y,
					endX: pos.x,
					endY: pos.y,
				};
				this.callbacks.onSelectionChange?.(this.selection);
				break;

			case "draw":
				this.isDrawing = true;
				this.callbacks.onDraw?.(pos.x, pos.y);
				break;

			case "erase":
				this.isDrawing = true;
				this.callbacks.onErase?.(pos.x, pos.y);
				break;
		}
	}

	private handleMouseMove(e: MouseEvent): void {
		const pos = this.getSimCoords(e);

		if (this.isSelecting && this.selection) {
			this.selection.endX = pos.x;
			this.selection.endY = pos.y;
			this.callbacks.onSelectionChange?.(this.selection);
		}

		if (this.isDrawing) {
			if (this.mode === "draw") {
				this.callbacks.onDraw?.(pos.x, pos.y);
			} else if (this.mode === "erase") {
				this.callbacks.onErase?.(pos.x, pos.y);
			}
		}

		// Update ghost preview during drag
		if (this.isDragging && this.draggedCreature) {
			this.ghostPreview = {
				region: this.draggedCreature.preset.region,
				x: pos.x - this.draggedCreature.offsetX,
				y: pos.y - this.draggedCreature.offsetY,
			};
		}
	}

	private handleMouseUp(_e: MouseEvent): void {
		if (this.isSelecting && this.selection) {
			// Normalize selection coordinates
			const normalized: SelectionRect = {
				startX: Math.min(this.selection.startX, this.selection.endX),
				startY: Math.min(this.selection.startY, this.selection.endY),
				endX: Math.max(this.selection.startX, this.selection.endX),
				endY: Math.max(this.selection.startY, this.selection.endY),
			};

			// Only complete if selection has area
			if (normalized.endX > normalized.startX && normalized.endY > normalized.startY) {
				this.selection = normalized;
				this.callbacks.onSelectionComplete?.(normalized);
			} else {
				this.selection = null;
			}

			this.callbacks.onSelectionChange?.(this.selection);
		}

		this.isSelecting = false;
		this.isDrawing = false;
	}

	private handleMouseLeave(_e: MouseEvent): void {
		if (this.isSelecting) {
			this.isSelecting = false;
			this.selection = null;
			this.callbacks.onSelectionChange?.(null);
		}
		this.isDrawing = false;
		this.ghostPreview = null;
	}

	private handleKeyDown(e: KeyboardEvent): void {
		// Mode shortcuts
		if (e.key === "v" || e.key === "Escape") {
			this.setMode("view");
		} else if (e.key === "s") {
			this.setMode("select");
		} else if (e.key === "d") {
			this.setMode("draw");
		} else if (e.key === "e") {
			this.setMode("erase");
		}

		// Brush size adjustment
		if (e.key === "[") {
			this.setBrushSize(this.brushSize - 1);
		} else if (e.key === "]") {
			this.setBrushSize(this.brushSize + 1);
		}
	}

	private getSimCoords(e: MouseEvent | DragEvent): { x: number; y: number } {
		const rect = this.canvas.getBoundingClientRect();
		const canvasX = e.clientX - rect.left;
		const canvasY = e.clientY - rect.top;

		const simWidth = this.simulation.getWidth();
		const simHeight = this.simulation.getHeight();

		return {
			x: Math.floor((canvasX / this.canvas.width) * simWidth),
			y: Math.floor((canvasY / this.canvas.height) * simHeight),
		};
	}

	getBrushSize(): number {
		return this.brushSize;
	}

	getBrushIntensity(): number {
		return this.brushIntensity;
	}
}
