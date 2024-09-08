import { View, Linking, Alert } from "react-native";
import { Button } from "@rneui/base";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";

const SocialLink = ({ userData }) => {
    const handlePress = async (url) => {
        try {
            await Linking.openURL(url);
        } catch (error) {
            Alert.alert(`Không thể mở: ${url}`, "\nLỗi :", error.message);
        }
    };
    return (
        <View style={{ flexDirection: "row", marginTop: 5 }}>
            {userData?.email && (
                <Button
                    type="clear"
                    buttonStyle={{ padding: 0, margin: 0, paddingHorizontal: 0, marginRight: 16 }}
                    onPress={() => handlePress(`mailto:${userData.email}`)}
                >
                    <Ionicons name="mail" size={26} color="#333" />
                </Button>
            )}
            {userData?.facebook && (
                <Button type="clear" buttonStyle={{ padding: 0, margin: 0, paddingHorizontal: 0, marginRight: 16 }} onPress={() => handlePress(userData.facebook)}>
                    <FontAwesome name="facebook-square" size={24} color="#333" />
                </Button>
            )}
            {userData?.instagram && (
                <Button type="clear" buttonStyle={{ padding: 0, margin: 0, paddingHorizontal: 0, marginRight: 16 }} onPress={() => handlePress(userData.instagram)}>
                    <FontAwesome name="instagram" size={24} color="#333" />
                </Button>
            )}
            {userData?.threads && (
                <Button type="clear" buttonStyle={{ padding: 0, margin: 0, paddingHorizontal: 0, marginRight: 16 }} onPress={() => handlePress(userData.threads)}>
                    <FontAwesome6 name="threads" size={24} color="#333" />
                </Button>
            )}
            {userData?.tiktok && (
                <Button type="clear" buttonStyle={{ padding: 0, margin: 0, paddingHorizontal: 0, marginRight: 16 }} onPress={() => handlePress(userData.tiktok)}>
                    <FontAwesome6 name="tiktok" size={22} color="#333" />
                </Button>
            )}
            {userData?.x && (
                <Button type="clear" buttonStyle={{ padding: 0, margin: 0, paddingHorizontal: 0, marginRight: 16 }} onPress={() => handlePress(userData.x)}>
                    <FontAwesome6 name="x-twitter" size={24} color="#333" />
                </Button>
            )}
        </View>
    );
};

export default SocialLink;
