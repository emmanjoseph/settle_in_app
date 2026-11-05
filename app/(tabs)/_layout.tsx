import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TabBar } from "@/components/navigation/TabBar";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

const icon =
    (active: IconName, inactive: IconName) =>
        ({ color, focused }: { color: string; focused: boolean }) => (
            <Ionicons name={focused ? active : inactive} size={24} color={color} />
        );

export default function _layout() {
    return (
        <Tabs
            tabBar={(props) => <TabBar {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    headerTitle: "Home",
                    tabBarIcon: icon("home", "home-outline"),
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: "Explore",
                    headerTitle: "Explore",
                    tabBarIcon: icon("compass", "compass-outline"),
                }}
            />
            <Tabs.Screen
                name="upload"
                options={{ title: "Upload", headerTitle: "Upload" }}
            />
            <Tabs.Screen
                name="messages"
                options={{
                    title: "Messages",
                    headerTitle: "Messages",
                    tabBarIcon: icon("chatbubbles", "chatbubbles-outline"),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    headerTitle: "Profile",
                    tabBarIcon: icon("person", "person-outline"),
                }}
            />
        </Tabs>
    );
}