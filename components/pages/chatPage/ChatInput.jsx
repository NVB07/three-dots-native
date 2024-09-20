import { View, Text, TextInput } from "react-native";
import { Button } from "@rneui/base";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState, useRef } from "react";
const ChatInput = ({ documentId, currentUserData, messageData, scrollRef }) => {
    const inputRef = useRef(null);

    const scrollToBottom = (animate = false) => {
        scrollRef.current?.scrollToEnd({ animated: animate });
    };
    useEffect(() => {
        scrollToBottom();
    });

    const handleSendMMessage = () => {
        scrollToBottom(true);
    };

    return (
        <View style={{ flexDirection: "row", width: "100%", paddingHorizontal: 12, paddingVertical: 5 }}>
            <View style={{ flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 9999, justifyContent: "center", paddingHorizontal: 10 }}>
                <TextInput ref={inputRef} onFocus={() => scrollToBottom(true)} placeholder="Soạn tin nhắn" style={{ fontSize: 15 }} />
            </View>
            <Button onPress={handleSendMMessage} containerStyle={{ width: 40, height: 40, marginLeft: 3 }} radius={9999} buttonStyle={{ backgroundColor: "#ECECECFF" }}>
                <Ionicons name="send" size={24} color="#3797f0" />
            </Button>
        </View>
    );
};

export default ChatInput;
