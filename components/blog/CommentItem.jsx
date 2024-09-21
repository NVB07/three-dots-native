import firestore from "@react-native-firebase/firestore";
import { View, Text } from "react-native";
import { Link } from "expo-router";
import { Button } from "@rneui/themed";
import FastImage from "react-native-fast-image";
import { Dialog } from "@rneui/themed";
import { useEffect, useState } from "react";
import { deleteComment } from "../firebase/service";

import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

const CommentItem = ({ comment, authUser, blogId, author }) => {
    const [visible2, setVisible2] = useState(false);
    const [userComment, setuserComment] = useState(null);

    useEffect(() => {
        if (comment.uid) {
            const subscriber = firestore()
                .collection("users")
                .doc(comment.uid)
                .onSnapshot((documentSnapshot) => {
                    if (documentSnapshot.exists) {
                        const data = documentSnapshot.data();
                        setuserComment(data);
                    }
                });
            return subscriber;
        }
    }, [comment.uid]);

    const toggleDialog2 = () => {
        setVisible2(!visible2);
    };

    const handleDeleteComment = async () => {
        await deleteComment(blogId, comment.id);
        setVisible2(false);
    };
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
        <View style={{ marginVertical: 8 }}>
            <View style={{ flexDirection: "row" }}>
                <View style={{ height: "100%" }}>
                    <Link href={`/userid/${userComment?.uid}`}>
                        <FastImage
                            style={{ width: 36, height: 36, borderRadius: 9999 }}
                            source={{
                                uri: userComment?.photoURL,
                                priority: FastImage.priority.low,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                    </Link>
                </View>
                <View style={{ marginLeft: 4, paddingHorizontal: 12, paddingVertical: 4, paddingBottom: 8, backgroundColor: "#dcdcdc", borderRadius: 15, width: "90%" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <View>
                            <Link href={`/userid/${userComment?.uid}`}>
                                <Text style={{ fontSize: 16, fontWeight: "500" }}>{userComment?.displayName}</Text>
                            </Link>
                            <Text style={{ fontSize: 13, color: "#999" }}>{handleConvertDate(comment?.sendTime)}</Text>
                        </View>
                        {(authUser.uid === comment.uid || authUser.uid === author.uid) && (
                            <View>
                                <Button type="clear" radius={9999} onPress={toggleDialog2} buttonStyle={{ width: 34, height: 34 }}>
                                    <SimpleLineIcons name="options" size={14} color="black" />
                                </Button>
                                <Dialog isVisible={visible2} onBackdropPress={toggleDialog2}>
                                    <Dialog.Title title="Tùy chọn" />
                                    <Button type="outline" onPress={handleDeleteComment} buttonStyle={{ marginBottom: 8 }} titleStyle={{ color: "red" }} radius={"md"}>
                                        Xóa bình luận
                                    </Button>
                                    <Button onPress={toggleDialog2} type="outline" radius={"md"}>
                                        Đóng
                                    </Button>
                                </Dialog>
                            </View>
                        )}
                    </View>
                    <Text>{comment.comment.replace(/\|\~n\|/g, "\n")}</Text>
                </View>
            </View>
        </View>
    );
};

export default CommentItem;
