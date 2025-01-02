import { View, Text } from "react-native";
import { Button } from "@rneui/base";
import FastImage from "react-native-fast-image";
import { useRouter } from "expo-router";
import { SheetManager } from "react-native-actions-sheet";

const SearchFriend = ({ friendData, chatId, authUser, lastMessage }) => {
    const router = useRouter();

    return (
        <View style={{ width: "100%" }}>
            <View style={{}}>
                <Button
                    onPress={() => {
                        SheetManager.hide("SearchFriendSheet");
                        router.push({
                            pathname: "/roomChat/" + chatId,
                            params: {
                                friendData: friendData ? encodeURIComponent(JSON.stringify(friendData)) : null,
                            },
                        });
                    }}
                    titleStyle={{ color: "#ccc" }}
                    type="clear"
                    buttonStyle={{ width: "100%", justifyContent: "flex-start", paddingHorizontal: 12 }}
                >
                    <FastImage
                        style={{ width: 40, height: 40, borderRadius: 9999, marginRight: 8 }}
                        source={{
                            uri: friendData?.photoURL,
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                    <View style={{ justifyContent: "space-between", flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: lastMessage?.uid !== authUser.uid ? 600 : "normal" }}>{friendData?.displayName}</Text>

                        <Text style={{ fontSize: 15, fontWeight: "normal", color: "#666", fontStyle: "italic" }}>Nhấn để vào đoạn chat</Text>
                    </View>
                </Button>
            </View>
        </View>
    );
};

export default SearchFriend;
