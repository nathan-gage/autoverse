// Interaction store - shares InteractionHandler reference with components
import { get, writable } from "svelte/store";
import type { InteractionHandler } from "../interaction";
import type { Preset } from "../types";

// Store for the interaction handler instance
export const interactionHandler = writable<InteractionHandler | null>(null);

// Trigger a render from outside SimulationView
export const renderTrigger = writable<number>(0);

export function triggerRender(): void {
	renderTrigger.update((n) => n + 1);
}

// Start drag from the preset library
export function startDragFromLibrary(preset: Preset, event: DragEvent): void {
	const handler = get(interactionHandler);
	if (handler) {
		handler.startDragFromLibrary(preset, event);
	}
}

// Main simulation canvas reference for glow layer
export const simulationCanvas = writable<HTMLCanvasElement | null>(null);
