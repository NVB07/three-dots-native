// import { Tabs, Stack } from "expo-router";
import React, { useContext } from "react";
import { View, TouchableOpacity } from "react-native";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { ChatIcon } from "@/components/navigation/ChatIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SheetManager } from "react-native-actions-sheet";

import { AuthContext } from "@/components/context/AuthProvider";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from ".";
import ChatScreen from "./chat";
import UserScreen from "./user";
import AddBlog from "./add";
import SearchScreen from "./search";

const Tab = createBottomTabNavigator();

export default function TabLayout() {
    const { authUser } = useContext(AuthContext);
    const colorScheme = useColorScheme();
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: "",
                    tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "home" : "home-outline"} color={color} />,
                }}
            />
            <Tab.Screen
                name="search"
                component={SearchScreen}
                options={{
                    title: "",
                    tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "search" : "search-outline"} color={color} />,
                }}
            />
            <Tab.Screen
                name="New"
                component={AddBlog}
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

            <Tab.Screen
                name="Chat"
                component={ChatScreen}
                options={{
                    title: "",
                    tabBarIcon: ({ color, focused }) => <ChatIcon name={focused ? "chatbox" : "chatbox-outline"} color={color} style={undefined} />,
                }}
            />

            <Tab.Screen
                name="user"
                component={UserScreen}
                options={{
                    title: "",
                    tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "person" : "person-outline"} color={color} />,
                }}
            />
        </Tab.Navigator>
    );
}
