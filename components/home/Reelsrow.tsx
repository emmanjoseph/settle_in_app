import { memo } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { ChevronRight, Eye, Heart, Play } from "lucide-react-native";
import { REELS } from "@/lib/reels";

const CARD_W = 148;
const CARD_H = 248; // roughly 9:15, close to a vertical video
const GAP = 12;

type Reel = (typeof REELS)[number];

const fmtCount = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K` : String(n);

function Glass({ children, style }: { children: React.ReactNode; style?: object }) {
    return (
        <View
            style={[
                {
                    borderRadius: 999,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.3)",
                    backgroundColor: "rgba(255,255,255,0.14)",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                },
                style,
            ]}
        >
            <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill} />
            {children}
        </View>
    );
}

const ReelCard = memo(function ReelCard({ reel, onPress }: { reel: Reel; onPress: () => void }) {
    // `creator` / `creatorAvatar` / `views` are optional: the row hides them if your data lacks them
    const r = reel as Reel & { creator?: string; creatorAvatar?: string; views?: number };

    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`Open reel: ${reel.title}`}
            className="overflow-hidden rounded-[28px] bg-neutral-200 active:scale-[0.97]"
            style={{
                width: CARD_W,
                height: CARD_H,
                shadowColor: "#000",
                shadowOpacity: 0.12,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
            }}
        >
            <Image source={{ uri: reel.image }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
            <LinearGradient
                pointerEvents="none"
                colors={["rgba(0,0,0,0.35)", "rgba(0,0,0,0)", "rgba(0,0,0,0.82)"]}
                locations={[0, 0.4, 1]}
                style={StyleSheet.absoluteFill}
            />

            {/* top: price + play */}
            <View className="absolute inset-x-2.5 top-2.5 flex-row items-center justify-between">
                <Glass>
                    <Text className="px-2.5 py-1 font-jakarta-bold text-[11px] text-white">{reel.priceLabel}</Text>
                </Glass>
                <Glass style={{ width: 28, height: 28 }}>
                    <Play size={12} color="#ffffff" fill="#ffffff" />
                </Glass>
            </View>

            {/* bottom: title, creator, stats */}
            <View className="absolute inset-x-3 bottom-3 gap-2">
                <Text className="font-jakarta-bold text-[13px] leading-[17px] text-white" numberOfLines={2}>
                    {reel.title}
                </Text>

                {r.creator ? (
                    <View className="flex-row items-center gap-1.5">
                        {r.creatorAvatar ? (
                            <Image
                                source={{ uri: r.creatorAvatar }}
                                style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 1, borderColor: "rgba(255,255,255,0.6)" }}
                                contentFit="cover"
                            />
                        ) : null}
                        <Text className="flex-1 font-jakarta-medium text-[11px] text-white/85" numberOfLines={1}>
                            {r.creator}
                        </Text>
                    </View>
                ) : null}

                <View className="flex-row items-center gap-3">
                    <View className="flex-row items-center gap-1">
                        <Heart size={12} color="#ffffff" fill="#ffffff" />
                        <Text className="font-jakarta-medium text-[11px] text-white">{fmtCount(reel.likes)}</Text>
                    </View>
                    {r.views != null ? (
                        <View className="flex-row items-center gap-1">
                            <Eye size={12} color="#ffffff" />
                            <Text className="font-jakarta-medium text-[11px] text-white">{fmtCount(r.views)}</Text>
                        </View>
                    ) : null}
                </View>
            </View>
        </Pressable>
    );
});

/** Horizontal strip of reel thumbnails. Place it between posts in the Home feed. */
export function ReelsRow() {
    const openReels = (start = 0) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push({ pathname: "/reels", params: { start: String(start) } });
    };

    return (
        <View className="gap-3">
            <View className="flex-row items-center justify-between">
                <View>
                    <Text className="font-jakarta-bold text-lg tracking-tight text-neutral-950">Reels</Text>
                    <Text className="font-jakarta-regular text-xs text-neutral-500">Quick home tours</Text>
                </View>
                <Pressable
                    onPress={() => openReels(0)}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="See all reels"
                    className="flex-row items-center rounded-full bg-neutral-100 py-1.5 pl-3 pr-2 active:bg-neutral-200"
                >
                    <Text className="font-jakarta-semibold text-xs text-neutral-950">See all</Text>
                    <ChevronRight size={14} color="#0a0a0a" />
                </Pressable>
            </View>

            {/* -mx-6 lets the strip bleed to the screen edges inside the padded feed */}
            <FlatList
                horizontal
                data={REELS}
                keyExtractor={(r) => r.id}
                showsHorizontalScrollIndicator={false}
                className="-mx-6"
                snapToInterval={CARD_W + GAP}
                decelerationRate="fast"
                contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 8, gap: GAP }}
                renderItem={({ item, index }) => <ReelCard reel={item} onPress={() => openReels(index)} />}
            />
        </View>
    );
}