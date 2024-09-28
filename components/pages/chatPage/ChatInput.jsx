import { View, Text, TextInput } from "react-native";
import { Button } from "@rneui/base";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState, useRef } from "react";
import { sendMessageValue } from "@/components/firebase/service";
import firestore from "@react-native-firebase/firestore";
import { sendPushNotification } from "@/components/oneSignal/notification";

const ChatInput = ({ documentId, currentUserData, setMessageArray, scrollRef, friendData }) => {
    const [messageValue, setMessageValue] = useState("");
    const inputRef = useRef(null);

    const scrollToBottom = (animate = false, time = 0) => {
        setTimeout(() => {
            scrollRef.current?.scrollToEnd({ animated: animate });
        }, time);
    };
    useEffect(() => {
        scrollToBottom();
    });

    const handleSendMessage = async () => {
        const value = {
            content: messageValue,
            uid: currentUserData.uid,
            sendTime: firestore.FieldValue.serverTimestamp(),
        };
        setMessageArray((prev) => [...prev, value]);
        setMessageValue("");
        scrollToBottom(true, 100);
        await sendMessageValue(documentId, value);
        await sendPushNotification(friendData?.uid, "Tin nhắn mới !", `${currentUserData?.displayName}: "${messageValue}"`, currentUserData.photoURL);
    };

    return (
        <View style={{ flexDirection: "row", width: "100%", paddingHorizontal: 12, paddingVertical: 5 }}>
            <View style={{ flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 9999, justifyContent: "center", paddingHorizontal: 10 }}>
                <TextInput
                    ref={inputRef}
                    onChangeText={(e) => setMessageValue(e)}
                    value={messageValue}
                    onFocus={() => scrollToBottom(true, 100)}
                    placeholder="Soạn tin nhắn"
                    style={{ fontSize: 15 }}
                />
            </View>
            <Button
                disabled={messageValue.length === 0}
                onPress={handleSendMessage}
                containerStyle={{ width: 40, height: 40, marginLeft: 3 }}
                radius={9999}
                buttonStyle={{ backgroundColor: "#ECECECFF" }}
            >
                <Ionicons name="send" size={24} color={messageValue.length === 0 ? "#ccc" : "#3797f0"} />
            </Button>
        </View>
    );
};

export default ChatInput;
