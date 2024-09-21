import { View, Text } from "react-native";
import { Button } from "@rneui/base";
import { useState, useEffect } from "react";
import FastImage from "react-native-fast-image";
import firestore from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";

const Friend = ({ uid, chatId, authUser }) => {
    const router = useRouter();
    const [friendData, setFriendData] = useState(null);
    const [lastMessage, setLastMessage] = useState(null);
    useEffect(() => {
        const subscriber = firestore()
            .collection("users")
            .doc(uid)
            .onSnapshot((documentSnapshot) => {
                setFriendData(documentSnapshot.data());
            });

        return () => subscriber();
    }, [uid]);

    useEffect(() => {
        const subscriber = firestore()
            .collection("roomsChat")
            .doc(chatId)
            .onSnapshot((documentSnapshot) => {
                setLastMessage(documentSnapshot.data());
            });

        return () => subscriber();
    }, [uid]);
    return (
        <View style={{ width: "100%", marginVertical: 4 }}>
            <View style={{}}>
                <Button
                    onPress={() => {
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
                    <View style={{ justifyContent: "space-between" }}>
                        <Text style={{ fontSize: 16, fontWeight: lastMessage?.lastMessage?.uid !== authUser.uid ? 600 : "normal" }}>{friendData?.displayName}</Text>

                        {lastMessage?.lastMessage?.uid !== authUser.uid ? (
                            <Text style={{ fontSize: 15, fontWeight: "normal", color: "#0069FFFF" }}>{lastMessage?.lastMessage?.content}</Text>
                        ) : (
                            <Text style={{ fontSize: 15, fontWeight: "normal", color: "#666" }}>{"Bạn: " + lastMessage?.lastMessage?.content}</Text>
                        )}
                    </View>
                </Button>
            </View>
        </View>
    );
};

export default Friend;
