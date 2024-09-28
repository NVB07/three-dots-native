import { View, Text } from "react-native";
import { Button } from "@rneui/base";
import { useState, useEffect, useContext } from "react";
import FastImage from "react-native-fast-image";
import firestore from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";

const Friend = ({ uid, chatId, authUser, lastMessage }) => {
    const router = useRouter();
    const [friendData, setFriendData] = useState(null);
    // const [lastMessage, setLastMessage] = useState(null);
    useEffect(() => {
        const subscriber = firestore()
            .collection("users")
            .doc(uid)
            .onSnapshot((documentSnapshot) => {
                setFriendData(documentSnapshot.data());
            });

        return () => subscriber();
    }, [uid]);

    // useEffect(() => {
    //     const subscriber = firestore()
    //         .collection("roomsChat")
    //         .doc(chatId)
    //         .onSnapshot((documentSnapshot) => {
    //             const data = documentSnapshot.data();
    //             setLastMessage(data);
    //         });

    //     return () => subscriber();
    // }, [uid]);
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
                    <View style={{ justifyContent: "space-between", flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: lastMessage?.uid !== authUser.uid ? 600 : "normal" }}>{friendData?.displayName}</Text>

                        {lastMessage?.uid !== authUser.uid ? (
                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, fontWeight: "normal", color: "#0069FFFF" }}>
                                {lastMessage?.content}
                            </Text>
                        ) : (
                            <View style={{ flexDirection: "row", width: "100%" }}>
                                <Text style={{ fontSize: 15, fontWeight: "normal", color: "#666" }}> {"Bạn: "}</Text>
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

export default Friend;
