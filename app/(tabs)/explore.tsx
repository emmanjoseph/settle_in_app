import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowUpDown, ChevronDown, ChevronRight, Map, Search, SlidersHorizontal } from "lucide-react-native";
import { PropertyRow, type Property } from "@/components/explore/PropertyRow";
import { RangeSlider, TEAL, formatPrice } from "@/components/explore/RangeSlider";
import {GradientBackdrop} from "@/components/GradientBackdrop";

// ---- placeholder data (swap for your API) ----------------------------------
const PROPERTIES: Property[] = [
  {
    id: "1", title: "Modern Villa Estate", location: "Beverly Hills, CA", priceLabel: "$2.4M", price: 2_400_000,
    type: "Villa", beds: 5, baths: 4, area: "4.2k",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400",
  },
  {
    id: "2", title: "Downtown Loft", location: "Manhattan, NYC", priceLabel: "$850K", price: 850_000,
    type: "Apartment", beds: 2, baths: 2, area: "1.5k",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
  },
  {
    id: "3", title: "Family Suburban Home", location: "Austin, TX", priceLabel: "$620K", price: 620_000,
    type: "House", beds: 4, baths: 3, area: "2.8k",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400",
  },
  {
    id: "4", title: "Sky Penthouse Suite", location: "Miami Beach, FL", priceLabel: "$3.1M", price: 3_100_000,
    type: "Apartment", beds: 3, baths: 3, area: "3.5k",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400",
  },
];
// ----------------------------------------------------------------------------

const TYPES = ["All Types", "House", "Apartment", "Villa", "Studio", "Commercial"] as const;
const SORTS = ["Newest", "Price: Low", "Price: High"] as const;
const PRICE_MIN = 0;
const PRICE_MAX = 5_000_000;
const PRICE_STEP = 50_000;

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const focused = useIsFocused();

  const [query, setQuery] = useState("");
  const [type, setType] = useState<(typeof TYPES)[number]>("All Types");
  const [range, setRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [sortIndex, setSortIndex] = useState(0);
  const [liked, setLiked] = useState<Set<string>>(new Set());

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const [lo, hi] = range;
    const list = PROPERTIES.filter(
        (p) =>
            (type === "All Types" || p.type === type) &&
            (!q || `${p.title} ${p.location}`.toLowerCase().includes(q)) &&
            p.price >= lo &&
            (hi >= PRICE_MAX || p.price <= hi),
    );
    if (sortIndex === 1) return [...list].sort((a, b) => a.price - b.price);
    if (sortIndex === 2) return [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [query, type, range, sortIndex]);

  const toggleLike = (id: string) =>
      setLiked((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });

  const anyPrice = range[0] <= PRICE_MIN && range[1] >= PRICE_MAX;
  const priceLabel = anyPrice
      ? "Any price"
      : `${formatPrice(range[0])} – ${range[1] >= PRICE_MAX ? "$5M+" : formatPrice(range[1])}`;

  return (
      <View className="flex-1 bg-white">
        <GradientBackdrop height={300} />
        {focused && <StatusBar style="dark" />}

        <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
          {/* sticky: title, search, type chips */}
          <View className="gap-4  pb-4" style={{ paddingTop: insets.top + 12 }}>
            <View className="flex-row items-center justify-between px-4">
              <Text className="font-jakarta-bold text-[30px] leading-9 tracking-tight text-neutral-950">
                Explore
              </Text>
              <Pressable className="">
                <SlidersHorizontal size={26} color="#0a0a0a" />
              </Pressable>
            </View>

            <View className="mx-4 justify-center">
              <View className="absolute bottom-0 left-4 top-0 z-10 justify-center">
                <Search size={20} color="#737373" />
              </View>
              <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search city, neighborhood, address…"
                  placeholderTextColor="#737373"
                  returnKeyType="search"
                  className="h-16 rounded-full bg-white pl-12 pr-4 font-jakarta-regular text-sm text-neutral-950"
              />
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 14, gap: 8 }}
            >
              {TYPES.map((t) => {
                const active = t === type;
                return (
                    <Pressable
                        key={t}
                        onPress={() => setType(t)}
                        className={`rounded-full px-5 py-3 ${active ? "bg-neutral-900" : "bg-white"}`}
                    >
                      <Text
                          className={`text-sm font-jakarta-medium ${active ? "text-neutral-50" : "text-neutral-700"}`}
                      >
                        {t}
                      </Text>
                    </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View className="gap-6 px-6 pb-8 pt-2">
            {/* price range */}
            <View className="gap-4">
              <View className="flex-row items-center justify-between">
                <Text className="font-jakarta-semibold text-sm text-neutral-950">Price Range</Text>
                <Text className="font-jakarta-medium text-sm" style={{ color: TEAL }}>
                  {priceLabel}
                </Text>
              </View>
              <RangeSlider min={PRICE_MIN} max={PRICE_MAX} step={PRICE_STEP} value={range} onChange={setRange} />
              <View className="flex-row justify-between">
                <Text className="font-jakarta-regular text-xs text-neutral-500">$0</Text>
                <Text className="font-jakarta-regular text-xs text-neutral-500">$5M+</Text>
              </View>
            </View>

            {/* map view card */}
            <Pressable
                // TODO: navigate to your map screen (design screen 14)
                className="flex-row items-center justify-between rounded-3xl bg-neutral-100 p-3"
            >
              <View className="flex-row items-center gap-5">
                <View className="h-14 w-14 items-center justify-center rounded-lg bg-white">
                  <Map size={20} color="#0a0a0a" />
                </View>
                <View>
                  <Text className="font-jakarta-semibold text-sm text-neutral-950">View on Map</Text>
                  <Text className="font-jakarta-medium text-xs text-neutral-700">See properties around you</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#737373" />
            </Pressable>

            {/* results header */}
            <View className="flex-row items-center justify-between pt-2">
              <View>
                <Text className="font-jakarta-bold text-lg text-neutral-950">Results</Text>
                <Text className="font-jakarta-medium text-sm text-neutral-500">
                  {results.length} {results.length === 1 ? "property" : "properties"}
                </Text>
              </View>
              <Pressable
                  onPress={() => setSortIndex((i) => (i + 1) % SORTS.length)}
                  className="h-12 flex-row items-center gap-1 rounded-full border border-neutral-200 bg-white px-3"
              >
                <ArrowUpDown size={12} color="#0a0a0a" />
                <Text className="font-jakarta-semibold text-xs text-neutral-950">Sort: {SORTS[sortIndex]}</Text>
              </Pressable>
            </View>

            {/* results */}
            <View className="gap-2">
              {results.map((p) => (
                  <PropertyRow key={p.id} property={p} liked={liked.has(p.id)} onToggleLike={() => toggleLike(p.id)} />
              ))}
              {results.length === 0 && (
                  <View className="items-center gap-1 py-10">
                    <Text className="font-jakarta-semibold text-xl text-neutral-950">No properties found</Text>
                    <Text className="font-jakarta-regular text-sm text-neutral-500">
                      Try a different search, type or price range
                    </Text>
                  </View>
              )}
            </View>

            {results.length > 0 && (
                <Pressable
                    // TODO: fetch the next page from your API
                    className="h-11 flex-row items-center justify-center gap-2 rounded-xl"
                >
                  <Text className="font-jakarta-extrabold text-lg text-neutral-600">Load More</Text>
                  <ChevronDown size={16} color="#0a0a0a" />
                </Pressable>
            )}
          </View>
        </ScrollView>
      </View>
  );
}