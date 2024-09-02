import { View, Linking } from "react-native";
import { Button } from "@rneui/base";

const SocialLink = () => {
    const handlePress = async () => {
        const supported = await Linking.canOpenURL("https://www.facebook.com/binh.jupiter/");

        if (supported) {
            // Mở URL bằng trình duyệt mặc định của hệ thống
            await Linking.openURL("https://www.facebook.com/binh.jupiter/");
        } else {
            Alert.alert(`Không thể mở URL: ${"https://www.facebook.com/binh.jupiter/"}`);
        }
    };
    return (
        <View>
            <Button title="F" onPress={handlePress} />
        </View>
    );
};

export default SocialLink;
