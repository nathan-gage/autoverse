// Mobile store - state for mobile UI layout and interactions
import { derived, get, writable } from "svelte/store";

export type MobileTab = "controls" | "display" | "presets" | "patterns";

export interface MobileState {
	isMobile: boolean;
	activeTab: MobileTab;
	swipeOffset: number;
	isSwiping: boolean;
}

const MOBILE_BREAKPOINT = 900;
const TABS: MobileTab[] = ["controls", "display", "presets", "patterns"];

function createMobileStore() {
	const { subscribe, set, update } = writable<MobileState>({
		isMobile: typeof window !== "undefined" && window.innerWidth <= MOBILE_BREAKPOINT,
		activeTab: "controls",
		swipeOffset: 0,
		isSwiping: false,
	});

	return {
		subscribe,
		set,
		update,

		// Check viewport and update mobile state
		checkViewport: () => {
			if (typeof window === "undefined") return;
			const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
			update((s) => ({ ...s, isMobile }));
		},

		// Set active tab
		setTab: (tab: MobileTab) => {
			update((s) => ({ ...s, activeTab: tab, swipeOffset: 0 }));
		},

		// Navigate to next/previous tab
		nextTab: () => {
			update((s) => {
				const currentIndex = TABS.indexOf(s.activeTab);
				const nextIndex = Math.min(currentIndex + 1, TABS.length - 1);
				return { ...s, activeTab: TABS[nextIndex], swipeOffset: 0 };
			});
		},

		prevTab: () => {
			update((s) => {
				const currentIndex = TABS.indexOf(s.activeTab);
				const prevIndex = Math.max(currentIndex - 1, 0);
				return { ...s, activeTab: TABS[prevIndex], swipeOffset: 0 };
			});
		},

		// Swipe handling
		startSwipe: () => {
			update((s) => ({ ...s, isSwiping: true }));
		},

		updateSwipe: (offset: number) => {
			update((s) => ({ ...s, swipeOffset: offset }));
		},

		endSwipe: (containerWidth: number) => {
			const state = get({ subscribe });
			const threshold = containerWidth * 0.2;
			const offset = state.swipeOffset;

			if (Math.abs(offset) > threshold) {
				if (offset > 0) {
					// Swiped right -> go to previous tab
					const currentIndex = TABS.indexOf(state.activeTab);
					if (currentIndex > 0) {
						set({
							...state,
							activeTab: TABS[currentIndex - 1],
							swipeOffset: 0,
							isSwiping: false,
						});
						return;
					}
				} else {
					// Swiped left -> go to next tab
					const currentIndex = TABS.indexOf(state.activeTab);
					if (currentIndex < TABS.length - 1) {
						set({
							...state,
							activeTab: TABS[currentIndex + 1],
							swipeOffset: 0,
							isSwiping: false,
						});
						return;
					}
				}
			}

			// Snap back if threshold not met
			update((s) => ({ ...s, swipeOffset: 0, isSwiping: false }));
		},
	};
}

export const mobileStore = createMobileStore();

// Derived store for current tab index
export const currentTabIndex = derived(mobileStore, ($m) => TABS.indexOf($m.activeTab));

// Export tab list for iteration
export const MOBILE_TABS = TABS;
