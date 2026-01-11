<script lang="ts">
	import type { Snippet } from "svelte";

	type BorderColor = "primary" | "secondary" | "tertiary";

	interface Props {
		title?: string;
		borderColor?: BorderColor;
		noPadding?: boolean;
		class?: string;
		children?: Snippet;
	}

	let { title, borderColor = "primary", noPadding = false, class: className = "", children }: Props = $props();

	const colorClasses: Record<BorderColor, string> = {
		primary: "border-primary",
		secondary: "border-secondary",
		tertiary: "border-tertiary",
	};
</script>

<div class="tui-box {colorClasses[borderColor]} {className}">
	<!-- Corner decorations -->
	<div class="corner top-left"></div>
	<div class="corner top-right"></div>
	<div class="corner bottom-left"></div>
	<div class="corner bottom-right"></div>

	{#if title}
		<div class="title {colorClasses[borderColor]}">{title}</div>
	{/if}

	<div class="content" class:no-padding={noPadding}>
		{@render children?.()}
	</div>
</div>

<style>
	.tui-box {
		position: relative;
		border: 1px solid;
		background: rgba(5, 5, 5, 0.8);
	}

	.border-primary {
		border-color: var(--color-primary-dim);
		box-shadow: 0 0 5px var(--color-primary-glow);
	}

	.border-secondary {
		border-color: var(--color-secondary-dim);
		box-shadow: 0 0 5px var(--color-secondary-glow);
	}

	.border-tertiary {
		border-color: var(--color-tertiary-dim);
		box-shadow: 0 0 5px var(--color-tertiary-glow);
	}

	/* Corner decorations */
	.corner {
		position: absolute;
		width: 6px;
		height: 6px;
		border: inherit;
		border-color: inherit;
	}

	.top-left {
		top: -1px;
		left: -1px;
		border-right: none;
		border-bottom: none;
	}

	.top-right {
		top: -1px;
		right: -1px;
		border-left: none;
		border-bottom: none;
	}

	.bottom-left {
		bottom: -1px;
		left: -1px;
		border-right: none;
		border-top: none;
	}

	.bottom-right {
		bottom: -1px;
		right: -1px;
		border-left: none;
		border-top: none;
	}

	/* Title */
	.title {
		position: absolute;
		top: -8px;
		left: 12px;
		padding: 0 6px;
		background: var(--color-void);
		font-size: 9px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.15em;
	}

	.title.border-primary {
		color: var(--color-primary);
		border: none;
		box-shadow: none;
	}

	.title.border-secondary {
		color: var(--color-secondary);
		border: none;
		box-shadow: none;
	}

	.title.border-tertiary {
		color: var(--color-tertiary);
		border: none;
		box-shadow: none;
	}

	/* Content */
	.content {
		height: 100%;
		width: 100%;
		padding: 12px;
	}

	.content.no-padding {
		padding: 0;
	}
</style>
