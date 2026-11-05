import { Image, ScrollView, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Plus } from "lucide-react-native";

export type Story = { name: string; avatar: string };

type Props = { yourAvatar: string; stories: Story[] };

export function StoriesRow({ yourAvatar, stories }: Props) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 16, gap: 16 }}
        >
            {/* your story */}
            <View className="items-center gap-2">
                <View className="h-20 w-20 rounded-full bg-neutral-200 p-0.5">
                    <Image source={{ uri: yourAvatar }} className="h-full w-full rounded-full" resizeMode="cover" />
                    <View className="absolute bottom-0 right-0 h-7 w-7 items-center justify-center rounded-full bg-neutral-900">
                        <Plus size={16} color="#ffffff" />
                    </View>
                </View>
                <Text className="font-jakarta-regular text-xs text-neutral-500">Your story</Text>
            </View>

            {stories.map((story) => (
                <View key={story.name} className="items-center gap-2">
                    <LinearGradient
                        colors={["#d36dea", "#ff905d", "#d36dea"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ width: 80, height: 80, borderRadius: 40, padding: 2 }}
                    >
                        <View className="h-full w-full overflow-hidden rounded-full bg-white">
                            <Image source={{ uri: story.avatar }} className="h-full w-full" resizeMode="cover" />
                        </View>
                    </LinearGradient>
                    <Text className="font-jakarta-regular text-xs text-neutral-950">{story.name}</Text>
                </View>
            ))}
        </ScrollView>
    );
}