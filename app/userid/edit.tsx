import { View, Text } from "react-native";
import EditProfile from "@/components/pages/userPage/EditProfile";
import { useContext } from "react";
import { AuthContext } from "@/components/context/AuthProvider";
export default function Edit() {
    const { authUser, setAuthUser } = useContext(AuthContext);
    return (
        <View style={{ paddingTop: 40, flex: 1 }}>
            <EditProfile authUser={authUser} setAuthUser={setAuthUser} />
        </View>
    );
}
