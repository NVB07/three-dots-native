import React from "react";
import { Text, View, StyleSheet, Alert } from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import ActionSheet, { useSheetPayload, SheetManager } from "react-native-actions-sheet";
import { Button } from "@rneui/themed";

import AntDesign from "@expo/vector-icons/AntDesign";
import Fontisto from "@expo/vector-icons/Fontisto";
import { deleteBlog } from "../firebase/service";

function SheetOption() {
    const sheetData = useSheetPayload("SheetOption");
    const imageBlog = sheetData.blogData.post.imageURL;

    const getPathImage = (imageBlog) => {
        if (imageBlog) {
            const startIndex = imageBlog.lastIndexOf("/") + 1;
            const endIndex = imageBlog.indexOf("?alt=");
            const encodedImagePath = imageBlog.substring(startIndex, endIndex);

            const imagePath = decodeURIComponent(encodedImagePath).startsWith("imagePostBlogs") ? decodeURIComponent(encodedImagePath) : null;
            return imagePath;
        }
        return null;
    };

    const handleDeleteBlog = () => {
        SheetManager.hide("SheetOption");
        Alert.alert("Xóa bài viết", "Việc xóa bài viết sẽ không thể khôi phục trong tương lai. Bạn có chắc muốn xóa ?", [
            {
                text: "Hủy",
                onPress: () => console.log("Đã hủy"),
                style: "cancel",
            },
            {
                text: "Xóa",
                onPress: async () => {
                    await deleteBlog(sheetData.blogId, getPathImage(imageBlog));
                },
            },
        ]);
    };

    const handleCoppyLink = async () => {
        try {
            await Clipboard.setString("https://three-dots.vercel.app/blog/" + sheetData.blogId);
            Alert.alert("Sao chép liên kết thành công!");
            SheetManager.hide("SheetOption");
        } catch (error) {
            Alert.alert("Lỗi", "Không thể sao chép ");
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
                    paddingBottom: 10,
                }}
            >
                <Text style={styles.title}>Tùy chọn</Text>
                <View style={styles.buttonGroup}>
                    {sheetData?.isMyBlog && (
                        <Button
                            title="Sửa nội dung bài viết"
                            icon={<AntDesign name="edit" size={18} color="black" />}
                            iconPosition="left"
                            radius="md"
                            type="clear"
                            buttonStyle={styles.buttonItem}
                            titleStyle={styles.titleStyle}
                            onPress={() =>
                                SheetManager.show("EditBlogSheet", {
                                    payload: { authUser: sheetData.authUser, blogData: sheetData.blogData, blogId: sheetData.blogId },
                                })
                            }
                        />
                    )}
                    <Button
                        title="Sao chép liên kết"
                        icon={<AntDesign name="link" size={18} color="black" />}
                        iconPosition="left"
                        radius="md"
                        type="clear"
                        onPress={handleCoppyLink}
                        buttonStyle={styles.buttonItem}
                        titleStyle={styles.titleStyle}
                    />
                    {sheetData?.isMyBlog && (
                        <Button
                            title="Xóa bài viết"
                            icon={<AntDesign name="delete" size={18} color="red" />}
                            iconPosition="left"
                            radius="md"
                            type="clear"
                            onPress={handleDeleteBlog}
                            buttonStyle={styles.buttonItem}
                            titleStyle={styles.titleStyleDel}
                        />
                    )}
                    <Button
                        title="Đóng"
                        icon={<Fontisto name="close-a" size={16} color="black" />}
                        iconPosition="left"
                        radius="md"
                        onPress={() => SheetManager.hide("SheetOption")}
                        type="clear"
                        buttonStyle={styles.buttonItem}
                        titleStyle={styles.titleStyle}
                    />
                </View>
            </View>
        </ActionSheet>
    );
}

export default SheetOption;
const styles = StyleSheet.create({
    title: {
        paddingTop: 8,
        paddingBottom: 4,
        marginBottom: 8,
        fontSize: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
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
});
