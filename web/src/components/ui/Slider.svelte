<script lang="ts">
	type Color = "primary" | "secondary" | "tertiary";

	interface Props {
		value: number;
		min?: number;
		max?: number;
		step?: number;
		label?: string;
		showValue?: boolean;
		valueFormat?: (v: number) => string;
		color?: Color;
		onchange?: (value: number) => void;
	}

	let {
		value = $bindable(),
		min = 0,
		max = 100,
		step = 1,
		label,
		showValue = true,
		valueFormat = (v: number) => String(v),
		color = "tertiary",
		onchange,
	}: Props = $props();

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		value = parseFloat(target.value);
		onchange?.(value);
	}
</script>

<div class="slider-container">
	{#if label || showValue}
		<div class="slider-header">
			{#if label}
				<span class="label">{label}</span>
			{/if}
			{#if showValue}
				<span class="value {color}">{valueFormat(value)}</span>
			{/if}
		</div>
	{/if}
	<input type="range" class={color} {min} {max} {step} {value} oninput={handleInput} />
</div>

<style>
	.slider-container {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.slider-header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	.label {
		font-size: 9px;
		color: var(--color-primary-dim);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.value {
		font-family: var(--font-led);
		font-size: 12px;
	}

	.value.primary {
		color: var(--color-primary);
	}

	.value.secondary {
		color: var(--color-secondary);
	}

	.value.tertiary {
		color: var(--color-tertiary);
	}

	input[type="range"] {
		width: 100%;
	}

	input[type="range"].primary::-webkit-slider-thumb {
		border-color: var(--color-primary);
		box-shadow: 0 0 8px var(--color-primary-glow);
	}

	input[type="range"].secondary::-webkit-slider-thumb {
		border-color: var(--color-secondary);
		box-shadow: 0 0 8px var(--color-secondary-glow);
	}

	input[type="range"].tertiary::-webkit-slider-thumb {
		border-color: var(--color-tertiary);
		box-shadow: 0 0 8px var(--color-tertiary-glow);
	}
</style>
