import { Pressable, Text, View } from "react-native";
import { CheckCircle2, Home, Key, ShieldCheck, Sparkles } from "lucide-react-native";
import {
    FloatingBadge,
    finishOnboarding,
    OnboardingScreen,
    PaginationDots,
    softShadow,
    TEAL,
} from "@/components/onboarding/shared";

export default function MoveInScreen() {
    return (
        <OnboardingScreen>
            <View className="flex-1 items-center px-8 pt-8">
                <View className="relative w-full" style={{ height: 420 }}>
                    {/* Background blob */}
                    <View className="absolute inset-x-0 top-8 items-center">
                        <View
                            className="h-72 w-72 bg-teal-50"
                            style={{
                                borderTopLeftRadius: 160,
                                borderTopRightRadius: 120,
                                borderBottomLeftRadius: 150,
                                borderBottomRightRadius: 130,
                                ...softShadow,
                            }}
                        />
                    </View>

                    {/* Central illustration card */}
                    <View className="absolute inset-0 items-center justify-center">
                        <View
                            className="w-56 rounded-3xl border border-neutral-200 bg-white p-6 items-center"
                            style={softShadow}
                        >
                            <View className="h-20 w-20 rounded-2xl bg-teal-600 items-center justify-center mb-4">
                                <Home size={40} color="#ffffff" />
                            </View>
                            <Text className="text-lg font-jakarta-extrabold text-neutral-900 text-center">
                                Ready to Move In
                            </Text>
                            <Text className="mt-1 text-xs text-neutral-500 text-center font-jakarta-medium">
                                Paperwork verified & keys ready
                            </Text>
                        </View>
                    </View>

                    <FloatingBadge size={44} className="left-8 top-12">
                        <Key size={20} color={TEAL} />
                    </FloatingBadge>
                    <FloatingBadge size={44} className="right-8 top-14">
                        <ShieldCheck size={22} color={TEAL} />
                    </FloatingBadge>
                    <FloatingBadge size={40} className="bottom-16 left-8">
                        <CheckCircle2 size={20} color="#16a34a" />
                    </FloatingBadge>
                    <FloatingBadge size={36} className="bottom-20 right-10">
                        <Sparkles size={18} color="#eab308" />
                    </FloatingBadge>
                </View>

                <View className="items-center gap-3 px-4">
                    <Text className="text-center text-2xl font-jakarta-extrabold text-neutral-950">
                        Seamless Move-In
                    </Text>
                    <Text className="px-2 text-center text-lg leading-5 text-neutral-500">
                        Sign agreements digitally, handle deposits securely, and get your keys without stress.
                    </Text>
                </View>
            </View>

            {/* Bottom Actions */}
            <View className="px-8 pt-4 pb-2 gap-4">
                <View className="items-center">
                    <PaginationDots active={2} variant="teal" />
                </View>

                <Pressable
                    onPress={finishOnboarding}
                    className="w-full bg-teal-600 py-4 rounded-2xl items-center shadow-sm active:bg-teal-700"
                >
                    <Text className="text-white font-jakarta-bold text-base">Get Started</Text>
                </Pressable>
            </View>
        </OnboardingScreen>
    );
}
