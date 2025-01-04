import { View, Text } from "react-native";
import { Button } from "@rneui/base";
import { useState, useEffect, useContext } from "react";
import FastImage from "react-native-fast-image";
import firestore from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import Aes from "react-native-aes-crypto";
import { RSA } from "react-native-rsa-native";

const Friend = ({ uid, chatId, authUser, lastMessage, onDataReceived, myPrivateKey }) => {
    const aesKeySenderEncrypted = lastMessage?.aesKeySenderEncrypted;
    const aesKeyReceiverEncrypted = lastMessage?.aesKeyReceiverEncrypted;

    const router = useRouter();
    const [decryptedMessage, setDecryptedMessage] = useState("");
    const [friendData, setFriendData] = useState(null);
    useEffect(() => {
        const subscriber = firestore()
            .collection("users")
            .doc(uid)
            .onSnapshot((documentSnapshot) => {
                const userData = documentSnapshot.data();
                setFriendData(userData);
                onDataReceived({ userData, chatId, lastMessage });
            });

        return () => subscriber();
    }, [uid]);
    const decryptMessage = async (encryptedMessage, aesKey, iv) => {
        const message = Aes.decrypt(encryptedMessage, aesKey, iv, "aes-256-cbc");
        return message;
    };

    const decryptAESKey = async () => {
        try {
            const myMessage = authUser.uid === lastMessage?.uid;
            if (myMessage) {
                const AesKey = await RSA.decrypt(aesKeySenderEncrypted, myPrivateKey);
                const message = await decryptMessage(lastMessage?.content, AesKey, lastMessage?.iv);
                setDecryptedMessage(message);
            } else {
                const AesKey = await RSA.decrypt(aesKeyReceiverEncrypted, myPrivateKey);
                const message = await decryptMessage(lastMessage?.content, AesKey, lastMessage?.iv);
                setDecryptedMessage(message);
            }
        } catch (error) {
            setDecryptedMessage("Chưa có tin nhắn");
        }
    };

    useEffect(() => {
        const runDecrypt = async () => {
            await decryptAESKey();
        };

        runDecrypt();
    }, [lastMessage]);

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
                                {decryptedMessage || <Text style={{ color: "#666", fontStyle: "italic" }}> Chưa có tin nhắn</Text>}
                            </Text>
                        ) : (
                            <View style={{ flexDirection: "row", width: "100%" }}>
                                <Text style={{ fontSize: 15, fontWeight: "normal", color: "#666" }}>{decryptedMessage !== "Chưa có tin nhắn" && "Bạn: "}</Text>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, fontWeight: "normal", color: "#666", flex: 1 }}>
                                    {decryptedMessage || <Text style={{ color: "#666", fontStyle: "italic" }}> Chưa có tin nhắn</Text>}
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
