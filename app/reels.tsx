import { ReactNode, useEffect, useRef, useState } from "react";
import {
    Animated,
    FlatList,
    Pressable,
    Share,
    StyleSheet,
    Text,
    View,
    type ViewToken,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { VideoView, useVideoPlayer } from "expo-video";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaskedView from "@react-native-masked-view/masked-view";
import { BlurView } from "expo-blur";
import {
    Bath,
    BadgeCheck,
    Bell,
    BedDouble,
    Bookmark,
    ChevronRight,
    Heart,
    MapPin,
    MessageCircle,
    MoreHorizontal,
    Plus,
    Search,
    Send,
    Volume2,
    VolumeX,
} from "lucide-react-native";
import { REELS, type Reel } from "@/lib/reels";

const TEAL = "#14b8a6"; // teal-500: accent on dark media
const textShadow = {
    textShadowColor: "rgba(0,0,0,0.55)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
} as const;

const fmtCount = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K` : String(n);

type UiState = { liked?: boolean; saved?: boolean; following?: boolean };

function ReelVideo({ uri, active, muted }: { uri: string; active: boolean; muted: boolean }) {
    const player = useVideoPlayer(uri, (p) => {
        p.loop = true;
    });
    useEffect(() => {
        if (active) player.play();
        else player.pause();
    }, [active, player]);
    useEffect(() => {
        player.muted = muted;
    }, [muted, player]);
    return <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls={false} />;
}

function GlassButton({
                         label,
                         onPress,
                         children,
                     }: {
    label: string;
    onPress?: () => void;
    children: ReactNode;
}) {
    return (
        <Pressable
            onPress={onPress}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel={label}
            className="h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/15"
        >
            {children}
        </Pressable>
    );
}

function Stat({
                  label,
                  text,
                  onPress,
                  children,
              }: {
    label: string;
    text?: string;
    onPress: () => void;
    children: ReactNode;
}) {
    return (
        <Pressable
            onPress={onPress}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={label}
            className="flex-row items-center gap-1.5"
        >
            {children}
            {text ? (
                <Text className="font-jakarta-medium text-xs text-white" style={textShadow}>
                    {text}
                </Text>
            ) : null}
        </Pressable>
    );
}

type ItemProps = {
    reel: Reel;
    height: number;
    active: boolean;
    muted: boolean;
    hasVideo: boolean;
    ui: UiState;
    onToggle: (key: keyof UiState) => void;
    onToggleMute: () => void;
};

function ReelItem({ reel, height, active, muted, hasVideo, ui, onToggle, onToggleMute }: ItemProps) {
    const insets = useSafeAreaInsets();
    const lastTap = useRef(0);
    const pop = useRef(new Animated.Value(0)).current;
    const [expanded, setExpanded] = useState(false);

    const likeCount = reel.likes + (ui.liked ? 1 : 0);

    const doubleTap = () => {
        if (!ui.liked) onToggle("liked");
        pop.setValue(0);
        Animated.sequence([
            Animated.spring(pop, { toValue: 1, friction: 5, useNativeDriver: true }),
            Animated.delay(350),
            Animated.timing(pop, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]).start();
    };

    const onTap = () => {
        const now = Date.now();
        if (now - lastTap.current < 280) doubleTap();
        lastTap.current = now;
    };

    const openProperty = () =>
        // @ts-ignore
        router.push({ pathname: "/property/[id]", params: { id: reel.propertyId } });

    const share = () => Share.share({ message: `${reel.title} · ${reel.priceLabel} · ${reel.location}` });

    return (
        <View style={{ height }} className="w-full bg-black">
            {reel.videoUrl ? (
                <ReelVideo uri={reel.videoUrl} active={active} muted={muted} />
            ) : (
                <Image source={{ uri: reel.image }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
            )}

            {/* top scrim so the header stays readable */}
            <LinearGradient
                pointerEvents="none"
                colors={["rgba(0,0,0,0.45)", "rgba(0,0,0,0)"]}
                locations={[0, 0.2]}
                style={StyleSheet.absoluteFill}
            />

            {/* double-tap layer */}
            <Pressable onPress={onTap} style={StyleSheet.absoluteFill} />
            <Animated.View
                pointerEvents="none"
                style={{
                    ...StyleSheet.absoluteFillObject,
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: pop,
                    transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1.15] }) }],
                }}
            >
                <Heart size={96} color="#ffffff" fill="#ffffff" />
            </Animated.View>

            {/* bottom glass panel */}
            <View pointerEvents="box-none" className="absolute inset-x-0 bottom-0">
                {/* blur layer, masked so it fades out toward the top */}
                <MaskedView
                    pointerEvents="none"
                    style={StyleSheet.absoluteFill}
                    maskElement={
                        <LinearGradient
                            colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.6)", "rgba(0,0,0,1)"]}
                            locations={[0, 0.3, 0.55]}
                            style={StyleSheet.absoluteFill}
                        />
                    }
                >
                    <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
                    <LinearGradient
                        colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.5)"]}
                        style={StyleSheet.absoluteFill}
                    />
                </MaskedView>

                {/* content: top padding gives the fade room to breathe */}
                <View
                    pointerEvents="box-none"
                    className="gap-4 px-5 pt-20"
                    style={{ paddingBottom: insets.bottom + 12 }}
                >
                    {/* headline + description */}
                    <View className="gap-2">
                        <Text className="font-jakarta-bold text-2xl leading-8 text-white" style={textShadow} numberOfLines={2}>
                            {reel.title}
                        </Text>
                        <Pressable onPress={() => setExpanded((e) => !e)} accessibilityRole="button" accessibilityLabel={expanded ? "Show less" : "Show more"}>
                            <Text
                                className="font-jakarta-regular text-sm leading-5 text-white/80"
                                style={textShadow}
                                numberOfLines={expanded ? undefined : 2}
                            >
                                {reel.description}
                                {!expanded ? <Text className="font-jakarta-semibold text-white"> more</Text> : null}
                            </Text>
                        </Pressable>
                    </View>

                    {/* agent row */}
                    <View className="flex-row items-center gap-3">
                        <View className="h-10 w-10 overflow-hidden rounded-full border border-white/40 bg-neutral-700">
                            <Image source={{ uri: reel.agent.avatar }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
                        </View>
                        <View className="flex-1">
                            <View className="flex-row items-center gap-1">
                                <Text className="font-jakarta-semibold text-sm text-white" style={textShadow} numberOfLines={1}>
                                    @{reel.agent.handle}
                                </Text>
                                {/* add `verified?: boolean` to the agent type */}
                                {(reel.agent as { verified?: boolean }).verified ? (
                                    <BadgeCheck size={14} color="#ffffff" fill={TEAL} />
                                ) : null}
                            </View>
                            <Text className="font-jakarta-regular text-xs text-white/70" style={textShadow} numberOfLines={1}>
                                {reel.agent.name} · {reel.agent.role}
                            </Text>
                        </View>
                        <Pressable
                            onPress={() => onToggle("following")}
                            hitSlop={6}
                            accessibilityRole="button"
                            accessibilityLabel={ui.following ? "Unfollow" : "Follow"}
                            className={`rounded-full border px-5 py-2 ${
                                ui.following ? "border-transparent bg-white" : "border-white/30 bg-white/15"
                            }`}
                        >
                            <Text className={`font-jakarta-semibold text-xs ${ui.following ? "text-black" : "text-white"}`}>
                                {ui.following ? "Following" : "Follow"}
                            </Text>
                        </Pressable>
                        <Pressable
                            // TODO: report / not interested sheet
                            onPress={() => {}}
                            hitSlop={8}
                            accessibilityRole="button"
                            accessibilityLabel="More options"
                        >
                            <MoreHorizontal size={22} color="#ffffff" />
                        </Pressable>
                    </View>

                    {/* stats row */}
                    <View className="flex-row items-center gap-6">
                        <Stat label={ui.liked ? "Unlike" : "Like"} text={fmtCount(likeCount)} onPress={() => onToggle("liked")}>
                            <Heart size={22} color={ui.liked ? "#f43f5e" : "#ffffff"} fill={ui.liked ? "#f43f5e" : "transparent"} />
                        </Stat>
                        <Stat
                            label="Comments"
                            text={fmtCount(reel.comments)}
                            // TODO: open your comments sheet
                            onPress={() => {}}
                        >
                            <MessageCircle size={22} color="#ffffff" />
                        </Stat>
                        <Stat label="Share" onPress={share}>
                            <Send size={22} color="#ffffff" />
                        </Stat>
                        <Stat label={ui.saved ? "Unsave" : "Save"} onPress={() => onToggle("saved")}>
                            <Bookmark size={22} color="#ffffff" fill={ui.saved ? "#ffffff" : "transparent"} />
                        </Stat>
                        <View className="flex-1" />
                        {hasVideo && (
                            <Pressable
                                onPress={onToggleMute}
                                hitSlop={8}
                                accessibilityRole="button"
                                accessibilityLabel={muted ? "Unmute" : "Mute"}
                            >
                                {muted ? <VolumeX size={20} color="#ffffff" /> : <Volume2 size={20} color="#ffffff" />}
                            </Pressable>
                        )}
                    </View>

                    {/* property bar (replaces the music bar) */}
                    <Pressable
                        onPress={openProperty}
                        accessibilityRole="link"
                        accessibilityLabel="Open listing"
                        className="flex-row items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-2 pr-3"
                    >
                        <Image
                            source={{ uri: reel.image }}
                            style={{ width: 44, height: 44, borderRadius: 12 }}
                            contentFit="cover"
                        />
                        <View className="flex-1 gap-0.5">
                            <Text className="font-jakarta-bold text-sm text-white" numberOfLines={1}>
                                {reel.priceLabel}
                            </Text>
                            <View className="flex-row items-center gap-1">
                                <MapPin size={12} color="#ffffff" />
                                <Text className="flex-shrink font-jakarta-regular text-xs text-white/85" numberOfLines={1}>
                                    {reel.location}
                                </Text>
                                <Text className="text-xs text-white/50">·</Text>
                                <BedDouble size={12} color="#ffffff" />
                                <Text className="font-jakarta-regular text-xs text-white/85">{reel.beds}</Text>
                                <Bath size={12} color="#ffffff" />
                                <Text className="font-jakarta-regular text-xs text-white/85">{reel.baths}</Text>
                            </View>
                        </View>
                        <ChevronRight size={18} color="#ffffff" />
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

export default function ReelsScreen() {
    const insets = useSafeAreaInsets();
    const [height, setHeight] = useState(0);
    const [active, setActive] = useState(0);
    const [muted, setMuted] = useState(true);
    const [ui, setUi] = useState<Record<string, UiState>>({});

    const toggle = (id: string, key: keyof UiState) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setUi((s) => ({ ...s, [id]: { ...s[id], [key]: !s[id]?.[key] } }));
    };

    const onViewable = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        const i = viewableItems[0]?.index;
        if (i != null) setActive(i);
    }).current;
    const viewConfig = useRef({ itemVisiblePercentThreshold: 70 }).current;

    return (
        <View className="flex-1 bg-black" onLayout={(e) => setHeight(e.nativeEvent.layout.height)}>
            <StatusBar style="light" />

            {height > 0 && (
                <FlatList
                    data={REELS}
                    keyExtractor={(r) => r.id}
                    pagingEnabled
                    decelerationRate="fast"
                    showsVerticalScrollIndicator={false}
                    onViewableItemsChanged={onViewable}
                    viewabilityConfig={viewConfig}
                    getItemLayout={(_, i) => ({ length: height, offset: height * i, index: i })}
                    initialNumToRender={1}
                    windowSize={3}
                    maxToRenderPerBatch={2}
                    removeClippedSubviews
                    renderItem={({ item, index }) => (
                        <ReelItem
                            reel={item}
                            height={height}
                            active={index === active}
                            muted={muted}
                            hasVideo={!!item.videoUrl}
                            ui={ui[item.id] ?? {}}
                            onToggle={(key) => toggle(item.id, key)}
                            onToggleMute={() => setMuted((m) => !m)}
                        />
                    )}
                />
            )}

            {/* header: search | title | create + notifications */}
            <View
                pointerEvents="box-none"
                className="absolute inset-x-0 top-0 flex-row items-center justify-between px-5"
                style={{ paddingTop: insets.top + 8 }}
            >
                <View className="w-24 items-start">
                    <GlassButton
                        label="Search"
                        // TODO: open search for reels
                    >
                        <Search size={18} color="#ffffff" />
                    </GlassButton>
                </View>

                <Text className="font-jakarta-semibold text-base text-white" style={textShadow}>
                    Reels
                </Text>

                <View className="w-24 flex-row items-center justify-end gap-2">
                    <GlassButton
                        label="Create reel"
                        // TODO: open reel upload flow
                    >
                        <Plus size={20} color="#ffffff" />
                    </GlassButton>
                    <GlassButton
                        label="Notifications"
                        // TODO: open notifications
                    >
                        <Bell size={18} color="#ffffff" />
                    </GlassButton>
                </View>
            </View>
        </View>
    );
}