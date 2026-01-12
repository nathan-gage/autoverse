<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { simulationStore, initializeSimulation, log } from "./stores/simulation";
	import { settings } from "./stores/settings";
	import { loadSavedScheme, currentScheme } from "./stores/themes";
	import { mobileStore } from "./stores/mobile";
	import Header from "./components/layout/Header.svelte";
	import Footer from "./components/layout/Footer.svelte";
	import LeftSidebar from "./components/layout/LeftSidebar.svelte";
	import RightSidebar from "./components/layout/RightSidebar.svelte";
	import SimulationView from "./components/canvas/SimulationView.svelte";
	import BottomSheet from "./components/mobile/BottomSheet.svelte";

	let initialized = false;
	let initError: string | null = null;
	let appContainer: HTMLDivElement;
	let glowStyle = "";
	// Helper to convert hex to rgba
	function hexToRgba(hex: string, alpha: number): string {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	}

	$: {
		const { width, height } = $simulationStore.config;
		const area = Math.max(1, width * height);
		const averageMass = $simulationStore.totalMass / area;
		const normalized = Math.min(1, Math.max(0, averageMass));
		const glowAlpha = 0.15 + normalized * 0.45;
		const colors = $currentScheme.colors;
		glowStyle = [
			`--color-primary-glow: ${hexToRgba(colors.primary, glowAlpha)}`,
			`--color-secondary-glow: ${hexToRgba(colors.secondary, glowAlpha)}`,
			`--color-tertiary-glow: ${hexToRgba(colors.tertiary, glowAlpha)}`,
		].join("; ");
	}

	onMount(async () => {
		// Load saved theme
		loadSavedScheme();

		// Initialize mobile detection and listen for resize
		mobileStore.checkViewport();
		window.addEventListener("resize", mobileStore.checkViewport);

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
		window.removeEventListener("resize", mobileStore.checkViewport);
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
	<div class="app-container" class:mobile-layout={$mobileStore.isMobile} bind:this={appContainer} style={glowStyle}>
		{#if $mobileStore.isMobile}
			<!-- Mobile Layout -->
			<div class="mobile-header">
				<span class="mobile-title">FLOW_LENIA</span>
			</div>
			<div class="mobile-canvas-container">
				<SimulationView />
			</div>
			<BottomSheet />
		{:else}
			<!-- Desktop Layout -->
			<Header />
			<div class="main-content">
				<LeftSidebar />
				<SimulationView />
				<RightSidebar />
			</div>
			<Footer />
		{/if}
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

	/* Mobile Layout */
	.mobile-layout {
		display: flex;
		flex-direction: column;
	}

	.mobile-header {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 8px 12px;
		border-bottom: 1px solid var(--color-primary-dim);
		background: var(--color-void);
		flex-shrink: 0;
	}

	.mobile-title {
		font-size: 14px;
		font-weight: bold;
		color: var(--color-primary);
		letter-spacing: 0.2em;
		text-shadow: 0 0 10px var(--color-primary-glow);
	}

	.mobile-canvas-container {
		flex: 1;
		min-height: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 8px;
		position: relative;
		z-index: 1;
	}
</style>
