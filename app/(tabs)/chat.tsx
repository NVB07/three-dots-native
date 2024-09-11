import { View, StyleSheet } from "react-native";
import ChatPage from "@/components/pages/chatPage/ChatPage";

export default function ChatScreen() {
    return (
        <View style={{ paddingTop: 40, flex: 1 }}>
            <ChatPage />
        </View>
    );
}
