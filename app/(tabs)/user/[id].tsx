import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";
import UserPage from "@/components/pages/userPage/UserPage";

export default function User() {
    const { id } = useLocalSearchParams();

    return (
        <View style={{ paddingTop: 40, flex: 1, padding: 12 }}>
            <UserPage uid={id} />
        </View>
    );
}
