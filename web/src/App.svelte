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

	// Update glow layer - simulation acts as a mask for UI glow
	function updateGlowLayer() {
		const srcCanvas = $simulationCanvas;
		if (!srcCanvas || !glowCtx || !glowCanvas) {
			animationFrame = requestAnimationFrame(updateGlowLayer);
			return;
		}

		// Resize glow canvas to match container
		if (appContainer) {
			const rect = appContainer.getBoundingClientRect();
			if (glowCanvas.width !== rect.width || glowCanvas.height !== rect.height) {
				glowCanvas.width = rect.width;
				glowCanvas.height = rect.height;
			}
		}

		const w = glowCanvas.width;
		const h = glowCanvas.height;
		const colors = $currentScheme.colors;

		// Clear canvas
		glowCtx.clearRect(0, 0, w, h);

		// Step 1: Draw simulation as base (stretched to fill)
		glowCtx.drawImage(srcCanvas, 0, 0, w, h);

		// Step 2: Tint with theme colors using screen blend
		glowCtx.globalCompositeOperation = "screen";

		// Left side - primary color
		const leftGradient = glowCtx.createRadialGradient(0, h/2, 0, 0, h/2, w * 0.7);
		leftGradient.addColorStop(0, hexToRgba(colors.primary, 0.6));
		leftGradient.addColorStop(1, "transparent");
		glowCtx.fillStyle = leftGradient;
		glowCtx.fillRect(0, 0, w, h);

		// Right side - secondary color
		const rightGradient = glowCtx.createRadialGradient(w, h/2, 0, w, h/2, w * 0.7);
		rightGradient.addColorStop(0, hexToRgba(colors.secondary, 0.6));
		rightGradient.addColorStop(1, "transparent");
		glowCtx.fillStyle = rightGradient;
		glowCtx.fillRect(0, 0, w, h);

		// Reset composite operation
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

		<div class="main-content">
			<LeftSidebar />
			<SimulationView />
			<RightSidebar />
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
		display: flex;
		min-height: 0;
		gap: 8px;
		padding: 8px;
		position: relative;
		z-index: 1;
	}

	/* Canvas-based glow layer - UI colors masked by simulation mass */
	.glow-layer {
		position: absolute;
		top: -100px;
		left: -100px;
		width: calc(100% + 200px);
		height: calc(100% + 200px);
		pointer-events: none;
		z-index: 0;
		filter: blur(120px);
		opacity: 0.4;
		mix-blend-mode: screen;
	}
</style>
