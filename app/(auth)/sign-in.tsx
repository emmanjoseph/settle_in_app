import { useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Lock, Mail } from "lucide-react-native";
import {
    AuthField,
    AuthLogo,
    AuthScreen,
    OrDivider,
    PrimaryButton,
    isEmail,
} from "@/components/auth/AuthKit";
// import {GradientBackdrop} from "@/components/GradientBackdrop";

export default function SignInScreen() {
    const passwordRef = useRef<TextInput>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        const next: typeof errors = {};
        if (!isEmail(email)) next.email = "Enter a valid email address";
        if (!password) next.password = "Enter your password";
        setErrors(next);
        if (Object.keys(next).length) return;

        setLoading(true);
        try {
            // TODO: call your backend (e.g. POST /auth/login) and store the session/token
            await new Promise((r) => setTimeout(r, 600));
            router.replace("/(tabs)");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthScreen>
            {/*<GradientBackdrop height={300} />*/}
            <AuthLogo subtitle="Please login to continue" />

            <View className="mt-8 gap-6">
                <View className="gap-4">
                    <AuthField
                        label="Email"
                        icon={Mail}
                        placeholder="you@example.com"
                        value={email}
                        onChangeText={setEmail}
                        error={errors.email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        textContentType="emailAddress"
                        returnKeyType="next"
                        onSubmitEditing={() => passwordRef.current?.focus()}
                    />
                    <AuthField
                        ref={passwordRef}
                        label="Password"
                        icon={Lock}
                        password
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={setPassword}
                        error={errors.password}
                        autoCapitalize="none"
                        autoComplete="current-password"
                        textContentType="password"
                        returnKeyType="done"
                        onSubmitEditing={submit}
                    />
                    <Pressable onPress={() => router.push("/forgot-password")} hitSlop={8} className="self-end">
                        <Text className="font-jakarta-medium text-sm text-neutral-500">Forgot Password?</Text>
                    </Pressable>
                </View>

                <PrimaryButton label="Sign In" onPress={submit} loading={loading} />

                <OrDivider label="or continue with" />

                <View className="flex-row gap-4">
                    {[
                        { name: "Google", icon: "logo-google" as const },
                        { name: "Apple", icon: "logo-apple" as const },
                    ].map((p) => (
                        <Pressable
                            key={p.name}
                            // TODO: wire up expo-auth-session / expo-apple-authentication

                            className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white active:bg-neutral-50"
                        >
                            <Ionicons name={p.icon} size={18} color="#0a0a0a" />
                            <Text className="font-jakarta-medium text-sm text-neutral-950">{p.name}</Text>
                        </Pressable>
                    ))}
                </View>
            </View>

            <View className="flex-1" />
            <View className="flex-row items-center justify-center gap-1 pt-8">
                <Text className="font-jakarta-medium text-base text-neutral-500">Don't have an account?</Text>
                <Pressable onPress={() => router.replace("/sign-up")} hitSlop={8}>
                    <Text className="font-jakarta-bold text-base text-neutral-900">Sign Up</Text>
                </Pressable>
            </View>
        </AuthScreen>
    );
}