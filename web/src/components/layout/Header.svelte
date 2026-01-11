<script lang="ts">
	import { simulationStore } from "../../stores/simulation";
	import { currentScheme, nextScheme, COLOR_SCHEMES, setScheme } from "../../stores/themes";
</script>

<header class="header">
	<div class="header-left">
		<pre class="ascii-logo">{`
 ▄▀▄ █ █ ▀█▀ ▄▀▄ █ █ █▀▀ █▀▄ ▄▀▀ █▀▀
 █▀█ █▄█  █  █ █ ▀▄▀ ██▄ █▀▄ ▄██ ██▄`}</pre>
	</div>
	<div class="header-right">
		<div class="theme-picker">
			<span class="picker-label">THEME</span>
			<div class="theme-swatches">
				{#each COLOR_SCHEMES as scheme}
					<button
						class="swatch"
						class:active={$currentScheme.id === scheme.id}
						style="--swatch-color: {scheme.colors.primary}"
						onclick={() => setScheme(scheme.id)}
						title={scheme.name}
					></button>
				{/each}
			</div>
		</div>
		<div class="backend-indicator" class:gpu={$simulationStore.backend === "gpu"}>
			<span class="backend-label">COMPUTE</span>
			<span class="backend-value">{$simulationStore.backend.toUpperCase()}</span>
		</div>
	</div>
</header>

<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 6px 16px;
		border-bottom: 1px solid var(--color-primary-dim);
		background: linear-gradient(180deg, color-mix(in srgb, var(--color-primary) 3%, transparent) 0%, transparent 100%);
	}

	.header-left {
		display: flex;
		align-items: center;
	}

	.ascii-logo {
		font-family: var(--font-mono);
		font-size: 10px;
		line-height: 1.1;
		color: var(--color-primary);
		margin: 0;
		text-shadow: 0 0 10px var(--color-primary-glow);
		white-space: pre;
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 20px;
	}

	/* Theme Picker */
	.theme-picker {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 4px;
	}

	.picker-label {
		font-size: 8px;
		color: var(--color-primary-dim);
		letter-spacing: 0.1em;
	}

	.theme-swatches {
		display: flex;
		gap: 4px;
	}

	.swatch {
		width: 14px;
		height: 14px;
		padding: 0;
		border: 1px solid var(--color-muted);
		background: var(--swatch-color);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.swatch:hover {
		transform: scale(1.2);
		box-shadow: 0 0 8px var(--swatch-color);
	}

	.swatch.active {
		border-color: white;
		box-shadow: 0 0 10px var(--swatch-color);
	}

	/* Backend Indicator */
	.backend-indicator {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 1px;
	}

	.backend-label {
		font-size: 8px;
		color: var(--color-primary-dim);
		letter-spacing: 0.1em;
	}

	.backend-value {
		font-family: var(--font-led);
		font-size: 16px;
		color: var(--color-primary);
		letter-spacing: 0.05em;
	}

	.backend-indicator.gpu .backend-value {
		color: var(--color-secondary);
		text-shadow: 0 0 8px var(--color-secondary-glow);
	}

	.backend-indicator.gpu .backend-label {
		color: var(--color-secondary-dim);
	}

	@media (max-width: 900px) {
		.header {
			flex-direction: column;
			align-items: flex-start;
			gap: 8px;
			padding: 8px 12px;
		}

		.header-right {
			width: 100%;
			justify-content: space-between;
		}

		.theme-picker,
		.backend-indicator {
			align-items: flex-start;
		}

		.ascii-logo {
			font-size: 9px;
		}
	}

	@media (max-width: 600px) {
		.header-right {
			flex-direction: column;
			align-items: flex-start;
			gap: 12px;
		}
	}
</style>
