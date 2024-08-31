import { Stack } from "expo-router";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { NavigationContainer } from "@react-navigation/native";
// import HomeScreen from "../(tabs)";
// import ChatScreen from "../(tabs)/chat";
// import UserScreen from "../(tabs)/user";
// import AddBlog from "../(tabs)/add";
// import NotificationScreen from "../(tabs)/notification";
// import UserId from "./[userid]/index";
// import React, { useContext } from "react";
// import { View, TouchableOpacity } from "react-native";
// import { TabBarIcon } from "@/components/navigation/TabBarIcon";
// import { Colors } from "@/constants/Colors";
// import { useColorScheme } from "@/hooks/useColorScheme";
// import { SheetManager } from "react-native-actions-sheet";

// import { AuthContext } from "@/components/context/AuthProvider";

// const RootStack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();
export default function UserLayout() {
    return (
        <Stack>
            <Stack.Screen name="[userid]/index" options={{ headerShown: false }} />
            <Stack.Screen name="edit" />
        </Stack>
    );
}

// // const Tab = createBottomTabNavigator();
// // const TabChild = createNativeStackNavigator();
// function TabLayout() {
//     const { authUser } = useContext(AuthContext);
//     const colorScheme = useColorScheme();
//     return (
//         <Tab.Navigator
//             screenOptions={{
//                 tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
//                 headerShown: false,
//             }}
//         >
//             <Tab.Screen
//                 name="userid"
//                 component={UserId}
//                 options={{
//                     title: "",
//                     tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "home" : "home-outline"} color={color} />,
//                 }}
//             />
//             <Tab.Screen
//                 name="Notification"
//                 component={NotificationScreen}
//                 options={{
//                     title: "",
//                     tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "notifications" : "notifications-outline"} color={color} />,
//                 }}
//             />
//             <Tab.Screen
//                 name="New"
//                 component={AddBlog}
//                 options={{
//                     title: "",
//                     tabBarButton: ({ accessibilityState, onPress }) => (
//                         <View style={{ width: 70, alignItems: "center" }}>
//                             <TouchableOpacity
//                                 onPress={() => {
//                                     SheetManager.show("NewBlogSheet", {
//                                         payload: authUser,
//                                     });
//                                 }}
//                                 style={{ borderRadius: 12, marginTop: 3, backgroundColor: "#D2D2D2FF", width: 35, height: 35, alignItems: "center" }}
//                             >
//                                 <TabBarIcon style={{ marginTop: 3 }} name={"add"} />
//                             </TouchableOpacity>
//                         </View>
//                     ),
//                 }}
//             />
//             <Tab.Screen
//                 name="Chat"
//                 component={ChatScreen}
//                 options={{
//                     title: "",
//                     tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "chatbox" : "chatbox-outline"} color={color} />,
//                 }}
//             />
//             <Tab.Screen
//                 name="user"
//                 component={UserScreen}
//                 options={{
//                     title: "",
//                     tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "person" : "person-outline"} color={color} />,
//                 }}
//             />
//         </Tab.Navigator>
//     );
// }
