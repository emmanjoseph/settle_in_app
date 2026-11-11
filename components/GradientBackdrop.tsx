import { LinearGradient } from "expo-linear-gradient";

/**
 * Soft teal wash for the top of a screen. Render it as a sibling *before* the
 * ScrollView (inside a flex-1 container) so it stays fixed at the top of the
 * screen while the content scrolls over it. It fades into neutral-50.
 */
export function GradientBackdrop({ height = 340 }: { height?: number }) {
    return (
        <LinearGradient
            pointerEvents="none"
    colors={["#e3f2fd", "#dbefff", "#ffffff"]} // teal-200 → teal-100 → neutral-50
    locations={[0, 0.5, 1]}
    style={{ position: "absolute", top: 0, left: 0, right: 0, height }}
    />
);
}