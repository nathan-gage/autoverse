<script lang="ts">
	import TUIBox from "../ui/TUIBox.svelte";
	import Slider from "../ui/Slider.svelte";
	import {
		simulationStore,
		play,
		pause,
		step,
		reset,
		setStepsPerFrame,
		systemLog,
	} from "../../stores/simulation";
	import { settings, setMode, setBrushSize, setBrushIntensity } from "../../stores/settings";
	import type { InteractionMode } from "../../types";

	let speed = $state(1);

	function handleSpeedChange(value: number) {
		speed = value;
		setStepsPerFrame(value);
	}

	function handleModeChange(mode: InteractionMode) {
		setMode(mode);
	}

	const modes: { id: InteractionMode; label: string; icon: string }[] = [
		{ id: "view", label: "VIEW", icon: "&#9673;" },
		{ id: "select", label: "SEL", icon: "&#9633;" },
		{ id: "draw", label: "DRAW", icon: "&#9998;" },
		{ id: "erase", label: "ERASE", icon: "&#9747;" },
	];

	function formatLogTime(timestamp: number): string {
		const date = new Date(timestamp);
		return date.toLocaleTimeString("en-US", {
			hour12: false,
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});
	}
</script>

<aside class="left-sidebar">
	<!-- System Control Panel -->
	<TUIBox title="SYS.CONTROL" borderColor="primary">
		<div class="control-grid">
			<button
				class="control-btn"
				class:active={!$simulationStore.playing}
				onclick={() => ($simulationStore.playing ? pause() : play())}
			>
				{#if $simulationStore.playing}
					<span class="icon">&#9724;</span>
					<span class="label">PAUSE</span>
				{:else}
					<span class="icon">&#9654;</span>
					<span class="label">PLAY</span>
				{/if}
			</button>
			<button class="control-btn" onclick={() => step()}>
				<span class="icon">&#9655;</span>
				<span class="label">STEP</span>
			</button>
			<button class="control-btn" onclick={() => reset()}>
				<span class="icon">&#8634;</span>
				<span class="label">RESET</span>
			</button>
		</div>

		<div class="speed-control">
			<Slider
				label="SIM SPEED"
				bind:value={speed}
				min={1}
				max={10}
				step={1}
				color="primary"
				valueFormat={(v) => `${v}X`}
				onchange={handleSpeedChange}
			/>
		</div>
	</TUIBox>

	<!-- Tool Kit Panel -->
	<TUIBox title="TOOL.KIT" borderColor="tertiary">
		<div class="tool-grid">
			{#each modes as mode}
				<button
					class="tool-btn"
					class:active={$settings.mode === mode.id}
					onclick={() => handleModeChange(mode.id)}
				>
					<span class="icon">{@html mode.icon}</span>
					<span class="label">{mode.label}</span>
				</button>
			{/each}
		</div>

		{#if $settings.mode === "draw" || $settings.mode === "erase"}
			<div class="brush-settings">
				<Slider
					label="BRUSH SIZE"
					value={$settings.brushSize}
					min={1}
					max={30}
					step={1}
					color="tertiary"
					valueFormat={(v) => `${v}PX`}
					onchange={setBrushSize}
				/>
				{#if $settings.mode === "draw"}
					<Slider
						label="INTENSITY"
						value={$settings.brushIntensity}
						min={0}
						max={1}
						step={0.05}
						color="tertiary"
						valueFormat={(v) => `${Math.round(v * 100)}%`}
						onchange={setBrushIntensity}
					/>
				{/if}
			</div>
		{/if}
	</TUIBox>

	<!-- Debug Log Panel -->
	<TUIBox title="DEBUG.LOG" borderColor="secondary" class="debug-log-box">
		<div class="log-container">
			{#each $systemLog as entry}
				<div class="log-entry {entry.level}">
					<span class="log-prefix">&gt;</span>
					<span class="log-message">{entry.message}</span>
				</div>
			{/each}
		</div>
	</TUIBox>
</aside>

<style>
	.left-sidebar {
		width: 220px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		flex-shrink: 0;
	}

	/* Control Grid */
	.control-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 4px;
		margin-bottom: 12px;
	}

	.control-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		padding: 8px 4px;
		font-size: 8px;
	}

	.control-btn .icon {
		font-size: 14px;
	}

	.control-btn .label {
		font-size: 8px;
		letter-spacing: 0.1em;
	}

	.speed-control {
		margin-top: 8px;
	}

	/* Tool Grid */
	.tool-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 4px;
		margin-bottom: 8px;
	}

	.tool-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		padding: 8px 4px;
		border-color: var(--color-tertiary-dim);
		color: var(--color-tertiary);
	}

	.tool-btn:hover {
		background: color-mix(in srgb, var(--color-tertiary) 10%, transparent);
		border-color: var(--color-tertiary);
	}

	.tool-btn.active {
		background: color-mix(in srgb, var(--color-tertiary) 15%, transparent);
		border-color: var(--color-tertiary);
		box-shadow: 0 0 10px var(--color-tertiary-glow);
	}

	.tool-btn .icon {
		font-size: 14px;
	}

	.tool-btn .label {
		font-size: 8px;
		letter-spacing: 0.1em;
	}

	.brush-settings {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-top: 8px;
		padding-top: 8px;
		border-top: 1px solid var(--color-tertiary-dim);
	}

	/* Debug Log */
	.left-sidebar :global(.debug-log-box) {
		flex: 1;
		min-height: 0;
	}

	.log-container {
		height: 100%;
		overflow-y: auto;
		font-size: 10px;
		font-family: var(--font-mono);
	}

	.log-entry {
		display: flex;
		gap: 4px;
		padding: 2px 0;
		color: var(--color-primary-dim);
	}

	.log-entry.success {
		color: var(--color-success);
	}

	.log-entry.warn {
		color: var(--color-warning);
	}

	.log-entry.error {
		color: var(--color-danger);
	}

	.log-prefix {
		color: var(--color-secondary);
		flex-shrink: 0;
	}

	.log-message {
		word-break: break-word;
	}

	@media (max-width: 900px) {
		.left-sidebar {
			width: 100%;
		}

		.control-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		.tool-grid {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	@media (max-width: 600px) {
		.tool-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
