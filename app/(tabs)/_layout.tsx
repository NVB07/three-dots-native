import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "",
                    tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "home" : "home-outline"} color={color} />,
                }}
            />
            <Tabs.Screen
                name="add"
                options={{
                    title: "",
                    tabBarButton: ({ accessibilityState, onPress }) => <TabBarIcon name={"add"} />,
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    title: "",
                    tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "chatbox" : "chatbox-outline"} color={color} />,
                }}
            />

            <Tabs.Screen
                name="user"
                options={{
                    title: "",
                    tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "person" : "person-outline"} color={color} />,
                }}
            />
        </Tabs>
    );
}
