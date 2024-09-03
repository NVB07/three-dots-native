import { Stack } from "expo-router";
export default function BlogLayout() {
    return (
        <Stack>
            <Stack.Screen name="[blogid]/index" options={{ headerShown: false }} />
        </Stack>
    );
}
