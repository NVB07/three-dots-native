import { Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, useEffect } from "react";
import firestore from "@react-native-firebase/firestore";
import { SheetManager } from "react-native-actions-sheet";

const CountReact = ({ authUser, blogId, blogData, authorData, showSheet = false }) => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [countComment, setCountComment] = useState(0);
    const [comments, setComments] = useState();

    useEffect(() => {
        if (blogId) {
            const unsubscribe = firestore()
                .collection("blogs")
                .doc(blogId)
                .onSnapshot((documentSnapshot) => {
                    if (documentSnapshot.exists) {
                        const data = documentSnapshot.data();
                        setLikeCount(data.liked?.length);
                        setLiked(
                            data?.liked?.find((uid) => {
                                return uid === authUser?.uid;
                            })
                        );
                    }
                });
            return () => unsubscribe();
        }
    }, [blogId]);
    useEffect(() => {
        if (blogId) {
            const unsubscribe = firestore()
                .collection("blogs")
                .doc(blogId)
                .collection("comments")
                .orderBy("sendTime", "desc")
                .onSnapshot(
                    (querySnapshot) => {
                        if (!querySnapshot.empty) {
                            const commentsData = querySnapshot.docs.map((doc) => ({
                                id: doc.id,
                                ...doc.data(),
                            }));

                            setCountComment(commentsData.length);
                            setComments(commentsData);
                        } else {
                            setCountComment(0);
                            setComments([]);
                        }
                    },
                    (error) => {
                        console.error("Error fetching comments: ", error);
                    }
                );

            return () => unsubscribe();
        }
    }, [blogId]);

    const handleLikePost = () => {
        setLiked((prev) => {
            firestore()
                .collection("blogs")
                .doc(blogId)
                .update({
                    liked: !prev ? firestore.FieldValue.arrayUnion(authUser.uid) : firestore.FieldValue.arrayRemove(authUser.uid),
                });
            !prev;
        });
    };

    return (
        <View>
            <View style={{ flexDirection: "row" }}>
                <View style={{ height: 24, width: 24, marginBottom: 4 }}>
                    <Pressable type="clear" onPress={handleLikePost} radius={"sm"} style={{}}>
                        {liked ? <Ionicons name="heart-sharp" size={24} color={"red"} /> : <Ionicons name="heart-outline" size={24} color={"#333"} />}
                    </Pressable>
                </View>
                {!showSheet && (
                    <View style={{ height: 24, width: 24, marginBottom: 4, marginLeft: 8 }}>
                        <Pressable
                            type="clear"
                            onPress={() => SheetManager.show("SheetComments", { payload: { blogData, blogId, comments, authorData, authUser } })}
                            radius={"sm"}
                            style={{}}
                        >
                            <Ionicons name="chatbubble-outline" size={22} color={"#333"} />
                        </Pressable>
                    </View>
                )}
            </View>
            <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ color: "#999" }}>{likeCount} lượt thích,</Text>
                <Text style={{ color: "#999" }}> {countComment} bình luận</Text>
            </View>
        </View>
    );
};

export default CountReact;
