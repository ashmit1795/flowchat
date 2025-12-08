import { create } from "zustand";

const useThemeStore = create((set) => ({
	theme: localStorage.getItem("flowchat-theme") || "forest",
	setTheme: (newTheme) => {
		localStorage.setItem("flowchat-theme", newTheme);
		set({ theme: newTheme });
	},
}));

export default useThemeStore;