import { View, Text, Pressable, Image } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Button } from "@rneui/base";
import FastImage from "react-native-fast-image";

const SearchItem = ({ data, authUser, userResults }) => {
    const router = useRouter();
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [comments, setComments] = useState();
    const [author, setAuthor] = useState();

    useEffect(() => {
        const subscriber = firestore()
            .collection("users")
            .doc(data?.author.uid)
            .onSnapshot((documentSnapshot) => {
                setAuthor(documentSnapshot.data());
            });

        return () => subscriber();
    }, [data?.author.uid]);

    useEffect(() => {
        if (data?.post.imageURL) {
            Image.getSize(
                data.post.imageURL,
                (width, height) => {
                    setImageSize({ width: 350, height: (height / width) * 385 });
                },
                (error) => {
                    console.error("Error getting image size:", error);
                }
            );
        }
    }, [data?.post.imageURL]);
    useEffect(() => {
        const unsubscribeComment = firestore()
            .collection("blogs")
            .doc(data?.id)
            .collection("comments")
            .orderBy("sendTime", "desc")
            .onSnapshot(
                (querySnapshot) => {
                    if (!querySnapshot.empty) {
                        const commentsData = querySnapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data(),
                        }));
                        setComments(commentsData);
                    } else {
                        setComments([]);
                    }
                },
                (error) => {
                    console.error("Error fetching comments: ", error);
                }
            );
        return () => unsubscribeComment();
    }, [data?.id]);

    if (userResults) {
        return (
            <View style={{ width: "100%", marginVertical: 4 }}>
                <Pressable
                    onPress={() => router.push(`/userid/${userResults?.uid}`)}
                    style={({ pressed }) => [
                        {
                            backgroundColor: pressed ? "#C2C2C2FF" : "#E2E2E2FF",
                        },
                        { padding: 5, flexDirection: "row", borderRadius: 10 },
                    ]}
                >
                    <FastImage
                        style={{ width: 36, height: 36, borderRadius: 9999, marginRight: 6 }}
                        source={{
                            uri: userResults?.photoURL,
                            priority: FastImage.priority.low,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: 500 }}>{userResults?.displayName}</Text>

                        <Text style={{ color: "red" }}>Trang cá nhân</Text>
                    </View>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={{ width: "100%", marginVertical: 4 }}>
            <Pressable
                onPress={() =>
                    router.push({
                        pathname: "/blogid/" + data?.id,
                        params: {
                            data: data ? encodeURIComponent(JSON.stringify(data)) : null,
                            author: author ? encodeURIComponent(JSON.stringify(author)) : null,
                            authUser: authUser ? encodeURIComponent(JSON.stringify(authUser)) : null,
                            comments: comments ? encodeURIComponent(JSON.stringify(comments)) : null,
                            imageSize: imageSize ? encodeURIComponent(JSON.stringify(imageSize)) : null,
                        },
                    })
                }
                style={({ pressed }) => [
                    {
                        backgroundColor: pressed ? "#C2C2C2FF" : "#E2E2E2FF",
                    },
                    { padding: 5, flexDirection: "row", borderRadius: 10 },
                ]}
            >
                <FastImage
                    style={{ width: 36, height: 36, borderRadius: 9999, marginRight: 6 }}
                    source={{
                        uri: author?.photoURL,
                        priority: FastImage.priority.low,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: 500 }}>{author?.displayName}</Text>
                    {data?.post.normalText ? (
                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, flex: 1, color: "#555", fontStyle: "italic" }}>
                            {data?.post.normalText}
                        </Text>
                    ) : (
                        <Text style={{ color: "green" }}>-Ảnh-</Text>
                    )}
                </View>
            </Pressable>
        </View>
    );
};

export default SearchItem;
