// Color scheme system
import { get, writable } from "svelte/store";

export interface ColorSchemeColors {
	// Primary accent
	primary: string;
	primaryDim: string;
	primaryGlow: string;

	// Secondary accent
	secondary: string;
	secondaryDim: string;
	secondaryGlow: string;

	// Tertiary accent
	tertiary: string;
	tertiaryDim: string;
	tertiaryGlow: string;

	// Alert colors
	success: string;
	warning: string;
	danger: string;
}

export interface ColorScheme {
	id: string;
	name: string;
	colors: ColorSchemeColors;
}

export const COLOR_SCHEMES: ColorScheme[] = [
	{
		id: "void",
		name: "VOID",
		colors: {
			primary: "#a855f7", // Purple
			primaryDim: "#6b21a8",
			primaryGlow: "rgba(168, 85, 247, 0.4)",
			secondary: "#3b82f6", // Electric blue
			secondaryDim: "#1e40af",
			secondaryGlow: "rgba(59, 130, 246, 0.4)",
			tertiary: "#ec4899", // Pink
			tertiaryDim: "#9d174d",
			tertiaryGlow: "rgba(236, 72, 153, 0.4)",
			success: "#a855f7",
			warning: "#f59e0b",
			danger: "#ef4444",
		},
	},
	{
		id: "neon-tokyo",
		name: "NEON TOKYO",
		colors: {
			primary: "#ff2d95", // Hot pink
			primaryDim: "#9d1a5a",
			primaryGlow: "rgba(255, 45, 149, 0.4)",
			secondary: "#00f0ff", // Electric cyan
			secondaryDim: "#0891b2",
			secondaryGlow: "rgba(0, 240, 255, 0.4)",
			tertiary: "#ffee00", // Neon yellow
			tertiaryDim: "#a38a00",
			tertiaryGlow: "rgba(255, 238, 0, 0.4)",
			success: "#00f0ff",
			warning: "#ffee00",
			danger: "#ff2d95",
		},
	},
	{
		id: "synthwave",
		name: "SYNTHWAVE",
		colors: {
			primary: "#f472b6", // Soft pink
			primaryDim: "#a21caf",
			primaryGlow: "rgba(244, 114, 182, 0.4)",
			secondary: "#818cf8", // Soft purple
			secondaryDim: "#4338ca",
			secondaryGlow: "rgba(129, 140, 248, 0.4)",
			tertiary: "#22d3ee", // Cyan
			tertiaryDim: "#0e7490",
			tertiaryGlow: "rgba(34, 211, 238, 0.4)",
			success: "#22d3ee",
			warning: "#fbbf24",
			danger: "#f43f5e",
		},
	},
	{
		id: "bloodmoon",
		name: "BLOODMOON",
		colors: {
			primary: "#dc2626", // Blood red
			primaryDim: "#7f1d1d",
			primaryGlow: "rgba(220, 38, 38, 0.4)",
			secondary: "#f97316", // Orange
			secondaryDim: "#9a3412",
			secondaryGlow: "rgba(249, 115, 22, 0.4)",
			tertiary: "#fbbf24", // Gold
			tertiaryDim: "#92400e",
			tertiaryGlow: "rgba(251, 191, 36, 0.4)",
			success: "#f97316",
			warning: "#fbbf24",
			danger: "#dc2626",
		},
	},
	{
		id: "toxic",
		name: "TOXIC",
		colors: {
			primary: "#84cc16", // Lime
			primaryDim: "#3f6212",
			primaryGlow: "rgba(132, 204, 22, 0.5)",
			secondary: "#facc15", // Yellow
			secondaryDim: "#854d0e",
			secondaryGlow: "rgba(250, 204, 21, 0.4)",
			tertiary: "#22c55e", // Green
			tertiaryDim: "#166534",
			tertiaryGlow: "rgba(34, 197, 94, 0.4)",
			success: "#22c55e",
			warning: "#facc15",
			danger: "#ef4444",
		},
	},
	{
		id: "ice",
		name: "ICE",
		colors: {
			primary: "#38bdf8", // Sky blue
			primaryDim: "#0369a1",
			primaryGlow: "rgba(56, 189, 248, 0.4)",
			secondary: "#e0f2fe", // Ice white
			secondaryDim: "#7dd3fc",
			secondaryGlow: "rgba(224, 242, 254, 0.3)",
			tertiary: "#a5b4fc", // Soft indigo
			tertiaryDim: "#4f46e5",
			tertiaryGlow: "rgba(165, 180, 252, 0.4)",
			success: "#38bdf8",
			warning: "#fcd34d",
			danger: "#f87171",
		},
	},
	{
		id: "hacker",
		name: "HACKER",
		colors: {
			primary: "#22c55e", // Terminal green
			primaryDim: "#166534",
			primaryGlow: "rgba(34, 197, 94, 0.5)",
			secondary: "#4ade80", // Light green
			secondaryDim: "#15803d",
			secondaryGlow: "rgba(74, 222, 128, 0.4)",
			tertiary: "#86efac", // Pale green
			tertiaryDim: "#22c55e",
			tertiaryGlow: "rgba(134, 239, 172, 0.3)",
			success: "#22c55e",
			warning: "#fbbf24",
			danger: "#ef4444",
		},
	},
	{
		id: "phosphor",
		name: "PHOSPHOR",
		colors: {
			primary: "#fef08a", // Phosphor yellow
			primaryDim: "#a16207",
			primaryGlow: "rgba(254, 240, 138, 0.5)",
			secondary: "#fde047", // Bright yellow
			secondaryDim: "#854d0e",
			secondaryGlow: "rgba(253, 224, 71, 0.4)",
			tertiary: "#fbbf24", // Amber
			tertiaryDim: "#92400e",
			tertiaryGlow: "rgba(251, 191, 36, 0.4)",
			success: "#a3e635",
			warning: "#fbbf24",
			danger: "#f87171",
		},
	},
];

// Current color scheme
export const currentScheme = writable<ColorScheme>(COLOR_SCHEMES[0]);

// Apply scheme to document
export function applyScheme(scheme: ColorScheme): void {
	const root = document.documentElement;
	const { colors } = scheme;

	root.style.setProperty("--color-primary", colors.primary);
	root.style.setProperty("--color-primary-dim", colors.primaryDim);
	root.style.setProperty("--color-primary-glow", colors.primaryGlow);

	root.style.setProperty("--color-secondary", colors.secondary);
	root.style.setProperty("--color-secondary-dim", colors.secondaryDim);
	root.style.setProperty("--color-secondary-glow", colors.secondaryGlow);

	root.style.setProperty("--color-tertiary", colors.tertiary);
	root.style.setProperty("--color-tertiary-dim", colors.tertiaryDim);
	root.style.setProperty("--color-tertiary-glow", colors.tertiaryGlow);

	root.style.setProperty("--color-success", colors.success);
	root.style.setProperty("--color-warning", colors.warning);
	root.style.setProperty("--color-danger", colors.danger);

	currentScheme.set(scheme);

	// Save to localStorage
	localStorage.setItem("autoverse-theme", scheme.id);
}

export function setScheme(id: string): void {
	const scheme = COLOR_SCHEMES.find((s) => s.id === id);
	if (scheme) {
		applyScheme(scheme);
	}
}

export function loadSavedScheme(): void {
	const saved = localStorage.getItem("autoverse-theme");
	if (saved) {
		const scheme = COLOR_SCHEMES.find((s) => s.id === saved);
		if (scheme) {
			applyScheme(scheme);
			return;
		}
	}
	// Default to first scheme
	applyScheme(COLOR_SCHEMES[0]);
}

export function nextScheme(): void {
	const current = get(currentScheme);
	const idx = COLOR_SCHEMES.findIndex((s) => s.id === current.id);
	const next = COLOR_SCHEMES[(idx + 1) % COLOR_SCHEMES.length];
	applyScheme(next);
}
