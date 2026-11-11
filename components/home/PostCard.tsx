import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import {
    Bath,
    BadgeCheck,
    BedDouble,
    Bookmark,
    Heart,
    MapPin,
    MessageCircle,
    MoreHorizontal,
    Share2,
    SlidersHorizontal,
} from "lucide-react-native";

export type Post = {
    id: string;
    user: string;
    handle?: string;
    avatar: string;
    subtitle: string;
    image: string;
    listingType: "For Sale" | "For Rent";
    title: string;
    location: string;
    price: string;
    likes: number;
    shares?: number;
    comments?: number;
    postedAgo: string;
    caption: string;
    initiallyLiked?: boolean;
    menuIcon?: "filters" | "more";
    beds?: number;
    baths?: number;
};

const RED = "#f87171";
const WHITE = "#fafafa";

function formatCount(n: number) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
    return String(n);
}

function Glass({
                   children,
                   radius = 999,
                   style,
               }: {
    children: React.ReactNode;
    radius?: number;
    style?: object;
}) {
    return (
        <View
            style={[
                {
                    borderRadius: radius,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.35)",
                },
                style,
            ]}
        >
            <BlurView
                intensity={35}
                tint="light"
                style={{ flexDirection: "row", alignItems: "center" }}
            >
                {children}
            </BlurView>
        </View>
    );
}

function RailButton({
                        onPress,
                        count,
                        children,
                    }: {
    onPress?: () => void;
    count?: number;
    children: React.ReactNode;
}) {
    return (
        <Pressable onPress={onPress} hitSlop={6} className="items-center gap-1">
            <Glass>
                <View className="h-12 w-12 items-center justify-center">{children}</View>
            </Glass>
            {count != null && (
                <Text className="font-jakarta-semibold text-xs text-white">
                    {formatCount(count)}
                </Text>
            )}
        </Pressable>
    );
}

export function PostCard({ post }: { post: Post }) {
    const [liked, setLiked] = useState(!!post.initiallyLiked);
    const [saved, setSaved] = useState(false);
    const MenuIcon = post.menuIcon === "filters" ? SlidersHorizontal : MoreHorizontal;
    const likeCount = post.likes + (liked && !post.initiallyLiked ? 1 : 0);

    return (
        <View className="aspect-[4/5] w-full overflow-hidden rounded-[35px] bg-neutral-200">
            <Image
                source={{ uri: post.image }}
                className="h-full w-full"
                resizeMode="cover"
            />

            {/* legibility gradients */}
            <LinearGradient
                colors={["rgba(0,0,0,0.5)", "transparent"]}
                style={{ position: "absolute", top: 0, left: 0, right: 0, height: "45%" }}
            />
            <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.7)"]}
                style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "55%" }}
            />

            {/* top: listing headline + menu */}
            <View className="absolute inset-x-4 top-4 flex-row items-start justify-between">
                <View className="flex-1 gap-2 pr-3">
                    <View className="flex-row items-center gap-2">
                        <View className="rounded-full bg-teal-600 px-3 py-1">
                            <Text className="font-jakarta-semibold text-xs text-white">
                                {post.listingType}
                            </Text>
                        </View>
                        <Glass>
                            <Text className="px-3 py-1 font-jakarta-semibold text-xs text-white">
                                {post.price}
                            </Text>
                        </Glass>
                    </View>
                    <Text
                        className="font-jakarta-bold text-xl leading-7 text-white"
                        numberOfLines={2}
                    >
                        {post.title}
                    </Text>
                    <View className="flex-row items-center gap-1">
                        <MapPin size={16} color={WHITE} />
                        <Text className="font-jakarta-regular text-sm text-white/85">
                            {post.location}
                        </Text>
                    </View>
                </View>

                <Pressable hitSlop={10}>
                    <Glass style={{ height: 36, width: 36 }}>
                        <View className="h-9 w-9 items-center justify-center">
                            <MenuIcon size={18} color={WHITE} />
                        </View>
                    </Glass>
                </Pressable>
            </View>

            {/* right: vertical action rail */}
            <View className="absolute bottom-4 right-3 items-center gap-4">
                <RailButton onPress={() => setLiked((v) => !v)} count={likeCount}>
                    <Heart
                        size={22}
                        color={liked ? RED : WHITE}
                        fill={liked ? RED : "transparent"}
                    />
                </RailButton>
                <RailButton onPress={() => setSaved((v) => !v)}>
                    <Bookmark
                        size={20}
                        color={WHITE}
                        fill={saved ? WHITE : "transparent"}
                    />
                </RailButton>
                <RailButton count={post.shares ?? 0}>
                    <Share2 size={20} color={WHITE} />
                </RailButton>
                <RailButton count={post.comments ?? 0}>
                    <MessageCircle size={20} color={WHITE} />
                </RailButton>
            </View>

            {/* bottom-left: publisher + beds/baths + caption */}
            <View className="absolute bottom-4 left-4 right-20 gap-3">
                {(post.beds != null || post.baths != null) && (
                    <View className="flex-row gap-2">
                        {post.beds != null && (
                            <Glass>
                                <View className="flex-row items-center gap-1.5 px-3 py-1.5">
                                    <BedDouble size={16} color={WHITE} />
                                    <Text className="font-jakarta-semibold text-xs text-white">
                                        {post.beds} beds
                                    </Text>
                                </View>
                            </Glass>
                        )}
                        {post.baths != null && (
                            <Glass>
                                <View className="flex-row items-center gap-1.5 px-3 py-1.5">
                                    <Bath size={16} color={WHITE} />
                                    <Text className="font-jakarta-semibold text-xs text-white">
                                        {post.baths} baths
                                    </Text>
                                </View>
                            </Glass>
                        )}
                    </View>
                )}

                <View className="flex-row items-center gap-2.5">
                    <Image
                        source={{ uri: post.avatar }}
                        className="h-12 w-12 rounded-full border-2 border-white/70 bg-neutral-100"
                    />
                    <View className="flex-1">
                        <View className="flex-row items-center gap-1.5">
                            <Text
                                className="font-jakarta-semibold text-base text-white"
                                numberOfLines={1}
                            >
                                {post.user}
                            </Text>
                            <BadgeCheck size={14} color="#5eead4" />
                        </View>
                        <Text
                            className="font-jakarta-regular text-xs text-white/70"
                            numberOfLines={1}
                        >
                            {post.handle ? `@${post.handle}` : post.subtitle} · {post.postedAgo}
                        </Text>
                    </View>
                </View>

                <Text
                    className="font-jakarta-medium text-sm leading-5 text-white/90"
                    numberOfLines={2}
                >
                    {post.caption}
                </Text>
            </View>
        </View>
    );
}