import { Text, View, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function UploadScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <View className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-6">
          <Text className="text-xl font-bold text-gray-900 mb-1">Create a Listing / Post</Text>
          <Text className="text-sm text-gray-500 mb-4">Share housing, items for sale, or tips with the community</Text>

          {/* Upload Area */}
          <TouchableOpacity className="border-2 border-dashed border-gray-300 rounded-xl p-8 items-center justify-center bg-gray-50 mb-4 active:bg-gray-100">
            <Ionicons name="cloud-upload-outline" size={40} color="#2563eb" />
            <Text className="mt-2 text-sm font-semibold text-gray-700">Upload photos or documents</Text>
            <Text className="text-xs text-gray-400 mt-1">PNG, JPG, PDF up to 10MB</Text>
          </TouchableOpacity>

          {/* Form fields */}
          <View className="gap-y-4">
            <View>
              <Text className="text-xs font-semibold text-gray-600 mb-1">Title</Text>
              <TextInput
                placeholder="e.g. 1-Bedroom Apartment Sublet"
                placeholderTextColor="#9ca3af"
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800"
              />
            </View>

            <View>
              <Text className="text-xs font-semibold text-gray-600 mb-1">Category</Text>
              <TextInput
                placeholder="Housing, Furniture, Advice..."
                placeholderTextColor="#9ca3af"
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800"
              />
            </View>

            <View>
              <Text className="text-xs font-semibold text-gray-600 mb-1">Description</Text>
              <TextInput
                placeholder="Provide details about your post..."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 h-24"
              />
            </View>

            <TouchableOpacity className="bg-blue-600 py-3.5 rounded-xl items-center mt-2 active:bg-blue-700">
              <Text className="text-white font-semibold text-base">Publish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
