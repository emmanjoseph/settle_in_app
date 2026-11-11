import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    ChevronRight,
    Info,
    LifeBuoy,
    Lock,
    Mail,
} from "lucide-react-native";
import {
    AuthField,
    AuthScreen,
    OrDivider,
    PrimaryButton,
    isEmail,
} from "@/components/auth/AuthKit";

const RESEND_SECONDS = 30;

const goToSignIn = () => (router.canGoBack() ? router.back() : router.replace("/sign-in"));

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [cooldown]);

    const send = async () => {
        if (!isEmail(email)) {
            setError("Enter the email linked to your account");
            return;
        }
        setError(undefined);
        setLoading(true);
        try {
            // TODO: call your backend (e.g. POST /auth/forgot-password)
            await new Promise((r) => setTimeout(r, 600));
            setSent(true);
            setCooldown(RESEND_SECONDS);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthScreen>
            {/* top row */}
            <View className="flex-row items-center justify-between">
                <Pressable
                    onPress={() => (sent ? setSent(false) : goToSignIn())}
                    hitSlop={8}
                    className="h-11 w-11 items-center justify-center rounded-full bg-neutral-100 active:bg-neutral-100"
                >
                    <ArrowLeft size={20} color="#0a0a0a" />
                </Pressable>
                <Text className="font-jakarta-semibold text-sm text-neutral-500">
                    Step {sent ? 2 : 1} of 2
                </Text>
            </View>

            {/* illustration + copy */}
            <View className="items-center gap-8 pt-6">
                <View className="h-40 w-40 items-center justify-center">
                    <View className="absolute h-40 w-40 rounded-full bg-neutral-100" />
                    <View className="absolute h-28 w-28 rounded-full border border-neutral-200 bg-neutral-100" />
                    <View
                        className="h-20 w-20 items-center justify-center rounded-2xl bg-neutral-900"
                        style={{
                            shadowColor: "#000",
                            shadowOpacity: 0.18,
                            shadowRadius: 14,
                            shadowOffset: { width: 0, height: 8 },
                            elevation: 8,
                        }}
                    >
                        {sent ? (
                            <Check size={40} color="#fafafa" strokeWidth={1.75} />
                        ) : (
                            <Mail size={40} color="#fafafa" strokeWidth={1.5} />
                        )}
                        <View className="absolute -right-2 -top-2 h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white">
                            {sent ? <Mail size={16} color="#0a0a0a" /> : <Lock size={16} color="#0a0a0a" />}
                        </View>
                    </View>
                </View>

                <View className="items-center gap-2">
                    <Text className="font-jakarta-bold text-2xl tracking-tight text-neutral-950">
                        {sent ? "Check Your Email" : "Recover Your Account"}
                    </Text>
                    <Text className="px-4 text-center font-jakarta-regular text-base leading-5 text-neutral-500">
                        {sent
                            ? `We've sent a password reset link to ${email.trim()}. It can take a minute to arrive.`
                            : "Enter your registered email address and we'll send you a reset link to get back into your account."}
                    </Text>
                </View>
            </View>

            {/* form / sent actions */}
            <View className="mt-8 gap-4">
                {sent ? (
                    <>
                        <PrimaryButton label="Back to Sign In" onPress={goToSignIn} height="lg" />
                        <View className="flex-row items-center justify-center gap-1">
                            <Text className="font-jakarta-regular text-sm text-neutral-500">Didn't get it?</Text>
                            <Pressable onPress={send} disabled={cooldown > 0 || loading} hitSlop={8}>
                                <Text
                                    className={`font-jakarta-semibold text-sm ${
                                        cooldown > 0 ? "text-neutral-400" : "text-neutral-900"
                                    }`}
                                >
                                    {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend email"}
                                </Text>
                            </Pressable>
                        </View>
                    </>
                ) : (
                    <>
                        <View className="gap-1">
                            <AuthField
                                label="Email Address"
                                icon={Mail}
                                height="lg"
                                placeholder="your.name@example.com"
                                value={email}
                                onChangeText={setEmail}
                                error={error}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoComplete="email"
                                textContentType="emailAddress"
                                returnKeyType="send"
                                onSubmitEditing={send}
                            />
                            {!error && (
                                <View className="flex-row items-center gap-1 px-1 pt-1">
                                    <Info size={12} color="#737373" />
                                    <Text className="font-jakarta-regular text-xs text-neutral-500">
                                        Use the email linked to your listings
                                    </Text>
                                </View>
                            )}
                        </View>
                        <PrimaryButton
                            label="Send Reset Link"
                            onPress={send}
                            loading={loading}
                            height="lg"
                            icon={<ArrowRight size={16} color="#fafafa" />}
                        />
                    </>
                )}
            </View>

            <View className="mt-8 gap-8">
                <OrDivider label="OR" />
                <Pressable
                    // TODO: open your support screen / email / chat
                    className="flex-row items-center gap-4 rounded-2xl bg-neutral-100 p-4 active:opacity-80"
                >
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
                        <LifeBuoy size={20} color="#0a0a0a" />
                    </View>
                    <View className="flex-1 gap-1">
                        <Text className="font-jakarta-semibold text-sm text-neutral-950">Need more help?</Text>
                        <Text className="font-jakarta-regular text-xs text-neutral-500">
                            Contact our support team 24/7
                        </Text>
                    </View>
                    <ChevronRight size={16} color="#737373" />
                </Pressable>
            </View>

            {!sent && (
                <>
                    <View className="flex-1" />
                    <View className="flex-row items-center justify-center gap-1 pt-8">
                        <Text className="font-jakarta-regular text-sm text-neutral-500">Remember your password?</Text>
                        <Pressable onPress={goToSignIn} hitSlop={8}>
                            <Text className="font-jakarta-semibold text-sm text-neutral-950">Back to Sign In</Text>
                        </Pressable>
                    </View>
                </>
            )}
        </AuthScreen>
    );
}