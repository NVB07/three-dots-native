import { View, Text } from "react-native";
import FastImage from "react-native-fast-image";
import { Button } from "@rneui/base";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
const RoomChat = ({ firendData, roomId }) => {
    console.log(firendData);
    const navigation = useNavigation();
    const handleGoBack = () => {
        navigation.goBack();
    };
    return (
        <View style={{ flex: 1, paddingTop: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#ccc", paddingBottom: 8 }}>
                <Button
                    radius={12}
                    type="clear"
                    titleStyle={{ color: "#ccc" }}
                    buttonStyle={{ padding: 0 }}
                    containerStyle={{
                        width: 50,
                        padding: 0,
                    }}
                    icon={<AntDesign name="arrowleft" size={24} color="black" />}
                    onPress={handleGoBack}
                />
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <FastImage source={{ uri: firendData?.photoURL }} style={{ width: 40, height: 40, borderRadius: 9999 }} />
                    <Text style={{ fontSize: 18, fontWeight: 500, marginLeft: 8 }}>{firendData?.displayName}</Text>
                </View>
            </View>
        </View>
    );
};

export default RoomChat;
