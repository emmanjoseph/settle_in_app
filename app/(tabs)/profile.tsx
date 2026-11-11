import { useState } from "react";
import { Alert, Pressable, ScrollView, Share, Text, View, useWindowDimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Bath,
  BedDouble,
  ChevronRight,
  CreditCard,
  LifeBuoy,
  Lock,
  LogOut,
  MapPin,
  Bell,
  Pencil,
  Settings,
  Share2,
  Star,
  type LucideIcon,
} from "lucide-react-native";
import {GradientBackdrop} from "@/components/GradientBackdrop";

const TEAL = "#0d9488";
const RED = "#dc2626";

const USER = {
  name: "Alex Morgan",
  location: "New York, NY",
  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300",
  listings: 12,
  saved: 48,
  rating: 4.9,
};

type Listing = {
  id: string;
  title: string;
  priceLabel: string;
  type: "For Sale" | "For Rent";
  beds: number;
  baths: number;
  image: string;
};

const LISTINGS: Listing[] = [
  { id: "1", title: "Lakeside Villa", priceLabel: "$1.2M", type: "For Sale", beds: 4, baths: 3, image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500" },
  { id: "2", title: "Downtown Loft", priceLabel: "$3.2K", type: "For Rent", beds: 2, baths: 2, image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500" },
  { id: "3", title: "Suburban Home", priceLabel: "$845K", type: "For Sale", beds: 3, baths: 2, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500" },
  { id: "4", title: "Beach House", priceLabel: "$5.8K", type: "For Rent", beds: 5, baths: 4, image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=500" },
];

const REVIEWS = [
  { id: "r1", name: "Sarah K.", rating: 5, text: "Alex was responsive and the viewing was seamless. Highly recommend." },
  { id: "r2", name: "James O.", rating: 5, text: "Honest listing, exactly as described. Smooth process from start to finish." },
  { id: "r3", name: "Amina W.", rating: 4, text: "Great communication and very flexible with viewing times." },
];

const TABS = [
  { key: "listings", label: "My Listings" },
  { key: "saved", label: "Saved" },
  { key: "reviews", label: "Reviews" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const SETTINGS: { key: string; label: string; Icon: LucideIcon; route?: string }[] = [
  { key: "notifications", label: "Notifications", Icon: Bell },
  { key: "privacy", label: "Privacy", Icon: Lock },
  { key: "payments", label: "Payment Methods", Icon: CreditCard },
  { key: "help", label: "Help & Support", Icon: LifeBuoy },
];

function Stat({ value, label, star }: { value: string | number; label: string; star?: boolean }) {
  return (
      <View className="flex-1 items-center gap-0.5">
        <View className="flex-row items-center gap-1">
          <Text className="font-jakarta-bold text-lg text-neutral-950">{value}</Text>
          {star ? <Star size={13} color="#f59e0b" fill="#f59e0b" /> : null}
        </View>
        <Text className="font-jakarta-regular text-xs text-neutral-500">{label}</Text>
      </View>
  );
}

function ListingCard({ item, width }: { item: Listing; width: number }) {
  const rent = item.type === "For Rent";
  return (
      <Pressable
          // TODO: router.push({ pathname: "/property/[id]", params: { id: item.id } })
          accessibilityRole="button"
          accessibilityLabel={`${item.title}, ${item.priceLabel}`}
          className="gap-2 active:opacity-90"
          style={{ width }}
      >
        <View className="overflow-hidden rounded-3xl bg-neutral-200" style={{ width, height: width * 1.05 }}>
          <Image source={{ uri: item.image }} style={{ width: "100%", height: "100%" }} contentFit="cover" transition={200} />
          <View
              className="absolute left-2.5 top-2.5 rounded-full px-2.5 py-1"
              style={{ backgroundColor: rent ? "rgba(13,148,136,0.92)" : "rgba(13,148,136,0.92)" }}
          >
            <Text className="font-jakarta-semibold text-[10px] text-white">{item.type}</Text>
          </View>
        </View>
        <View className="flex-row items-center justify-between gap-2 px-1">
          <Text className="flex-1 font-jakarta-bold text-sm text-neutral-950" numberOfLines={1}>
            {item.title}
          </Text>
          <View className="rounded-full bg-neutral-950 px-2.5 py-1">
            <Text className="font-jakarta-bold text-[11px] text-white">{item.priceLabel}</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-3 px-1">
          <View className="flex-row items-center gap-1">
            <BedDouble size={13} color="#737373" />
            <Text className="font-jakarta-medium text-xs text-neutral-500">{item.beds}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Bath size={13} color="#737373" />
            <Text className="font-jakarta-medium text-xs text-neutral-500">{item.baths}</Text>
          </View>
        </View>
      </Pressable>
  );
}

export default function Profile() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const cardW = (width - 32 - 12) / 2;
  const [tab, setTab] = useState<TabKey>("listings");

  const changeTab = (k: TabKey) => {
    Haptics.selectionAsync();
    setTab(k);
  };

  const shareProfile = () => Share.share({ message: `${USER.name} on Settle In · ${USER.location}` });

  const signOut = () =>
      Alert.alert("Sign out?", "You'll need to sign in again to access your account.", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign out",
          style: "destructive",
          onPress: () => {
            // TODO: clear session, then router.replace("/sign-in")
          },
        },
      ]);

  const saved = LISTINGS.slice(0, 2);
  const grid = tab === "listings" ? LISTINGS : saved;

  return (
      <View className="flex-1 bg-white">
        <StatusBar style="dark" />
        <GradientBackdrop height={300}/>
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 100 }}
        >
          {/* header */}
          <View className="flex-row items-center justify-between px-4 pb-4">
            {/*<View className="h-10 w-10" />*/}
            <Text className="font-jakarta-bold text-[25px] text-neutral-950">Profile</Text>
            <Pressable
                // TODO: router.push("/settings")
                hitSlop={6}
                accessibilityRole="button"
                accessibilityLabel="Settings"
                className="h-10 w-10 items-center justify-center rounded-full bg-neutral-100 active:bg-neutral-200"
            >
              <Settings size={18} color="#0a0a0a" />
            </Pressable>
          </View>

          {/* identity */}
          <View className="items-center px-4">
            <View className="h-28 w-28 items-center justify-center rounded-full border-2" style={{ borderColor: TEAL }}>
              <Image
                  source={{ uri: USER.avatar }}
                  style={{ width: 98, height: 98, borderRadius: 49, backgroundColor: "#e5e5e5" }}
                  contentFit="cover"
                  transition={200}
              />
              <View className="absolute bottom-1.5 right-1.5 h-5 w-5 rounded-full border-[3px] border-white bg-emerald-500" />
            </View>
            <Text className="mt-3 font-jakarta-bold text-xl tracking-tight text-neutral-950">{USER.name}</Text>
            <View className="mt-1 flex-row items-center gap-1">
              <MapPin size={13} color="#737373" />
              <Text className="font-jakarta-regular text-sm text-neutral-500">{USER.location}</Text>
            </View>
            <View className="mt-2.5 rounded-full px-3 py-1" style={{ backgroundColor: TEAL }}>
              <Text className="font-jakarta-semibold text-[11px] text-white">Verified Buyer</Text>
            </View>
          </View>

          {/* stats */}
          <View className="mx-4 mt-5 flex-row rounded-3xl bg-neutral-100 py-4">
            <Stat value={USER.listings} label="Listings" />
            <View className="w-px bg-neutral-200" />
            <Stat value={USER.saved} label="Saved" />
            <View className="w-px bg-neutral-200" />
            <Stat value={USER.rating} label="Reviews" star />
          </View>

          {/* actions */}
          <View className="mt-3 flex-row gap-3 px-4">
            <Pressable
                // TODO: router.push("/edit-profile")
                accessibilityRole="button"
                className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-full bg-neutral-950 active:opacity-90"
            >
              <Pencil size={15} color="#ffffff" />
              <Text className="font-jakarta-semibold text-sm text-white">Edit Profile</Text>
            </Pressable>
            <Pressable
                onPress={shareProfile}
                accessibilityRole="button"
                className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white active:bg-neutral-50"
            >
              <Share2 size={15} color="#0a0a0a" />
              <Text className="font-jakarta-semibold text-sm text-neutral-950">Share Profile</Text>
            </Pressable>
          </View>

          {/* tabs */}
          <View className="mt-6 flex-row gap-6 border-b border-neutral-100 px-4">
            {TABS.map((t) => {
              const active = t.key === tab;
              return (
                  <Pressable
                      key={t.key}
                      onPress={() => changeTab(t.key)}
                      accessibilityRole="tab"
                      accessibilityState={{ selected: active }}
                      className={`-mb-px pb-3 ${active ? "border-b-2 border-neutral-950" : ""}`}
                  >
                    <Text
                        className={`text-sm ${
                            active ? "font-jakarta-semibold text-neutral-950" : "font-jakarta-medium text-neutral-400"
                        }`}
                    >
                      {t.label}
                    </Text>
                  </Pressable>
              );
            })}
          </View>

          {/* tab content */}
          {tab === "reviews" ? (
              <View className="px-4 pt-2">
                {REVIEWS.map((r, i) => (
                    <View key={r.id} className={`gap-1.5 py-4 ${i > 0 ? "border-t border-neutral-100" : ""}`}>
                      <View className="flex-row items-center justify-between">
                        <Text className="font-jakarta-semibold text-sm text-neutral-950">{r.name}</Text>
                        <View className="flex-row gap-0.5">
                          {Array.from({ length: 5 }).map((_, n) => (
                              <Star
                                  key={n}
                                  size={12}
                                  color="#f59e0b"
                                  fill={n < r.rating ? "#f59e0b" : "transparent"}
                              />
                          ))}
                        </View>
                      </View>
                      <Text className="font-jakarta-regular text-sm leading-5 text-neutral-500">{r.text}</Text>
                    </View>
                ))}
              </View>
          ) : (
              <View className="flex-row flex-wrap gap-x-3 gap-y-5 px-4 pt-4">
                {grid.map((item) => (
                    <ListingCard key={item.id} item={item} width={cardW} />
                ))}
              </View>
          )}

          {/* settings */}
          <View className="mt-8 px-4">

            <View className="gap-2">
              {SETTINGS.map(({ key, label, Icon }) => (
                  <Pressable
                      key={key}
                      // TODO: router.push(`/settings/${key}`)
                      accessibilityRole="button"
                      className="h-14 flex-row items-center gap-3 rounded-2xl bg-neutral-100 px-4 active:bg-neutral-200"
                  >
                    <Icon size={18} color="#0a0a0a" />
                    <Text className="flex-1 font-jakarta-semibold text-sm text-neutral-950">{label}</Text>
                    <ChevronRight size={20} color="#a3a3a3" />
                  </Pressable>
              ))}
              <Pressable
                  onPress={signOut}
                  accessibilityRole="button"
                  className="h-14 flex-row items-center gap-3 rounded-2xl bg-red-50 px-4 active:bg-red-100"
              >
                <LogOut size={18} color={RED} />
                <Text className="flex-1 font-jakarta-semibold text-sm" style={{ color: RED }}>
                  Sign Out
                </Text>
                <ChevronRight size={18} color="#fca5a5" />
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
  );
}