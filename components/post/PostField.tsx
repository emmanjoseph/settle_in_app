import { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View, type TextInputProps } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import type { LucideIcon } from "lucide-react-native";

type FieldProps = TextInputProps & {
    label: string;
    labelIcon?: LucideIcon;
    icon?: LucideIcon;
    prefix?: string;
    center?: boolean;
    error?: string;
};

export function PostField({
                              label,
                              labelIcon: LabelIcon,
                              icon: Icon,
                              prefix,
                              center,
                              error,
                              multiline,
                              onFocus,
                              onBlur,
                              ...rest
                          }: FieldProps) {
    const ref = useRef<TextInput>(null);
    const [focused, setFocused] = useState(false);

    const ring = error ? "border-red-500 bg-white" : focused ? "border-neutral-900 bg-white" : "border-transparent bg-neutral-100";

    return (
        <View className="gap-1.5">
            <View className="flex-row items-center gap-1.5 pl-1">
                {LabelIcon ? <LabelIcon size={13} color="#737373" /> : null}
                <Text className="font-jakarta-medium text-[13px] text-neutral-500">{label}</Text>
            </View>

            <Pressable
                onPress={() => ref.current?.focus()}
                className={`flex-row rounded-2xl border-[1.5px] px-4 ${ring} ${
                    multiline ? "min-h-32 items-start py-3.5" : "h-14 items-center"
                }`}
            >
                {Icon ? (
                    <View className="mr-2.5">
                        <Icon size={18} color="#737373" />
                    </View>
                ) : null}
                {prefix ? (
                    <Text className="mr-2 font-jakarta-semibold text-sm text-neutral-400">{prefix}</Text>
                ) : null}
                <TextInput
                    ref={ref}
                    multiline={multiline}
                    textAlignVertical={multiline ? "top" : "center"}
                    placeholderTextColor="#a3a3a3"
                    selectionColor="#0a0a0a"
                    onFocus={(e) => {
                        setFocused(true);
                        onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setFocused(false);
                        onBlur?.(e);
                    }}
                    className={`flex-1 font-jakarta-medium text-base text-neutral-950 ${center ? "text-center" : ""} ${
                        multiline ? "min-h-24" : "h-full"
                    }`}
                    {...rest}
                />
            </Pressable>

            {error ? <Text className="pl-1 font-jakarta-regular text-xs text-red-600">{error}</Text> : null}
        </View>
    );
}

export function Segmented<T extends string>({
                                                options,
                                                value,
                                                onChange,
                                            }: {
    options: { key: T; label: string; Icon?: LucideIcon }[];
    value: T;
    onChange: (key: T) => void;
}) {
    const [w, setW] = useState(0);
    const n = options.length;
    const segW = w > 0 ? (w - 8) / n : 0;
    const index = Math.max(0, options.findIndex((o) => o.key === value));
    const x = useSharedValue(0);

    useEffect(() => {
        x.value = withTiming(index * segW, { duration: 220 });
    }, [index, segW]);

    const thumb = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

    return (
        <View className="flex-row rounded-3xl bg-neutral-100 p-1" onLayout={(e) => setW(e.nativeEvent.layout.width)}>
            {segW > 0 && (
                <Animated.View
                    pointerEvents="none"
                    className="absolute bottom-1 left-1 top-1 rounded-3xl bg-white"
                    style={[
                        {
                            width: segW,
                            elevation: 2,
                        },
                        thumb,
                    ]}
                />
            )}
            {options.map(({ key, label, Icon }) => {
                const active = key === value;
                return (
                    <Pressable
                        key={key}
                        onPress={() => onChange(key)}
                        accessibilityRole="button"
                        accessibilityState={{ selected: active }}
                        className="h-14 flex-1 flex-row items-center justify-center gap-2"
                    >
                        {Icon ? <Icon size={16} color={active ? "#0a0a0a" : "#737373"} /> : null}
                        <Text
                            className={`text-sm ${
                                active ? "font-jakarta-semibold text-neutral-950" : "font-jakarta-medium text-neutral-500"
                            }`}
                        >
                            {label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}