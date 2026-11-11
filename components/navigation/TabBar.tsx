import { Platform, Pressable, Text, View } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import Animated, {
    FadeIn,
    FadeOut,
    LinearTransition,
} from "react-native-reanimated";

const ACTIVE = "#0a0a0a";
const INACTIVE = "#6b7280";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const layoutAnim = LinearTransition.springify().damping(20).stiffness(220);

function Badge({ value }: { value: number | string }) {
    const text = typeof value === "number" && value > 9 ? "9+" : String(value);
    return (
        <View className="absolute -right-2 -top-1.5 h-[17px] min-w-[17px] items-center justify-center rounded-full bg-red-500 px-1 border-2 border-white">
            <Text className="font-jakarta-semibold text-[9px] leading-[11px] text-white">
                {text}
            </Text>
        </View>
    );
}

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();

    return (
        <View
            pointerEvents="box-none"
            style={{
                position: "absolute",
                left: 16,
                right: 16,
                bottom: Math.max(insets.bottom, 12),
                backgroundColor: "transparent",
            }}
        >
            {/* shadow lives on the outer view, clipping on the inner one */}
            <View
                className="rounded-full"
                style={{
                    shadowColor: "#000",
                    shadowOpacity: 0.12,
                    shadowRadius: 20,
                    shadowOffset: { width: 0, height: 8 },
                    elevation: 12,
                }}
            >
                <BlurView
                    intensity={40}
                    tint="light"
                    experimentalBlurMethod={
                        Platform.OS === "android" ? "dimezisBlurView" : undefined
                    }
                    className="flex-row items-center justify-between overflow-hidden rounded-full p-1"
                    style={{
                        backgroundColor: "rgba(255,255,255,0.35)",
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.6)",
                    }}
                >
                    {state.routes.map((route, index) => {
                        const { options } = descriptors[route.key];

                        // keep hidden tabs (href: null) out of the bar
                        if ((options as { href?: string | null }).href === null)
                            return null;

                        const focused = state.index === index;
                        const label = options.title ?? route.name;
                        const isUpload = route.name === "upload";
                        const badge = options.tabBarBadge;
                        const hasBadge =
                            badge !== undefined && badge !== null && badge !== 0 && badge !== "";

                        const onPress = () => {
                            const event = navigation.emit({
                                type: "tabPress",
                                target: route.key,
                                canPreventDefault: true,
                            });
                            if (!focused && !event.defaultPrevented) {
                                navigation.navigate(route.name, route.params);
                            }
                        };

                        const onLongPress = () => {
                            navigation.emit({ type: "tabLongPress", target: route.key });
                        };

                        return (
                            <AnimatedPressable
                                key={route.key}
                                layout={layoutAnim}
                                onPress={onPress}
                                onLongPress={onLongPress}
                                accessibilityRole="button"
                                accessibilityLabel={
                                    options.tabBarAccessibilityLabel ??
                                    (hasBadge ? `${label}, ${badge} unread` : label)
                                }
                                accessibilityState={{ selected: focused }}
                                hitSlop={4}
                                className={`h-14 flex-row items-center justify-center rounded-full ${
                                    isUpload
                                        ? "w-14 bg-neutral-950"
                                        : focused
                                            ? "bg-white/80 px-4"
                                            : "w-14"
                                }`}
                            >
                                {isUpload ? (
                                    <Ionicons name="add" size={26} color="#ffffff" />
                                ) : (
                                    <>
                                        <View>
                                            {options.tabBarIcon?.({
                                                focused,
                                                color: focused ? ACTIVE : INACTIVE,
                                                size: 22,
                                            })}
                                            {hasBadge && <Badge value={badge as number | string} />}
                                        </View>
                                        {focused && (
                                            <Animated.Text
                                                entering={FadeIn.duration(180)}
                                                exiting={FadeOut.duration(100)}
                                                numberOfLines={1}
                                                className="ml-2 font-jakarta-semibold text-[13px] text-neutral-950"
                                            >
                                                {label}
                                            </Animated.Text>
                                        )}
                                    </>
                                )}
                            </AnimatedPressable>
                        );
                    })}
                </BlurView>
            </View>
        </View>
    );
}