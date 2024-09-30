import { View, StyleSheet, TextInput, Keyboard } from "react-native";
import storage from "@react-native-firebase/storage";
import ActionSheet, { useSheetPayload } from "react-native-actions-sheet";
import { Button, Overlay } from "@rneui/themed";
import { SheetManager } from "react-native-actions-sheet";
import { useState } from "react";
import FastImage from "react-native-fast-image";
import { Text } from "@rneui/base";
import * as ImagePicker from "expo-image-picker";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";

import { addBlog } from "@/components/firebase/service";
function NewBlogSheet() {
    const [text, setText] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const payload = useSheetPayload("NewBlogSheet");

    const uploadImageToStorage = async (imageUri) => {
        const fileName = imageUri.split("/").pop(); // Lấy tên file từ URI
        const reference = storage().ref(`imagePostBlogs/${fileName}`);

        try {
            await reference.putFile(imageUri);
            const url = await reference.getDownloadURL();
            return url;
        } catch (error) {
            console.error("Error uploading image:", error);
            return null;
        }
    };

    const pickImage = async () => {
        Keyboard.dismiss();
        if (image) {
            setImage(null);
        }
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            Keyboard.dismiss();
            setImage(result.assets[0].uri);
            console.log(result.assets[0].uri);
        }
    };
    const removeImage = () => {
        setImage(null);
    };
    const handleAddBlog = async () => {
        setLoading(true);
        let imageUrl = "";
        if (image) {
            imageUrl = await uploadImageToStorage(image);
        }
        const searchKeywords = text
            .trim()
            .toUpperCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/Đ/g, "D")
            .split(/[ \n]+/);

        console.log(searchKeywords);

        const addData = await addBlog({
            author: {
                uid: payload?.uid,
            },
            post: {
                content: text,
                searchKeywords: searchKeywords,
                normalText: text,
                imageURL: imageUrl,
            },
        });
        if (addData) {
            Keyboard.dismiss();
            SheetManager.hide("NewBlogSheet");
            setLoading(false);
        }
    };

    return (
        <ActionSheet
            keyboardHandlerEnabled={false}
            gestureEnabled={true}
            indicatorStyle={{
                width: 100,
            }}
        >
            <View
                style={{
                    paddingHorizontal: 12,
                    paddingTop: 0,
                    height: "95%",
                }}
            >
                <View style={{ width: "100%", justifyContent: "space-between", display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ fontSize: 17, fontWeight: "bold" }}>Bài viết mới</Text>
                    <View style={{ width: 50, height: 50 }}>
                        <Button
                            title="Hủy"
                            onPress={() => SheetManager.hide("NewBlogSheet")}
                            titleStyle={{ color: "red" }}
                            iconPosition="left"
                            radius="md"
                            type="clear"
                        />
                    </View>
                </View>
                <View style={styles.buttonGroup}>
                    <View style={{ paddingBottom: 8 }}>
                        <View style={styles.newBlogAction}>
                            <FastImage
                                style={styles.avatar}
                                source={{
                                    uri: payload?.photoURL,
                                    priority: FastImage.priority.low,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                            <View>
                                <Text style={styles.headerText}>{payload?.displayName}</Text>
                                <Text style={{ fontSize: 14, marginLeft: 6, color: "#999" }}>Tạo bài viết</Text>
                            </View>
                        </View>
                    </View>
                    <TextInput
                        textAlignVertical="top"
                        onChangeText={(e) => setText(e)}
                        multiline={true}
                        numberOfLines={4}
                        placeholder="Có gì mới?"
                        style={styles.textarea}
                    />
                    <View style={styles.container}>
                        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
                            <View style={{ width: 50, height: 50, borderRadius: 9999, padding: 0 }}>
                                <Button type="clear" radius={9999} onPress={pickImage}>
                                    <FontAwesome name="image" size={24} color={loading ? "gray" : "green"} />
                                </Button>
                            </View>
                            <View style={{ width: 50, height: 50, borderRadius: 9999, padding: 0 }}>
                                <Button disabled={!text && !image} type="solid" radius={9999} onPress={handleAddBlog}>
                                    <AntDesign name="arrowright" size={24} color="white" />
                                </Button>
                            </View>
                        </View>
                        {image && (
                            <View style={{ position: "relative", top: 0, left: 0, paddingHorizontal: 20, paddingVertical: 20 }}>
                                <FastImage source={{ uri: image, priority: FastImage.priority.normal }} style={styles.image} />
                                <View style={{ position: "absolute", top: 5, right: 5, width: 40, height: 50, borderRadius: 9999 }}>
                                    <Button title="X" radius={9999} color="warning" onPress={removeImage} />
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </View>
            <Overlay isVisible={loading}>
                <View style={{ width: 300 }}>
                    <Text style={{ textAlign: "center", fontSize: 20 }}>Đang đăng bài viết</Text>
                    <Button loadingProps={{ size: "large" }} loading type="clear" />
                </View>
            </Overlay>
        </ActionSheet>
    );
}

export default NewBlogSheet;
const styles = StyleSheet.create({
    buttonGroup: {
        backgroundColor: "#f3f3f3",
        padding: 4,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 15,
    },
    buttonItem: {
        width: "100%",
        justifyContent: "flex-start", // Căn chỉnh nội dung về phía trái
        paddingHorizontal: 10, // Đảm bảo đủ khoảng cách giữa icon và chữ
    },
    titleStyle: {
        color: "#000",
        textAlign: "left",
        marginLeft: 10, // Khoảng cách giữa icon và chữ
    },
    titleStyleDel: {
        color: "red",
        marginLeft: 10,
        textAlign: "left",
        width: "100%",
    },
    textarea: {
        borderWidth: 0,
        maxHeight: 100,
        fontSize: 16,
    },
    newBlogAction: {
        width: "100%",
        flexDirection: "row",
    },
    avatar: {
        backgroundColor: "yellow",
        width: 36,
        height: 36,
        borderRadius: 9999,
    },
    headerText: {
        fontSize: 16,
        marginLeft: 6,
        fontWeight: "bold",
    },
    container: {},
    image: {
        width: "100%",
        height: 300,
    },
});
