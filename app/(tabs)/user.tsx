import { View } from "react-native";
import UserPage from "@/components/pages/userPage/UserPage";
import { useContext } from "react";
import { AuthContext } from "@/components/context/AuthProvider";
export default function UserScreen() {
    const { authUser } = useContext(AuthContext);

    return (
        <View style={{ paddingTop: 40, flex: 1 }}>
            <UserPage uid={authUser.uid} userTabClick />
        </View>
    );
}
