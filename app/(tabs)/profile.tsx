import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  detail?: string;
  danger?: boolean;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

export default function ProfileScreen() {
  const menuSections: MenuSection[] = [
    {
      title: "Account",
      items: [
        { icon: "person-outline", label: "Personal Information" },
        { icon: "notifications-outline", label: "Notifications" },
        { icon: "bookmark-outline", label: "Saved Listings" },
        { icon: "document-text-outline", label: "My Listings & Posts" },
      ],
    },
    {
      title: "Preferences",
      items: [
        { icon: "globe-outline", label: "Language & Region" },
        { icon: "moon-outline", label: "Dark Mode", detail: "Off" },
        { icon: "shield-checkmark-outline", label: "Privacy & Security" },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: "help-circle-outline", label: "Help Center" },
        { icon: "information-circle-outline", label: "About SettleIn" },
        { icon: "log-out-outline", label: "Log Out", danger: true },
      ],
    },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* User Card */}
        <View className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex-row items-center mb-6">
          <View className="w-16 h-16 rounded-full bg-blue-600 items-center justify-center mr-4">
            <Text className="text-white font-bold text-2xl">JD</Text>
          </View>
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-900">John Doe</Text>
            <Text className="text-sm text-gray-500">john.doe@example.com</Text>
            <View className="mt-1.5 self-start bg-blue-50 px-2.5 py-0.5 rounded-full">
              <Text className="text-xs font-semibold text-blue-600">Verified Member</Text>
            </View>
          </View>
        </View>

        {/* Menu Sections */}
        {menuSections.map((section, sIdx) => (
          <View key={sIdx} className="mb-6">
            <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">
              {section.title}
            </Text>
            <View className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {section.items.map((item, iIdx) => (
                <TouchableOpacity
                  key={iIdx}
                  className={`flex-row items-center justify-between p-4 active:bg-gray-50 ${
                    iIdx !== section.items.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <View className="flex-row items-center">
                    <Ionicons
                      name={item.icon}
                      size={22}
                      color={item.danger ? "#ef4444" : "#4b5563"}
                    />
                    <Text
                      className={`ml-3 text-base ${
                        item.danger ? "text-red-500 font-semibold" : "text-gray-800"
                      }`}
                    >
                      {item.label}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    {item.detail && (
                      <Text className="text-sm text-gray-400 mr-2">{item.detail}</Text>
                    )}
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={item.danger ? "#ef4444" : "#9ca3af"}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
