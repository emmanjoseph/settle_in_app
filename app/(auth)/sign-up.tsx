import { useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { Lock, Mail, Phone, ShieldCheck, User } from "lucide-react-native";
import {
    AuthField,
    AuthLogo,
    AuthScreen,
    PrimaryButton,
    isEmail,
} from "@/components/auth/AuthKit";
import {GradientBackdrop} from "@/components/GradientBackdrop";

type Errors = Partial<Record<"name" | "email" | "phone" | "password" | "confirm", string>>;

export default function SignUpScreen() {
    const emailRef = useRef<TextInput>(null);
    const phoneRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);
    const confirmRef = useRef<TextInput>(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [errors, setErrors] = useState<Errors>({});
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        const next: Errors = {};
        if (name.trim().length < 2) next.name = "Enter your full name";
        if (!isEmail(email)) next.email = "Enter a valid email address";
        if (phone.replace(/\D/g, "").length < 7) next.phone = "Enter a valid phone number";
        if (password.length < 8) next.password = "Use at least 8 characters";
        if (confirm !== password) next.confirm = "Passwords don't match";
        setErrors(next);
        if (Object.keys(next).length) return;

        setLoading(true);
        try {
            // TODO: call your backend (e.g. POST /auth/register) and store the session/token
            await new Promise((r) => setTimeout(r, 600));
            router.replace("/");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthScreen>
            {/*<GradientBackdrop height={400} />*/}
            <AuthLogo subtitle="Create your account" />

            <View className="mt-8 gap-6">
                <View className="gap-4">
                    <AuthField
                        label="Full Name"
                        icon={User}
                        placeholder="John Doe"
                        value={name}
                        onChangeText={setName}
                        error={errors.name}
                        autoCapitalize="words"
                        autoComplete="name"
                        textContentType="name"
                        returnKeyType="next"
                        onSubmitEditing={() => emailRef.current?.focus()}
                    />
                    <AuthField
                        ref={emailRef}
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
                        onSubmitEditing={() => phoneRef.current?.focus()}
                    />
                    <AuthField
                        ref={phoneRef}
                        label="Phone Number"
                        icon={Phone}
                        placeholder="+1 (555) 000-0000"
                        value={phone}
                        onChangeText={setPhone}
                        error={errors.phone}
                        keyboardType="phone-pad"
                        autoComplete="tel"
                        textContentType="telephoneNumber"
                        returnKeyType="next"
                        onSubmitEditing={() => passwordRef.current?.focus()}
                    />
                    <AuthField
                        ref={passwordRef}
                        label="Password"
                        icon={Lock}
                        password
                        placeholder="Create password"
                        value={password}
                        onChangeText={setPassword}
                        error={errors.password}
                        autoCapitalize="none"
                        autoComplete="new-password"
                        textContentType="newPassword"
                        returnKeyType="next"
                        onSubmitEditing={() => confirmRef.current?.focus()}
                    />
                    <AuthField
                        ref={confirmRef}
                        label="Confirm Password"
                        icon={ShieldCheck}
                        password
                        placeholder="Confirm password"
                        value={confirm}
                        onChangeText={setConfirm}
                        error={errors.confirm}
                        autoCapitalize="none"
                        autoComplete="new-password"
                        textContentType="newPassword"
                        returnKeyType="done"
                        onSubmitEditing={submit}
                    />
                </View>

                <PrimaryButton label="Create Account" onPress={submit} loading={loading} />
            </View>

            <View className="flex-1" />
            <View className="flex-row items-center justify-center gap-1 pt-8">
                <Text className="font-jakarta-medium text-base text-neutral-500">Already have an account?</Text>
                <Pressable onPress={() => router.replace("/sign-in")} hitSlop={8}>
                    <Text className="font-jakarta-bold text-sm text-neutral-900">Sign In</Text>
                </Pressable>
            </View>
        </AuthScreen>
    );
}