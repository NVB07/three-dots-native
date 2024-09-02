import { Button } from "@rneui/base";
import { AntDesign } from "@expo/vector-icons";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

const HeaderBack = ({ title = "", icon = true }) => {
    const navigation = useNavigation();
    const handleGoBack = () => {
        navigation.goBack();
    };
    return (
        <View
            style={{
                width: "100%",
                height: 40,

                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottomWidth: 1,
                borderBottomColor: "#ccc",
                // paddingBottom: 8,
            }}
        >
            <Button
                radius={12}
                type="clear"
                title={!icon && "Hủy"}
                titleStyle={!icon ? { color: "red" } : {}}
                containerStyle={{
                    width: 50,
                    paddingLeft: 0,
                }}
                icon={icon ? <AntDesign name="arrowleft" size={24} color="black" /> : null}
                onPress={handleGoBack}
            />

            <Text style={{ fontSize: 20, fontWeight: "bold" }}> {title}</Text>
            <View style={{ width: 50 }}></View>
        </View>
    );
};

export default HeaderBack;
