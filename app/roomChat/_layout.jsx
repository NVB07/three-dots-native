import { Stack } from "expo-router";
export default function ChatLayout() {
    return (
        <Stack>
            <Stack.Screen name="[roomId]/index" options={{ headerShown: false }} />
        </Stack>
    );
}
