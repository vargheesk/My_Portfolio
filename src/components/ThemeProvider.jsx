import { useEffect } from "react";

export function ThemeProvider({ children }) {
    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");

        // Check if user has a stored preference
        if (storedTheme) {
            // Use user's stored preference
            if (storedTheme === "dark") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        } else {
            // No stored preference - use system preference
            const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            if (systemPrefersDark) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        }

        // Listen for system theme changes (when no user preference is set)
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleSystemThemeChange = (e) => {
            // Only apply system theme if user hasn't set a preference
            if (!localStorage.getItem("theme")) {
                if (e.matches) {
                    document.documentElement.classList.add("dark");
                } else {
                    document.documentElement.classList.remove("dark");
                }
            }
        };

        mediaQuery.addEventListener("change", handleSystemThemeChange);

        return () => {
            mediaQuery.removeEventListener("change", handleSystemThemeChange);
        };
    }, []);

    return <>{children}</>;
}
