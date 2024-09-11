import { View, Text, TextInput } from "react-native";
import { useContext } from "react";
import { Button } from "@rneui/base";
import FastImage from "react-native-fast-image";

import { AuthContext } from "@/components/context/AuthProvider";
const ChatPage = () => {
    const { authUser, setAuthUser } = useContext(AuthContext);
    return (
        <View style={{ paddingHorizontal: 12 }}>
            <View
                style={{
                    width: "100%",
                    height: 40,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottomWidth: 1,
                    borderBottomColor: "#ccc",
                }}
            >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Nhắn tin</Text>
            </View>
            <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View style={{ width: "10%", alignItems: "flex-start" }}>
                    <FastImage
                        style={{ width: 37, height: 37, borderRadius: 9999 }}
                        source={{
                            uri: authUser?.photoURL,
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                </View>
                <View
                    style={{
                        marginTop: 10,
                        borderWidth: 1,
                        borderColor: "#ccc",
                        borderRadius: 99999,
                        marginBottom: 8,
                        flexDirection: "row",
                        alignItems: "center",
                        width: "90%",
                        justifyContent: "space-between",
                    }}
                >
                    <Button
                        containerStyle={{ width: "100%" }}
                        radius={9999}
                        titleStyle={{ color: "#999", textAlign: "left" }}
                        type="clear"
                        buttonStyle={{ width: "100%", justifyContent: "flex-start" }}
                        style={{ height: 35, flex: 1, paddingVertical: 8, paddingHorizontal: 8 }}
                        title={"Tìm kiếm"}
                    />
                </View>
            </View>
            <Text>chat</Text>
        </View>
    );
};

export default ChatPage;
