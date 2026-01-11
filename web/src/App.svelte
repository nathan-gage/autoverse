<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import {
		simulationStore,
		initializeSimulation,
		log,
	} from "./stores/simulation";
	import { settings } from "./stores/settings";
	import { loadSavedScheme, currentScheme } from "./stores/themes";
	import { simulationCanvas } from "./stores/interaction";
	import Header from "./components/layout/Header.svelte";
	import Footer from "./components/layout/Footer.svelte";
	import LeftSidebar from "./components/layout/LeftSidebar.svelte";
	import RightSidebar from "./components/layout/RightSidebar.svelte";
	import SimulationView from "./components/canvas/SimulationView.svelte";

	let initialized = false;
	let initError: string | null = null;
	let glowCanvas: HTMLCanvasElement;
	let glowCtx: CanvasRenderingContext2D | null = null;
	let animationFrame: number;
	let glowStarted = false;
	let appContainer: HTMLDivElement;

	// Helper to convert hex to rgba
	function hexToRgba(hex: string, alpha: number): string {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	}

	// Offscreen canvas for mask processing
	let maskCanvas: HTMLCanvasElement | null = null;
	let maskCtx: CanvasRenderingContext2D | null = null;

	// Update glow layer - simulation brightness controls glow visibility
	function updateGlowLayer() {
		const srcCanvas = $simulationCanvas;
		if (!srcCanvas || !glowCtx || !glowCanvas) {
			animationFrame = requestAnimationFrame(updateGlowLayer);
			return;
		}

		// Initialize mask canvas if needed
		if (!maskCanvas) {
			maskCanvas = document.createElement("canvas");
			maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });
		}

		// Resize canvases to match container
		if (appContainer) {
			const rect = appContainer.getBoundingClientRect();
			const needsResize = glowCanvas.width !== rect.width || glowCanvas.height !== rect.height;
			const needsInit = maskCanvas.width === 0 || maskCanvas.height === 0;

			if (needsResize || needsInit) {
				glowCanvas.width = rect.width;
				glowCanvas.height = rect.height;
				maskCanvas.width = rect.width;
				maskCanvas.height = rect.height;
			}
		}

		if (!maskCtx || maskCanvas.width === 0) return;

		const w = glowCanvas.width;
		const h = glowCanvas.height;
		const colors = $currentScheme.colors;

		// Step 1: Draw simulation to mask canvas (stretched) and convert to alpha mask
		maskCtx.drawImage(srcCanvas, 0, 0, w, h);
		const imageData = maskCtx.getImageData(0, 0, w, h);
		const data = imageData.data;

		// Convert brightness to alpha, subtracting colormap floor
		// Theme colormap starts at near-black rgb(5,5,5) = brightness 5
		const floorBrightness = 5;
		const brightnessRange = 255 - floorBrightness;

		for (let i = 0; i < data.length; i += 4) {
			const rawBrightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
			const adjusted = Math.max(0, rawBrightness - floorBrightness);
			const normalized = adjusted / brightnessRange;
			const curved = Math.pow(normalized, 0.35); // Boost low values
			data[i] = 255;     // R - white
			data[i + 1] = 255; // G - white
			data[i + 2] = 255; // B - white
			data[i + 3] = curved * 255;
		}
		maskCtx.putImageData(imageData, 0, 0);

		// Step 2: Draw UI glow colors to main canvas (thin edge regions)
		glowCtx.clearRect(0, 0, w, h);

		// Left sidebar - thin strip along right edge where it meets content
		glowCtx.fillStyle = colors.primary;
		glowCtx.fillRect(180, 0, 80, h); // Just the edge area

		// Right sidebar - thin strip along left edge where it meets content
		glowCtx.fillStyle = colors.secondary;
		glowCtx.fillRect(w - 220, 0, 80, h);

		// Header bottom edge
		glowCtx.fillStyle = colors.tertiary;
		glowCtx.fillRect(0, 30, w, 40);

		// Footer top edge
		glowCtx.fillStyle = colors.tertiary;
		glowCtx.fillRect(0, h - 60, w, 40);

		// Step 3: Apply mask - use destination-in with the alpha mask
		glowCtx.globalCompositeOperation = "destination-in";
		glowCtx.drawImage(maskCanvas, 0, 0);
		glowCtx.globalCompositeOperation = "source-over";

		animationFrame = requestAnimationFrame(updateGlowLayer);
	}

	// Start glow layer when canvas becomes available
	$: if (glowCanvas && !glowStarted) {
		glowCtx = glowCanvas.getContext("2d");
		glowStarted = true;
		updateGlowLayer();
	}

	onMount(async () => {
		// Load saved theme
		loadSavedScheme();

		log("SYS.BOOT", "info");
		log("Loading WASM module...", "info");

		try {
			await initializeSimulation();
			initialized = true;
			log("WASM initialized", "success");
			log(`Backend: ${$simulationStore.backend.toUpperCase()}`, "info");
			log(`Theme: ${$currentScheme.name}`, "info");
			if ($simulationStore.gpuAvailable) {
				log("WebGPU available", "success");
			} else {
				log("WebGPU not available", "warn");
			}
			log("SYSTEM READY", "success");
		} catch (err) {
			initError = String(err);
			log(`INIT FAILED: ${err}`, "error");
		}
	});

	onDestroy(() => {
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
		}
	});
</script>

{#if !initialized && !initError}
	<div class="loading-screen">
		<div class="loading-content">
			<div class="glitch-text" data-text="FLOW_LENIA">FLOW_LENIA</div>
			<div class="loading-status">
				<span class="animate-pulse">INITIALIZING SUBSTRATE</span>
				<span class="animate-blink">_</span>
			</div>
		</div>
	</div>
{:else if initError}
	<div class="error-screen">
		<div class="error-content">
			<div class="error-title">SYSTEM FAILURE</div>
			<div class="error-message">{initError}</div>
			<div class="error-hint">
				Ensure WASM is built: <code>wasm-pack build --target web --release</code>
			</div>
		</div>
	</div>
{:else}
	<div class="app-container" bind:this={appContainer}>
		<!-- Canvas-based ambient glow layer -->
		<canvas class="glow-layer" bind:this={glowCanvas}></canvas>

		<Header />

		<div class="main-content" class:panel-hidden={!$settings.showPanels}>
			<SimulationView />
			{#if $settings.showPanels}
				<div class="panel-deck">
					<LeftSidebar />
					<RightSidebar />
				</div>
			{/if}
		</div>

		<Footer />
	</div>

	<!-- CRT Effects -->
	{#if $settings.showScanlines}
		<div class="scanlines"></div>
	{/if}
	<div class="vignette"></div>
{/if}

<style>
	.loading-screen,
	.error-screen {
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-void);
	}

	.loading-content,
	.error-content {
		text-align: center;
	}

	.loading-content .glitch-text {
		font-size: 32px;
		font-weight: bold;
		color: var(--color-primary);
		letter-spacing: 0.2em;
		margin-bottom: 24px;
	}

	.loading-status {
		color: var(--color-primary-dim);
		font-size: 12px;
		letter-spacing: 0.1em;
	}

	.error-title {
		font-size: 24px;
		color: var(--color-danger);
		margin-bottom: 16px;
		letter-spacing: 0.2em;
	}

	.error-message {
		color: var(--color-primary);
		margin-bottom: 24px;
		max-width: 500px;
	}

	.error-hint {
		color: var(--color-primary-dim);
		font-size: 11px;
	}

	.error-hint code {
		background: var(--color-dim);
		padding: 2px 6px;
		color: var(--color-secondary);
	}

	.app-container {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		background: var(--color-void);
		position: relative;
		overflow: hidden;
	}

	.main-content {
		flex: 1;
		display: grid;
		grid-template-columns: 220px minmax(0, 1fr) 180px;
		grid-template-areas: "left sim right";
		min-height: 0;
		gap: 8px;
		padding: 8px;
		position: relative;
		z-index: 1;
	}

	.main-content.panel-hidden {
		grid-template-columns: minmax(0, 1fr);
		grid-template-areas: "sim";
	}

	.main-content :global(.left-sidebar) {
		grid-area: left;
	}

	.main-content :global(.simulation-view) {
		grid-area: sim;
	}

	.main-content :global(.right-sidebar) {
		grid-area: right;
	}

	.panel-deck {
		display: contents;
	}

	@media (max-width: 1100px) {
		.main-content {
			grid-template-columns: 200px minmax(0, 1fr) 160px;
			gap: 6px;
			padding: 6px;
		}
	}

	@media (max-width: 900px) {
		.main-content {
			display: block;
			padding: 8px;
		}

		.panel-deck {
			position: absolute;
			left: 8px;
			right: 8px;
			bottom: 8px;
			display: flex;
			gap: 12px;
			overflow-x: auto;
			scroll-snap-type: x mandatory;
			padding: 8px 4px 12px;
			z-index: 3;
			overscroll-behavior-x: contain;
		}

		.panel-deck :global(.left-sidebar),
		.panel-deck :global(.right-sidebar) {
			width: 100%;
			min-width: min(320px, 90vw);
			max-width: 90vw;
			max-height: 70vh;
			overflow-y: auto;
			scroll-snap-align: start;
			padding: 8px;
			border: 1px solid var(--color-primary-dim);
			background: color-mix(in srgb, var(--color-void) 88%, transparent);
			backdrop-filter: blur(8px);
			box-shadow: 0 0 18px color-mix(in srgb, var(--color-primary) 30%, transparent);
		}

		.panel-deck :global(.right-sidebar) {
			border-color: var(--color-secondary-dim);
			box-shadow: 0 0 18px color-mix(in srgb, var(--color-secondary) 30%, transparent);
		}
	}

	/* Canvas-based glow layer - UI colors masked by simulation mass */
	.glow-layer {
		position: absolute;
		top: -50px;
		left: -50px;
		width: calc(100% + 100px);
		height: calc(100% + 100px);
		pointer-events: none;
		z-index: 0;
		filter: blur(60px);
		opacity: 0.7;
		mix-blend-mode: screen;
	}
</style>
