<script lang="ts">
	interface Props {
		text: string;
		class?: string;
	}

	let { text, class: className = "" }: Props = $props();
</script>

<span class="glitch-text {className}" data-text={text}>{text}</span>

<style>
	.glitch-text {
		position: relative;
		display: inline-block;
	}

	.glitch-text::before,
	.glitch-text::after {
		content: attr(data-text);
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: var(--color-void);
	}

	.glitch-text::before {
		left: 2px;
		text-shadow: -1px 0 var(--color-magenta);
		clip: rect(24px, 9999px, 90px, 0);
		animation: glitch-anim-2 3s infinite linear alternate-reverse;
	}

	.glitch-text::after {
		left: -2px;
		text-shadow: -1px 0 var(--color-green);
		clip: rect(85px, 9999px, 140px, 0);
		animation: glitch-anim 2.5s infinite linear alternate-reverse;
	}

	@keyframes glitch-anim {
		0% {
			clip: rect(10px, 9999px, 31px, 0);
		}
		20% {
			clip: rect(76px, 9999px, 92px, 0);
		}
		40% {
			clip: rect(24px, 9999px, 56px, 0);
		}
		60% {
			clip: rect(62px, 9999px, 12px, 0);
		}
		80% {
			clip: rect(86px, 9999px, 34px, 0);
		}
		100% {
			clip: rect(5px, 9999px, 72px, 0);
		}
	}

	@keyframes glitch-anim-2 {
		0% {
			clip: rect(29px, 9999px, 86px, 0);
		}
		20% {
			clip: rect(4px, 9999px, 19px, 0);
		}
		40% {
			clip: rect(98px, 9999px, 21px, 0);
		}
		60% {
			clip: rect(12px, 9999px, 54px, 0);
		}
		80% {
			clip: rect(66px, 9999px, 33px, 0);
		}
		100% {
			clip: rect(1px, 9999px, 91px, 0);
		}
	}
</style>
