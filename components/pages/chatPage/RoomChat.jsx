import { View, Text, ScrollView } from "react-native";
import FastImage from "react-native-fast-image";
import { Button } from "@rneui/base";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import messaging from "@react-native-firebase/messaging";
import { useEffect, useState, useRef, useContext } from "react";
import firestore from "@react-native-firebase/firestore";
import Message from "./Message";
import ChatInput from "./ChatInput";
import { AuthContext } from "@/components/context/AuthProvider";

const RoomChat = ({ firendData, roomId }) => {
    const [messageArray, setMessageArray] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollableRef = useRef(null);
    const { authUser } = useContext(AuthContext);
    // const requestUserPermission = async () => {
    //     const authStatus = await messaging().requestPermission();
    //     const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    //     if (enabled) {
    //         console.log("Authorization status:", authStatus);
    //     }
    // };
    // const getToken = async () => {
    //     await messaging().registerDeviceForRemoteMessages();
    //     const token = await messaging().getToken();
    //     console.log("token: ", token);
    // };
    // useEffect(() => {
    //     requestUserPermission();
    //     getToken();
    // }, []);

    useEffect(() => {
        const subscriber = firestore()
            .collection("roomsChat")
            .doc(roomId)
            .collection("chat")
            .orderBy("sendTime", "asc")
            .onSnapshot((querySnapshot) => {
                const messageArrayTemp = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    messageArrayTemp.push(data);
                });
                setMessageArray(messageArrayTemp);
                setLoading(false);
            });

        return () => subscriber();
    }, []);

    const navigation = useNavigation();
    const handleGoBack = () => {
        navigation.goBack();
    };
    return (
        <View style={{ flex: 1, paddingTop: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#ccc", paddingBottom: 8 }}>
                <Button
                    radius={12}
                    type="clear"
                    titleStyle={{ color: "#ccc" }}
                    buttonStyle={{ padding: 0 }}
                    containerStyle={{
                        width: 50,
                        padding: 0,
                    }}
                    icon={<AntDesign name="arrowleft" size={24} color="black" />}
                    onPress={handleGoBack}
                />
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <FastImage source={{ uri: firendData?.photoURL }} style={{ width: 40, height: 40, borderRadius: 9999 }} />
                    <Text style={{ fontSize: 18, fontWeight: 500, marginLeft: 8 }}>{firendData?.displayName}</Text>
                </View>
            </View>
            <ScrollView ref={scrollableRef}>
                {!loading ? (
                    messageArray.map((item, index) => {
                        return <Message key={index} messageData={item} friendData={firendData} authUser={authUser} />;
                    })
                ) : (
                    <View>
                        <Button type="clear" loading loadingProps={{ size: 80, color: "#999" }} buttonStyle={{ height: 200 }} />
                        <Text style={{ textAlign: "center", fontSize: 15 }}>Đang tải tin nhắn ...</Text>
                    </View>
                )}
            </ScrollView>
            <ChatInput
                setMessageArray={setMessageArray}
                documentId={roomId}
                friendData={firendData}
                currentUserData={authUser}
                messageData={messageArray}
                scrollRef={scrollableRef}
            />
        </View>
    );
};

export default RoomChat;
