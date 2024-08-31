import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";
import UserPage from "@/components/pages/userPage/UserPage";

export default function UserId() {
    const { userid } = useLocalSearchParams();
    console.log(userid);

    return (
        <View style={{ paddingTop: 40, flex: 1 }}>
            <UserPage uid={userid} />
        </View>
    );
}
