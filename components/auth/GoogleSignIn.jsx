import React from "react";
import { View, Text } from "react-native";
import { Button } from "@rneui/base";
import onGoogleButtonPress from "./onGoogleButtonPress";
import AntDesign from "@expo/vector-icons/AntDesign";
export default function GoogleSignIn() {
    return (
        <View style={{ width: "100%", alignItems: "center" }}>
            <Button radius={"lg"} buttonStyle={{ backgroundColor: "#ccc" }} onPress={() => onGoogleButtonPress().then(() => console.log("Signed in with Google!"))}>
                <AntDesign name="google" size={24} color="black" />
                <Text style={{ marginLeft: 10, fontSize: 18 }}>Đăng nhập bằng Google</Text>
            </Button>
        </View>
    );
}
