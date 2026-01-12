<script lang="ts">
	import { mobileStore, currentTabIndex, MOBILE_TABS, type MobileTab } from "../../stores/mobile";
	import {
		simulationStore,
		play,
		pause,
		step,
		reset,
		setStepsPerFrame,
		switchBackend,
		getManager,
		log,
		formattedStep,
		formattedMass,
	} from "../../stores/simulation";
	import { settings, setMode, setBrushSize, setBrushIntensity, setColorScheme, toggleScanlines } from "../../stores/settings";
	import { presets, deletePreset, downloadPresets, importPresets } from "../../stores/presets";
	import { startDragFromLibrary } from "../../stores/interaction";
	import { BUILTIN_PRESETS } from "../../presets";
	import type { InteractionMode, ColorScheme, Preset, Seed } from "../../types";

	let panelsContainer: HTMLDivElement;
	let swipeStartX = 0;
	let swipeCurrentX = 0;
	let speed = $state(1);

	// Touch handling for swipe navigation
	function handleTouchStart(e: TouchEvent) {
		const touch = e.touches[0];
		swipeStartX = touch.clientX;
		swipeCurrentX = touch.clientX;
		mobileStore.startSwipe();
	}

	function handleTouchMove(e: TouchEvent) {
		if (!$mobileStore.isSwiping) return;

		const touch = e.touches[0];
		swipeCurrentX = touch.clientX;
		const diff = swipeCurrentX - swipeStartX;

		// Limit swipe at edges
		const tabIndex = $currentTabIndex;
		if ((tabIndex === 0 && diff > 0) || (tabIndex === MOBILE_TABS.length - 1 && diff < 0)) {
			mobileStore.updateSwipe(diff * 0.3); // Resistance at edges
		} else {
			mobileStore.updateSwipe(diff);
		}
	}

	function handleTouchEnd() {
		if (!$mobileStore.isSwiping || !panelsContainer) return;
		mobileStore.endSwipe(panelsContainer.clientWidth);
	}

	function handleTabClick(tab: MobileTab) {
		mobileStore.setTab(tab);
	}

	// Speed control
	function handleSpeedChange(delta: number) {
		speed = Math.max(1, Math.min(10, speed + delta));
		setStepsPerFrame(speed);
	}

	// Tool mode buttons
	const modes: { id: InteractionMode; label: string; icon: string }[] = [
		{ id: "view", label: "VIEW", icon: "◉" },
		{ id: "select", label: "SEL", icon: "□" },
		{ id: "draw", label: "DRAW", icon: "✎" },
		{ id: "erase", label: "ERASE", icon: "✗" },
	];

	// Color schemes
	const colorSchemes: { id: ColorScheme; label: string }[] = [
		{ id: "theme", label: "THEME" },
		{ id: "grayscale", label: "GRAY" },
		{ id: "thermal", label: "THERMAL" },
		{ id: "viridis", label: "VIRIDIS" },
	];

	function handlePresetClick(preset: Preset) {
		const manager = getManager();
		if (!manager) return;
		const centerX = Math.floor((manager.getWidth() - preset.region.width) / 2);
		const centerY = Math.floor((manager.getHeight() - preset.region.height) / 2);
		manager.placeRegion(preset.region, centerX, centerY);
	}

	function handleBuiltinClick(builtin: (typeof BUILTIN_PRESETS)[0]) {
		reset(builtin.seed as Seed);
		log(`Loaded: ${builtin.name}`, "info");
	}

	// Long press for delete
	let pressTimer: ReturnType<typeof setTimeout> | null = null;

	function handlePresetTouchStart(preset: Preset) {
		pressTimer = setTimeout(() => {
			if (confirm(`Delete "${preset.name}"?`)) {
				deletePreset(preset.id);
			}
		}, 500);
	}

	function handlePresetTouchEnd() {
		if (pressTimer) {
			clearTimeout(pressTimer);
			pressTimer = null;
		}
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
				// Error logged in store
			}
		};
		input.click();
	}

	// Compute transform for panels wrapper
	let panelTransform = $derived.by(() => {
		const baseOffset = -$currentTabIndex * 100;
		const swipePercent = panelsContainer ? ($mobileStore.swipeOffset / panelsContainer.clientWidth) * 100 : 0;
		return `translateX(${baseOffset + swipePercent}%)`;
	});
</script>

<div class="bottom-sheet">
	<!-- Stats Bar -->
	<div class="mobile-stats">
		<div class="stats-group">
			<span>STEP: <strong>{$formattedStep}</strong></span>
			<span>MASS: <strong>{$formattedMass}</strong></span>
			<span>FPS: <strong>{$simulationStore.fps}</strong></span>
		</div>
		<div class="backend-toggle">
			<span class="backend-label" class:active={$simulationStore.backend === "cpu"}>CPU</span>
			<button
				class="toggle-btn"
				class:gpu={$simulationStore.backend === "gpu"}
				disabled={!$simulationStore.gpuAvailable}
				onclick={() => switchBackend($simulationStore.backend === "cpu" ? "gpu" : "cpu")}
				aria-label="Toggle between CPU and GPU backend"
			>
				<span class="toggle-knob"></span>
			</button>
			<span class="backend-label" class:active={$simulationStore.backend === "gpu"} class:unavailable={!$simulationStore.gpuAvailable}>GPU</span>
		</div>
	</div>

	<!-- Tab Navigation -->
	<div class="tabs">
		{#each MOBILE_TABS as tab, i}
			<button
				class="tab"
				class:active={$mobileStore.activeTab === tab}
				onclick={() => handleTabClick(tab)}
			>
				{tab.toUpperCase()}
			</button>
		{/each}
	</div>

	<!-- Swipeable Panels -->
	<div
		class="panels-container"
		bind:this={panelsContainer}
		ontouchstart={handleTouchStart}
		ontouchmove={handleTouchMove}
		ontouchend={handleTouchEnd}
		ontouchcancel={handleTouchEnd}
	>
		<div
			class="panels-wrapper"
			class:swiping={$mobileStore.isSwiping}
			style="transform: {panelTransform}"
		>
			<!-- Controls Panel -->
			<div class="panel">
				<div class="playback-controls">
					<button
						class="play-btn"
						class:active={$simulationStore.playing}
						onclick={() => ($simulationStore.playing ? pause() : play())}
					>
						{#if $simulationStore.playing}
							<span class="icon">⏸</span>
						{:else}
							<span class="icon">▶</span>
						{/if}
					</button>
					<button class="ctrl-btn" onclick={() => step()}>
						<span class="icon">⏭</span>
					</button>
					<button class="ctrl-btn" onclick={() => reset()}>
						<span class="icon">↺</span>
					</button>
					<div class="speed-control">
						<button class="speed-btn" onclick={() => handleSpeedChange(-1)}>−</button>
						<strong>{speed}X</strong>
						<button class="speed-btn" onclick={() => handleSpeedChange(1)}>+</button>
					</div>
				</div>

				<div class="tools-grid">
					{#each modes as mode}
						<button
							class="tool-btn"
							class:active={$settings.mode === mode.id}
							onclick={() => setMode(mode.id)}
						>
							<span class="icon">{mode.icon}</span>
							<span class="label">{mode.label}</span>
						</button>
					{/each}
				</div>

				{#if $settings.mode === "draw" || $settings.mode === "erase"}
					<div class="brush-settings">
						<div class="brush-row">
							<label>SIZE</label>
							<input
								type="range"
								min="1"
								max="30"
								value={$settings.brushSize}
								oninput={(e) => setBrushSize(parseInt(e.currentTarget.value))}
							/>
							<span>{$settings.brushSize}</span>
						</div>
						{#if $settings.mode === "draw"}
							<div class="brush-row">
								<label>INTENSITY</label>
								<input
									type="range"
									min="0"
									max="100"
									value={Math.round($settings.brushIntensity * 100)}
									oninput={(e) => setBrushIntensity(parseInt(e.currentTarget.value) / 100)}
								/>
								<span>{Math.round($settings.brushIntensity * 100)}%</span>
							</div>
						{/if}
					</div>
				{/if}
			</div>

			<!-- Display Panel -->
			<div class="panel">
				<div class="display-section">
					<label class="section-label">COLOR SCHEME</label>
					<div class="scheme-grid">
						{#each colorSchemes as scheme}
							<button
								class="scheme-btn"
								class:active={$settings.colorScheme === scheme.id}
								onclick={() => setColorScheme(scheme.id)}
							>
								{scheme.label}
							</button>
						{/each}
					</div>
				</div>

				<div class="display-section">
					<label class="section-label">EFFECTS</label>
					<div class="toggle-row">
						<span>CRT Scanlines</span>
						<button
							class="toggle-btn small"
							class:on={$settings.showScanlines}
							onclick={toggleScanlines}
							aria-label="Toggle CRT scanlines effect"
						>
							<span class="toggle-knob"></span>
						</button>
					</div>
				</div>
			</div>

			<!-- Presets Panel -->
			<div class="panel">
				<div class="preset-actions">
					<button class="action-btn" onclick={handleImport}>IMPORT</button>
					<button class="action-btn" onclick={downloadPresets}>EXPORT</button>
				</div>

				<div class="preset-grid">
					{#each $presets as preset (preset.id)}
						<div
							class="preset-item"
							onclick={() => handlePresetClick(preset)}
							onkeydown={(e) => e.key === "Enter" && handlePresetClick(preset)}
							ontouchstart={() => handlePresetTouchStart(preset)}
							ontouchend={handlePresetTouchEnd}
							ontouchmove={handlePresetTouchEnd}
							role="button"
							tabindex="0"
						>
							{#if preset.thumbnail}
								<img src={preset.thumbnail} alt={preset.name} />
							{:else}
								<div class="preset-placeholder"></div>
							{/if}
							<span class="preset-name">{preset.name}</span>
							<span class="preset-size">{preset.region.width}×{preset.region.height}</span>
						</div>
					{:else}
						<div class="empty-state">No saved patterns</div>
					{/each}
				</div>
			</div>

			<!-- Patterns Panel -->
			<div class="panel">
				<div class="builtin-grid">
					{#each BUILTIN_PRESETS as builtin}
						<button
							class="builtin-btn"
							onclick={() => handleBuiltinClick(builtin)}
						>
							<span class="builtin-name">{builtin.name}</span>
							<span class="builtin-desc">{builtin.description}</span>
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- Swipe Indicator Dots -->
	<div class="swipe-indicator">
		{#each MOBILE_TABS as tab, i}
			<button
				class="dot"
				class:active={$currentTabIndex === i}
				onclick={() => mobileStore.setTab(tab)}
				aria-label="Go to {tab} panel"
			></button>
		{/each}
	</div>
</div>

<style>
	.bottom-sheet {
		display: flex;
		flex-direction: column;
		background: var(--color-void);
		border-top: 1px solid var(--color-primary-dim);
		max-height: 45vh;
		min-height: 180px;
	}

	/* Stats Bar */
	.mobile-stats {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 6px 12px;
		background: var(--color-void-light);
		font-size: 10px;
		border-bottom: 1px solid var(--color-dim);
	}

	.stats-group {
		display: flex;
		gap: 12px;
		color: var(--color-primary-dim);
	}

	.stats-group strong {
		color: var(--color-primary);
		font-family: var(--font-led);
	}

	.backend-toggle {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.backend-label {
		font-size: 9px;
		color: var(--color-muted);
		transition: color 0.2s;
	}

	.backend-label.active {
		color: var(--color-primary);
	}

	.backend-label.unavailable {
		opacity: 0.4;
		text-decoration: line-through;
	}

	.toggle-btn {
		position: relative;
		width: 32px;
		height: 16px;
		padding: 0;
		background: var(--color-void);
		border: 1px solid var(--color-primary-dim);
		border-radius: 8px;
	}

	.toggle-btn .toggle-knob {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 10px;
		height: 10px;
		background: var(--color-muted);
		border-radius: 50%;
		transition: all 0.2s;
	}

	.toggle-btn.gpu .toggle-knob,
	.toggle-btn.on .toggle-knob {
		left: 18px;
		background: var(--color-primary);
	}

	.toggle-btn.small {
		width: 28px;
		height: 14px;
	}

	.toggle-btn.small .toggle-knob {
		width: 8px;
		height: 8px;
		top: 2px;
		left: 2px;
	}

	.toggle-btn.small.on .toggle-knob {
		left: 16px;
	}

	/* Tabs */
	.tabs {
		display: flex;
		border-bottom: 1px solid var(--color-dim);
		overflow-x: auto;
		scrollbar-width: none;
		-webkit-overflow-scrolling: touch;
	}

	.tabs::-webkit-scrollbar {
		display: none;
	}

	.tab {
		flex: 1;
		padding: 8px 12px;
		background: none;
		border: none;
		border-bottom: 2px solid transparent;
		color: var(--color-muted);
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.1em;
		white-space: nowrap;
	}

	.tab.active {
		color: var(--color-primary);
		border-bottom-color: var(--color-primary);
	}

	/* Panels Container */
	.panels-container {
		flex: 1;
		overflow: hidden;
		touch-action: pan-y;
	}

	.panels-wrapper {
		display: flex;
		height: 100%;
		transition: transform 0.3s ease;
		will-change: transform;
	}

	.panels-wrapper.swiping {
		transition: none;
	}

	.panel {
		flex: 0 0 100%;
		width: 100%;
		overflow-y: auto;
		padding: 12px;
		-webkit-overflow-scrolling: touch;
	}

	/* Playback Controls */
	.playback-controls {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 12px;
	}

	.play-btn {
		width: 44px;
		height: 44px;
		padding: 0;
		border-color: var(--color-primary);
	}

	.play-btn.active {
		background: color-mix(in srgb, var(--color-primary) 20%, transparent);
		box-shadow: 0 0 10px var(--color-primary-glow);
	}

	.play-btn .icon {
		font-size: 18px;
	}

	.ctrl-btn {
		width: 40px;
		height: 40px;
		padding: 0;
	}

	.ctrl-btn .icon {
		font-size: 16px;
	}

	.speed-control {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-left: auto;
		color: var(--color-primary);
		font-family: var(--font-led);
		font-size: 14px;
	}

	.speed-btn {
		width: 28px;
		height: 28px;
		padding: 0;
		font-size: 16px;
	}

	/* Tools Grid */
	.tools-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 6px;
		margin-bottom: 12px;
	}

	.tool-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		padding: 10px 4px;
		border-color: var(--color-tertiary-dim);
		color: var(--color-tertiary);
	}

	.tool-btn.active {
		background: color-mix(in srgb, var(--color-tertiary) 15%, transparent);
		border-color: var(--color-tertiary);
		box-shadow: 0 0 8px var(--color-tertiary-glow);
	}

	.tool-btn .icon {
		font-size: 16px;
	}

	.tool-btn .label {
		font-size: 8px;
		letter-spacing: 0.1em;
	}

	/* Brush Settings */
	.brush-settings {
		background: var(--color-void-light);
		border: 1px solid var(--color-dim);
		padding: 10px;
	}

	.brush-row {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 6px;
	}

	.brush-row:last-child {
		margin-bottom: 0;
	}

	.brush-row label {
		font-size: 9px;
		color: var(--color-tertiary-dim);
		min-width: 60px;
		letter-spacing: 0.1em;
	}

	.brush-row input[type="range"] {
		flex: 1;
	}

	.brush-row span {
		font-family: var(--font-led);
		font-size: 12px;
		color: var(--color-tertiary);
		min-width: 36px;
		text-align: right;
	}

	/* Display Panel */
	.display-section {
		margin-bottom: 16px;
	}

	.section-label {
		display: block;
		font-size: 9px;
		color: var(--color-primary-dim);
		letter-spacing: 0.1em;
		margin-bottom: 8px;
	}

	.scheme-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 6px;
	}

	.scheme-btn {
		padding: 8px;
		font-size: 9px;
		border-color: var(--color-secondary-dim);
		color: var(--color-secondary);
	}

	.scheme-btn.active {
		background: color-mix(in srgb, var(--color-secondary) 15%, transparent);
		border-color: var(--color-secondary);
		box-shadow: 0 0 8px var(--color-secondary-glow);
	}

	.toggle-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 0;
		font-size: 11px;
		color: var(--color-primary);
	}

	/* Preset Actions */
	.preset-actions {
		display: flex;
		gap: 8px;
		margin-bottom: 12px;
	}

	.action-btn {
		flex: 1;
		padding: 8px;
		font-size: 9px;
	}

	/* Preset Grid */
	.preset-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
		gap: 8px;
	}

	.preset-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 8px;
		background: var(--color-void-light);
		border: 1px solid var(--color-dim);
		cursor: pointer;
		transition: all 0.15s;
	}

	.preset-item:active {
		background: color-mix(in srgb, var(--color-primary) 10%, transparent);
		border-color: var(--color-primary-dim);
	}

	.preset-item img {
		width: 48px;
		height: 48px;
		background: var(--color-void);
		image-rendering: pixelated;
		margin-bottom: 6px;
	}

	.preset-placeholder {
		width: 48px;
		height: 48px;
		background: var(--color-dim);
		margin-bottom: 6px;
	}

	.preset-name {
		font-size: 9px;
		color: var(--color-primary);
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
	}

	.preset-size {
		font-size: 8px;
		color: var(--color-muted);
		font-family: var(--font-led);
	}

	.empty-state {
		grid-column: 1 / -1;
		text-align: center;
		padding: 24px;
		color: var(--color-muted);
		font-size: 11px;
	}

	/* Builtin Grid */
	.builtin-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 8px;
	}

	.builtin-btn {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: 10px;
		text-align: left;
		border-color: var(--color-tertiary-dim);
		color: var(--color-tertiary);
	}

	.builtin-btn:active {
		background: color-mix(in srgb, var(--color-tertiary) 15%, transparent);
		border-color: var(--color-tertiary);
	}

	.builtin-name {
		font-size: 11px;
		font-weight: 600;
		margin-bottom: 2px;
	}

	.builtin-desc {
		font-size: 9px;
		color: var(--color-muted);
		font-weight: normal;
	}

	/* Swipe Indicator */
	.swipe-indicator {
		display: flex;
		justify-content: center;
		gap: 8px;
		padding: 8px 0;
		background: var(--color-void);
	}

	.dot {
		width: 8px;
		height: 8px;
		padding: 0;
		border-radius: 50%;
		background: var(--color-dim);
		border: 1px solid var(--color-muted);
		transition: all 0.2s;
	}

	.dot.active {
		background: var(--color-primary);
		border-color: var(--color-primary);
		box-shadow: 0 0 6px var(--color-primary-glow);
	}
</style>
