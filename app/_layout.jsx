import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import AuthProvider from "@/components/context/AuthProvider";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SheetProvider } from "react-native-actions-sheet";
import "../components/sheets";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PermissionsAndroid } from "react-native";
import { LogLevel, OneSignal } from "react-native-onesignal";
import Constants from "expo-constants";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    const [loaded] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }
    OneSignal.Debug.setLogLevel(6);
    OneSignal.initialize("6247d01a-bfba-45c6-b768-0c3efa3eaea9");
    OneSignal.Notifications.requestPermission(true);
    console.log("innit");

    // Also need enable notifications to complete OneSignal setup

    return (
        // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <SafeAreaProvider>
            <GestureHandlerRootView
                style={{
                    flex: 1,
                }}
            >
                <SheetProvider context="global">
                    <AuthProvider>
                        <Stack>
                            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                            <Stack.Screen name="+not-found" />
                            <Stack.Screen name="userid" options={{ headerShown: false }} />
                            <Stack.Screen name="blogid" options={{ headerShown: false }} />
                            <Stack.Screen name="roomChat" options={{ headerShown: false }} />
                        </Stack>
                    </AuthProvider>
                </SheetProvider>
            </GestureHandlerRootView>
        </SafeAreaProvider>
        // </ThemeProvider>
    );
}
