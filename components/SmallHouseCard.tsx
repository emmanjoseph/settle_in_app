import { Image, Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Bath, BedDouble } from "lucide-react-native";

export type NearbyHouse = {
    title: string;
    price: string;
    beds: number;
    baths: number;
    image: string;
};

const WHITE = "#fafafa";

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
                style={{ flexDirection: "row", alignItems: "center" }}
            >
                {children}
            </BlurView>
        </View>
    );
}

const SmallHouseCard = ({
                            house,
                            onPress,
                        }: {
    house: NearbyHouse;
    onPress?: () => void;
}) => {
    return (
        <Pressable
            onPress={onPress}
            className="aspect-[4/5] w-[48.5%] overflow-hidden rounded-[28px] bg-neutral-200"
        >
            <Image
                source={{ uri: house.image }}
                className="h-full w-full"
                resizeMode="cover"
            />

            <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.75)"]}
                style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60%" }}
            />

            {/* price pill */}
            <View className="absolute left-3 top-3">
                <Glass>
                    <Text className="px-3 py-1 font-jakarta-bold text-xs text-white">
                        {house.price}
                    </Text>
                </Glass>
            </View>

            {/* title + beds/baths */}
            <View className="absolute inset-x-3 bottom-3 gap-2">
                <Text
                    className="font-jakarta-bold text-base leading-5 text-white"
                    numberOfLines={2}
                >
                    {house.title}
                </Text>
                <View className="flex-row gap-2">
                    <Glass>
                        <View className="flex-row items-center gap-1 px-2.5 py-1">
                            <BedDouble size={12} color={WHITE} />
                            <Text className="font-jakarta-semibold text-[11px] text-white">
                                {house.beds}
                            </Text>
                        </View>
                    </Glass>
                    <Glass>
                        <View className="flex-row items-center gap-1 px-2.5 py-1">
                            <Bath size={12} color={WHITE} />
                            <Text className="font-jakarta-semibold text-[11px] text-white">
                                {house.baths}
                            </Text>
                        </View>
                    </Glass>
                </View>
            </View>
        </Pressable>
    );
};

export default SmallHouseCard;