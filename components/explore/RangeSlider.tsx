import { useRef, useState } from "react";
import { PanResponder, View } from "react-native";

export const TEAL = "#0d9488";
const THUMB = 20;

export function formatPrice(n: number) {
    if (n >= 1_000_000) {
        const m = n / 1_000_000;
        return `$${Number.isInteger(m) ? m : m.toFixed(1)}M`;
    }
    if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
    return `$${n}`;
}

type Props = {
    min: number;
    max: number;
    step: number;
    value: [number, number];
    onChange: (value: [number, number]) => void;
};

/** Dual-handle slider with no native dependency (PanResponder). */
export function RangeSlider({ min, max, step, value, onChange }: Props) {
    const [width, setWidth] = useState(0);
    const usable = Math.max(width - THUMB, 1);

    // refs so the (created-once) responders always see the latest values
    const latest = useRef({ min, max, step, value, usable, onChange });
    latest.current = { min, max, step, value, usable, onChange };
    const startX = useRef(0);

    const make = (idx: 0 | 1) =>
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderTerminationRequest: () => false,
            onPanResponderGrant: () => {
                const l = latest.current;
                startX.current = ((l.value[idx] - l.min) / (l.max - l.min)) * l.usable;
            },
            onPanResponderMove: (_, g) => {
                const l = latest.current;
                const x = Math.min(Math.max(startX.current + g.dx, 0), l.usable);
                let v = Math.round((l.min + (x / l.usable) * (l.max - l.min)) / l.step) * l.step;
                const [lo, hi] = l.value;
                if (idx === 0) l.onChange([Math.min(v, hi - l.step), hi]);
                else l.onChange([lo, Math.max(v, lo + l.step)]);
            },
        });

    const low = useRef(make(0)).current;
    const high = useRef(make(1)).current;

    const toX = (v: number) => ((v - min) / (max - min)) * usable;
    const [lo, hi] = value;
    const thumbStyle = {
        top: 2,
        borderColor: TEAL,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
    } as const;

    return (
        <View className="h-6 justify-center" onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
            <View className="absolute inset-x-0 h-1.5 rounded-full bg-neutral-100" />
            <View
                className="absolute h-1.5 rounded-full"
                style={{ left: toX(lo) + THUMB / 2, width: Math.max(toX(hi) - toX(lo), 0), backgroundColor: TEAL }}
            />
            <View
                {...low.panHandlers}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                className="absolute h-5 w-5 rounded-full border-2 bg-white"
                style={[thumbStyle, { left: toX(lo) }]}
            />
            <View
                {...high.panHandlers}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                className="absolute h-5 w-5 rounded-full border-2 bg-white"
                style={[thumbStyle, { left: toX(hi) }]}
            />
        </View>
    );
}