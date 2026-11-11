import { useRef, useState } from "react";
import {
    FlatList,
    Linking,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Platform,
    Pressable,
    Share,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
    type ViewStyle,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    type SharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
    Bath,
    BedDouble,
    Calendar,
    Camera,
    Car,
    ChevronLeft,
    Dumbbell,
    Heart,
    MapPin,
    Maximize2,
    Phone,
    Share2,
    ShieldCheck,
    Star,
    Trees,
    Waves,
    Wifi,
    type LucideIcon,
} from "lucide-react-native";
import { getPropertyDetail, type Amenity } from "@/lib/properties";

const TABS = [
    { key: "overview", label: "Overview" },
    { key: "details", label: "Details" },
    { key: "map", label: "Map" },
] as const;

const TEAL = "#0d9488";
const WHITE = "#fafafa";
const HERO_HEIGHT = 448;
const SWITCH = HERO_HEIGHT - 110; // scroll offset where the header turns solid

/** Frosted pill/circle. Blur is a background layer; children are centered. */
function Glass({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
    return (
        <View
            style={[
                {
                    borderRadius: 999,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.35)",
                    backgroundColor: "rgba(255,255,255,0.12)",
                    flexDirection: "row",
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

/** Header button: glass over the hero, solid once the sheet scrolls under it. */
function HeaderButton({
                          scrollY,
                          onPress,
                          label,
                          children,
                      }: {
    scrollY: SharedValue<number>;
    onPress: () => void;
    label: string;
    children: (color: string) => React.ReactNode;
}) {
    const onHero = useAnimatedStyle(() => ({
        opacity: interpolate(scrollY.value, [SWITCH - 40, SWITCH], [1, 0], Extrapolation.CLAMP),
    }));
    const onSheet = useAnimatedStyle(() => ({
        opacity: interpolate(scrollY.value, [SWITCH - 40, SWITCH], [0, 1], Extrapolation.CLAMP),
    }));
    return (
        <Pressable onPress={onPress} hitSlop={6} accessibilityRole="button" accessibilityLabel={label}>
            <View className="h-10 w-10">
                <Animated.View style={[StyleSheet.absoluteFill, onHero]}>
                    <Glass style={{ height: 40, width: 40 }}>{children(WHITE)}</Glass>
                </Animated.View>
                <Animated.View
                    style={[StyleSheet.absoluteFill, onSheet]}
                    className="items-center justify-center rounded-full bg-neutral-100"
                >
                    {children("#0a0a0a")}
                </Animated.View>
            </View>
        </Pressable>
    );
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View className="mt-8">
        <Text className="mb-3 font-jakarta-semibold text-lg text-neutral-950">{title}</Text>
        {children}
    </View>
);

const AMENITIES: Record<Amenity, { label: string; Icon: LucideIcon }> = {
    pool: { label: "Swimming pool", Icon: Waves },
    parking: { label: "Private parking", Icon: Car },
    smart: { label: "Smart home", Icon: Wifi },
    gym: { label: "Fitness center", Icon: Dumbbell },
    garden: { label: "Private garden", Icon: Trees },
    security: { label: "24/7 security", Icon: ShieldCheck },
};

const fmt = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export default function PropertyDetailScreen() {
    // in the component: delete `expanded`, add `tab`
    const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("overview");
    const { id } = useLocalSearchParams<{ id: string }>();
    const p = getPropertyDetail(id);
    const isRent = p.listingType === "For Rent";

    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const listRef = useRef<FlatList<string>>(null);

    const [index, setIndex] = useState(0);
    const [saved, setSaved] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const scrollY = useSharedValue(0);
    const onScroll = useAnimatedScrollHandler((e) => {
        scrollY.value = e.contentOffset.y;
    });

    const barStyle = useAnimatedStyle(() => ({
        opacity: interpolate(scrollY.value, [SWITCH - 40, SWITCH], [0, 1], Extrapolation.CLAMP),
    }));
    const heroStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: interpolate(
                    scrollY.value,
                    [-HERO_HEIGHT, 0, HERO_HEIGHT],
                    [-HERO_HEIGHT / 2, 0, HERO_HEIGHT * 0.35],
                ),
            },
            { scale: interpolate(scrollY.value, [-HERO_HEIGHT, 0], [2, 1], Extrapolation.CLAMP) },
        ],
    }));

    const onPagerEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
        setIndex(Math.round(e.nativeEvent.contentOffset.x / width));

    const share = () =>
        Share.share({
            message: `${p.title} · ${p.priceLabel}${isRent ? "/mo" : ""} · ${p.address}`,
        });

    const toggleSaved = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSaved((s) => !s);
    };

    // const openMaps = () =>
    //     Linking.openURL(
    //         Platform.select({
    //             ios: `http://maps.apple.com/?q=${encodeURIComponent(p.address)}`,
    //             default: `geo:0,0?q=${encodeURIComponent(p.address)}`,
    //         }),
    //     );
    const openMaps = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push({ pathname: "/directions", params: { id: p.id } });
    };

    const goBack = () => (router.canGoBack() ? router.back() : router.replace("/"));

    const stats = [
        { Icon: BedDouble, value: String(p.beds), label: "Bedrooms" },
        { Icon: Bath, value: String(p.baths), label: "Bathrooms" },
        { Icon: Maximize2, value: fmt(p.areaSqft), label: "Sq ft" },
    ];

    const details = isRent
        ? [
            { label: "Available from", value: p.availableFrom ?? "—" },
            { label: "Lease term", value: p.leaseTerm ?? "—" },
            { label: "Deposit", value: p.deposit ?? "—" },
            { label: "Pets", value: p.petsAllowed ? "Allowed" : "Not allowed" },
            { label: "Furnished", value: p.furnished ? "Yes" : "No" },
            { label: "Parking", value: p.parking },
        ]
        : [
            { label: "Year built", value: String(p.yearBuilt) },
            { label: "Parking", value: p.parking },
            { label: "HOA fee", value: p.hoa ?? "—" },
            { label: "Listed", value: p.listed },
        ];

    const priceNote = isRent
        ? p.deposit
            ? `Deposit ${p.deposit}`
            : ""
        : `$${fmt(Math.round(p.price / p.areaSqft))} / sq ft`;

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="light" />

            <Animated.ScrollView
                onScroll={onScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
            >
                {/* hero gallery (parallax + stretch) */}
                <View style={{ height: HERO_HEIGHT }} className="overflow-hidden bg-neutral-200">
                    <Animated.View style={[{ height: HERO_HEIGHT }, heroStyle]}>
                        <FlatList
                            ref={listRef}
                            data={p.images}
                            keyExtractor={(uri, i) => `${uri}-${i}`}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onMomentumScrollEnd={onPagerEnd}
                            getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
                            renderItem={({ item }) => (
                                <Image
                                    source={{ uri: item }}
                                    style={{ width, height: HERO_HEIGHT }}
                                    contentFit="cover"
                                    transition={200}
                                />
                            )}
                        />
                        <LinearGradient
                            pointerEvents="none"
                            colors={["rgba(0,0,0,0.45)", "transparent", "rgba(0,0,0,0.25)"]}
                            locations={[0, 0.5, 1]}
                            style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
                        />
                    </Animated.View>

                    <View className="absolute inset-x-4 bottom-9 flex-row items-end justify-between">
                        <Glass>
                            <View className="flex-row items-center px-3 py-1.5">
                                <Camera size={14} color={WHITE} />
                                <Text className="ml-1.5 font-jakarta-medium text-xs text-white">
                                    {index + 1} / {p.images.length}
                                </Text>
                            </View>
                        </Glass>
                        {/* 360° tour hidden until it's wired up:
                        <Pressable onPress={...} hitSlop={6}><Glass>…</Glass></Pressable> */}
                    </View>
                </View>

                {/* content sheet */}
                <View className="-mt-6 rounded-t-3xl bg-white px-5 pt-6">
                    <View className="gap-1.5">
                        <View className="flex-row items-center justify-between">
                            <View className={`rounded-full px-3 py-1 ${isRent ? "bg-amber-50" : "bg-teal-50"}`}>
                                <Text
                                    className={`font-jakarta-semibold text-xs ${
                                        isRent ? "text-amber-700" : "text-teal-700"
                                    }`}
                                >
                                    {p.listingType}
                                </Text>
                            </View>
                            <Text className="font-jakarta-regular text-xs text-neutral-500">{priceNote}</Text>
                        </View>
                        <Text className="mt-1 font-jakarta-bold text-[28px] tracking-tight text-neutral-950">
                            {p.priceLabel}
                            {isRent && <Text className="font-jakarta-regular text-base text-neutral-500"> /mo</Text>}
                        </Text>
                        <Text className="font-jakarta-semibold text-lg text-neutral-950">{p.title}</Text>
                        <View className="flex-row items-center gap-1.5">
                            <MapPin size={13} color={TEAL} />
                            <Text className="flex-1 font-jakarta-regular text-sm text-neutral-500">{p.address}</Text>
                        </View>
                    </View>

                    {/* stats */}
                    <View className="mt-5 flex-row border-y border-neutral-100 py-4">
                        {stats.map(({ Icon, value, label }, i) => (
                            <View
                                key={label}
                                className={`flex-1 items-center gap-1 ${
                                    i < stats.length - 1 ? "border-r border-neutral-100" : ""
                                }`}
                            >
                                <Icon size={20} color={TEAL} />
                                <Text className="font-jakarta-semibold text-base text-neutral-950">{value}</Text>
                                <Text className="font-jakarta-regular text-xs text-neutral-500">{label}</Text>
                            </View>
                        ))}
                    </View>

                    {/* tabs */}
                    <View className="mt-6 flex-row rounded-3xl bg-neutral-100 p-1">
                        {TABS.map((t) => {
                            const active = t.key === tab;
                            return (
                                <Pressable
                                    key={t.key}
                                    onPress={() => setTab(t.key)}
                                    accessibilityRole="tab"
                                    accessibilityState={{ selected: active }}
                                    className={`flex-1 items-center rounded-3xl py-4 ${active ? "bg-white" : ""}`}
                                    style={
                                        active
                                            ? {
                                                shadowColor: "#000",
                                                shadowOpacity: 0.08,
                                                shadowRadius: 3,
                                                shadowOffset: { width: 0, height: 1 },
                                                elevation: 1,
                                            }
                                            : undefined
                                    }
                                >
                                    <Text
                                        className={`text-sm ${
                                            active ? "font-jakarta-semibold text-neutral-950" : "font-jakarta-medium text-neutral-500"
                                        }`}
                                    >
                                        {t.label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>

                    <View className="mt-4">
                        {tab === "overview" && (
                            <Text className="font-jakarta-regular text-base leading-6 text-neutral-500">{p.description}</Text>
                        )}
                        {tab === "details" && (
                            <View>
                                {details.map((d, i) => (
                                    <View
                                        key={d.label}
                                        className={`flex-row justify-between py-3 ${i > 0 ? "border-t border-neutral-100" : ""}`}
                                    >
                                        <Text className="font-jakarta-regular text-sm text-neutral-500">{d.label}</Text>
                                        <Text className="font-jakarta-semibold text-sm text-neutral-950">{d.value}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                        {tab === "map" && (
                            <Pressable
                                onPress={openMaps}
                                className="h-36 items-center justify-center gap-2 rounded-2xl bg-teal-50 active:opacity-80"
                            >
                                <MapPin size={24} color={TEAL} />
                                <Text className="font-jakarta-semibold text-sm text-neutral-950">{p.address}</Text>
                                <Text className="font-jakarta-regular text-xs text-neutral-500">Tap to open in Maps</Text>
                            </Pressable>
                        )}
                    </View>

                    {/* amenities */}
                    <Section title="Amenities">
                        <View className="flex-row flex-wrap justify-between gap-y-3">
                            {p.amenities.map((a) => {
                                const { label, Icon } = AMENITIES[a];
                                return (
                                    <View key={a} className="w-[48.5%] flex-row items-center gap-2 rounded-xl bg-neutral-100 p-5">
                                        <Icon size={16} color={TEAL} />
                                        <Text className="flex-1 font-jakarta-bold text-sm text-neutral-700" numberOfLines={1}>
                                            {label}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                    </Section>


                    {/* agent */}
                    <View className="mt-8 flex-row items-center gap-3 border-y border-neutral-100 py-4">
                        <Image
                            source={{ uri: p.agent.avatar }}
                            style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "#f5f5f5" }}
                            contentFit="cover"
                            transition={200}
                        />
                        <View className="flex-1">
                            <Text className="font-jakarta-semibold text-base text-neutral-950">{p.agent.name}</Text>
                            <View className="flex-row items-center gap-1">
                                <Star size={14} color="#f59e0b" fill="#f59e0b" />
                                <Text className="font-jakarta-medium text-xs text-neutral-500">
                                    {p.agent.rating} · {p.agent.reviews} reviews
                                </Text>
                            </View>
                        </View>
                        <Pressable
                            // TODO: open the chat thread with this agent (design screen 12)
                            className="rounded-full border border-neutral-200 bg-white px-4 py-2 active:bg-neutral-50"
                        >
                            <Text className="font-jakarta-medium text-sm text-neutral-950">Message</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => Linking.openURL(`tel:${p.agent.phone}`)}
                            accessibilityRole="button"
                            accessibilityLabel={`Call ${p.agent.name}`}
                            className="h-10 w-10 items-center justify-center rounded-full bg-neutral-100 active:bg-neutral-200"
                        >
                            <Phone size={16} color="#0a0a0a" />
                        </Pressable>
                    </View>
                </View>
            </Animated.ScrollView>

            {/* header: fading solid bar + buttons */}
            <Animated.View
                pointerEvents="none"
                className="absolute inset-x-0 top-0 items-center justify-end border-b border-neutral-100 bg-white pb-3"
                style={[{ height: insets.top + 56 }, barStyle]}
            >
                <Text className="max-w-[60%] font-jakarta-semibold text-sm text-neutral-950" numberOfLines={1}>
                    {p.title}
                </Text>
            </Animated.View>
            <View
                className="absolute inset-x-4 flex-row items-center justify-between"
                style={{ top: insets.top + 8 }}
            >
                <HeaderButton scrollY={scrollY} label="Back" onPress={goBack}>
                    {(c) => <ChevronLeft size={20} color={c} />}
                </HeaderButton>
                <View className="flex-row gap-2">
                    <HeaderButton scrollY={scrollY} label="Share" onPress={share}>
                        {(c) => <Share2 size={18} color={c} />}
                    </HeaderButton>
                    <HeaderButton scrollY={scrollY} label={saved ? "Remove from saved" : "Save"} onPress={toggleSaved}>
                        {(c) => (
                            <Heart
                                size={18}
                                color={saved ? "#dc2626" : c}
                                fill={saved ? "#dc2626" : "transparent"}
                            />
                        )}
                    </HeaderButton>
                </View>
            </View>

            {/* sticky bottom bar */}
            <BlurView
                intensity={80}
                tint="light"
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    paddingHorizontal: 16,
                    paddingTop: 12,
                    paddingBottom: Math.max(insets.bottom, 12),
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderTopColor: "rgba(0,0,0,0.1)",
                    backgroundColor: "rgba(255,255,255,0.7)",
                }}
            >
                <View>
                    <Text className="font-jakarta-regular text-[11px] text-neutral-500">
                        {isRent ? "Per month" : "Price"}
                    </Text>
                    <Text className="font-jakarta-bold text-lg text-neutral-950">{p.priceLabel}</Text>
                </View>
                <Pressable
                    onPress={() => router.push({ pathname: "/schedule-visit", params: { id: p.id } })}
                    className="h-14 flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-neutral-900 active:opacity-90"
                >
                    <Calendar size={16} color="#fafafa" />
                    <Text className="font-jakarta-semibold text-base text-neutral-50">
                        {isRent ? "Book a viewing" : "Schedule a visit"}
                    </Text>
                </Pressable>
            </BlurView>
        </View>
    );
}