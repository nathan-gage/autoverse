<script lang="ts">
	import TUIBox from "../ui/TUIBox.svelte";
	import EvolutionPanel from "../evolution/EvolutionPanel.svelte";
	import {
		simulationStore,
		formattedStep,
		formattedTime,
		formattedMass,
		switchBackend,
		getManager,
		reset,
		log,
	} from "../../stores/simulation";
	import { presets, deletePreset, downloadPresets, importPresets } from "../../stores/presets";
	import { startDragFromLibrary } from "../../stores/interaction";
	import { BUILTIN_PRESETS } from "../../presets";
	import type { Preset, Seed } from "../../types";

	// Get kernel params from config
	$: kernel = $simulationStore.config.kernels[0];

	function handleBackendToggle() {
		const newBackend = $simulationStore.backend === "cpu" ? "gpu" : "cpu";
		switchBackend(newBackend);
	}

	function handlePresetClick(preset: Preset) {
		const manager = getManager();
		if (!manager) return;

		// Place preset at center
		const centerX = Math.floor((manager.getWidth() - preset.region.width) / 2);
		const centerY = Math.floor((manager.getHeight() - preset.region.height) / 2);
		manager.placeRegion(preset.region, centerX, centerY);
	}

	function handleBuiltinClick(builtin: (typeof BUILTIN_PRESETS)[0]) {
		reset(builtin.seed as Seed);
		log(`Loaded pattern: ${builtin.name}`, "info");
	}

	function handleDeletePreset(e: MouseEvent, id: string) {
		e.stopPropagation();
		deletePreset(id);
	}

	function handleExport() {
		downloadPresets();
	}

	function handleImport() {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".json";
		input.onchange = async (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (!file) return;
			const text = await file.text();
			try {
				importPresets(text);
			} catch {
				// Error already logged
			}
		};
		input.click();
	}

	// Drag handling for presets
	function handleDragStart(e: DragEvent, preset: Preset) {
		e.dataTransfer!.effectAllowed = "copy";
		e.dataTransfer!.setData("text/plain", preset.id);
		startDragFromLibrary(preset, e);
	}
</script>

<aside class="right-sidebar">
	<!-- Evolution Panel -->
	<EvolutionPanel />

	<!-- Stats Panel - redesigned -->
	<TUIBox title="METRICS" borderColor="secondary">
		<div class="metric-display">
			<div class="metric-main">
				<span class="metric-value">{$formattedStep}</span>
				<span class="metric-unit">STEPS</span>
			</div>
			<div class="metric-row">
				<div class="metric-item">
					<span class="metric-label">TIME</span>
					<span class="metric-num">{$formattedTime}s</span>
				</div>
				<div class="metric-item">
					<span class="metric-label">MASS</span>
					<span class="metric-num highlight">{$formattedMass}</span>
				</div>
			</div>
			<div class="metric-row">
				<div class="metric-item">
					<span class="metric-label">FPS</span>
					<span class="metric-num accent">{$simulationStore.fps}</span>
				</div>
				<div class="metric-item">
					<span class="metric-label">BACKEND</span>
					<button
						class="backend-btn"
						class:gpu={$simulationStore.backend === "gpu"}
						disabled={!$simulationStore.gpuAvailable}
						onclick={handleBackendToggle}
					>
						{$simulationStore.backend.toUpperCase()}
					</button>
				</div>
			</div>
		</div>
	</TUIBox>

	<!-- Kernel Config -->
	<TUIBox title="KERNEL" borderColor="primary">
		<div class="config-grid">
			<div class="config-item">
				<span class="cfg-label">mu</span>
				<span class="cfg-value">{kernel?.mu ?? "—"}</span>
			</div>
			<div class="config-item">
				<span class="cfg-label">sigma</span>
				<span class="cfg-value">{kernel?.sigma ?? "—"}</span>
			</div>
			<div class="config-item">
				<span class="cfg-label">R</span>
				<span class="cfg-value">{$simulationStore.config.kernel_radius}</span>
			</div>
			<div class="config-item">
				<span class="cfg-label">dt</span>
				<span class="cfg-value">{$simulationStore.config.dt}</span>
			</div>
		</div>
	</TUIBox>

	<!-- Built-in Patterns -->
	<TUIBox title="SEEDS" borderColor="tertiary">
		<div class="builtin-grid">
			{#each BUILTIN_PRESETS as builtin}
				<button class="builtin-btn" onclick={() => handleBuiltinClick(builtin)} title={builtin.description}>
					{builtin.name}
				</button>
			{/each}
		</div>
	</TUIBox>

	<!-- Saved Patterns -->
	<TUIBox title="SAVED" borderColor="primary" class="saved-box">
		<div class="patterns-header">
			<button class="small-btn" onclick={handleImport}>IMPORT</button>
			<button class="small-btn" onclick={handleExport}>EXPORT</button>
		</div>

		<div class="preset-list">
			{#each $presets as preset (preset.id)}
				<div
					class="preset-item"
					draggable="true"
					onclick={() => handlePresetClick(preset)}
					onkeydown={(e) => e.key === "Enter" && handlePresetClick(preset)}
					ondragstart={(e) => handleDragStart(e, preset)}
					role="button"
					tabindex="0"
				>
					<div class="preset-thumbnail">
						{#if preset.thumbnail}
							<img src={preset.thumbnail} alt={preset.name} />
						{/if}
					</div>
					<div class="preset-info">
						<span class="preset-name">{preset.name}</span>
						<span class="preset-size">{preset.region.width}x{preset.region.height}</span>
					</div>
					<button class="delete-btn" onclick={(e) => handleDeletePreset(e, preset.id)}>
						&#10005;
					</button>
				</div>
			{:else}
				<div class="empty-state">No saved patterns</div>
			{/each}
		</div>
	</TUIBox>
</aside>

<style>
	.right-sidebar {
		width: 180px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		flex-shrink: 0;
		overflow-y: auto;
		padding-top: 4px;
	}

	/* Metrics Display */
	.metric-display {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.metric-main {
		text-align: center;
		padding: 8px 0;
		border-bottom: 1px solid var(--color-secondary-dim);
	}

	.metric-value {
		display: block;
		font-family: var(--font-led);
		font-size: 22px;
		color: var(--color-primary);
		text-shadow: 0 0 10px var(--color-primary-glow);
		letter-spacing: 0.1em;
	}

	.metric-unit {
		font-size: 8px;
		color: var(--color-primary-dim);
		letter-spacing: 0.2em;
	}

	.metric-row {
		display: flex;
		justify-content: space-between;
	}

	.metric-item {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.metric-label {
		font-size: 8px;
		color: var(--color-primary-dim);
		letter-spacing: 0.1em;
	}

	.metric-num {
		font-family: var(--font-led);
		font-size: 14px;
		color: var(--color-primary);
	}

	.metric-num.highlight {
		color: var(--color-secondary);
	}

	.metric-num.accent {
		color: var(--color-tertiary);
	}

	.backend-btn {
		font-size: 9px;
		padding: 2px 6px;
		border-color: var(--color-secondary-dim);
		color: var(--color-secondary);
		font-family: var(--font-led);
	}

	.backend-btn.gpu {
		background: color-mix(in srgb, var(--color-secondary) 15%, transparent);
		box-shadow: 0 0 6px var(--color-secondary-glow);
	}

	/* Config Grid */
	.config-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 6px;
	}

	.config-item {
		display: flex;
		justify-content: space-between;
		font-size: 10px;
	}

	.cfg-label {
		color: var(--color-primary-dim);
	}

	.cfg-value {
		color: var(--color-primary);
		font-family: var(--font-led);
	}

	/* Built-in Patterns */
	.builtin-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4px;
	}

	.builtin-btn {
		font-size: 8px;
		padding: 6px 4px;
		border-color: var(--color-tertiary-dim);
		color: var(--color-tertiary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.builtin-btn:hover {
		background: color-mix(in srgb, var(--color-tertiary) 10%, transparent);
		border-color: var(--color-tertiary);
		box-shadow: 0 0 8px var(--color-tertiary-glow);
	}

	/* Saved Patterns */
	.right-sidebar :global(.saved-box) {
		flex: 1;
		min-height: 120px;
		display: flex;
		flex-direction: column;
	}

	.patterns-header {
		display: flex;
		gap: 4px;
		margin-bottom: 8px;
	}

	.small-btn {
		flex: 1;
		font-size: 8px;
		padding: 3px 4px;
	}

	.preset-list {
		flex: 1;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.preset-item {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 4px;
		border: 1px solid var(--color-dim);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.preset-item:hover {
		border-color: var(--color-primary-dim);
		background: color-mix(in srgb, var(--color-primary) 5%, transparent);
	}

	.preset-thumbnail {
		width: 28px;
		height: 28px;
		background: var(--color-void);
		border: 1px solid var(--color-dim);
		flex-shrink: 0;
		overflow: hidden;
	}

	.preset-thumbnail img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		image-rendering: pixelated;
	}

	.preset-info {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 1px;
	}

	.preset-name {
		font-size: 9px;
		color: var(--color-primary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.preset-size {
		font-size: 8px;
		color: var(--color-primary-dim);
		font-family: var(--font-led);
	}

	.delete-btn {
		width: 16px;
		height: 16px;
		padding: 0;
		font-size: 9px;
		border-color: transparent;
		color: var(--color-muted);
		flex-shrink: 0;
	}

	.delete-btn:hover {
		border-color: var(--color-danger);
		color: var(--color-danger);
		background: color-mix(in srgb, var(--color-danger) 10%, transparent);
	}

	.empty-state {
		font-size: 9px;
		color: var(--color-primary-dim);
		text-align: center;
		padding: 12px 4px;
	}
</style>
