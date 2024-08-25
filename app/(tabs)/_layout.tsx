import { Tabs } from "expo-router";
import React, { useContext } from "react";
import { View, TouchableOpacity } from "react-native";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SheetManager } from "react-native-actions-sheet";

import { AuthContext } from "@/components/context/AuthProvider";

export default function TabLayout() {
    const { authUser } = useContext(AuthContext);
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
                name="notification"
                options={{
                    title: "",
                    tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "notifications" : "notifications-outline"} color={color} />,
                }}
            />
            <Tabs.Screen
                name="add"
                options={{
                    title: "",
                    tabBarButton: ({ accessibilityState, onPress }) => (
                        <View style={{ width: 70, alignItems: "center" }}>
                            <TouchableOpacity
                                onPress={() => {
                                    SheetManager.show("NewBlogSheet", {
                                        payload: authUser,
                                    });
                                }}
                                style={{ borderRadius: 12, marginTop: 3, backgroundColor: "#D2D2D2FF", width: 35, height: 35, alignItems: "center" }}
                            >
                                <TabBarIcon style={{ marginTop: 3 }} name={"add"} />
                            </TouchableOpacity>
                        </View>
                    ),
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
            <Tabs.Screen
                name="user/[id]"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="user/edit"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    );
}
