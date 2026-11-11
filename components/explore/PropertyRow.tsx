import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { ArrowUpRight, Bath, BedDouble, Heart, MapPin, Maximize2 } from "lucide-react-native";

export type Property = {
    id: string;
    title: string;
    location: string;
    priceLabel: string;
    price: number;
    type: "House" | "Apartment" | "Villa" | "Studio" | "Commercial";
    beds: number;
    baths: number;
    area: string;
    image: string;
    latitude: number;
    longitude: number;
};

const RED = "#dc2626";

function Glass({ children, style }: { children: React.ReactNode; style?: object }) {
    return (
        <View
            style={[
                {
                    borderRadius: 999,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.35)",
                    backgroundColor: "rgba(255,255,255,0.12)",
                    alignItems: "center",
                    justifyContent: "center",
                },
                style,
            ]}
        >
            <BlurView intensity={35} tint="light" style={StyleSheet.absoluteFill} />
            {children}
        </View>
    );
}

function Stat({ icon, value }: { icon: React.ReactNode; value: string | number }) {
    return (
        <View className="flex-row items-center gap-1">
            {icon}
            <Text className="font-jakarta-medium text-xs text-neutral-600">{value}</Text>
        </View>
    );
}

export function PropertyRow({
                                property: p,
                                liked,
                                onToggleLike,
                                onPress,
                                className
                            }: {
    property: Property;
    liked: boolean;
    onToggleLike: () => void;
    onPress?: () => void;
    className?: string
}) {
    const router = useRouter();

    const open = () =>
        onPress ? onPress() : router.push({ pathname: "/details/[id]", params: { id: p.id } });

    const like = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onToggleLike();
    };

    return (
        <Pressable
            onPress={open}
            accessibilityRole="button"
            accessibilityLabel={`${p.title}, ${p.priceLabel}, ${p.location}`}
            className={`flex-row rounded-[28px] bg-neutral-100 p-2 active:scale-[0.98] active:opacity-95 ${className}`}

        >
            {/* photo */}
            <View className="h-36 w-36 overflow-hidden rounded-[22px] bg-neutral-100">
                <Image source={{ uri: p.image }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
                <LinearGradient
                    pointerEvents="none"
                    colors={["rgba(0,0,0,0.35)", "transparent", "rgba(0,0,0,0.2)"]}
                    style={StyleSheet.absoluteFill}
                />

                <Pressable
                    onPress={like}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel={liked ? "Remove from saved" : "Save"}
                    className="absolute right-2 top-2"
                >
                    <Glass style={{ width: 30, height: 30 }}>
                        <Heart size={14} color={liked ? RED : "#ffffff"} fill={liked ? RED : "transparent"} />
                    </Glass>
                </Pressable>
            </View>

            {/* info */}
            <View className="min-w-0 flex-1 justify-between py-1 pl-3.5 pr-1">
                <View className="gap-1">
                    <Text
                        className="font-jakarta-bold text-base leading-snug tracking-tight text-neutral-950 truncate"
                        numberOfLines={2}
                    >
                        {p.title}
                    </Text>
                    <View className="flex-row items-center gap-1">
                        <MapPin size={12} color="#737373" />
                        <Text className="flex-1 font-jakarta-medium text-[13px] text-neutral-500" numberOfLines={1}>
                            {p.location}
                        </Text>
                    </View>
                </View>

                <View className="gap-2.5">
                    <View className="flex-row items-center gap-3.5">
                        <Stat icon={<BedDouble size={14} color="#737373" />} value={p.beds} />
                        <Stat icon={<Bath size={14} color="#737373" />} value={p.baths} />
                        <Stat icon={<Maximize2 size={13} color="#737373" />} value={p.area} />
                    </View>

                    <View className="flex-row items-center justify-between">
                        <Text className="font-jakarta-bold text-lg tracking-tight text-neutral-950">
                            {p.priceLabel}
                        </Text>
                        <View className="h-9 w-9 items-center justify-center rounded-full bg-neutral-950">
                            <ArrowUpRight size={16} color="#ffffff" />
                        </View>
                    </View>
                </View>
            </View>
        </Pressable>
    );
}