import { View, Text, ScrollView, TextInput } from "react-native";
import HeaderBack from "@/components/headerBack/HeaderBack";
import { useState, useEffect, useContext } from "react";
import FastImage from "react-native-fast-image";
import { addComment } from "../../firebase/service";
import firestore from "@react-native-firebase/firestore";
import CountReact from "../../blog/CountReact";
import CommentItem from "../../blog/CommentItem";
import { Button } from "@rneui/base";
import { Ionicons } from "@expo/vector-icons";

const BlogPage = ({ blogid, blogData, author, comment, imageSize, authUser }) => {
    const [commentValue, setCommentValue] = useState("");
    const [commentSnapshot, setCommentSnapshot] = useState([]);

    const handleAddComment = async () => {
        await addComment(blogid, commentValue, authUser);
        setCommentValue("");
    };

    useEffect(() => {
        const unsubscribe = firestore()
            .collection("blogs")
            .doc(blogid)
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
    }, [blogid]);

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
        <View style={{ flex: 1, position: "relative" }}>
            <HeaderBack title={"Bài viết của " + author.displayName} />
            <View style={{ paddingBottom: 90 }}>
                <ScrollView style={{ paddingHorizontal: 12 }}>
                    <View style={{ borderBottomWidth: 1, borderBottomColor: "#ccc", paddingBottom: 10 }}>
                        <View style={{ flexDirection: "row", paddingTop: 10 }}>
                            <FastImage
                                style={{ width: 36, height: 36, borderRadius: 9999 }}
                                source={{
                                    uri: author?.photoURL,
                                    priority: FastImage.priority.low,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                            <View style={{ marginLeft: 4 }}>
                                <Text style={{ fontSize: 16, fontWeight: "600" }}>{author.displayName}</Text>
                                <Text style={{ fontSize: 13, color: "#999" }}>{handleConvertDate(blogData.createAt)}</Text>
                            </View>
                        </View>
                        {blogData.post.content && <Text style={{ fontSize: 16, marginBottom: 4 }}>{blogData.post.normalText}</Text>}
                        {blogData.post.imageURL && (
                            <View style={{ width: 385, height: imageSize.height, marginBottom: 10 }}>
                                <FastImage
                                    style={{ width: "100%", height: "100%", padding: 0, borderRadius: 8 }}
                                    overflow="hidden"
                                    source={{
                                        uri: blogData.post.imageURL,
                                        priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.contain}
                                />
                            </View>
                        )}
                        <CountReact showSheet authUser={authUser} blogId={blogid} />
                    </View>
                    {commentSnapshot.map((item, index) => {
                        return <CommentItem key={index} comment={item} authUser={authUser} blogId={blogid} />;
                    })}
                </ScrollView>
            </View>
            <View
                style={{
                    width: "100%",
                    paddingHorizontal: 12,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: "absolute",
                    bottom: 0,
                }}
            >
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: "#ccc",
                        borderRadius: 99999,
                        marginBottom: 8,
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
                        // autoFocus
                        placeholder="Bình luận"
                        style={{ height: 35, flex: 1, paddingVertical: 8, paddingHorizontal: 8 }}
                    />
                </View>
                <View>
                    <Button
                        disabled={commentValue.trim() === ""}
                        radius={9999}
                        onPress={handleAddComment}
                        buttonStyle={{ width: 38, height: 38, backgroundColor: "#007DFDFF", marginBottom: 8 }}
                    >
                        <Ionicons name="send" size={20} color="#fff" />
                    </Button>
                </View>
            </View>
        </View>
    );
};

export default BlogPage;
