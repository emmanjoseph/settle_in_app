import { Text } from "react-native";

export function Wordmark({ size = 28 }: { size?: number }) {
    return (
        <Text
            className="font-jakarta-extrabold text-neutral-950"
            style={{ fontSize: size, letterSpacing: -size * 0.03 }}
        >
            Settle<Text className="text-teal-600">In</Text>
        </Text>
    );
}