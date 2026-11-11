import { ReactNode } from "react";
import { Alert, Image, Linking, Pressable, ScrollView, Share, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
    BadgeCheck, Calendar,
    CalendarDays,
    CalendarPlus,
    Check, CheckCircle2,
    Clock,
    Eye,
    Home,
    MapPin,
    MessageCircle,
    Phone,
    Share2,
    Video,
    X,
} from "lucide-react-native";
import { getPropertyDetail } from "@/lib/properties";

const TEAL = "#0d9488";
const FULL_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const pad = (n: number) => String(n).padStart(2, "0");

/** "2026-11-12" -> local Date, or null */
function parseDate(value?: string) {
    const m = value?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
}

/** "12:00 PM" -> { h: 12, min: 0 } (24h), or null */
function parseTime(value?: string) {
    const m = value?.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!m) return null;
    return { h: (Number(m[1]) % 12) + (m[3].toUpperCase() === "PM" ? 12 : 0), min: Number(m[2]) };
}

const stamp = (d: Date) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

const closeFlow = () => (router.canDismiss() ? router.dismissAll() : router.replace("/"));

function Tile({ icon, label, value, sub }: { icon: ReactNode; label: string; value: string; sub?: string }) {
    return (
        <View className="flex-1 rounded-2xl bg-neutral-50 p-3.5">
            <View className="mb-3 flex-row items-center gap-1.5">
                {icon}
                <Text className="font-jakarta-medium text-[10px] uppercase tracking-widest text-neutral-500">
                    {label}
                </Text>
            </View>
            <Text className="font-jakarta-bold text-xl tracking-tight text-neutral-950" numberOfLines={1}>
                {value}
            </Text>
            {sub ? <Text className="mt-0.5 font-jakarta-regular text-xs text-neutral-500">{sub}</Text> : null}
        </View>
    );
}

/** dashed "tear line" with ticket notches on both sides */
function TearLine() {
    return (
        <View className="h-6 justify-center">
            <View className="flex-row justify-between px-6">
                {Array.from({ length: 22 }).map((_, i) => (
                    <View key={i} className="h-px w-2 bg-neutral-300" />
                ))}
            </View>
            <View className="absolute -left-3 h-6 w-6 rounded-full bg-white" />
            <View className="absolute -right-3 h-6 w-6 rounded-full bg-white" />
        </View>
    );
}

export default function VisitConfirmedScreen() {
    const { id, date, time, visitType, bookingRef } = useLocalSearchParams<{
        id: string;
        date?: string;
        time?: string;
        visitType?: string;
        bookingRef?: string;
    }>();

    const p = getPropertyDetail(id);
    const insets = useSafeAreaInsets();
    const isRent = p.listingType === "For Rent";
    const noun = isRent ? "Viewing" : "Visit";
    const isVirtual = visitType === "virtual";
    const agentFirstName = p.agent.name.split(" ")[0];

    const day = parseDate(date);
    const clock = parseTime(time);
    const dateLabel = day
        ? `${FULL_DAYS[day.getDay()]}, ${MONTHS[day.getMonth()]} ${day.getDate()}, ${day.getFullYear()}`
        : "—";

    const share = () =>
        Share.share({ message: `${noun}: ${p.title} · ${dateLabel} at ${time ?? "—"} · ${p.address}` });

    const addToCalendar = () => {
        if (!day || !clock) {
            Alert.alert("Can't add to calendar", "The date or time for this booking is missing.");
            return;
        }
        const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), clock.h, clock.min);
        const end = new Date(start.getTime() + 60 * 60 * 1000); // assume a 1-hour slot
        const url =
            "https://calendar.google.com/calendar/render?action=TEMPLATE" +
            `&text=${encodeURIComponent(`${noun}: ${p.title}`)}` +
            `&dates=${stamp(start)}/${stamp(end)}` +
            `&location=${encodeURIComponent(p.address)}` +
            `&details=${encodeURIComponent(`${isVirtual ? "Virtual tour" : "In-person tour"} with ${p.agent.name}`)}`;
        Linking.openURL(url);
    };

    const cancel = () =>
        Alert.alert(`Cancel this ${noun.toLowerCase()}?`, "The agent will be notified.", [
            { text: `Keep ${noun.toLowerCase()}`, style: "cancel" },
            {
                text: `Cancel ${noun.toLowerCase()}`,
                style: "destructive",
                onPress: () => {
                    // TODO: cancel on your backend using `bookingRef` (e.g. DELETE /visits/:ref)
                    closeFlow();
                },
            },
        ]);

    const viewProperty = () =>
        router.canGoBack() ? router.back() : router.replace({ pathname: "/property/[id]", params: { id: p.id } });

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
            >
                {/* mint header, scrolls with content */}
                <LinearGradient
                    colors={["#a7f3e4", "#d9fbf3", "#ffffff"]}
                    style={{ position: "absolute", top: 0, left: 0, right: 0, height: 340 }}
                />

                {/* top bar */}
                <View className="flex-row items-center justify-between px-5 pb-2" style={{ paddingTop: insets.top + 8 }}>
                    <Pressable
                        onPress={closeFlow}
                        hitSlop={6}
                        className="h-10 w-10 items-center justify-center rounded-full bg-white/70 active:bg-white"
                    >
                        <X size={20} color="#0a0a0a" />
                    </Pressable>
                    <Pressable
                        onPress={share}
                        hitSlop={6}
                        className="h-10 w-10 items-center justify-center rounded-full bg-white/70 active:bg-white"
                    >
                        <Share2 size={19} color="#0a0a0a" />
                    </Pressable>
                </View>

                {/* success hero */}
                {/* success hero */}
                <View className="items-center px-6 pb-7 pt-3">
                    <View className="h-40 w-40 items-center justify-center">
                        <View className="absolute inset-0 rounded-full" style={{ backgroundColor: "rgba(13,148,136,0.08)" }} />
                        <View className="absolute inset-4 rounded-full" style={{ backgroundColor: "rgba(13,148,136,0.15)" }} />
                        <View className="absolute inset-8 rounded-full" style={{ backgroundColor: "rgba(13,148,136,0.25)" }} />
                        <View
                            className="h-14 w-14 items-center justify-center rounded-2xl bg-neutral-900"
                            style={{
                                shadowColor: "#000",
                                shadowOpacity: 0.2,
                                shadowRadius: 12,
                                shadowOffset: { width: 0, height: 6 },
                                elevation: 6,
                            }}
                        >
                            <CheckCircle2 size={28} color="#fafafa" />
                        </View>
                        <View className="absolute bottom-3 right-3 h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white">
                            <View className="h-6 w-6 items-center justify-center rounded-full" style={{ backgroundColor: TEAL }}>
                                <Calendar size={12} color="#ffffff" />
                            </View>
                        </View>
                    </View>
                    <Text className="mt-2 font-jakarta-bold text-[26px] tracking-tight text-neutral-950">
                        {noun} confirmed
                    </Text>
                    <Text className="mt-1 text-center font-jakarta-regular text-[15px] text-neutral-600">
                        {agentFirstName} will see you {day ? `on ${MONTHS[day.getMonth()]} ${day.getDate()}` : "soon"}.
                    </Text>
                </View>

                {/* ticket */}
                <View
                    className="mx-4 rounded-[28px] bg-white"
                    style={{
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowRadius: 24,
                        shadowOffset: { width: 0, height: 10 },
                        elevation: 8,
                    }}
                >
                    {/* property header */}
                    <View className="overflow-hidden rounded-t-[28px]">
                        <Image source={{ uri: p.images[0] }} className="h-40 w-full bg-neutral-200" resizeMode="cover" />
                        <LinearGradient
                            colors={["transparent", "rgba(0,0,0,0.65)"]}
                            style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 100 }}
                        />
                        <View className="absolute bottom-3 left-4 right-4">
                            <Text className="font-jakarta-bold text-lg text-white" numberOfLines={1}>
                                {p.title}
                            </Text>
                            <View className="mt-0.5 flex-row items-center gap-1">
                                <MapPin size={12} color="#ffffff" />
                                <Text className="flex-1 font-jakarta-regular text-xs text-white/90" numberOfLines={1}>
                                    {p.address}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* date + time */}
                    <View className="flex-row gap-3 p-4">
                        <Tile
                            icon={<CalendarDays size={13} color="#737373" />}
                            label="Date"
                            value={day ? `${MONTHS[day.getMonth()]} ${day.getDate()}` : "—"}
                            sub={day ? `${FULL_DAYS[day.getDay()]}, ${day.getFullYear()}` : undefined}
                        />
                        <Tile
                            icon={<Clock size={13} color="#737373" />}
                            label="Time"
                            value={time ?? "—"}
                            sub="About 1 hour"
                        />
                    </View>

                    <TearLine />

                    {/* type + agent + ref */}
                    <View className="gap-4 p-4">
                        <View className="flex-row items-center gap-3">
                            <View className="h-10 w-10 items-center justify-center rounded-xl bg-neutral-950">
                                {isVirtual ? <Video size={18} color="#fff" /> : <Home size={18} color="#fff" />}
                            </View>
                            <View className="flex-1">
                                <Text className="font-jakarta-medium text-[10px] uppercase tracking-widest text-neutral-500">
                                    {noun} type
                                </Text>
                                <Text className="font-jakarta-semibold text-sm text-neutral-950">
                                    {isVirtual ? "Virtual tour" : "In-person tour"}
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row items-center gap-3 rounded-2xl bg-neutral-50 p-3">
                            <Image source={{ uri: p.agent.avatar }} className="h-10 w-10 rounded-full bg-neutral-200" />
                            <View className="flex-1">
                                <Text className="font-jakarta-medium text-[10px] uppercase tracking-widest text-neutral-500">
                                    Your agent
                                </Text>
                                <Text className="font-jakarta-semibold text-sm text-neutral-950" numberOfLines={1}>
                                    {p.agent.name}
                                </Text>
                            </View>
                            <Pressable
                                onPress={() => Linking.openURL(`sms:${p.agent.phone}`)}
                                accessibilityLabel={`Message ${p.agent.name}`}
                                className="h-10 w-10 items-center justify-center rounded-full bg-white"
                            >
                                <MessageCircle size={17} color="#0a0a0a" />
                            </Pressable>
                            <Pressable
                                onPress={() => Linking.openURL(`tel:${p.agent.phone}`)}
                                accessibilityLabel={`Call ${p.agent.name}`}
                                className="h-10 w-10 items-center justify-center rounded-full bg-neutral-950"
                            >
                                <Phone size={17} color="#ffffff" />
                            </Pressable>
                        </View>

                        {bookingRef ? (
                            <View className="flex-row items-center justify-center gap-1.5">
                                <BadgeCheck size={14} color={TEAL} />
                                <Text className="font-jakarta-medium text-xs" style={{ color: TEAL }}>
                                    Booking #{bookingRef}
                                </Text>
                            </View>
                        ) : null}
                    </View>
                </View>

                {/* footnote + cancel */}
                <Text className="mt-5 px-8 text-center font-jakarta-regular text-xs leading-5 text-neutral-500">
                    A confirmation email is on its way. {agentFirstName} will reach out 1 hour before your{" "}
                    {noun.toLowerCase()}.
                </Text>
                <Pressable onPress={cancel} hitSlop={8} className="items-center py-4">
                    <Text className="font-jakarta-medium text-xs text-red-500">Cancel {noun.toLowerCase()}</Text>
                </Pressable>
            </ScrollView>

            {/* pinned actions */}
            <View
                className="absolute bottom-0 left-0 right-0 flex-row gap-3 border-t border-neutral-100 bg-white/95 px-4 pt-3"
                style={{ paddingBottom: Math.max(insets.bottom, 12) }}
            >
                <Pressable
                    onPress={viewProperty}
                    className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white active:bg-neutral-50"
                >
                    <Eye size={16} color="#0a0a0a" />
                    <Text className="font-jakarta-semibold text-[15px] text-neutral-950">Property</Text>
                </Pressable>
                <Pressable
                    onPress={addToCalendar}
                    className="h-12 flex-[1.6] flex-row items-center justify-center gap-2 rounded-full bg-neutral-950 active:opacity-90"
                >
                    <CalendarPlus size={16} color="#ffffff" />
                    <Text className="font-jakarta-semibold text-[15px] text-white">Add to Calendar</Text>
                </Pressable>
            </View>
        </View>
    );
}