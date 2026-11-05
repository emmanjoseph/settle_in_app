import { Text, View, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MessagesScreen() {
  const conversations = [
    {
      id: "1",
      name: "Alex Johnson",
      avatarBg: "bg-blue-500",
      initials: "AJ",
      lastMessage: "Is the apartment still available for next semester?",
      time: "2m ago",
      unread: 2,
    },
    {
      id: "2",
      name: "Sarah Miller",
      avatarBg: "bg-emerald-500",
      initials: "SM",
      lastMessage: "Thanks for the tips on city transport!",
      time: "1h ago",
      unread: 0,
    },
    {
      id: "3",
      name: "David Kim",
      avatarBg: "bg-purple-500",
      initials: "DK",
      lastMessage: "Let me know when you're free to chat.",
      time: "Yesterday",
      unread: 0,
    },
    {
      id: "4",
      name: "SettleIn Support",
      avatarBg: "bg-indigo-600",
      initials: "SI",
      lastMessage: "Welcome to SettleIn! Let us know if you need help.",
      time: "3d ago",
      unread: 0,
    },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Search */}
        <View className="flex-row items-center bg-white rounded-xl px-4 py-3 border border-gray-200 mb-4">
          <Ionicons name="search" size={20} color="#9ca3af" />
          <TextInput
            placeholder="Search messages..."
            className="flex-1 ml-3 text-base text-gray-800"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Message list */}
        <View className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {conversations.map((conv, idx) => (
            <TouchableOpacity
              key={conv.id}
              className={`flex-row items-center p-4 active:bg-gray-50 ${
                idx !== conversations.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <View
                className={`w-12 h-12 rounded-full ${conv.avatarBg} items-center justify-center mr-3`}
              >
                <Text className="text-white font-bold text-base">{conv.initials}</Text>
              </View>
              <View className="flex-1 mr-2">
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="font-semibold text-gray-900 text-base">{conv.name}</Text>
                  <Text className="text-xs text-gray-400">{conv.time}</Text>
                </View>
                <Text
                  className={`text-sm ${
                    conv.unread > 0 ? "font-semibold text-gray-900" : "text-gray-500"
                  }`}
                  numberOfLines={1}
                >
                  {conv.lastMessage}
                </Text>
              </View>
              {conv.unread > 0 && (
                <View className="w-5 h-5 bg-blue-600 rounded-full items-center justify-center">
                  <Text className="text-white text-xs font-bold">{conv.unread}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
