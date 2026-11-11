import { useMemo, useState } from "react";
import {
    Alert,
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Linking,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, Calendar, Home, MapPin, Phone, Video, X } from "lucide-react-native";
import { getPropertyDetail } from "@/lib/properties";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const TIMES = ["9:00 AM", "10:30 AM", "12:00 PM", "1:30 PM", "3:00 PM", "4:30 PM"];
const VISIT_TYPES = [
    { key: "in-person", label: "In-Person Tour", Icon: Home },
    { key: "virtual", label: "Virtual Tour", Icon: Video },
] as const;

const softShadow = {
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
} as const;

const ymd = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

// leave the whole booking flow (X button); falls back to a normal back
const closeFlow = () => (router.canDismiss() ? router.dismissAll() : router.back());

export default function ScheduleVisitScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const p = getPropertyDetail(id);
    const isRent = p.listingType === "For Rent";
    const insets = useSafeAreaInsets();

    // next 7 days, starting tomorrow
    const dates = useMemo(() => {
        const base = new Date();
        base.setHours(0, 0, 0, 0);
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(base);
            d.setDate(base.getDate() + i + 1);
            return d;
        });
    }, []);

    const [dateIndex, setDateIndex] = useState(0);
    const [time, setTime] = useState<string>("12:00 PM");
    const [visitType, setVisitType] = useState<(typeof VISIT_TYPES)[number]["key"]>("in-person");
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);

    const selected = dates[dateIndex];
    const monthLabel = `${MONTHS[selected.getMonth()]} ${selected.getFullYear()}`;
    const noun = isRent ? "Viewing" : "Visit";

    const confirm = async () => {
        setLoading(true);
        try {
            const payload = {
                propertyId: p.id,
                date: ymd(selected),
                time,
                visitType,
                note: note.trim() || undefined,
            };
            // TODO: send `payload` to your backend (e.g. POST /visits)
            await new Promise((r) => setTimeout(r, 600));

            // TODO: replace this alert with your booking-confirmation screen (design screen 16)
            router.replace({
                pathname: "/visit-confirmed",
                params: {
                    id: p.id,
                    date: payload.date,
                    time: payload.time,
                    visitType: payload.visitType,
                    // bookingRef: booking.reference,  // <- from your backend response
                },
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />

            {/* top bar */}
            <View
                className="flex-row items-center justify-between border-b border-neutral-200 bg-white px-4 pb-3"
                style={{ paddingTop: insets.top + 8 }}
            >
                <Pressable
                    onPress={() => router.back()}
                    hitSlop={6}
                    className="h-10 w-10 items-center justify-center rounded-full active:bg-neutral-100"
                >
                    <ArrowLeft size={20} color="#0a0a0a" />
                </Pressable>
                <Text className="font-jakarta-bold text-base text-neutral-950">
                    {isRent ? "Book a Viewing" : "Schedule a Visit"}
                </Text>
                <Pressable
                    onPress={closeFlow}
                    hitSlop={6}
                    className="h-10 w-10 items-center justify-center rounded-full active:bg-neutral-100"
                >
                    <X size={20} color="#0a0a0a" />
                </Pressable>
            </View>

            <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ padding: 16, paddingBottom: 24, gap: 24 }}
                >
                    {/* property summary */}
                    <View
                        className="flex-row items-center gap-3 rounded-3xl bg-neutral-100 p-2"

                    >
                        <Image source={{ uri: p.images[0] }} className="h-20 w-20 rounded-3xl bg-neutral-100" resizeMode="cover" />
                        <View className="min-w-0 flex-1 gap-1">
                            <Text className="font-jakarta-semibold text-base text-neutral-950" numberOfLines={1}>
                                {p.title}
                            </Text>
                            <View className="flex-row items-center gap-1">
                                <MapPin size={12} fill={"#737373"} color="#737373" />
                                <Text className="flex-1 font-jakarta-semibold text-sm text-neutral-500" numberOfLines={1}>
                                    {p.address}
                                </Text>
                            </View>
                        </View>
                        <View className="rounded-full bg-neutral-900 px-2 py-1">
                            <Text className="font-jakarta-semibold text-xs text-neutral-50">
                                {p.priceLabel}
                                {isRent ? "/mo" : ""}
                            </Text>
                        </View>
                    </View>

                    {/* date */}
                    <View className="gap-4">
                        <View className="flex-row items-center justify-between">
                            <Text className="font-jakarta-semibold text-sm text-neutral-700">Select Date</Text>
                            <Text className="text-sm font-jakarta-semibold text-neutral-500">{monthLabel}</Text>
                        </View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="-mx-4"
                            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 4, gap: 8 }}
                        >
                            {dates.map((d, i) => {
                                const active = i === dateIndex;
                                return (
                                    <Pressable
                                        key={d.toISOString()}
                                        onPress={() => setDateIndex(i)}
                                        className={`min-w-[60px] items-center justify-center gap-1 rounded-xl p-3 ${
                                            active ? "bg-neutral-900" : "bg-neutral-100"
                                        }`}
                                        style={active ? softShadow : undefined}
                                    >
                                        <Text
                                            className={`font-jakarta-semibold text-xs ${
                                                active ? "text-neutral-50/80" : "text-neutral-500"
                                            }`}
                                        >
                                            {WEEKDAYS[d.getDay()]}
                                        </Text>
                                        <Text
                                            className={`font-jakarta-semibold text-lg ${active ? "text-neutral-50" : "text-neutral-950"}`}
                                        >
                                            {d.getDate()}
                                        </Text>
                                        <Text
                                            className={`font-jakarta-regular text-xs ${
                                                active ? "text-neutral-50/80" : "text-neutral-500"
                                            }`}
                                        >
                                            {MONTHS[d.getMonth()]}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </ScrollView>
                    </View>

                    {/* time */}
                    <View className="gap-4">
                        <Text className="font-jakarta-semibold text-sm text-neutral-700">Select Time</Text>
                        <View className="flex-row flex-wrap justify-between gap-y-2">
                            {TIMES.map((t) => {
                                const active = t === time;
                                return (
                                    <Pressable
                                        key={t}
                                        onPress={() => setTime(t)}
                                        className={`w-[32%] items-center justify-center rounded-xl py-3 ${
                                            active ? "bg-neutral-900" : "bg-neutral-100"
                                        }`}
                                        style={active ? softShadow : undefined}
                                    >
                                        <Text
                                            className={`font-jakarta-medium text-sm ${active ? "text-neutral-50" : "text-neutral-950"}`}
                                        >
                                            {t}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>

                    {/* visit type */}
                    <View className="gap-4">
                        <Text className="font-jakarta-semibold text-sm text-neutral-700">Visit Type</Text>
                        <View className="flex-row gap-2">
                            {VISIT_TYPES.map(({ key, label, Icon }) => {
                                const active = key === visitType;
                                return (
                                    <Pressable
                                        key={key}
                                        onPress={() => setVisitType(key)}
                                        className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl py-3 ${
                                            active ? "bg-neutral-900" : "bg-neutral-100"
                                        }`}
                                        style={active ? softShadow : undefined}
                                    >
                                        <Icon size={16} color={active ? "#fafafa" : "#0a0a0a"} />
                                        <Text
                                            className={`font-jakarta-medium text-sm ${active ? "text-neutral-50" : "text-neutral-950"}`}
                                        >
                                            {label}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>

                    {/* agent */}
                    <View
                        className="flex-row items-center gap-3 rounded-3xl border border-neutral-50 bg-white p-4"
                        style={softShadow}
                    >
                        <Image source={{ uri: p.agent.avatar }} className="h-14 w-14 rounded-full bg-neutral-100" />
                        <View className="flex-1">
                            <Text className="font-jakarta-semibold text-lg text-neutral-700">{p.agent.name}</Text>
                            <Text className="font-jakarta-semibold text-sm text-neutral-500">Your agent</Text>
                        </View>
                        <Pressable
                            onPress={() => Linking.openURL(`tel:${p.agent.phone}`)}
                            accessibilityLabel={`Call ${p.agent.name}`}
                            className="h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white active:bg-neutral-50"
                            style={softShadow}
                        >
                            <Phone size={16} color="#0a0a0a" />
                        </Pressable>
                    </View>

                    {/* note */}
                    <View className="gap-2">
                        <Text className="font-jakarta-semibold text-sm text-neutral-950">Add a Note</Text>
                        <TextInput
                            value={note}
                            onChangeText={setNote}
                            placeholder="Any special requests or questions..."
                            placeholderTextColor="#a3a3a3"
                            multiline
                            textAlignVertical="top"
                            className="min-h-24 rounded-3xl bg-neutral-100 p-3 font-jakarta-regular text-sm text-neutral-950"
                        />
                    </View>
                </ScrollView>

                {/* sticky confirm bar */}
                <View
                    className="border-t border-neutral-200 bg-white px-4 pt-3"
                    style={{ paddingBottom: Math.max(insets.bottom, 12) }}
                >
                    <Pressable
                        onPress={confirm}
                        disabled={loading}
                        className={`h-16 flex-row items-center justify-center gap-2 rounded-3xl bg-neutral-900 active:opacity-90 ${
                            loading ? "opacity-70" : ""
                        }`}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fafafa" />
                        ) : (
                            <>
                                <Calendar size={16} color="#fafafa" />
                                <Text className="font-jakarta-semibold text-base text-neutral-50">Confirm {noun}</Text>
                            </>
                        )}
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}