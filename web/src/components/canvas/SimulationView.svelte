<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { simulationStore, getManager } from "../../stores/simulation";
	import { settings } from "../../stores/settings";
	import { interactionHandler, renderTrigger, simulationCanvas } from "../../stores/interaction";
	import { currentScheme } from "../../stores/themes";
	import { Renderer } from "../../renderer";
	import { InteractionHandler } from "../../interaction";

	let canvasContainer: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let renderer: Renderer | null = null;
	let interaction: InteractionHandler | null = null;

	// Canvas dimensions
	const CANVAS_SIZE = 512;

	onMount(() => {
		const manager = getManager();
		if (!manager || !canvas) return;

		// Export canvas reference for glow layer
		simulationCanvas.set(canvas);

		// Initialize renderer
		renderer = new Renderer(canvas, {
			colorScheme: $settings.colorScheme,
			showGrid: $settings.showGrid,
			showSelection: $settings.showSelection,
			brushSize: $settings.brushSize,
			brushIntensity: $settings.brushIntensity,
			backend: $simulationStore.backend,
		});

		// Initialize interaction handler
		interaction = new InteractionHandler(canvas, manager, renderer, {
			onSelectionChange: () => render(),
			onSelectionComplete: () => {},
			onDrop: (preset, x, y) => {
				manager.placeRegion(preset.region, x, y);
				render();
			},
			onDraw: (x, y) => {
				manager.drawAt(x, y, $settings.brushSize, $settings.brushIntensity);
				render();
			},
			onErase: (x, y) => {
				manager.eraseAt(x, y, $settings.brushSize);
				render();
			},
			onModeChange: () => {},
			onBrushSizeChange: () => {},
		});

		// Expose to store for other components
		interactionHandler.set(interaction);

		// Initial render
		render();
	});

	onDestroy(() => {
		interactionHandler.set(null);
		simulationCanvas.set(null);
		renderer = null;
		interaction = null;
	});

	function render() {
		if (!renderer) return;
		const manager = getManager();
		if (!manager) return;

		const state = manager.getState();
		const selection = interaction?.getSelection();
		const ghostPreview = interaction?.getGhostPreview();
		renderer.render(state, selection, ghostPreview);
	}

	// Re-render when simulation state changes
	$: if ($simulationStore.state && renderer) {
		render();
	}

	// Update interaction mode when settings change
	$: if (interaction && $settings.mode) {
		interaction.setMode($settings.mode);
	}

	// Update brush settings
	$: if (interaction) {
		interaction.setBrushSize($settings.brushSize);
		interaction.setBrushIntensity($settings.brushIntensity);
	}

	// Update renderer settings
	$: if (renderer && $settings.colorScheme) {
		renderer.updateSettings({ colorScheme: $settings.colorScheme });
		render();
	}

	// Update theme colors when theme changes
	$: if (renderer && $currentScheme) {
		renderer.setThemeColors({
			primary: $currentScheme.colors.primary,
			secondary: $currentScheme.colors.secondary,
			tertiary: $currentScheme.colors.tertiary,
		});
		render();
	}

	// Re-render when triggered externally (e.g., preset import)
	$: if ($renderTrigger && renderer) {
		render();
	}
</script>

<div class="simulation-view">
	<div class="canvas-frame">
		<!-- Canvas info bar -->
		<div class="canvas-header">
			<span class="dim-label">{$simulationStore.config.width}x{$simulationStore.config.height}</span>
		</div>

		<div class="canvas-container" bind:this={canvasContainer}>
			<canvas bind:this={canvas} width={CANVAS_SIZE} height={CANVAS_SIZE}></canvas>

			<!-- Corner markers -->
			<div class="corner-marker top-left"></div>
			<div class="corner-marker top-right"></div>
			<div class="corner-marker bottom-left"></div>
			<div class="corner-marker bottom-right"></div>

			<!-- Scanline overlay on canvas -->
			<div class="canvas-scanlines"></div>
		</div>
	</div>
</div>

<style>
	.simulation-view {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 0;
		padding: 8px;
	}

	.canvas-frame {
		border: 1px solid var(--color-primary-dim);
		box-shadow: 0 0 20px var(--color-primary-glow);
	}

	.canvas-header {
		display: flex;
		justify-content: center;
		padding: 4px 12px;
		font-size: 10px;
		color: var(--color-primary-dim);
		letter-spacing: 0.15em;
		border-bottom: 1px solid var(--color-primary-dim);
		background: color-mix(in srgb, var(--color-primary) 2%, transparent);
	}

	.dim-label {
		font-family: var(--font-led);
		color: var(--color-primary);
	}

	.canvas-container {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-void);
		touch-action: none;
	}

	canvas {
		display: block;
		image-rendering: pixelated;
		image-rendering: crisp-edges;
		touch-action: none;
	}

	/* Corner markers */
	.corner-marker {
		position: absolute;
		width: 16px;
		height: 16px;
		pointer-events: none;
	}

	.corner-marker::before,
	.corner-marker::after {
		content: "";
		position: absolute;
		background: var(--color-primary);
		opacity: 0.5;
	}

	.top-left {
		top: 4px;
		left: 4px;
	}

	.top-left::before {
		top: 0;
		left: 0;
		width: 10px;
		height: 1px;
	}

	.top-left::after {
		top: 0;
		left: 0;
		width: 1px;
		height: 10px;
	}

	.top-right {
		top: 4px;
		right: 4px;
	}

	.top-right::before {
		top: 0;
		right: 0;
		width: 10px;
		height: 1px;
	}

	.top-right::after {
		top: 0;
		right: 0;
		width: 1px;
		height: 10px;
	}

	.bottom-left {
		bottom: 4px;
		left: 4px;
	}

	.bottom-left::before {
		bottom: 0;
		left: 0;
		width: 10px;
		height: 1px;
	}

	.bottom-left::after {
		bottom: 0;
		left: 0;
		width: 1px;
		height: 10px;
	}

	.bottom-right {
		bottom: 4px;
		right: 4px;
	}

	.bottom-right::before {
		bottom: 0;
		right: 0;
		width: 10px;
		height: 1px;
	}

	.bottom-right::after {
		bottom: 0;
		right: 0;
		width: 1px;
		height: 10px;
	}

	/* Canvas scanlines */
	.canvas-scanlines {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		pointer-events: none;
		background: linear-gradient(
			to bottom,
			rgba(255, 255, 255, 0),
			rgba(255, 255, 255, 0) 50%,
			rgba(0, 0, 0, 0.08) 50%,
			rgba(0, 0, 0, 0.08)
		);
		background-size: 100% 2px;
	}

	@media (max-width: 900px) {
		.simulation-view {
			padding: 4px 0;
		}

		.canvas-frame {
			width: 100%;
		}

		.canvas-container {
			width: 100%;
		}

		canvas {
			width: min(100%, 512px);
			height: auto;
		}
	}
</style>
