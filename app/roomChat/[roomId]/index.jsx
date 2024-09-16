import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import RoomChat from "../../../components/pages/chatPage/RoomChat";
const BlogScreen = () => {
    const { roomId, friendData } = useLocalSearchParams();
    const friend = JSON.parse(friendData);
    return (
        <View style={{ paddingTop: 40, flex: 1 }}>
            <RoomChat firendData={friend} roomId={roomId} />
        </View>
    );
};

export default BlogScreen;
