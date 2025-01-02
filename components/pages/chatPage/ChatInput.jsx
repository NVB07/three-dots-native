import { View, Text, TextInput, NativeModules } from "react-native";
import { Button } from "@rneui/base";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState, useRef } from "react";
import { sendMessageValue } from "@/components/firebase/service";
import firestore from "@react-native-firebase/firestore";
import { sendPushNotification } from "@/components/oneSignal/notification";
const forge = require("node-forge");
import Aes from "react-native-aes-crypto";

const ChatInput = ({ documentId, currentUserData, setMessageArray, scrollRef, friendData }) => {
    const [messageValue, setMessageValue] = useState("");
    const inputRef = useRef(null);

    const scrollToBottom = (animate = false, time = 0) => {
        setTimeout(() => {
            scrollRef.current?.scrollToEnd({ animated: animate });
        }, time);
    };
    useEffect(() => {
        scrollToBottom();
    });

    function encryptData(data) {
        const receiverPublicKey = friendData.publicKey; // Lấy khóa công khai người nhận
        const senderPublicKey = currentUserData.publicKey; // Lấy khóa công khai người gửi

        if (!receiverPublicKey || !senderPublicKey) {
            throw new Error("Chưa có khóa công khai!");
        }

        const receiverPublicKeyObj = forge.pki.publicKeyFromPem(receiverPublicKey);
        const senderPublicKeyObj = forge.pki.publicKeyFromPem(senderPublicKey);

        const receiverEncryptedData = receiverPublicKeyObj.encrypt(data, "RSAES-PKCS1-V1_5");
        const senderEncryptedData = senderPublicKeyObj.encrypt(data, "RSAES-PKCS1-V1_5");

        const receiverEncryptedBase64 = forge.util.encode64(receiverEncryptedData);
        const senderEncryptedBase64 = forge.util.encode64(senderEncryptedData);
        return { receiverEncryptedBase64, senderEncryptedBase64 };
    }

    const handleSendMessage = async () => {
        try {
            const valueMessageNormal = {
                content: messageValue,
                uid: currentUserData.uid,
                sendTime: firestore.FieldValue.serverTimestamp(),
            };

            // setMessageArray((prev) => [...prev, valueMessageNormal]);
            setMessageValue("");
            scrollToBottom(true, 100);
            const { cipher, iv, AESKey } = await getData(messageValue);
            if (friendData.publicKey && currentUserData.publicKey) {
                const encryptedAESKey = encryptData(AESKey);

                const value = {
                    content: cipher,
                    uid: currentUserData.uid,
                    sendTime: firestore.FieldValue.serverTimestamp(),
                    aesKeyReceiverEncrypted: encryptedAESKey.receiverEncryptedBase64,
                    aesKeySenderEncrypted: encryptedAESKey.senderEncryptedBase64,
                    iv: iv,
                };

                scrollToBottom(true, 100);
                await sendMessageValue(documentId, value);
                await sendPushNotification(friendData?.uid, "Tin nhắn mới !", `${currentUserData?.displayName}: ${messageValue}`, currentUserData.photoURL);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const generateKey = async (cost, length) => {
        const password = await Aes.randomKey(16);
        const salt = await Aes.randomKey(16);
        return Aes.pbkdf2(password, salt, cost, length, "sha256");
    };

    const encryptMessage = async (text, key) => {
        const iv = await Aes.randomKey(16);
        const cipher = await Aes.encrypt(text, key, iv, "aes-256-cbc");
        return {
            cipher,
            iv,
        };
    };
    // const decrypt = async (encryptedData, key) => {
    //     console.log({ encryptedData, key });
    //     return Aes.decrypt(encryptedData.cipher, key, encryptedData.iv, "aes-256-cbc");
    // };

    const getData = async (message) => {
        try {
            let secureData = {};
            const AESKey = await generateKey(5000, 256);
            const { cipher, iv } = await encryptMessage(message, AESKey);
            secureData = { cipher, iv, AESKey };
            return secureData;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    // const getDec = async () => {
    //     var { cipher, key, iv } = data;
    //     decrypt({ cipher, iv }, key).then((decrypted) => {
    //         console.log({ decrypted });
    //         setDec(decrypted);
    //     });
    // };

    return (
        <View style={{ flexDirection: "row", width: "100%", paddingHorizontal: 12, paddingVertical: 5 }}>
            <View style={{ flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 9999, justifyContent: "center", paddingHorizontal: 10 }}>
                <TextInput
                    ref={inputRef}
                    onChangeText={(e) => setMessageValue(e)}
                    value={messageValue}
                    onFocus={() => scrollToBottom(true, 100)}
                    placeholder="Soạn tin nhắn"
                    style={{ fontSize: 15 }}
                />
            </View>
            {/* <Button title={"decrypt"} onPress={getDec} />    */}
            <Button
                disabled={messageValue.length === 0}
                onPress={handleSendMessage}
                containerStyle={{ width: 40, height: 40, marginLeft: 3 }}
                radius={9999}
                buttonStyle={{ backgroundColor: "#ECECECFF" }}
            >
                <Ionicons name="send" size={24} color={messageValue.length === 0 ? "#ccc" : "#3797f0"} />
            </Button>
        </View>
    );
};

export default ChatInput;
