import { forwardRef, useState, type ReactNode } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
    type TextInputProps,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Eye, EyeOff, Home, type LucideIcon } from "lucide-react-native";
import {Wordmark} from "@/components/WordMark";

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const softShadow = {
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
} as const;

export function AuthScreen({ children }: { children: ReactNode }) {
    const insets = useSafeAreaInsets();
    return (
        <KeyboardAvoidingView
            className="flex-1 bg-white"
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <StatusBar style="dark" />
            <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingHorizontal: 32,
                    paddingTop: insets.top + 16,
                    paddingBottom: Math.max(insets.bottom, 16) + 16,
                }}
            >
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export function AuthLogo({ subtitle }: { subtitle: string }) {
    return (
        <View className="items-center gap-2 pt-6">
            <Wordmark size={32} />
            <Text className="font-jakarta-semibold text-base text-neutral-400">{subtitle}</Text>
        </View>
    );
}

type FieldProps = TextInputProps & {
    label: string;
    icon: LucideIcon;
    error?: string;
    password?: boolean;
    height?: "md" | "lg";
};

export const AuthField = forwardRef<TextInput, FieldProps>(function AuthField(
    { label, icon: Icon, error, password, height = "md", ...rest },
    ref,
) {
    const [hidden, setHidden] = useState(!!password);
    return (
        <View className="gap-2">
            <Text className="font-jakarta-semibold text-sm text-neutral-400">{label}</Text>
            <View className="justify-center">
                <View pointerEvents="none" className="absolute bottom-0 left-4 top-0 z-10 justify-center">
                    <Icon size={16} color="#a3a3a3" />
                </View>
                <TextInput
                    ref={ref}
                    secureTextEntry={hidden}
                    placeholderTextColor="#a3a3a3"
                    className={`rounded-3xl text-base border-none bg-neutral-100 pl-11 font-jakarta-medium text-neutral-800 ${
                        height === "lg" ? "h-16" : "h-16"
                    } ${password ? "pr-11" : "pr-4"} ${error ? "border-red-500" : "border-neutral-200"}`}
                    {...rest}
                />
                {password && (
                    <Pressable
                        onPress={() => setHidden((h) => !h)}
                        hitSlop={10}
                        className="absolute bottom-0 right-4 top-0 z-10 justify-center"
                    >
                        {hidden ? <Eye size={16} color="#737373" /> : <EyeOff size={16} color="#737373" />}
                    </Pressable>
                )}
            </View>
            {error ? <Text className="font-jakarta-regular text-xs text-red-600">{error}</Text> : null}
        </View>
    );
});

export function PrimaryButton({
                                  label,
                                  onPress,
                                  loading,
                                  icon,
                                  height = "md",
                              }: {
    label: string;
    onPress: () => void;
    loading?: boolean;
    icon?: ReactNode;
    height?: "md" | "lg";
}) {
    return (
        <Pressable
            onPress={onPress}
            disabled={loading}
            className={`w-full flex-row items-center justify-center gap-2 rounded-3xl bg-neutral-900 active:opacity-90 ${
                height === "lg" ? "h-16" : "h-16"
            } ${loading ? "opacity-70" : ""}`}
            style={softShadow}
        >
            {loading ? (
                <ActivityIndicator color="#fafafa" />
            ) : (
                <>
                    <Text className="font-jakarta-semibold text-base text-neutral-50">{label}</Text>
                    {icon}
                </>
            )}
        </Pressable>
    );
}

export function OrDivider({ label }: { label: string }) {
    return (
        <View className="flex-row items-center gap-4">
            <View className="h-px flex-1 bg-neutral-200" />
            <Text className="font-jakarta-regular text-xs text-neutral-500">{label}</Text>
            <View className="h-px flex-1 bg-neutral-200" />
        </View>
    );
}