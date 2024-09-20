import { Text, View } from "react-native";
import FastImage from "react-native-fast-image";

const Message = ({ messageData, friendData, authUser }) => {
    return (
        <View style={{ paddingHorizontal: 12, marginBottom: 8 }}>
            {authUser?.uid !== messageData.uid ? (
                <View style={{ flexDirection: "row", alignItems: "center", maxWidth: "65%", height: "auto" }}>
                    <View style={{ justifyContent: "flex-end", marginRight: 5, alignSelf: "stretch" }}>
                        <FastImage source={{ uri: friendData.photoURL }} style={{ width: 30, height: 30, borderRadius: 50 }} />
                    </View>
                    <View style={{}}>
                        <Text style={{ backgroundColor: "#ddd", paddingHorizontal: 8, paddingVertical: 3, fontSize: 16, borderRadius: 15, wordBreak: "break-word" }}>
                            {messageData.content}
                        </Text>
                    </View>
                </View>
            ) : (
                <View style={{ flexDirection: "row-reverse" }}>
                    <View style={{ maxWidth: "65%" }}>
                        <Text
                            style={{
                                backgroundColor: "#3797f0",
                                color: "#fff",
                                paddingHorizontal: 8,
                                paddingVertical: 3,
                                fontSize: 16,
                                borderRadius: 15,
                                wordBreak: "break-word",
                            }}
                        >
                            {messageData.content}
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
};

export default Message;
