import { useEffect, useRef, useState } from "react";
import {
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Linking,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
    ArrowUp,
    ChevronLeft,
    ChevronRight,
    FileText,
    MoreHorizontal,
    Phone,
    Plus,
    Smile,
} from "lucide-react-native";
import { getConversation, type ChatItem } from "@/lib/chats";

const TEAL = "#0d9488";
const R = 22; // bubble radius
const TAIL = 6; // squared corner on the last bubble of a group

const nowLabel = () => {
    const d = new Date();
    const h = d.getHours();
    return `${h % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

function Dot({ delay }: { delay: number }) {
    const o = useSharedValue(0.3);
    useEffect(() => {
        o.value = withDelay(
            delay,
            withRepeat(withSequence(withTiming(1, { duration: 400 }), withTiming(0.3, { duration: 400 })), -1),
        );
    }, []);
    const style = useAnimatedStyle(() => ({ opacity: o.value }));
    return <Animated.View style={style} className="h-2 w-2 rounded-full bg-neutral-400" />;
}

const HeaderButton = ({
                          onPress,
                          label,
                          disabled,
                          children,
                      }: {
    onPress?: () => void;
    label: string;
    disabled?: boolean;
    children: React.ReactNode;
}) => (
    <Pressable
        onPress={onPress}
        disabled={disabled}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel={label}
        className={`h-10 w-10 items-center justify-center rounded-full bg-neutral-100 active:bg-neutral-200 ${
            disabled ? "opacity-40" : ""
        }`}
    >
        {children}
    </Pressable>
);

export default function ChatScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const convo = getConversation(id);
    const insets = useSafeAreaInsets();
    const listRef = useRef<FlatList<ChatItem>>(null);

    const [items, setItems] = useState<ChatItem[]>(convo?.messages ?? []);
    const [text, setText] = useState("");
    const [keyboardUp, setKeyboardUp] = useState(false);

    // drop the safe-area gap while the keyboard is open
    useEffect(() => {
        const show = Keyboard.addListener(Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow", () => setKeyboardUp(true));
        const hide = Keyboard.addListener(Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide", () => setKeyboardUp(false));
        return () => {
            show.remove();
            hide.remove();
        };
    }, []);

    const goBack = () => (router.canGoBack() ? router.back() : router.replace("/messages"));

    if (!convo) {
        return (
            <View className="flex-1 items-center justify-center gap-3 bg-white px-6">
                <Text className="font-jakarta-semibold text-base text-neutral-950">Conversation not found</Text>
                <Pressable onPress={goBack} className="rounded-full bg-neutral-900 px-5 py-2.5">
                    <Text className="font-jakarta-semibold text-sm text-neutral-50">Go back</Text>
                </Pressable>
            </View>
        );
    }

    const canSend = text.trim().length > 0;

    const send = () => {
        if (!canSend) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const msg: ChatItem = { kind: "msg", id: `local-${Date.now()}`, from: "me", time: nowLabel(), text: text.trim() };
        // TODO: send `msg` through your backend / websocket and update its status from the response
        setItems((prev) => [...prev, msg]);
        setText("");
        requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    };

    const renderItem = ({ item, index }: { item: ChatItem; index: number }) => {
        if (item.kind === "date") {
            return (
                <View className="items-center pb-1 pt-5">
                    <View className="rounded-full bg-neutral-100 px-3 py-1">
                        <Text className="font-jakarta-medium text-[11px] text-neutral-500">{item.label}</Text>
                    </View>
                </View>
            );
        }

        // group consecutive messages from the same sender
        const prev = items[index - 1];
        const next = items[index + 1];
        const samePrev = prev?.kind === "msg" && prev.from === item.from;
        const sameNext = next?.kind === "msg" && next.from === item.from;
        const last = !sameNext;
        const mine = item.from === "me";
        const mt = samePrev ? 3 : 14;

        if (mine) {
            return (
                <View className="items-end" style={{ marginTop: mt }}>
                    <View
                        className="max-w-[78%] bg-neutral-950 px-4 py-3"
                        style={{
                            borderRadius: R,
                            borderBottomRightRadius: last ? TAIL : R,
                        }}
                    >
                        <Text className="font-jakarta-regular text-[15px] leading-[21px] text-white">{item.text}</Text>
                    </View>
                    {last && (
                        <View className="mr-1 mt-1 flex-row items-center gap-1">
                            <Text className="font-jakarta-regular text-[11px] text-neutral-400">
                                {item.seen ? `Seen ${item.seen}` : item.time}
                            </Text>
                            {item.seen ? (
                                <Image source={{ uri: convo.avatar }} style={{ width: 14, height: 14, borderRadius: 7 }} contentFit="cover" />
                            ) : null}
                        </View>
                    )}
                </View>
            );
        }

        return (
            <View className="flex-row items-end gap-2" style={{ marginTop: mt }}>
                {last ? (
                    <Image
                        source={{ uri: convo.avatar }}
                        style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: "#e5e5e5" }}
                        contentFit="cover"
                    />
                ) : (
                    <View style={{ width: 30 }} />
                )}
                <View className="max-w-[78%]">
                    <View
                        className="bg-neutral-100 px-4 py-3"
                        style={{ borderRadius: R, borderBottomLeftRadius: last ? TAIL : R }}
                    >
                        {item.file ? (
                            <View className="flex-row items-center gap-3">
                                <View className="h-10 w-10 items-center justify-center rounded-xl bg-white">
                                    <FileText size={20} color="#0a0a0a" />
                                </View>
                                <View className="shrink">
                                    <Text className="font-jakarta-semibold text-[13px] text-neutral-950" numberOfLines={1}>
                                        {item.file.name}
                                    </Text>
                                    <Text className="font-jakarta-regular text-[11px] text-neutral-500">{item.file.size}</Text>
                                </View>
                            </View>
                        ) : (
                            <Text className="font-jakarta-regular text-[15px] leading-[21px] text-neutral-950">{item.text}</Text>
                        )}
                    </View>
                    {last && <Text className="ml-1 mt-1 font-jakarta-regular text-[11px] text-neutral-400">{item.time}</Text>}
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView className="flex-1 bg-white" behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <StatusBar style="dark" />

            {/* header */}
            <View className="bg-white px-4 pb-3" style={{ paddingTop: insets.top + 8 }}>
                <View className="flex-row items-center gap-3">
                    <HeaderButton onPress={goBack} label="Back">
                        <ChevronLeft size={22} color="#0a0a0a" />
                    </HeaderButton>

                    <View className="min-w-0 flex-1 flex-row items-center gap-3">
                        <View>
                            <Image
                                source={{ uri: convo.avatar }}
                                style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: "#e5e5e5" }}
                                contentFit="cover"
                            />
                            {convo.online && (
                                <View
                                    className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white"
                                    style={{ backgroundColor: TEAL }}
                                />
                            )}
                        </View>
                        <View className="min-w-0 flex-1">
                            <Text className="font-jakarta-bold text-base tracking-tight text-neutral-950" numberOfLines={1}>
                                {convo.name}
                            </Text>
                            <Text
                                className="font-jakarta-regular text-xs"
                                style={{ color: convo.online ? TEAL : "#a3a3a3" }}
                            >
                                {convo.online ? "Online" : "Offline"}
                            </Text>
                        </View>
                    </View>

                    <HeaderButton
                        onPress={() => convo.phone && Linking.openURL(`tel:${convo.phone}`)}
                        disabled={!convo.phone}
                        label={`Call ${convo.name}`}
                    >
                        <Phone size={18} color="#0a0a0a" />
                    </HeaderButton>
                    <HeaderButton
                        // TODO: more options (mute, block, report)
                        label="More options"
                    >
                        <MoreHorizontal size={18} color="#0a0a0a" />
                    </HeaderButton>
                </View>

                {convo.property && (
                    <Pressable
                        onPress={() => router.push({ pathname: "/property/[id]", params: { id: convo.property!.id } })}
                        accessibilityRole="button"
                        accessibilityLabel={`View listing: ${convo.property.title}`}
                        className="mt-3 flex-row items-center gap-3 rounded-2xl bg-neutral-100 p-2 active:bg-neutral-200"
                    >
                        <Image
                            source={{ uri: convo.property.image }}
                            style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: "#e5e5e5" }}
                            contentFit="cover"
                        />
                        <View className="min-w-0 flex-1">
                            <Text className="font-jakarta-semibold text-sm text-neutral-950" numberOfLines={1}>
                                {convo.property.title}
                            </Text>
                            <Text className="font-jakarta-bold text-[13px] text-neutral-950">{convo.property.priceLabel}</Text>
                        </View>
                        <View className="flex-row items-center pr-1">
                            <Text className="font-jakarta-semibold text-xs" style={{ color: TEAL }}>
                                View
                            </Text>
                            <ChevronRight size={14} color={TEAL} />
                        </View>
                    </Pressable>
                )}
            </View>

            {/* messages */}
            <FlatList
                ref={listRef}
                data={items}
                keyExtractor={(m) => m.id}
                renderItem={renderItem}
                onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="interactive"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
                ListFooterComponent={
                    convo.typing ? (
                        <View className="mt-3 flex-row items-end gap-2">
                            <Image
                                source={{ uri: convo.avatar }}
                                style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: "#e5e5e5" }}
                                contentFit="cover"
                            />
                            <View
                                className="flex-row items-center gap-1.5 bg-neutral-100 px-4 py-4"
                                style={{ borderRadius: R, borderBottomLeftRadius: TAIL }}
                            >
                                <Dot delay={0} />
                                <Dot delay={150} />
                                <Dot delay={300} />
                            </View>
                        </View>
                    ) : null
                }
            />

            {/* input bar */}
            <View
                className="flex-row items-end gap-2 bg-white px-3 pt-2"
                style={{ paddingBottom: keyboardUp ? 8 : Math.max(insets.bottom, 8) }}
            >
                <Pressable
                    // TODO: attach a photo or document (expo-image-picker / expo-document-picker)
                    hitSlop={6}
                    accessibilityRole="button"
                    accessibilityLabel="Attach a file"
                    className="mb-0.5 h-11 w-11 items-center justify-center rounded-full bg-neutral-100 active:bg-neutral-200"
                >
                    <Plus size={22} color="#0a0a0a" />
                </Pressable>

                <View className="min-h-[46px] flex-1 flex-row items-end gap-2 rounded-3xl bg-neutral-100 py-3 pl-4 pr-3">
                    <TextInput
                        value={text}
                        onChangeText={setText}
                        placeholder="Message"
                        placeholderTextColor="#a3a3a3"
                        selectionColor="#0a0a0a"
                        multiline
                        style={{ maxHeight: 110, paddingVertical: 0 }}
                        className="flex-1 font-jakarta-regular text-[15px] text-neutral-950"
                    />
                    <Smile size={20} color="#a3a3a3" />
                </View>

                <Pressable
                    onPress={send}
                    disabled={!canSend}
                    accessibilityRole="button"
                    accessibilityLabel="Send message"
                    className={`mb-0.5 h-11 w-11 items-center justify-center rounded-full ${
                        canSend ? "bg-neutral-950" : "bg-neutral-200"
                    }`}
                >
                    <ArrowUp size={20} color={canSend ? "#ffffff" : "#a3a3a3"} strokeWidth={2.5} />
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}