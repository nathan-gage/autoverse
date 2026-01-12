<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import TUIBox from "../ui/TUIBox.svelte";
	import {
		evolutionStore,
		initializeEvolution,
		startEvolution,
		cancelEvolution,
		loadBestCandidate,
		getDefaultEvolutionConfig,
	} from "../../stores/evolution";
	import { simulationStore, log } from "../../stores/simulation";
	import type { EvolutionConfig, FitnessMetricWeight } from "../../types";

	let previewCanvas: HTMLCanvasElement;
	let previewCtx: CanvasRenderingContext2D | null = null;

	// Settings
	let popSize = 20;
	let maxGens = 50;
	let targetFitness = 0.95;
	let mutationRate = 15;
	let evalSteps = 200;
	let fitnessGoal = "survival";

	// Render preview of best candidate
	$: if (previewCtx && $evolutionStore.bestState) {
		renderPreview($evolutionStore.bestState);
	}

	function renderPreview(state: { channels: number[][]; width: number; height: number }) {
		if (!previewCtx || !previewCanvas) return;

		const { width, height, channels } = state;
		if (!channels || channels.length === 0) return;

		// Use first channel for grayscale preview
		const data = channels[0];
		if (!data || data.length === 0) return;

		const canvasWidth = previewCanvas.width;
		const canvasHeight = previewCanvas.height;

		const imageData = previewCtx.createImageData(width, height);
		for (let i = 0; i < data.length; i++) {
			const value = Math.floor(Math.min(1, Math.max(0, data[i])) * 255);
			imageData.data[i * 4] = value;
			imageData.data[i * 4 + 1] = value;
			imageData.data[i * 4 + 2] = value;
			imageData.data[i * 4 + 3] = 255;
		}

		const offscreen = new OffscreenCanvas(width, height);
		const offCtx = offscreen.getContext("2d");
		if (offCtx) {
			offCtx.putImageData(imageData, 0, 0);
			previewCtx.imageSmoothingEnabled = false;
			previewCtx.clearRect(0, 0, canvasWidth, canvasHeight);
			previewCtx.drawImage(offscreen, 0, 0, canvasWidth, canvasHeight);
		}
	}

	function getFitnessMetrics(goal: string): FitnessMetricWeight[] {
		switch (goal) {
			case "glider":
				return [
					{ metric: "Persistence" as const, weight: 1.0 },
					{ metric: "Locomotion" as const, weight: 1.5 },
					{ metric: "Compactness" as const, weight: 0.5 },
				];
			case "oscillator":
				return [
					{ metric: "Persistence" as const, weight: 1.0 },
					{ metric: "Stability" as const, weight: 0.8 },
					{ metric: "Compactness" as const, weight: 0.5 },
				];
			case "complex":
				return [
					{ metric: "Persistence" as const, weight: 1.0 },
					{ metric: "Complexity" as const, weight: 1.2 },
					{ metric: "MassConcentration" as const, weight: 0.3 },
				];
			default:
				return [
					{ metric: "Persistence" as const, weight: 1.0 },
					{ metric: "Compactness" as const, weight: 0.5 },
					{ metric: "Stability" as const, weight: 0.3 },
				];
		}
	}

	function buildConfig(): EvolutionConfig {
		const base = getDefaultEvolutionConfig();
		return {
			...base,
			population: {
				size: popSize,
				max_generations: maxGens,
				target_fitness: targetFitness,
				stagnation_limit: Math.max(5, Math.floor(maxGens / 3)),
			},
			algorithm: {
				type: "GeneticAlgorithm",
				config: {
					mutation_rate: mutationRate / 100,
					crossover_rate: 0.7,
					mutation_strength: 0.1,
					elitism: Math.max(1, Math.floor(popSize / 10)),
					selection: { method: "Tournament", size: 3 },
				},
			},
			evaluation: {
				steps: evalSteps,
				sample_interval: Math.max(1, Math.floor(evalSteps / 20)),
				warmup_steps: Math.floor(evalSteps / 10),
			},
			fitness: {
				metrics: getFitnessMetrics(fitnessGoal),
				aggregation: "WeightedSum",
			},
		};
	}

	async function handleStart() {
		const config = buildConfig();
		try {
			await startEvolution(config);
		} catch (error) {
			log(`Failed to start evolution: ${error}`, "error");
		}
	}

	function handleCancel() {
		cancelEvolution();
	}

	function handleLoad() {
		loadBestCandidate();
	}

	function getStopReasonText(reason: string): string {
		switch (reason) {
			case "TargetReached": return "TARGET HIT";
			case "MaxGenerations": return "MAX GENS";
			case "Stagnation": return "STAGNANT";
			case "Cancelled": return "CANCELLED";
			default: return reason;
		}
	}

	onMount(async () => {
		previewCtx = previewCanvas?.getContext("2d") ?? null;
		if (!$evolutionStore.initialized) {
			try {
				await initializeEvolution();
			} catch {
				// Error already logged
			}
		}
	});
</script>

<TUIBox title="EVOLVE" borderColor="tertiary">
	<div class="evolution-panel">
		<!-- Preview -->
		<div class="preview-container">
			<canvas bind:this={previewCanvas} width="64" height="64" class="preview-canvas"></canvas>
			<span class="preview-label">BEST</span>
		</div>

		<!-- Status / Progress -->
		{#if $evolutionStore.running && $evolutionStore.progress}
			<div class="progress-display">
				<div class="progress-row">
					<span class="label">GEN</span>
					<span class="value">{$evolutionStore.progress.generation}/{maxGens}</span>
				</div>
				<div class="progress-row">
					<span class="label">FIT</span>
					<span class="value highlight">{$evolutionStore.progress.best_fitness.toFixed(3)}</span>
				</div>
				<div class="progress-bar">
					<div
						class="progress-fill"
						style="width: {($evolutionStore.progress.generation / maxGens) * 100}%"
					></div>
				</div>
			</div>
		{:else if $evolutionStore.result}
			<div class="result-display">
				<div class="result-row">
					<span class="label">RESULT</span>
					<span class="value success">{$evolutionStore.result.stats.best_fitness.toFixed(3)}</span>
				</div>
				<div class="result-reason">{getStopReasonText($evolutionStore.result.stats.stop_reason)}</div>
			</div>
		{:else}
			<div class="idle-status">READY</div>
		{/if}

		<!-- Controls -->
		<div class="controls">
			{#if $evolutionStore.running}
				<button class="evo-btn danger" onclick={handleCancel}>STOP</button>
			{:else}
				<button class="evo-btn primary" onclick={handleStart} disabled={!$evolutionStore.initialized}>
					EVOLVE
				</button>
				{#if $evolutionStore.bestState}
					<button class="evo-btn secondary" onclick={handleLoad}>LOAD</button>
				{/if}
			{/if}
		</div>

		<!-- Settings (collapsible) -->
		<details class="settings">
			<summary>SETTINGS</summary>
			<div class="settings-grid">
				<label>
					<span>POP</span>
					<input type="number" bind:value={popSize} min="4" max="50" step="2" />
				</label>
				<label>
					<span>GENS</span>
					<input type="number" bind:value={maxGens} min="10" max="200" step="10" />
				</label>
				<label>
					<span>MUT%</span>
					<input type="number" bind:value={mutationRate} min="1" max="50" step="1" />
				</label>
				<label>
					<span>STEPS</span>
					<input type="number" bind:value={evalSteps} min="50" max="500" step="50" />
				</label>
			</div>
			<label class="goal-select">
				<span>GOAL</span>
				<select bind:value={fitnessGoal}>
					<option value="survival">Survival</option>
					<option value="glider">Glider</option>
					<option value="oscillator">Oscillator</option>
					<option value="complex">Complex</option>
				</select>
			</label>
		</details>
	</div>
</TUIBox>

<style>
	.evolution-panel {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.preview-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}

	.preview-canvas {
		width: 64px;
		height: 64px;
		border: 1px solid var(--color-tertiary-dim);
		background: var(--color-void);
		image-rendering: pixelated;
	}

	.preview-label {
		font-size: 8px;
		color: var(--color-tertiary-dim);
		letter-spacing: 0.1em;
	}

	.progress-display,
	.result-display {
		background: var(--color-dim);
		padding: 6px;
		border: 1px solid var(--color-tertiary-dim);
	}

	.progress-row,
	.result-row {
		display: flex;
		justify-content: space-between;
		font-size: 10px;
		margin-bottom: 4px;
	}

	.label {
		color: var(--color-tertiary-dim);
		letter-spacing: 0.05em;
	}

	.value {
		font-family: var(--font-led);
		color: var(--color-tertiary);
	}

	.value.highlight {
		color: var(--color-secondary);
		text-shadow: 0 0 6px var(--color-secondary-glow);
	}

	.value.success {
		color: var(--color-success);
	}

	.progress-bar {
		height: 4px;
		background: var(--color-void);
		border: 1px solid var(--color-tertiary-dim);
		margin-top: 4px;
	}

	.progress-fill {
		height: 100%;
		background: var(--color-tertiary);
		transition: width 0.2s ease;
	}

	.result-reason {
		font-size: 8px;
		color: var(--color-tertiary-dim);
		text-align: center;
		margin-top: 4px;
	}

	.idle-status {
		font-size: 10px;
		color: var(--color-tertiary-dim);
		text-align: center;
		padding: 8px;
		letter-spacing: 0.1em;
	}

	.controls {
		display: flex;
		gap: 4px;
	}

	.evo-btn {
		flex: 1;
		font-size: 9px;
		padding: 6px 8px;
		letter-spacing: 0.05em;
	}

	.evo-btn.primary {
		border-color: var(--color-tertiary);
		color: var(--color-tertiary);
	}

	.evo-btn.primary:hover:not(:disabled) {
		background: color-mix(in srgb, var(--color-tertiary) 15%, transparent);
		box-shadow: 0 0 8px var(--color-tertiary-glow);
	}

	.evo-btn.secondary {
		border-color: var(--color-secondary-dim);
		color: var(--color-secondary);
	}

	.evo-btn.secondary:hover {
		border-color: var(--color-secondary);
		box-shadow: 0 0 6px var(--color-secondary-glow);
	}

	.evo-btn.danger {
		border-color: var(--color-danger);
		color: var(--color-danger);
	}

	.evo-btn.danger:hover {
		background: color-mix(in srgb, var(--color-danger) 15%, transparent);
	}

	.settings {
		border: 1px solid var(--color-dim);
		padding: 6px;
	}

	.settings summary {
		font-size: 8px;
		color: var(--color-tertiary-dim);
		cursor: pointer;
		letter-spacing: 0.1em;
	}

	.settings[open] summary {
		margin-bottom: 8px;
		padding-bottom: 4px;
		border-bottom: 1px solid var(--color-dim);
	}

	.settings-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 6px;
	}

	.settings-grid label,
	.goal-select {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.settings-grid label span,
	.goal-select span {
		font-size: 8px;
		color: var(--color-tertiary-dim);
	}

	.settings-grid input,
	.goal-select select {
		font-size: 10px;
		padding: 3px 4px;
		background: var(--color-void);
		border: 1px solid var(--color-dim);
		color: var(--color-tertiary);
		font-family: var(--font-led);
	}

	.goal-select {
		margin-top: 6px;
	}

	.goal-select select {
		font-family: var(--font-mono);
	}
</style>
