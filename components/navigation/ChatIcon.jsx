// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
import { useContext, useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View, Text } from "react-native";
import { CountMessageContext } from "../context/CountMessageProvider";
export function ChatIcon({ style, authUser, ...rest }) {
    const { messages } = useContext(CountMessageContext);
    const [countMessage, setCountMessage] = useState(0);
    useEffect(() => {
        if (messages) {
            let quantity = 0;
            messages.forEach((item) => {
                if (item.data.lastMessage.uid !== authUser.uid) quantity++;
            });
            setCountMessage(quantity);
        }
    }, [messages]);

    return (
        <View style={{ position: "relative" }}>
            <Ionicons size={28} style={[{ marginBottom: -3 }, style]} {...rest} />
            {countMessage > 0 && (
                <View
                    style={{
                        position: "absolute",
                        top: -7,
                        right: -8,
                        backgroundColor: "#dc3545",
                        width: 22,
                        height: 22,
                        borderRadius: 9999,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text style={{ color: "#fff", fontSize: 15 }}>{countMessage}</Text>
                </View>
            )}
        </View>
    );
}
