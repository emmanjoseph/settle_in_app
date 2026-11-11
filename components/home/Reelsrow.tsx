import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Film, Heart, Play } from "lucide-react-native";
import { REELS } from "@/lib/reels";

const CARD_W = 132;
const CARD_H = 208;

const fmtCount = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K` : String(n);

/** Horizontal strip of reel thumbnails. Place it between posts in the Home feed. */
export function ReelsRow() {
    const openReels = (start = 0) => router.push({ pathname: "/reels", params: { start: String(start) } });

    return (
        <View className="gap-3">
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                    <Film size={16} color="#0a0a0a" />
                    <Text className="font-jakarta-bold text-base text-neutral-950">Reels</Text>
                </View>
                <Pressable onPress={() => openReels(0)} hitSlop={8}>
                    <Text className="font-jakarta-medium text-sm text-teal-600">See all</Text>
                </Pressable>
            </View>

            {/* -mx-6 lets the strip bleed to the screen edges inside the padded feed */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="-mx-6"
                contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
            >
                {REELS.map((reel, i) => (
                    <Pressable
                        key={reel.id}
                        onPress={() => openReels(i)}
                        accessibilityRole="button"
                        accessibilityLabel={`Open reel: ${reel.title}`}
                        className="overflow-hidden rounded-2xl bg-neutral-200"
                        style={{ width: CARD_W, height: CARD_H }}
                    >
                        <Image source={{ uri: reel.image }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
                        <LinearGradient
                            pointerEvents="none"
                            colors={["rgba(0,0,0,0.25)", "rgba(0,0,0,0)", "rgba(0,0,0,0.8)"]}
                            locations={[0, 0.45, 1]}
                            style={StyleSheet.absoluteFill}
                        />

                        <View className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5">
                            <Text className="font-jakarta-semibold text-[10px] text-neutral-950">{reel.priceLabel}</Text>
                        </View>
                        <View className="absolute right-2 top-2 h-6 w-6 items-center justify-center rounded-full bg-black/30">
                            <Play size={12} color="#ffffff" fill="#ffffff" />
                        </View>

                        <View className="absolute inset-x-2 bottom-2 gap-1">
                            <Text className="font-jakarta-semibold text-xs leading-4 text-white" numberOfLines={2}>
                                {reel.title}
                            </Text>
                            <View className="flex-row items-center gap-1">
                                <Heart size={11} color="#ffffff" fill="#ffffff" />
                                <Text className="font-jakarta-medium text-[11px] text-white/90">{fmtCount(reel.likes)}</Text>
                            </View>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
}