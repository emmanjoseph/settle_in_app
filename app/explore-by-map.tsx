import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    Text,
    TextInput,
    View,
    useWindowDimensions,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import MapView, { Marker, PROVIDER_GOOGLE, type Region } from "react-native-maps";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
    Bath,
    BedDouble,
    ChevronLeft,
    Heart, Home,
    List,
    LocateFixed,
    MapPin,
    Maximize2,
    Minus,
    Plus,
    Search,
    SlidersHorizontal,
} from "lucide-react-native";
import {Property, PropertyRow} from "@/components/explore/PropertyRow";
const properties: Property[] = [
    {
        id: "1",
        title: "Modern Villa Estate",
        location: "Runda, Nairobi",
        priceLabel: "KES 85M",
        price: 85_000_000,
        type: "Villa",
        beds: 5,
        baths: 4,
        area: "4.2k",
        image:
            "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400",
        latitude: -1.2156,
        longitude: 36.8073,
    },
    {
        id: "2",
        title: "Westlands Luxury Apartment",
        location: "Westlands, Nairobi",
        priceLabel: "KES 28.5M",
        price: 28_500_000,
        type: "Apartment",
        beds: 2,
        baths: 2,
        area: "1.5k",
        image:
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
        latitude: -1.2648,
        longitude: 36.8021,
    },
    {
        id: "3",
        title: "Family Home with Garden",
        location: "Syokimau, Machakos",
        priceLabel: "KES 18.5M",
        price: 18_500_000,
        type: "House",
        beds: 4,
        baths: 3,
        area: "2.8k",
        image:
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400",
        latitude: -1.3612,
        longitude: 36.9464,
    },
    {
        id: "4",
        title: "Luxury Kilimani Penthouse",
        location: "Kilimani, Nairobi",
        priceLabel: "KES 65M",
        price: 65_000_000,
        type: "Apartment",
        beds: 3,
        baths: 3,
        area: "3.5k",
        image:
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400",
        latitude: -1.2921,
        longitude: 36.7857,
    },
];
const TEAL = "#0d9488";
const TAB_BAR_SPACE = 88; // height of your floating tab bar + gap
const GAP = 12;



type Item =
    | { type: "single"; key: string; p: Property; latitude: number; longitude: number }
    | { type: "cluster"; key: string; items: Property[]; latitude: number; longitude: number };

/** simple grid clustering: cell size scales with zoom */
function cluster(list: Property[], latDelta: number): Item[] {
    const cell = latDelta / 8;
    const cells = new Map<string, Property[]>();
    list.forEach((p) => {
        const k = `${Math.floor(p.latitude / cell)}:${Math.floor(p.longitude / cell)}`;
        cells.set(k, [...(cells.get(k) ?? []), p]);
    });
    return [...cells.entries()].map(([k, g]) =>
        g.length === 1
            ? { type: "single", key: g[0].id, p: g[0], latitude: g[0].latitude, longitude: g[0].longitude }
            : {
                type: "cluster",
                key: `c-${k}-${g.length}`,
                items: g,
                latitude: g.reduce((s, x) => s + x.latitude, 0) / g.length,
                longitude: g.reduce((s, x) => s + x.longitude, 0) / g.length,
            },
    );
}

/** custom marker views are snapshotted; only track changes briefly after a state change */
function useBriefTracking(dep: unknown) {
    const [track, setTrack] = useState(true);
    useEffect(() => {
        setTrack(true);
        const t = setTimeout(() => setTrack(false), 250);
        return () => clearTimeout(t);
    }, [dep]);
    return track;
}
/** keep tracking on until the pin has laid out, then freeze it */
function usePinSnapshot(dep: unknown) {
    const [track, setTrack] = useState(true);
    useEffect(() => {
        setTrack(true);
        const t = setTimeout(() => setTrack(false), 800); // safety net
        return () => clearTimeout(t);
    }, [dep]);
    const onLayout = () => setTimeout(() => setTrack(false), 120);
    return { track, onLayout };
}

// fixed sizes so the anchor maths is exact: 4 + 88 (bubble) + 8 (arrow) + 40 (pin) + 4 = 144
const POPUP_W = 208;
const POPUP_H = 144;
const POPUP_ANCHOR_Y = (4 + 88 + 8 + 20) / POPUP_H; // pin centre sits on the coordinate

function HousePin({ p, selected, onPress }: { p: Property; selected: boolean; onPress: () => void }) {
    const { track, onLayout } = usePinSnapshot(selected);

    return (
        <Marker
            coordinate={{ latitude: p.latitude, longitude: p.longitude }}
            onPress={onPress}
            tracksViewChanges={track}
            anchor={selected ? { x: 0.5, y: POPUP_ANCHOR_Y } : { x: 0.5, y: 0.5 }}
            zIndex={selected ? 10 : 1}
        >
            {selected ? (
                <View
                    collapsable={false}
                    onLayout={onLayout}
                    style={{ width: POPUP_W, height: POPUP_H, padding: 4, alignItems: "center" }}
                >
                    {/* info bubble */}
                    <View
                        className="justify-between rounded-2xl border border-neutral-200 bg-white p-3"
                        style={{ width: 200, height: 88 }}
                    >
                        <View className="flex-row items-center justify-between gap-2">
                            <Text allowFontScaling={false} numberOfLines={1} className="flex-1 font-jakarta-bold text-sm text-neutral-950">
                                {p.title}
                            </Text>
                            <View className="rounded-full bg-neutral-950 px-2 py-0.5">
                                <Text allowFontScaling={false} className="font-jakarta-semibold text-[10px] text-white">
                                    {p.priceLabel}
                                </Text>
                            </View>
                        </View>
                        <View className="flex-row items-center gap-1">
                            <MapPin size={11} color="#737373" />
                            <Text allowFontScaling={false} numberOfLines={1} className="flex-1 font-jakarta-regular text-xs text-neutral-500">
                                {p.location}
                            </Text>
                        </View>
                        <View className="flex-row items-center gap-3">
                            <View className="flex-row items-center gap-1">
                                <BedDouble size={12} color="#737373" />
                                <Text allowFontScaling={false} className="font-jakarta-medium text-xs text-neutral-500">{p.beds}</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <Bath size={12} color="#737373" />
                                <Text allowFontScaling={false} className="font-jakarta-medium text-xs text-neutral-500">{p.baths}</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <Maximize2 size={11} color="#737373" />
                                <Text allowFontScaling={false} className="font-jakarta-medium text-xs text-neutral-500">{p.area}</Text>
                            </View>
                        </View>
                    </View>

                    {/* little arrow pointing at the pin */}
                    <View style={{ height: 8, width: 200, alignItems: "center" }}>
                        <View
                            style={{
                                position: "absolute",
                                top: -6,
                                width: 12,
                                height: 12,
                                backgroundColor: "#ffffff",
                                borderRightWidth: 1,
                                borderBottomWidth: 1,
                                borderColor: "#e5e5e5",
                                transform: [{ rotate: "45deg" }],
                            }}
                        />
                    </View>

                    {/* selected pin */}
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-neutral-950">
                        <Home size={20} color="#ffffff" />
                    </View>
                </View>
            ) : (
                <View collapsable={false} onLayout={onLayout} style={{ width: 44, height: 44, padding: 4 }}>
                    <View className="h-9 w-9 items-center justify-center rounded-full border border-neutral-300 bg-white">
                        <Home size={18} color="#0a0a0a" />
                    </View>
                </View>
            )}
        </Marker>
    );
}

function ClusterPin({ count, latitude, longitude, onPress }: { count: number; latitude: number; longitude: number; onPress: () => void }) {
    const track = useBriefTracking(count);
    return (
        <Marker coordinate={{ latitude, longitude }} onPress={onPress} tracksViewChanges={track} anchor={{ x: 0.5, y: 0.5 }}>
            <View
                className="h-12 w-12 items-center justify-center rounded-full border-2 border-white"
                style={{ backgroundColor: TEAL }}
            >
                <Text className="font-jakarta-bold text-sm text-white">{count > 9 ? "9+" : count}</Text>
            </View>
        </Marker>
    );
}

function MapButton({ onPress, label, children }: { onPress: () => void; label: string; children: React.ReactNode }) {
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={label}
            className="h-11 w-11 items-center justify-center rounded-full bg-white active:bg-neutral-100"
            style={{
                shadowColor: "#000",
                shadowOpacity: 0.12,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 2 },
                elevation: 4,
            }}
        >
            {children}
        </Pressable>
    );
}

export default function ExploreMapScreen() {
    const NAIROBI: Region = { latitude: -1.29, longitude: 36.84, latitudeDelta: 0.3, longitudeDelta: 0.3 };
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const CARD_W = width - 48;

    const mapRef = useRef<MapView>(null);
    const listRef = useRef<FlatList<Property>>(null);
    const region = useRef<Region | null>(null);

    const all = properties
    const [query, setQuery] = useState("");
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [mapReady, setMapReady] = useState(false);
    const [latDelta, setLatDelta] = useState(0.1);
    const [liked, setLiked] = useState<Record<string, boolean>>({});
    const toggleLike = (id: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setLiked((l) => ({ ...l, [id]: !l[id] }));
    };

    const data = useMemo(() => {
        const q = query.trim().toLowerCase();
        return q ? all.filter((p) => `${p.title} ${p.location}`.toLowerCase().includes(q)) : all;
    }, [all, query]);

    const items = useMemo(() => cluster(data, latDelta), [data, latDelta]);

    const openProperty = (p: Property) =>
        router.push({ pathname: "/property/[id]", params: { id: p.id } });

    const fitAll = useCallback(() => {
        if (!data.length) return;
        mapRef.current?.fitToCoordinates(
            data.map((p) => ({ latitude: p.latitude, longitude: p.longitude })),
            { edgePadding: { top: 80, right: 60, bottom: 280, left: 60 }, animated: true },
        );
    }, [data]);

    useEffect(() => {
        if (!mapReady) return;
        const t = setTimeout(fitAll, 300);
        return () => clearTimeout(t);
    }, [mapReady, fitAll]); // replaces your 400ms effect

    useEffect(() => {
        const t = setTimeout(fitAll, 400); // after the map is ready
        return () => clearTimeout(t);
    }, [fitAll]);

    const select = (p: Property, scroll = true) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedId(p.id);
        mapRef.current?.animateToRegion(
            {
                latitude: p.latitude - (region.current?.latitudeDelta ?? 0.05) * 0.18, // keep pin above the card
                longitude: p.longitude,
                latitudeDelta: region.current?.latitudeDelta ?? 0.05,
                longitudeDelta: region.current?.longitudeDelta ?? 0.05,
            },
            300,
        );
        if (scroll) {
            const i = data.findIndex((d) => d.id === p.id);
            if (i >= 0) listRef.current?.scrollToIndex({ index: i, animated: true });
        }
    };

    const onCarouselEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const i = Math.round(e.nativeEvent.contentOffset.x / (CARD_W + GAP));
        const p = data[i];
        if (p && p.id !== selectedId) select(p, false);
    };

    const zoom = (factor: number) => {
        const r = region.current;
        if (!r) return;
        mapRef.current?.animateToRegion(
            { ...r, latitudeDelta: r.latitudeDelta * factor, longitudeDelta: r.longitudeDelta * factor },
            200,
        );
    };

    const goBack = () => (router.canGoBack() ? router.back() : router.replace("/"));

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />

            {/* header */}
            <View
                className="flex-row items-center gap-2 bg-white px-3 pb-3"
                style={{ paddingTop: insets.top + 8 }}
            >
                <Pressable
                    onPress={goBack}
                    hitSlop={6}
                    accessibilityRole="button"
                    accessibilityLabel="Back"
                    className="h-11 w-11 items-center justify-center rounded-full active:bg-neutral-100"
                >
                    <ChevronLeft size={22} color="#0a0a0a" />
                </Pressable>
                <View className="h-14 flex-1 flex-row items-center gap-2 rounded-full bg-neutral-100 px-4">
                    <Search size={16} color="#737373" />
                    <TextInput
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Search area, city, neighborhood..."
                        placeholderTextColor="#9ca3af"
                        returnKeyType="search"
                        className="flex-1 font-jakarta-regular text-sm text-neutral-950"
                    />
                </View>
                <Pressable
                    // TODO: router.push to your filters screen
                    // onPress={() => router.push("/filters")}
                    accessibilityRole="button"
                    accessibilityLabel="Filters"
                    className="h-11 w-11 items-center justify-center rounded-full bg-neutral-100 active:bg-neutral-200"
                >
                    <SlidersHorizontal size={18} color="#0a0a0a" />
                </Pressable>
            </View>

            {/* map */}
            <View className="flex-1">
                <MapView
                    initialRegion={NAIROBI}
                    onMapReady={() => setMapReady(true)}
                    ref={mapRef}
                    style={{ flex: 1 }}
                    provider={PROVIDER_GOOGLE} // remove to use Apple Maps on iOS
                    showsUserLocation
                    showsCompass={false}
                    showsMyLocationButton={false}
                    toolbarEnabled={false}
                    onPress={() => setSelectedId(null)}
                    onRegionChangeComplete={(r) => {
                        region.current = r;
                        setLatDelta(r.latitudeDelta);
                    }}
                >
                    {items.map((it) =>
                        it.type === "single" ? (
                            <HousePin
                                key={it.key}
                                p={it.p}
                                selected={it.p.id === selectedId}
                                onPress={() => (it.p.id === selectedId ? openProperty(it.p) : select(it.p))}
                            />
                        ) : (
                            <ClusterPin
                                key={it.key}
                                count={it.items.length}
                                latitude={it.latitude}
                                longitude={it.longitude}
                                onPress={() =>
                                    mapRef.current?.fitToCoordinates(
                                        it.items.map((x) => ({ latitude: x.latitude, longitude: x.longitude })),
                                        { edgePadding: { top: 120, right: 80, bottom: 320, left: 80 }, animated: true },
                                    )
                                }
                            />
                        ),
                    )}
                </MapView>

                {/* zoom + locate */}
                <View className="absolute left-4 top-4 gap-2">
                    <MapButton label="Zoom in" onPress={() => zoom(0.5)}><Plus size={18} color="#0a0a0a" /></MapButton>
                    <MapButton label="Zoom out" onPress={() => zoom(2)}><Minus size={18} color="#0a0a0a" /></MapButton>
                    <MapButton label="Show all listings" onPress={fitAll}><LocateFixed size={18} color="#0a0a0a" /></MapButton>
                </View>

                {/* list toggle */}
                <Pressable
                    // TODO: route to your list view of the same results
                    // onPress={() => router.push("/explore-list")}
                    accessibilityRole="button"
                    className="absolute right-4 top-4 h-11 flex-row items-center gap-2 rounded-full bg-white px-4 active:bg-neutral-100"
                    style={{
                        shadowColor: "#000",
                        shadowOpacity: 0.12,
                        shadowRadius: 6,
                        shadowOffset: { width: 0, height: 2 },
                        elevation: 4,
                    }}
                >
                    <List size={16} color="#0a0a0a" />
                    <Text className="font-jakarta-semibold text-sm text-neutral-950">List</Text>
                </Pressable>

                {/* property carousel */}
                <FlatList
                    ref={listRef}
                    data={data}
                    keyExtractor={(p) => p.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={CARD_W + GAP}
                    decelerationRate="fast"
                    onMomentumScrollEnd={onCarouselEnd}
                    getItemLayout={(_, i) => ({ length: CARD_W + GAP, offset: (CARD_W + GAP) * i, index: i })}
                    contentContainerStyle={{ paddingHorizontal: 16,paddingVertical:12, gap: GAP }}
                    style={{ position: "absolute", left: 0, right: 0, bottom: insets.bottom + TAB_BAR_SPACE }}
                    renderItem={({ item: p }) => {
                        return (
                            <PropertyRow
                                property={p}
                                liked={!!liked[p.id]}
                                onToggleLike={() => toggleLike(p.id)}
                                onPress={() => openProperty(p)}
                                className={`w-[330px]`}
                            />
                        );
                    }}
                />
            </View>
        </View>
    );
}