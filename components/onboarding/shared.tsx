import { ReactNode } from "react";
import { Pressable, Text, View, type ViewStyle } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, type Href } from "expo-router";
import { Home } from "lucide-react-native";

export const TEAL = "#0d9488"; // teal-600

// Where Skip / Get Started should send the user. Change to your auth or tabs route.
const AFTER_ONBOARDING = "/(tabs)" as Href;
export const finishOnboarding = () => router.replace(AFTER_ONBOARDING);

// NativeWind can't express custom box-shadows, so these are plain style objects.
export const softShadow: ViewStyle = {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
};

export function OnboardingScreen({ children }: { children: ReactNode }) {
    const insets = useSafeAreaInsets();
    return (
        <View
            className="flex-1 bg-white"
            style={{ paddingTop: insets.top + 8, paddingBottom: Math.max(insets.bottom, 16) }}
        >
            <StatusBar style="dark" />
            {children}
        </View>
    );
}

export function BrandRow({ right }: { right: ReactNode }) {
    return (
        <View className="flex-row items-center justify-between px-6">
            <View className="flex-row items-center gap-2">
                <View
                    className="h-8 w-8 items-center justify-center rounded-lg bg-neutral-100"
                    style={softShadow}
                >
                    <Home size={16} color="#171717" />
                </View>
                <Text className="text-sm font-bold text-neutral-950">EstateHub</Text>
            </View>
            {right}
        </View>
    );
}

export function PaginationDots({
                                   active,
                                   variant = "dark",
                               }: {
    active: number;
    variant?: "dark" | "teal";
}) {
    const activeColor = variant === "teal" ? "bg-teal-600" : "bg-neutral-900";
    return (
        <View className="flex-row items-center gap-2">
            {[0, 1, 2].map((i) => (
                <View
                    key={i}
                    className={`h-2 rounded-full ${i === active ? `w-6 ${activeColor}` : "w-2 bg-neutral-200"}`}
                />
            ))}
        </View>
    );
}

export function OnboardingFooter({
                                     active,
                                     variant,
                                     onNext,
                                 }: {
    active: number;
    variant?: "dark" | "teal";
    onNext: () => void;
}) {
    return (
        <View className="flex-row items-center justify-between px-8 py-10">
            <Pressable onPress={finishOnboarding} hitSlop={12}>
                <Text className="text-base font-jakarta-extrabold text-neutral-500">Skip</Text>
            </Pressable>
            <PaginationDots active={active} variant={variant} />
            <Pressable onPress={onNext} hitSlop={12}>
                <Text className="text-base font-jakarta-extrabold text-teal-600">Next</Text>
            </Pressable>
        </View>
    );
}

export function FloatingBadge({
                                  children,
                                  size = 40,
                                  square = false,
                                  className = "",
                              }: {
    children: ReactNode;
    size?: number;
    square?: boolean;
    className?: string;
}) {
    return (
        <View
            className={`absolute items-center justify-center border border-neutral-200 bg-white ${
                square ? "rounded-2xl" : "rounded-full"
            } ${className}`}
            style={[{ width: size, height: size }, softShadow]}
        >
            {children}
        </View>
    );
}