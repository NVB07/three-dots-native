import { View, Text, ScrollView } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useContext, useEffect, useState, memo } from "react";
import { Button } from "@rneui/base";
import FastImage from "react-native-fast-image";
import Friend from "./Friend";

import { AuthContext } from "@/components/context/AuthProvider";
const ChatPage = () => {
    const { authUser } = useContext(AuthContext);
    const [friend, setFriend] = useState([]);

    useEffect(() => {
        if (authUser.uid) {
            const subscriber = firestore()
                .collection("roomsChat")

                .orderBy("createAt", "desc")
                .onSnapshot((querySnapshot) => {
                    if (querySnapshot) {
                        const docsWithUserUid = [];
                        querySnapshot.forEach((doc) => {
                            const data = doc.data();
                            if (data.user && data.user.includes(authUser.uid)) {
                                docsWithUserUid.push({
                                    id: doc.id,
                                    user: data.user,
                                });
                            }
                        });
                        setFriend(docsWithUserUid);
                    }
                });

            return () => subscriber();
        }
    }, []);
    return (
        <View style={{}}>
            <View
                style={{
                    width: "100%",
                    height: 40,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottomWidth: 1,
                    borderBottomColor: "#ccc",
                }}
            >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Nhắn tin</Text>
            </View>
            <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12 }}>
                <View
                    style={{
                        marginTop: 10,
                        borderWidth: 1,
                        borderColor: "#ccc",
                        borderRadius: 99999,
                        marginBottom: 8,
                        flexDirection: "row",
                        alignItems: "center",
                        width: "100%",
                        justifyContent: "space-between",
                    }}
                >
                    <Button
                        containerStyle={{ width: "100%" }}
                        radius={9999}
                        titleStyle={{ color: "#999", textAlign: "left" }}
                        type="clear"
                        buttonStyle={{ width: "100%", justifyContent: "flex-start" }}
                        style={{ height: 35, flex: 1, padding: 4 }}
                    >
                        <FastImage
                            style={{ width: 37, height: 37, borderRadius: 9999, marginRight: 6 }}
                            source={{
                                uri: authUser?.photoURL,
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                        <Text style={{ fontSize: 16, color: "#666" }}>Tìm kiếm</Text>
                    </Button>
                </View>
            </View>

            <ScrollView>
                {friend.map((item, index) => {
                    const friendUid = item.user.find((uid) => uid !== authUser.uid);
                    return <Friend uid={friendUid} chatId={item.id} key={index} authUser={authUser} />;
                })}
            </ScrollView>
        </View>
    );
};

export default ChatPage;
