import { Button, Overlay } from "@rneui/base";
import { useState, useEffect } from "react";
import { View, TextInput, Text, Alert, ScrollView, Keyboard } from "react-native";
import * as ImagePicker from "expo-image-picker";
import FastImage from "react-native-fast-image";
import { updateUserInformation } from "@/components/firebase/service";
import { useNavigation } from "@react-navigation/native";

const EditProfile = ({ authUser, setAuthUser }) => {
    const navigation = useNavigation();
    const [image, setImage] = useState(authUser.photoURL);
    const [userName, setUserName] = useState(authUser.displayName);
    const [gmail, setGmail] = useState(authUser.email);
    const [facebook, setFacebook] = useState(authUser.facebook);
    const [instagram, setInstagram] = useState(authUser.instagram);
    const [threads, setThreads] = useState(authUser.threads);
    const [tiktok, setTiktok] = useState(authUser.tiktok);
    const [x, setX] = useState(authUser.x);
    const [loading, setLoading] = useState(false);
    const [saveDisable, setSaveDisable] = useState(false);

    const facebookRegex = /^(https:\/\/(www\.)?facebook\.com\/).*/;
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const instagramRegex = /^(https:\/\/(www\.)?instagram\.com\/).*/;
    const threadsRegex = /^(https:\/\/(www\.)?threads\.net\/).*/;
    const tiktokRegex = /^(https:\/\/(www\.)?tiktok\.com\/).*/;
    const xRegex = /^(https:\/\/(www\.)?x\.com\/).*/;

    const handleDataFormat = () => {
        if (
            image === authUser.photoURL &&
            userName === authUser.displayName &&
            facebook === authUser.facebook &&
            gmail === authUser.email &&
            instagram === authUser.instagram &&
            threads === authUser.threads &&
            tiktok === authUser.tiktok &&
            x === authUser.x
        ) {
            setSaveDisable(true);
        } else if (userName === "") {
            setSaveDisable(true);
        } else if (gmail !== "" && !gmailRegex.test(gmail)) {
            setSaveDisable(true);
        } else if (facebook !== "" && !facebookRegex.test(facebook)) {
            setSaveDisable(true);
        } else if (instagram !== "" && !instagramRegex.test(instagram)) {
            setSaveDisable(true);
        } else if (threads !== "" && !threadsRegex.test(threads)) {
            setSaveDisable(true);
        } else if (tiktok !== "" && !tiktokRegex.test(tiktok)) {
            setSaveDisable(true);
        } else if (x !== "" && !xRegex.test(x)) {
            setSaveDisable(true);
        } else setSaveDisable(false);
    };
    useEffect(() => {
        handleDataFormat();
    }, [image, userName, gmail, facebook, instagram, threads, tiktok, x]);

    const getPathImage = (imageUrl) => {
        if (imageUrl) {
            const startIndex = imageUrl.lastIndexOf("/") + 1;
            const endIndex = imageUrl.indexOf("?alt=");
            const encodedImagePath = imageUrl.substring(startIndex, endIndex);

            const imagePath = decodeURIComponent(encodedImagePath).startsWith("photoUsers") ? decodeURIComponent(encodedImagePath) : null;
            return imagePath;
        }
        return null;
    };

    const pickImage = async () => {
        Keyboard.dismiss();

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            Keyboard.dismiss();
            setImage(result.assets[0].uri);
            console.log(result.assets[0].uri);
        }
    };

    const saveInformation = async () => {
        setLoading(true);
        const newImage = image === authUser.photoURL ? null : image;

        const updated = await updateUserInformation(authUser.uid, getPathImage(authUser.photoURL), newImage, {
            displayName: userName,
            email: gmail,
            facebook: facebook,
            instagram: instagram,
            threads: threads,
            tiktok: tiktok,
            x: x,
        });
        if (updated) {
            setLoading(false);
            Alert.alert("Thành công", "Chỉnh sửa thông tin thành công", [{ text: "OK", onPress: () => navigation.goBack() }]);
        } else {
            setLoading(false);
            Alert.alert("Đã xảy ra lỗi !", "Không sửa được thông tin", [{ text: "OK", onPress: () => console.log("") }]);
        }
    };
    return (
        <View style={{ flex: 1, position: "relative" }}>
            <Button
                disabled={saveDisable}
                onPress={saveInformation}
                radius={12}
                type="clear"
                containerStyle={{ position: "absolute", right: 0, top: -40, zIndex: 9999, width: 50, height: 50 }}
            >
                Lưu
            </Button>
            <ScrollView style={{ paddingTop: 10, paddingHorizontal: 12 }}>
                <View>
                    <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Ảnh đại diện</Text>
                    <View style={{ width: "100%", paddingTop: 10, alignItems: "center" }}>
                        <View style={{ width: 100, height: 100, borderRadius: 9999 }}>
                            <FastImage
                                style={{ width: 100, height: 100, borderRadius: 9999 }}
                                source={{
                                    uri: image,
                                    priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </View>
                        <Button type="outline" title="Chọn ảnh" onPress={pickImage} containerStyle={{ marginTop: 10, marginBottom: 10 }} />
                    </View>
                </View>
                <View>
                    <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Tên</Text>
                    <View style={{ width: "100%" }}>
                        <TextInput
                            textAlignVertical="top"
                            multiline={false}
                            onChangeText={(e) => setUserName(e.trim())}
                            value={userName}
                            // autoFocus
                            placeholder={authUser.displayName}
                            style={{ flex: 1, paddingVertical: 8, paddingHorizontal: 8, fontSize: 18, borderWidth: 1, borderColor: "#ccc", borderRadius: 8 }}
                        />
                    </View>
                </View>
                <View style={{ marginTop: 15, paddingBottom: 50 }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Liên kết mạng xã hội</Text>
                    <View style={{ width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 10 }}>
                        <Text style={{ paddingLeft: 8, paddingTop: 8, fontSize: 15, fontWeight: "600" }}>Gmail</Text>
                        <TextInput
                            textAlignVertical="top"
                            multiline={false}
                            onChangeText={(e) => setGmail(e.trim())}
                            value={gmail}
                            // autoFocus
                            placeholder={authUser.email ? authUser.email : "example@gmail.com"}
                            style={{ flex: 1, paddingVertical: 8, paddingHorizontal: 8, fontSize: 18 }}
                        />
                    </View>
                    <View style={{ width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 10 }}>
                        <Text style={{ paddingLeft: 8, paddingTop: 8, fontSize: 15, fontWeight: "600" }}>Facebook</Text>
                        <TextInput
                            textAlignVertical="top"
                            multiline={false}
                            onChangeText={(e) => setFacebook(e.trim())}
                            value={facebook}
                            // autoFocus
                            placeholder={authUser.facebook ? authUser.facebook : "https://facebook.com/facebookID"}
                            style={{ flex: 1, paddingVertical: 8, paddingHorizontal: 8, fontSize: 18 }}
                        />
                    </View>
                    <View style={{ width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 10 }}>
                        <Text style={{ paddingLeft: 8, paddingTop: 8, fontSize: 15, fontWeight: "600" }}>Instagram</Text>
                        <TextInput
                            textAlignVertical="top"
                            multiline={false}
                            onChangeText={(e) => setInstagram(e.trim())}
                            value={instagram}
                            // autoFocus
                            placeholder={authUser.instagram ? authUser.instagram : "https://instagram.com/instagramID"}
                            style={{ flex: 1, paddingVertical: 8, paddingHorizontal: 8, fontSize: 18 }}
                        />
                    </View>
                    <View style={{ width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 10 }}>
                        <Text style={{ paddingLeft: 8, paddingTop: 8, fontSize: 15, fontWeight: "600" }}>Threads</Text>
                        <TextInput
                            textAlignVertical="top"
                            multiline={false}
                            onChangeText={(e) => setThreads(e.trim())}
                            value={threads}
                            // autoFocus
                            placeholder={authUser.threads ? authUser.threads : "https://threads.net/@threeadID"}
                            style={{ flex: 1, paddingVertical: 8, paddingHorizontal: 8, fontSize: 18 }}
                        />
                    </View>
                    <View style={{ width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 10 }}>
                        <Text style={{ paddingLeft: 8, paddingTop: 8, fontSize: 15, fontWeight: "600" }}>Tiktok</Text>
                        <TextInput
                            textAlignVertical="top"
                            multiline={false}
                            onChangeText={(e) => setTiktok(e.trim())}
                            value={tiktok}
                            // autoFocus
                            placeholder={authUser.tiktok ? authUser.tiktok : "https://tiktok.com/@tiktokID"}
                            style={{ flex: 1, paddingVertical: 8, paddingHorizontal: 8, fontSize: 18 }}
                        />
                    </View>
                    <View style={{ width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 10 }}>
                        <Text style={{ paddingLeft: 8, paddingTop: 8, fontSize: 15, fontWeight: "600" }}>X</Text>
                        <TextInput
                            textAlignVertical="top"
                            multiline={false}
                            onChangeText={(e) => setX(e.trim())}
                            value={x}
                            // autoFocus
                            placeholder={authUser.x ? authUser.x : "https://x.com/xID"}
                            style={{ flex: 1, paddingVertical: 8, paddingHorizontal: 8, fontSize: 18 }}
                        />
                    </View>
                    <Overlay overlayStyle={{ backgroundColor: "#fff" }} isVisible={loading}>
                        <View style={{ width: 300 }}>
                            <Text style={{ textAlign: "center", fontSize: 20 }}>Đang sửa thông tin</Text>
                            <Button loadingProps={{ size: "large" }} loading type="clear" />
                        </View>
                    </Overlay>
                </View>
            </ScrollView>
        </View>
    );
};

export default EditProfile;
