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
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
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
