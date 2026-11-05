import { Image, Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Bath, BedDouble, Heart, MapPin, Maximize2 } from "lucide-react-native";

export type Property = {
    id: string;
    title: string;
    location: string;
    priceLabel: string;
    price: number;
    type: "House" | "Apartment" | "Villa" | "Studio" | "Commercial";
    beds: number;
    baths: number;
    area: string;
    image: string;
};

const RED = "#dc2626";

function Glass({
                   children,
                   style,
               }: {
    children: React.ReactNode;
    style?: object;
}) {
    return (
        <View
            style={[
                {
                    borderRadius: 999,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.35)",
                },
                style,
            ]}
        >
            <BlurView
                intensity={35}
                tint="light"
                style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}
            >
                {children}
            </BlurView>
        </View>
    );
}

export function PropertyRow({
                                property: p,
                                liked,
                                onToggleLike,
                                onPress,
                            }: {
    property: Property;
    liked: boolean;
    onToggleLike: () => void;
    onPress?: () => void;
}) {
    return (
        <Pressable
            onPress={onPress}
            className="flex-row rounded-[28px] bg-white p-2.5"
            style={{
                shadowColor: "#000",
                shadowOpacity: 0.06,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 3 },
                elevation: 2,
            }}
        >
            {/* Image with SmallHouseCard inspired glass badges & gradient */}
            <View className="relative h-40 w-40 overflow-hidden rounded-[22px] bg-neutral-200">
                <Image
                    source={{ uri: p.image }}
                    className="h-full w-full"
                    resizeMode="cover"
                />

                <LinearGradient
                    colors={["rgba(0,0,0,0.35)", "transparent", "rgba(0,0,0,0.45)"]}
                    style={{ position: "absolute", inset: 0 }}
                />

                {/* Glass Price Pill (SmallHouseCard style) */}
                <View className="absolute left-2 top-2">
                    <Glass>
                        <Text className="px-2.5 py-0.5 font-jakarta-bold text-[11px] text-white">
                            {p.priceLabel}
                        </Text>
                    </Glass>
                </View>

                {/* Glass Like Button */}
                <Pressable
                    onPress={onToggleLike}
                    hitSlop={8}
                    className="absolute right-2 top-2"
                >
                    <Glass style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Heart
                            size={13}
                            color={liked ? RED : "#ffffff"}
                            fill={liked ? RED : "transparent"}
                        />
                    </Glass>
                </Pressable>
            </View>

            {/* Info Column */}
            <View className="flex-1 justify-between py-1 pl-3 pr-1">
                <View className="gap-1">
                    <Text
                        className="font-jakarta-bold text-base leading-snug text-neutral-950"
                        numberOfLines={2}
                    >
                        {p.title}
                    </Text>

                    <View className="flex-row items-center gap-1">
                        <MapPin size={12} color="#737373" />
                        <Text
                            className="flex-1 font-jakarta-semibold text-sm text-neutral-500"
                            numberOfLines={1}
                        >
                            {p.location}
                        </Text>
                    </View>
                </View>

                {/* Feature Pills */}
                <View className="flex-row flex-wrap gap-1.5 pt-1">
                    <View className="flex-row items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1">
                        <BedDouble size={12} color="#0a0a0a" />
                        <Text className="font-jakarta-semibold text-[11px] text-neutral-900">
                            {p.beds}
                        </Text>
                    </View>

                    <View className="flex-row items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1">
                        <Bath size={12} color="#0a0a0a" />
                        <Text className="font-jakarta-semibold text-[11px] text-neutral-900">
                            {p.baths}
                        </Text>
                    </View>

                    <View className="flex-row items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1">
                        <Maximize2 size={12} color="#0a0a0a" />
                        <Text className="font-jakarta-semibold text-[11px] text-neutral-900">
                            {p.area}
                        </Text>
                    </View>
                </View>
            </View>
        </Pressable>
    );
}