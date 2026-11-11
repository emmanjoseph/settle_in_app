import { useState } from "react";
import { Linking, Platform, Pressable, Share, Text, View, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
    ArrowUp,
    ChevronLeft,
    CornerUpLeft,
    CornerUpRight,
    MapPin,
    Navigation,
    RotateCcw,
    Share2,
    type LucideIcon,
} from "lucide-react-native";
import { DirectionsMap, type RouteInfo, type Step } from "@/components/DirectionsMap";
import { getPropertyDetail } from "@/lib/properties";

const USE_MILES = false; // Kenya: km. Set true to match the mockup.

const formatDistance = (m: number) => {
    if (USE_MILES) {
        const mi = m / 1609.34;
        return mi < 0.1 ? `${Math.round(m * 3.281)} ft` : `${mi.toFixed(mi < 10 ? 1 : 0)} mi`;
    }
    return m < 1000 ? `${Math.round(m / 10) * 10} m` : `${(m / 1000).toFixed(m < 10000 ? 1 : 0)} km`;
};

const formatDuration = (s: number) => {
    const min = Math.max(1, Math.round(s / 60));
    return min < 60 ? `${min} min` : `${Math.floor(min / 60)} hr ${min % 60} min`;
};

function stepIcon(step: Step): LucideIcon {
    if (step.maneuver === "arrive") return MapPin;
    if (step.maneuver === "uturn" || step.modifier === "uturn") return RotateCcw;
    if (step.modifier?.includes("left")) return CornerUpLeft;
    if (step.modifier?.includes("right")) return CornerUpRight;
    return ArrowUp;
}

export default function DirectionsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const p = getPropertyDetail(id);
    const insets = useSafeAreaInsets();
    const [info, setInfo] = useState<RouteInfo | null>(null);

    // Make sure your property data has coordinates
    const destination = { latitude: p.latitude, longitude: p.longitude };

    const goBack = () => (router.canGoBack() ? router.back() : router.replace("/"));

    const share = () =>
        Share.share({
            message: `${p.title} · ${p.address}\nhttps://maps.google.com/?q=${destination.latitude},${destination.longitude}`,
        });

    const startNavigation = () => {
        const { latitude: lat, longitude: lng } = destination;
        Linking.openURL(
            Platform.select({
                ios: `http://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`,
                default: `google.navigation:q=${lat},${lng}`,
            }),
        );
    };

    const current = info?.steps[0];
    const next = info?.steps.slice(1, 4) ?? [];
    const CurrentIcon = current ? stepIcon(current) : ArrowUp;

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />

            {/* header */}
            <View
                className="flex-row items-center justify-between border-b border-neutral-100 bg-white px-4 pb-3"
                style={{ paddingTop: insets.top + 8 }}
            >
                <Pressable
                    onPress={goBack}
                    hitSlop={6}
                    accessibilityRole="button"
                    accessibilityLabel="Back"
                    className="h-10 w-10 items-center justify-center rounded-full active:bg-neutral-100"
                >
                    <ChevronLeft size={22} color="#0a0a0a" />
                </Pressable>
                <Text className="font-jakarta-semibold text-base text-neutral-950">Directions</Text>
                <Pressable
                    onPress={share}
                    hitSlop={6}
                    accessibilityRole="button"
                    accessibilityLabel="Share"
                    className="h-10 w-10 items-center justify-center rounded-full active:bg-neutral-100"
                >
                    <Share2 size={19} color="#0a0a0a" />
                </Pressable>
            </View>

            {/* map + overlays */}
            <View className="flex-1">
                <DirectionsMap destination={destination} onRoute={setInfo} />

                {/* property card */}
                <View
                    className="absolute inset-x-4 top-3 flex-row items-center gap-3 rounded-2xl bg-white p-2.5"
                    style={{
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowRadius: 12,
                        shadowOffset: { width: 0, height: 4 },
                        elevation: 6,
                    }}
                >
                    <Image
                        source={{ uri: p.images[0] }}
                        style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: "#e5e5e5" }}
                        contentFit="cover"
                    />
                    <View className="min-w-0 flex-1">
                        <Text className="font-jakarta-semibold text-sm text-neutral-950" numberOfLines={1}>
                            {p.title}
                        </Text>
                        <View className="mt-0.5 flex-row items-center gap-1">
                            <MapPin size={11} color="#737373" />
                            <Text className="flex-1 font-jakarta-regular text-xs text-neutral-500" numberOfLines={1}>
                                {p.address}
                            </Text>
                        </View>
                    </View>
                    {info && (
                        <View className="rounded-full bg-neutral-100 px-3 py-1.5">
                            <Text className="font-jakarta-semibold text-[11px] text-neutral-950">
                                {formatDistance(info.distance)} · {formatDuration(info.duration)}
                            </Text>
                        </View>
                    )}
                </View>

                {/* bottom sheet */}
                <View
                    className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white px-5 pt-3"
                    style={{
                        paddingBottom: Math.max(insets.bottom, 16),
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowRadius: 20,
                        shadowOffset: { width: 0, height: -6 },
                        elevation: 14,
                    }}
                >
                    <View className="mb-4 h-1 w-10 self-center rounded-full bg-neutral-200" />

                    {!info || !current ? (
                        <View className="h-40 items-center justify-center gap-3">
                            <ActivityIndicator color="#0d9488" />
                            <Text className="font-jakarta-regular text-sm text-neutral-500">Finding the best route…</Text>
                        </View>
                    ) : (
                        <>
                            {/* current step */}
                            <View className="flex-row items-center gap-4">
                                <View className="h-14 w-14 items-center justify-center rounded-2xl bg-teal-50">
                                    <CurrentIcon size={26} color="#0a0a0a" />
                                </View>
                                <View className="min-w-0 flex-1">
                                    <Text className="font-jakarta-medium text-[11px] uppercase tracking-widest text-neutral-500">
                                        In {formatDistance(current.distance)}
                                    </Text>
                                    <Text className="mt-0.5 font-jakarta-bold text-xl tracking-tight text-neutral-950">
                                        {current.instruction}
                                    </Text>
                                </View>
                            </View>

                            {/* next steps */}
                            {next.length > 0 && (
                                <View className="mt-5">
                                    <Text className="mb-1 font-jakarta-medium text-[11px] uppercase tracking-widest text-neutral-500">
                                        Next steps
                                    </Text>
                                    {next.map((s, i) => {
                                        const Icon = stepIcon(s);
                                        const arrive = s.maneuver === "arrive";
                                        return (
                                            <View
                                                key={`${s.instruction}-${i}`}
                                                className={`flex-row items-center gap-3 py-3 ${
                                                    i > 0 ? "border-t border-neutral-100" : ""
                                                }`}
                                            >
                                                <View
                                                    className={`h-9 w-9 items-center justify-center rounded-xl ${
                                                        arrive ? "bg-teal-50" : "bg-neutral-100"
                                                    }`}
                                                >
                                                    <Icon size={16} color={arrive ? "#0d9488" : "#0a0a0a"} />
                                                </View>
                                                <View className="min-w-0 flex-1">
                                                    <Text
                                                        className="font-jakarta-semibold text-sm text-neutral-950"
                                                        numberOfLines={1}
                                                    >
                                                        {s.instruction}
                                                    </Text>
                                                    <Text className="font-jakarta-regular text-xs text-neutral-500">
                                                        {arrive ? "Destination" : formatDistance(s.distance)}
                                                    </Text>
                                                </View>
                                            </View>
                                        );
                                    })}
                                </View>
                            )}
                        </>
                    )}

                    <Pressable
                        onPress={startNavigation}
                        accessibilityRole="button"
                        className="mt-4 h-14 flex-row items-center justify-center gap-2 rounded-2xl bg-neutral-900 active:opacity-90"
                    >
                        <Navigation size={16} color="#fafafa" />
                        <Text className="font-jakarta-semibold text-base text-neutral-50">Start Navigation</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}