import React from "react";
import { View, ImageBackground, Text, Pressable, TextInput, Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import { Button } from "@rneui/themed";
import ActionSheet, { ScrollView, useSheetPayload, SheetManager } from "react-native-actions-sheet";
import FastImage from "react-native-fast-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import CountReact from "./CountReact";
import { useEffect, useState } from "react";
import CommentItem from "./CommentItem";
import firestore from "@react-native-firebase/firestore";
import { addComment } from "../firebase/service";

function SheetComments() {
    const sheetData = useSheetPayload("SheetComments");

    const [inputPosition, setInputPosition] = useState(0);
    const [commentValue, setCommentValue] = useState("");
    const [commentSnapshot, setCommentSnapshot] = useState([]);

    const handleAddComment = async () => {
        await addComment(sheetData.blogId, commentValue, sheetData.authUser);
        setCommentValue("");
    };

    useEffect(() => {
        const unsubscribe = firestore()
            .collection("blogs")
            .doc(sheetData.blogId)
            .collection("comments")
            .orderBy("sendTime", "desc")
            .onSnapshot(
                (querySnapshot) => {
                    if (!querySnapshot.empty) {
                        const commentsData = querySnapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data(),
                        }));

                        setCommentSnapshot(commentsData);
                    } else {
                        setCommentSnapshot([]);
                    }
                },
                (error) => {
                    console.error("Error fetching comments: ", error);
                }
            );

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
            setInputPosition(Platform.OS === "ios" ? 0 : 312);
        });
        const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
            setInputPosition(0);
        });

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    const handleConvertDate = (timestamp) => {
        if (timestamp) {
            const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);

            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hours = date.getHours();
            const minutes = date.getMinutes();

            const time = `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes} | ${day < 10 ? "0" + day : day}/${
                month < 10 ? "0" + month : month
            }/${year}`;

            return time;
        }
        return "00:00";
    };

    return (
        <ActionSheet
            keyboardHandlerEnabled={false}
            springOffset={300}
            gestureEnabled={true}
            indicatorStyle={{
                width: 100,
            }}
        >
            <View style={{ height: "100%", position: "relative", paddingBottom: inputPosition }}>
                <View style={{ paddingHorizontal: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>Bài viết của {sheetData?.authorData.displayName}</Text>
                    <View style={{ width: 60 }}>
                        <Button buttonStyle={{ padding: 0 }} type="clear" onPress={() => SheetManager.hide("SheetComments")} radius={"lg"} titleStyle={{ color: "red" }}>
                            Đóng
                        </Button>
                    </View>
                </View>
                <ScrollView
                    contentContainerStyle={{
                        paddingHorizontal: 12,
                        paddingTop: 0,
                    }}
                >
                    <View style={{ paddingVertical: 4, borderBottomWidth: 1, borderColor: "#ccc" }}>
                        <View style={{ flexDirection: "row" }}>
                            <FastImage
                                style={{ width: 36, height: 36, borderRadius: 9999 }}
                                source={{
                                    uri: sheetData?.authorData.photoURL,
                                    priority: FastImage.priority.low,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                            <View style={{ marginLeft: 4 }}>
                                <Text style={{ fontSize: 16, fontWeight: "500" }}>{sheetData?.authorData.displayName}</Text>
                                <Text style={{ fontSize: 13, color: "#999" }}>{handleConvertDate(sheetData?.blogData.createAt)}</Text>
                            </View>
                        </View>
                        {sheetData?.blogData.post.content && <Text style={{ fontSize: 16, marginBottom: 2 }}>{sheetData?.blogData.post.normalText}</Text>}
                        {sheetData?.blogData.post.imageURL && (
                            <View style={{ width: "100%", height: 350, marginBottom: 10 }}>
                                <ImageBackground source={require("@/assets/images/background.jpg")} style={{ width: "100%", height: 350 }}>
                                    <FastImage
                                        style={{ width: "100%", height: "100%", padding: 0, maxHeight: 350 }}
                                        overflow="hidden"
                                        source={{
                                            uri: sheetData?.blogData.post.imageURL,
                                            priority: FastImage.priority.normal,
                                        }}
                                        resizeMode={FastImage.resizeMode.contain}
                                    />
                                </ImageBackground>
                            </View>
                        )}
                        <CountReact showSheet authUser={sheetData.authUser} blogId={sheetData.blogId} />
                    </View>
                    {commentSnapshot.map((item, index) => {
                        return <CommentItem key={index} comment={item} authUser={sheetData.authUser} blogId={sheetData.blogId} />;
                    })}
                </ScrollView>
                <View
                    style={{
                        backgroundColor: "#fff",
                        width: "100%",
                        paddingHorizontal: 12,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            borderWidth: 1,
                            borderColor: "#ccc",
                            borderRadius: 99999,
                            flexDirection: "row",
                            alignItems: "center",
                            width: "87%",
                            justifyContent: "space-between",
                        }}
                    >
                        <TextInput
                            textAlignVertical="top"
                            multiline={false}
                            onChangeText={(e) => setCommentValue(e)}
                            value={commentValue}
                            autoFocus
                            placeholder="Bình luận"
                            style={{ height: 35, flex: 1, paddingVertical: 8, paddingHorizontal: 8 }}
                        />
                    </View>
                    <View>
                        <Button
                            disabled={commentValue.trim() === ""}
                            radius={9999}
                            onPress={handleAddComment}
                            buttonStyle={{ width: 38, height: 38, backgroundColor: "#007DFDFF" }}
                        >
                            <Ionicons name="send" size={20} color="#fff" />
                        </Button>
                    </View>
                </View>
            </View>
        </ActionSheet>
    );
}

export default SheetComments;
