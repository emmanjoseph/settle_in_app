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
    SlidersHorizontal,
} from "lucide-react-native";

export type Post = {
    id: string;
    user: string;
    avatar: string;
    subtitle: string;
    image: string;
    listingType: "For Sale" | "For Rent";
    title: string;
    location: string;
    price: string;
    likes: number;
    postedAgo: string;
    caption: string;
    initiallyLiked?: boolean;
    menuIcon?: "filters" | "more";
    beds?: number;
    baths?: number;
};

const RED = "#f87171";
const WHITE = "#fafafa";

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

            {/* legibility gradients (top text + bottom glass bar) */}
            <LinearGradient
                colors={["rgba(0,0,0,0.55)", "transparent"]}
                style={{ position: "absolute", top: 0, left: 0, right: 0, height: "60%" }}
            />
            <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.65)"]}
                style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%" }}
            />

            {/* publisher */}
            <View className="absolute inset-x-4 top-4 flex-row items-center justify-between">
                <View className="flex-row items-center gap-2.5">
                    <Image
                        source={{ uri: post.avatar }}
                        className="h-10 w-10 rounded-full border border-white/60 bg-neutral-100"
                    />
                    <View>
                        <View className="flex-row items-center gap-1.5">
                            <Text className="font-jakarta-semibold text-sm text-white">
                                {post.user}
                            </Text>
                            <BadgeCheck size={14} color="#5eead4" />
                        </View>
                        <Text className="font-jakarta-regular text-xs text-white/70">
                            {post.postedAgo} · {post.subtitle}
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

            {/* headline block */}
            <View className="absolute inset-x-4 top-20 gap-2">
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
                    className="font-jakarta-bold text-xl leading-9 text-white"
                    numberOfLines={3}
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

            {/* caption + glass action bar */}
            <View className="absolute inset-x-3 bottom-3 gap-3">
                <Text
                    className="px-1 font-jakarta-medium text-sm leading-5 text-white/90"
                    numberOfLines={2}
                >
                    {post.caption}
                </Text>

                <View className="flex-row items-center gap-2">
                    {/* message + beds + baths */}
                    <Glass style={{ flex: 1 }}>
                        <Pressable className="m-1.5 h-10 w-10 items-center justify-center rounded-full bg-white/25">
                            <MessageCircle size={20} color={WHITE} />
                        </Pressable>

                        <View className="flex-1 flex-row items-center justify-evenly pr-2">
                            {post.beds != null && (
                                <View className="flex-row items-center gap-1.5">
                                    <BedDouble size={20} color={WHITE} />
                                    <Text className="font-jakarta-semibold text-sm text-white">
                                        {post.beds} beds
                                    </Text>
                                </View>
                            )}
                            {post.baths != null && (
                                <View className="flex-row items-center gap-1.5">
                                    <Bath size={20} color={WHITE} />
                                    <Text className="font-jakarta-semibold text-sm text-white">
                                        {post.baths} baths
                                    </Text>
                                </View>
                            )}
                        </View>
                    </Glass>

                    {/* save */}
                    <Pressable onPress={() => setSaved((v) => !v)} hitSlop={6}>
                        <Glass>
                            <View className="h-[52px] w-[52px] items-center justify-center">
                                <Bookmark
                                    size={20}
                                    color={WHITE}
                                    fill={saved ? WHITE : "transparent"}
                                />
                            </View>
                        </Glass>
                    </Pressable>

                    {/* like */}
                    <Pressable onPress={() => setLiked((v) => !v)} hitSlop={6}>
                        <Glass>
                            <View className="h-[52px] w-[52px] items-center justify-center">
                                <Heart
                                    size={22}
                                    color={liked ? RED : WHITE}
                                    fill={liked ? RED : "transparent"}
                                />
                                <Text className="font-jakarta-semibold text-[10px] text-white">
                                    {likeCount}
                                </Text>
                            </View>
                        </Glass>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}