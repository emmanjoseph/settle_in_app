import { useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useIsFocused } from "@react-navigation/native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PencilLine, Search } from "lucide-react-native";
import { CONVERSATIONS, type Conversation } from "@/lib/chats";
import {GradientBackdrop} from "@/components/GradientBackdrop";

function Row({ c }: { c: Conversation }) {
  const unread = c.unread > 0;
  return (
      <Pressable
          onPress={() => router.push({ pathname: "/chat/[id]", params: { id: c.id } })}
          accessibilityRole="button"
          accessibilityLabel={`Open chat with ${c.name}`}
          className="flex-row items-center gap-4  px-4 py-3 active:bg-neutral-100"
      >
        <View>
          <Image source={{ uri: c.avatar }} style={{ width: 60, height: 60, borderRadius: 44, backgroundColor: "#e5e5e5" }} contentFit="cover" />
          {c.online && (
              <View className="absolute bottom-0 right-0 h-5 w-5 rounded-full border-2 border-white bg-green-500" />
          )}
        </View>
        <View className="min-w-0 flex-1 gap-1">
          <View className="flex-row items-center justify-between gap-2">
            <Text className="flex-1 font-jakarta-bold text-base text-neutral-600" numberOfLines={1}>
              {c.name}
            </Text>
            <Text
                className={`text-xs ${unread ? "font-jakarta-bold text-neutral-600" : "font-jakarta-semibold text-neutral-500"}`}
            >
              {c.time} ago
            </Text>
          </View>
          <View className="flex-row items-center justify-between gap-2">
            <Text className="flex-1 font-jakarta-medium text-sm text-neutral-500" numberOfLines={1}>
              {c.lastMessage}
            </Text>
            {unread && (
                <View className="h-7 w-7 flex items-center justify-center rounded-full bg-neutral-800 px-1.5">
                  <Text className="font-jakarta-semibold text-[10px] text-neutral-50">{c.unread}</Text>
                </View>
            )}
          </View>
        </View>
      </Pressable>
  );
}

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const focused = useIsFocused();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
        ? CONVERSATIONS.filter((c) => `${c.name} ${c.lastMessage}`.toLowerCase().includes(q))
        : CONVERSATIONS;
  }, [query]);

  return (
      <View className="flex-1 bg-white">
        {focused && <StatusBar style="dark" />}
        <GradientBackdrop height={insets.top + 12 + 200} />
        <View className="flex-row items-center justify-between px-4 pb-4" style={{ paddingTop: insets.top + 12 }}>
          <Text className="font-jakarta-bold text-[25px] leading-9 tracking-tight text-neutral-950">Messages</Text>
          <Pressable
              // TODO: open "new message" (pick a contact or agent)
              accessibilityRole="button"
              accessibilityLabel="New message"
              className="h-10 w-10 items-center justify-center rounded-full active:bg-neutral-100"
          >
            <PencilLine size={20} color="#0a0a0a" />
          </Pressable>
        </View>

        <View className="mx-4 mb-4 justify-center">
          <View pointerEvents="none" className="absolute bottom-0 left-4 top-0 z-10 justify-center">
            <Search size={16} color="#737373" />
          </View>
          <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search conversations…"
              placeholderTextColor="#737373"
              returnKeyType="search"
              className="h-14 rounded-full bg-white pl-11 pr-4 font-jakarta-medium text-base text-neutral-900"
          />
        </View>

        <View className="flex-row items-center justify-between px-4 pb-2">
          <Text className="font-jakarta-semibold text-base text-neutral-500">Recent</Text>
          <Text className="font-jakarta-bold text-sm text-neutral-500">
            {results.length} {results.length === 1 ? "chat" : "chats"}
          </Text>
        </View>

        <FlatList
            data={results}
            keyExtractor={(c) => c.id}
            renderItem={({ item }) => <Row c={item} />}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom:70 }}
            ListEmptyComponent={
              <View className="items-center gap-1 px-1 py-16">
                <Text className="font-jakarta-semibold text-sm text-neutral-950">No conversations found</Text>
                <Text className="font-jakarta-regular text-xs text-neutral-500">Try a different name or keyword</Text>
              </View>
            }
        />
      </View>
  );
}