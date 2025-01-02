import { Text, View } from "react-native";
import { useEffect, useState, useContext } from "react";
import FastImage from "react-native-fast-image";
import { AuthContext } from "@/components/context/AuthProvider";

import Aes from "react-native-aes-crypto";
import { RSA } from "react-native-rsa-native";

const Message = ({ messageData, friendData, authUser }) => {
    const [decryptedMessage, setDecryptedMessage] = useState("");
    const { myPrivateKey } = useContext(AuthContext);
    const myMessage = authUser.uid === messageData.uid;
    const aesKeySenderEncrypted = messageData.aesKeySenderEncrypted;
    const aesKeyReceiverEncrypted = messageData.aesKeyReceiverEncrypted;

    const decryptMessage = async (encryptedMessage, aesKey, iv) => {
        const message = Aes.decrypt(encryptedMessage, aesKey, iv, "aes-256-cbc");
        return message;
    };

    const decryptAESKey = async () => {
        try {
            if (myMessage) {
                const AesKey = await RSA.decrypt(aesKeySenderEncrypted, myPrivateKey);
                const message = await decryptMessage(messageData.content, AesKey, messageData.iv);
                setDecryptedMessage(message);
            } else {
                const AesKey = await RSA.decrypt(aesKeyReceiverEncrypted, myPrivateKey);
                const message = await decryptMessage(messageData.content, AesKey, messageData.iv);
                setDecryptedMessage(message);
            }
        } catch (error) {
            setDecryptedMessage(null);
        }
    };

    useEffect(() => {
        const runDecrypt = async () => {
            await decryptAESKey();
        };

        runDecrypt();
    }, []);

    if (decryptedMessage === null || decryptedMessage === "") return null;

    return (
        <View style={{ paddingHorizontal: 12, marginVertical: 4 }}>
            {!myMessage ? (
                <View style={{ flexDirection: "row", alignItems: "center", maxWidth: "65%", height: "auto" }}>
                    <View style={{ justifyContent: "flex-end", marginRight: 5, alignSelf: "stretch" }}>
                        <FastImage source={{ uri: friendData.photoURL }} style={{ width: 30, height: 30, borderRadius: 50 }} />
                    </View>
                    <View style={decryptedMessage === "" ? { width: "40%" } : {}}>
                        <Text style={{ backgroundColor: "#ddd", paddingHorizontal: 8, paddingVertical: 3, fontSize: 16, borderRadius: 15, wordBreak: "break-word" }}>
                            {/* {messageData.content} */}
                            {decryptedMessage}
                        </Text>
                    </View>
                </View>
            ) : (
                <View style={{ flexDirection: "row-reverse" }}>
                    <View style={{ maxWidth: "65%", width: decryptedMessage !== "" ? "auto" : "40%" }}>
                        {/* <Button title={"decrypt"} onPress={decryptAESKey} /> */}
                        <Text
                            style={{
                                backgroundColor: decryptedMessage !== "" ? "#3797f0" : "#9acbf9",

                                color: "#fff",
                                paddingHorizontal: 8,
                                paddingVertical: 3,
                                fontSize: 16,
                                borderRadius: 15,
                                wordBreak: "break-word",
                            }}
                        >
                            {decryptedMessage}
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
};

export default Message;
