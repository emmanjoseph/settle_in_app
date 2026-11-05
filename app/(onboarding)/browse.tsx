import { Text, View } from "react-native";
import { router } from "expo-router";
import { Check, Heart, Key, MapPin, Search } from "lucide-react-native";
import {
    BrandRow,
    FloatingBadge,
    OnboardingFooter,
    OnboardingScreen,
    softShadow,
    TEAL,
} from "@/components/onboarding/shared";

export default function BrowseScreen() {
    return (
        <OnboardingScreen>
            <View className="flex-1 items-center px-8 pt-10">
                <View className="relative w-full" style={{ height: 430 }}>
                    {/* organic blob */}
                    <View className="absolute inset-x-0 top-10 items-center">
                        <View
                            className="h-72 w-72 bg-neutral-100"
                            style={{
                                borderTopLeftRadius: 140,
                                borderTopRightRadius: 150,
                                borderBottomLeftRadius: 110,
                                borderBottomRightRadius: 178,
                                ...softShadow,
                            }}
                        />
                    </View>

                    <FloatingBadge size={44} className="left-10 top-16">
                        <Key size={20} color={TEAL} />
                    </FloatingBadge>
                    <FloatingBadge size={44} className="right-8 top-24">
                        <MapPin size={20} color={TEAL} />
                    </FloatingBadge>
                    <FloatingBadge size={40} className="bottom-24 left-6">
                        <Search size={16} color="#0a0a0a" />
                    </FloatingBadge>
                    <FloatingBadge size={40} className="bottom-24 right-8">
                        <Heart size={16} color="#f87171" fill="#f87171" />
                    </FloatingBadge>

                    {/* reel / listing card */}
                    <View className="absolute inset-x-0 top-28 items-center">
                        <View className="rounded-full border border-neutral-200 bg-neutral-100 p-2">
                            <View className="h-10 w-10 rounded-full bg-neutral-900" />
                        </View>
                        <View className="-mt-1 h-4 w-24 rounded-t-2xl bg-neutral-100" />
                        <View
                            className="-mt-2 rounded-3xl border border-neutral-200 bg-white p-3"
                            style={softShadow}
                        >
                            <View className="gap-2">
                                <View className="h-14 w-28 rounded-md bg-teal-600/85" />
                                <View className="flex-row items-center justify-between">
                                    <View className="h-1.5 w-8 rounded-full bg-neutral-200" />
                                    <Heart size={12} color="#f87171" fill="#f87171" />
                                </View>
                                <View className="h-1 w-20 rounded-full bg-neutral-200" />
                                <View className="mt-1 h-6 rounded-md bg-neutral-100" />
                                <View className="flex-row gap-1">
                                    <View className="h-2.5 w-5 rounded bg-neutral-100" />
                                    <View className="h-2.5 w-5 rounded bg-neutral-100" />
                                </View>
                            </View>
                        </View>
                        <View className="-mt-0.5 h-3.5 w-40 rounded-b-2xl bg-neutral-100" />
                    </View>

                    {/* chat chip */}
                    <View
                        className="absolute bottom-10 right-8 flex-row items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-3 py-2"
                        style={softShadow}
                    >
                        <View className="h-6 w-6 rounded-full bg-teal-600" />
                        <View className="gap-1">
                            <View className="h-1 w-10 rounded-full bg-neutral-200" />
                            <View className="h-0.5 w-7 rounded-full bg-neutral-200" />
                        </View>
                        <Check size={12} color={TEAL} />
                    </View>
                </View>

                <View className="items-center gap-4 px-2">
                    <Text className="text-center text-2xl font-jakarta-extrabold text-neutral-950">
                        Browse & Connect Instantly
                    </Text>
                    <Text className="px-2 text-center text-lg font-jakarta-regular leading-5 text-neutral-500">
                        Watch property reels, chat with agents, and schedule visits — all in one place
                    </Text>
                </View>
            </View>

            <OnboardingFooter active={1} variant="teal" onNext={() => router.push("/move-in")} />
        </OnboardingScreen>
    );
}