import { View, StyleSheet, TextInput, Keyboard, Alert } from "react-native";

import ActionSheet, { useSheetPayload } from "react-native-actions-sheet";
import { Button, Overlay } from "@rneui/themed";
import { SheetManager } from "react-native-actions-sheet";
import { useState } from "react";
import FastImage from "react-native-fast-image";
import { Text } from "@rneui/base";

import AntDesign from "@expo/vector-icons/AntDesign";

import { updateBlog } from "@/components/firebase/service";
function EditBlogSheet() {
    const [loading, setLoading] = useState(false);
    const oldData = useSheetPayload("EditBlogSheet");
    const [text, setText] = useState(oldData?.blogData.post.normalText);

    const handleUpdateBlog = async () => {
        setLoading(true);

        const searchKeywords = text
            .trim()
            .toUpperCase()
            .split(/[ \n]+/);
        const updateData = await updateBlog(oldData.blogId, {
            "post.content": text.trim(),
            "post.searchKeywords": searchKeywords,
            "post.normalText": text.trim(),
        });
        if (updateData) {
            Keyboard.dismiss();
            SheetManager.hide("EditBlogSheet");
            SheetManager.hide("SheetOption");
            setLoading(false);
        } else {
            Alert.alert("Đã xảy ra lỗi", "Lỗi cập nhật nội dung.", [
                {
                    text: "OK",
                    onPress: () => console.log("Lỗi cập nhật nội dung."),
                },
            ]);
        }
    };

    return (
        <ActionSheet
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
                    <Text style={{ fontSize: 17, fontWeight: "bold" }}>Sửa nội dung bài viết</Text>
                    <View style={{ width: 50, height: 50 }}>
                        <Button
                            title="Hủy"
                            onPress={() => SheetManager.hide("EditBlogSheet")}
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
                                    uri: oldData?.authUser.photoURL,
                                    priority: FastImage.priority.low,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                            <View>
                                <Text style={styles.headerText}>{oldData?.authUser.displayName}</Text>
                                <Text style={{ fontSize: 14, marginLeft: 6, color: "#999" }}>Sửa bài viết</Text>
                            </View>
                        </View>
                    </View>
                    <TextInput
                        textAlignVertical="top"
                        onChangeText={(e) => setText(e)}
                        multiline={true}
                        numberOfLines={4}
                        defaultValue={oldData?.blogData.post.normalText}
                        placeholder="Nội dung mới"
                        style={styles.textarea}
                    />
                    <View style={styles.container}>
                        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
                            <View style={{ width: 50, height: 50, borderRadius: 9999, padding: 0 }}></View>
                            <View style={{ width: 50, height: 50, borderRadius: 9999, padding: 0 }}>
                                <Button disabled={!text || text === oldData?.blogData.post.normalText} onPress={handleUpdateBlog} type="solid" radius={9999}>
                                    <AntDesign name="arrowright" size={24} color="white" />
                                </Button>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <Overlay isVisible={loading}>
                <View style={{ width: 300 }}>
                    <Text style={{ textAlign: "center", fontSize: 20 }}>Đang sửa bài viết</Text>
                    <Button loadingProps={{ size: "large" }} loading type="clear" />
                </View>
            </Overlay>
        </ActionSheet>
    );
}

export default EditBlogSheet;
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
