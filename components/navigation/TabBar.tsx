import { Pressable, Text, View } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const ACTIVE = "#0a0a0a";
const INACTIVE = "#9ca3af";

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();

    return (
        <View
            className="flex-row bg-white px-3 pt-4"
            style={{
                paddingBottom: Math.max(insets.bottom, 12),
                borderTopLeftRadius: 28,
                borderTopRightRadius: 28,
                shadowColor: "#000",
                shadowOpacity: 0.06,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: -4 },
                elevation: 14,
            }}
        >
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];

                // keep hidden tabs (href: null) out of the bar
                if ((options as { href?: string | null }).href === null) return null;

                const focused = state.index === index;
                const label = options.title ?? route.name;
                const isUpload = route.name === "upload";

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
                    <Pressable
                        key={route.key}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        accessibilityRole="button"
                        accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
                        accessibilityState={{ selected: focused }}
                        className="flex-1 items-center justify-center"
                        hitSlop={4}
                    >
                        {isUpload ? (
                            <View
                                className={`h-11 w-11 items-center justify-center rounded-2xl ${
                                    focused ? "bg-neutral-950" : "bg-neutral-900"
                                }`}
                            >
                                <Ionicons name="add" size={26} color="#ffffff" />
                            </View>
                        ) : (
                            <>
                                {options.tabBarIcon?.({
                                    focused,
                                    color: focused ? ACTIVE : INACTIVE,
                                    size: 24,
                                })}
                                <Text
                                    className={`mt-1 text-[11px] ${
                                        focused
                                            ? "font-jakarta-semibold text-neutral-950"
                                            : "font-jakarta-medium text-neutral-400"
                                    }`}
                                >
                                    {label}
                                </Text>
                            </>
                        )}
                    </Pressable>
                );
            })}
        </View>
    );
}