/**
 * Triggers a vibration pattern if the device supports it.
 * @param {number|number[]} pattern - The vibration pattern (e.g., 200 or [100, 50, 100])
 */
export const vibrate = (pattern = 10) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
            navigator.vibrate(pattern);
        } catch (e) {
            // Ignore errors if vibration fails (e.g. user interaction requirements)
            console.warn("Vibration failed:", e);
        }
    }
};
