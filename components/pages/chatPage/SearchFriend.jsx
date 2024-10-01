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

                        {lastMessage?.uid !== authUser.uid ? (
                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, fontWeight: "normal", color: "#0069FFFF" }}>
                                {lastMessage?.content}
                            </Text>
                        ) : (
                            <View style={{ flexDirection: "row", width: "100%" }}>
                                <Text style={{ fontSize: 15, fontWeight: "normal", color: "#666" }}>{"Bạn: "}</Text>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, fontWeight: "normal", color: "#666", flex: 1 }}>
                                    {lastMessage?.content}
                                </Text>
                            </View>
                        )}
                    </View>
                </Button>
            </View>
        </View>
    );
};

export default SearchFriend;
