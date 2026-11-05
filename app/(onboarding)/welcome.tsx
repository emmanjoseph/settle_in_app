import { Text, View } from "react-native";
import { router } from "expo-router";
import { Heart, KeyRound, MapPin, Search } from "lucide-react-native";
import {
    BrandRow,
    FloatingBadge,
    OnboardingFooter,
    OnboardingScreen,
    TEAL,
} from "@/components/onboarding/shared";
import { HouseCoupleIllustration } from "@/components/onboarding/Housecoupleillustration";

export default function WelcomeScreen() {
    return (
        <OnboardingScreen>

            <View className="mt-4 flex-1 items-center justify-center px-6">
                <View className="relative w-full flex-1" style={{ maxHeight: 460 }}>
                    <View className="absolute inset-0 items-center justify-center">
                        <View className="h-[300px] w-[300px] rounded-full bg-neutral-100/60" />
                    </View>

                    <FloatingBadge size={40} className="left-10 top-10">
                        <KeyRound size={20} color={TEAL} />
                    </FloatingBadge>
                    <FloatingBadge size={44} className="right-8 top-14">
                        <MapPin size={20} color={TEAL} />
                    </FloatingBadge>
                    <FloatingBadge size={40} className="right-5 bottom-[88px]">
                        <Heart size={20} color="#f43f5e" />
                    </FloatingBadge>
                    <FloatingBadge size={36} className="bottom-[60px] left-6">
                        <Search size={16} color="#0a0a0a" />
                    </FloatingBadge>

                    <View className="absolute inset-0 items-center justify-end pb-12">
                        <HouseCoupleIllustration />
                    </View>
                </View>
            </View>

            <View className="px-8 py-14">
                <Text className="text-2xl font-jakarta-extrabold tracking-tight text-neutral-950">
                    Find Your Dream Home
                </Text>
                <Text className="mt-5 text-base font-jakarta-medium leading-5 text-neutral-500">
                    Discover thousands of properties for sale and rent across the country
                </Text>
            </View>

            <OnboardingFooter active={0} variant="dark" onNext={() => router.push("/browse")} />
        </OnboardingScreen>
    );
}