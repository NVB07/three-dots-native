import { View, Text } from "react-native";
import { Stack } from "expo-router";
import EditProfile from "@/components/pages/userPage/EditProfile";
import { useContext } from "react";
import { AuthContext } from "@/components/context/AuthProvider";
import HeaderBack from "@/components/headerBack/HeaderBack";
export default function Edit() {
    const { authUser, setAuthUser } = useContext(AuthContext);
    return (
        <View style={{ paddingTop: 40, flex: 1 }}>
            <HeaderBack title="Sửa thông tin" icon={false} />
            <EditProfile authUser={authUser} setAuthUser={setAuthUser} />
        </View>
    );
}
