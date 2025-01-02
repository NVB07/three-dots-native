import React, { useState, useEffect, createContext } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import LoginPage from "@/components/pages/loginPage/LoginPage";
import Loading from "@/components/pages/loading/Loading";
import { OneSignal } from "react-native-onesignal";
import * as SecureStore from "expo-secure-store";
const forge = require("node-forge");
import { RSA } from "react-native-rsa-native";
import { Button, Dialog } from "@rneui/base";
import Aes from "react-native-aes-crypto";
import { Text, View } from "react-native";
import { TextInput, Alert } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

export const AuthContext = createContext();
const AuthProvider = ({ children }) => {
    // Set an initializing state whilst Firebase connects
    const [initializing, setInitializing] = useState(true);
    const [authUser, setAuthUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(1);

    const [myPrivateKey, setMyPrivateKey] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogRestore, setDialogRestore] = useState(false);
    const [aesKey, setAesKey] = useState("");
    const [confirmAesKey, setConfirmAesKey] = useState("");
    const [checkAESKey, setCheckAESKey] = useState(0);

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

    async function createKeyPair() {
        const keys = await RSA.generateKeys(2048);
        const privateKeyAsn1 = forge.pki.privateKeyToAsn1(forge.pki.privateKeyFromPem(keys.private));
        const publicKeyAsn1 = forge.pki.publicKeyToAsn1(forge.pki.publicKeyFromPem(keys.public));

        const privateKeyPem = forge.pki.privateKeyToPem(forge.pki.privateKeyFromAsn1(privateKeyAsn1));
        const publicKeyPem = forge.pki.publicKeyToPem(forge.pki.publicKeyFromAsn1(publicKeyAsn1));

        return { privateKey: privateKeyPem, publicKey: publicKeyPem };
    }

    const encryptRSA = async (RSAKey, key) => {
        const iv = "b61ade79da2db1bca782ec9e9ef6a76e";
        const cipher = await Aes.encrypt(RSAKey, key, iv, "aes-256-cbc");
        return cipher;
    };

    const handleSwitchDialog = () => {
        Alert.alert(
            "Tạo khóa bảo mật mới", // Tiêu đề của alert
            "Việc tạo khóa bảo mật mới sẽ không thể khôi phục các tin nhắn trước đó, bạn có muốn tiếp tục ?",
            [
                {
                    text: "Hủy",
                    onPress: () => console.log("Hủy bỏ"),
                    style: "cancel",
                },
                {
                    text: "Xác nhận",
                    style: "destructive",
                    onPress: () => {
                        setAesKey("");
                        setConfirmAesKey("");
                        setDialogVisible(true);
                        setDialogRestore(false);
                    },
                },
            ],
            { cancelable: false }
        );
    };

    useEffect(() => {
        if (aesKey.trim() === "" || confirmAesKey.trim() === "") {
            setCheckAESKey(0);
        } else if (!passwordRegex.test(aesKey.trim())) {
            setCheckAESKey(3);
        } else if (aesKey.trim() === confirmAesKey.trim()) {
            setCheckAESKey(1);
        } else {
            setCheckAESKey(2);
        }
    }, [aesKey, confirmAesKey]);

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged((user) => {
            setCurrentUser(user);
        });
        return subscriber; // unsubscribe on unmount
    }, []);

    const createKey = async () => {
        const rsaKey = await createKeyPair();
        const key = await Aes.sha256(aesKey);
        await SecureStore.setItemAsync("privateKey", rsaKey.privateKey);
        setMyPrivateKey(rsaKey.privateKey);
        const encryptedPrivateKey = await encryptRSA(rsaKey.privateKey, key);
        await firestore().collection("users").doc(authUser.uid).update({ publicKey: rsaKey.publicKey });
        await firestore()
            .collection("secretKeyEncrypted")
            .doc(authUser.uid)
            .set({ key: encryptedPrivateKey, uid: authUser.uid })
            .then(() => {
                setAesKey("");
                setConfirmAesKey("");
                setDialogVisible(false);
            });
    };
    const enterKey = async () => {
        try {
            const userDoc = await firestore().collection("secretKeyEncrypted").doc(authUser.uid).get();
            const encryptedPrivateKey = userDoc.data()?.key;
            const key = await Aes.sha256(aesKey);
            const privateKeyDecrypted = await Aes.decrypt(encryptedPrivateKey, key, "b61ade79da2db1bca782ec9e9ef6a76e", "aes-256-cbc");
            await SecureStore.setItemAsync("privateKey", privateKeyDecrypted);
            setMyPrivateKey(privateKeyDecrypted);
            setDialogRestore(false);
            setAesKey("");
            setConfirmAesKey("");
        } catch (error) {
            Alert.alert(
                "Sai mật khẩu", // Tiêu đề của alert
                "Bạn đã nhập sai mật khẩu, vui lòng thử lại !",
                [
                    {
                        text: "Ok",
                        onPress: () => console.log("Hủy bỏ"),
                        style: "cancel",
                    },
                ],
                { cancelable: false }
            );
        }
    };

    useEffect(() => {
        const fetchPrivateKey = async () => {
            if (authUser?.uid) {
                try {
                    const userDoc = await firestore().collection("users").doc(authUser.uid).get();
                    const privateKey = await SecureStore.getItemAsync("privateKey");
                    if (!userDoc.data()?.publicKey) {
                        setDialogVisible(true);
                    } else if (privateKey === null) {
                        setDialogRestore(true);
                    } else {
                        setMyPrivateKey(privateKey);
                    }
                } catch (error) {
                    console.error("Lỗi khi lấy private key: ", error);
                }
            }
        };

        fetchPrivateKey(); // Gọi hàm bất đồng bộ để lấy private key
    }, [authUser?.uid]);

    useEffect(() => {
        if (currentUser !== 1 && currentUser?.uid) {
            const subscriber = firestore()
                .collection("users")
                .doc(currentUser.uid)
                .onSnapshot(
                    (documentSnapshot) => {
                        if (documentSnapshot.exists) {
                            const data = documentSnapshot.data();
                            setAuthUser(data);
                            OneSignal.login(data.uid);
                            console.log("uid login: ", data.uid);
                        }
                        setInitializing(false);
                    },
                    (error) => {
                        console.error("Error fetching user data: ", error);
                        setInitializing(false); // Dừng loading nếu có lỗi
                    }
                );
            return () => subscriber(); // unsubscribe on unmount
        } else if (currentUser == null) {
            setInitializing(false);

            setAuthUser(null); // Nếu không có currentUser, dừng loading
        }
    }, [currentUser]);
    if (initializing) return <Loading />;

    if (!authUser && !initializing) {
        return <LoginPage />;
    }

    return (
        <AuthContext.Provider value={{ authUser, myPrivateKey, setAuthUser }}>
            {dialogVisible && (
                <Dialog overlayStyle={{ backgroundColor: "white", width: "90%" }} isVisible={dialogVisible}>
                    <Dialog.Title titleStyle={{ color: "red", textAlign: "center", fontSize: 22 }} title="Tạo mật khẩu khóa bảo mật" />
                    <Text style={{ color: "#555", fontStyle: "italic", marginBottom: 10 }}>
                        *Mật mã này là duy nhất. Hãy sao lưu và giữ nó một cách an toàn. Nếu bạn quên mật khẩu này, sẽ không thể khôi phục tin nhắn trong tương lai !
                    </Text>
                    <TextInput
                        secureTextEntry={true}
                        onChangeText={(e) => setAesKey(e)}
                        value={aesKey}
                        placeholder="Nhập mật khẩu"
                        style={{ fontSize: 15, borderWidth: 1, borderColor: "#CCC", borderRadius: 5, padding: 5, marginBottom: 5 }}
                    />
                    <TextInput
                        secureTextEntry={true}
                        onChangeText={(e) => setConfirmAesKey(e)}
                        value={confirmAesKey}
                        placeholder="Nhập lại mật khẩu"
                        style={{ fontSize: 15, borderWidth: 1, borderColor: "#CCC", borderRadius: 5, padding: 5, marginBottom: 3 }}
                    />
                    <View style={{ minHeight: 20 }}>
                        {checkAESKey !== 0 &&
                            (checkAESKey === 1 ? (
                                <View style={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
                                    <AntDesign name="checkcircleo" size={18} color="green" />
                                    <Text style={{ color: "green", fontSize: 13 }}> Mật khẩu khớp</Text>
                                </View>
                            ) : checkAESKey === 2 ? (
                                <View style={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
                                    <AntDesign name="closecircleo" size={18} color="red" />
                                    <Text style={{ color: "red", fontSize: 13 }}> Mật khẩu không khớp</Text>
                                </View>
                            ) : (
                                <View style={{ display: "flex", alignItems: "center", flexDirection: "row", width: "100%" }}>
                                    <Text style={{ color: "red", fontSize: 13, wordBreak: "break-word" }}>Mật khẩu gồm ít nhất 6 ký tự, bao gồm cả chữ cái và số</Text>
                                </View>
                            ))}
                    </View>

                    <Button disabled={checkAESKey !== 1} containerStyle={{ marginTop: 15 }} title={"Xác nhận"} onPress={createKey} />
                </Dialog>
            )}
            {dialogRestore && (
                <Dialog overlayStyle={{ backgroundColor: "white", width: "90%" }} isVisible={dialogRestore}>
                    <Dialog.Title titleStyle={{ color: "red", textAlign: "center", fontSize: 22 }} title="Nhập mật khẩu khóa bảo mật" />
                    <Text style={{ color: "#555", fontStyle: "italic", marginBottom: 10 }}>
                        *Nhập mật khẩu để khôi phục tin nhắn đã lưu trữ trước đó. Nếu bạn quên mật khẩu, có thể nhấn {"\n"}
                        <Text style={{ color: "red" }}>Tạo mới mật khẩu</Text> nhưng sẽ không thể khôi phục tin nhắn !
                    </Text>
                    <TextInput
                        secureTextEntry={true}
                        onChangeText={(e) => setAesKey(e)}
                        value={aesKey}
                        placeholder="Nhập mật khẩu"
                        style={{ fontSize: 15, borderWidth: 1, borderColor: "#CCC", borderRadius: 5, padding: 5, marginBottom: 5 }}
                    />
                    <Button
                        title={"Tạo mới mật khẩu"}
                        titleStyle={{ color: "red", fontSize: 14, textDecorationLine: "underline" }}
                        type="clear"
                        onPress={handleSwitchDialog}
                        containerStyle={{ padding: 0, paddingHorizontal: 0, display: "flex", alignItems: "flex-end" }}
                        buttonStyle={{ padding: 0, paddingHorizontal: 0, width: 120 }}
                    />
                    <Button disabled={aesKey.trim() === ""} containerStyle={{ marginTop: 15 }} title={"Xác nhận"} onPress={enterKey} />
                </Dialog>
            )}
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
