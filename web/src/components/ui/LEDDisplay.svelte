<script lang="ts">
	type Color = "cyan" | "magenta" | "green" | "yellow";

	interface Props {
		value: string | number;
		label?: string;
		color?: Color;
		size?: "sm" | "md" | "lg";
		class?: string;
	}

	let { value, label, color = "cyan", size = "md", class: className = "" }: Props = $props();

	const colorClasses: Record<Color, string> = {
		cyan: "text-cyan",
		magenta: "text-magenta",
		green: "text-green",
		yellow: "text-yellow",
	};

	const sizeClasses: Record<string, string> = {
		sm: "text-sm",
		md: "text-md",
		lg: "text-lg",
	};
</script>

<div class="led-display {className}">
	{#if label}
		<span class="label">{label}</span>
	{/if}
	<span class="value {colorClasses[color]} {sizeClasses[size]}">{value}</span>
</div>

<style>
	.led-display {
		display: flex;
		align-items: baseline;
		gap: 8px;
	}

	.label {
		font-size: 9px;
		color: var(--color-cyan-dim);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.value {
		font-family: var(--font-led);
		letter-spacing: 0.05em;
	}

	.text-sm {
		font-size: 14px;
	}

	.text-md {
		font-size: 18px;
	}

	.text-lg {
		font-size: 24px;
	}

	.text-cyan {
		color: var(--color-cyan);
		text-shadow: 0 0 8px var(--color-cyan-glow);
	}

	.text-magenta {
		color: var(--color-magenta);
		text-shadow: 0 0 8px var(--color-magenta-glow);
	}

	.text-green {
		color: var(--color-green);
		text-shadow: 0 0 8px var(--color-green-glow);
	}

	.text-yellow {
		color: var(--color-yellow);
		text-shadow: 0 0 8px rgba(255, 255, 0, 0.3);
	}
</style>
