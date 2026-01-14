"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/themeStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { isDark, setDark } = useThemeStore();

    useEffect(() => {
        // Check system preference on mount
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        // Get stored preference or use system preference
        const stored = localStorage.getItem("agridrone-theme");
        if (stored) {
            const { state } = JSON.parse(stored);
            setDark(state.isDark);
        } else {
            setDark(prefersDark);
        }
    }, [setDark]);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDark);
    }, [isDark]);

    return <>{children}</>;
}
