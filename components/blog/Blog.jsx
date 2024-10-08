import firestore from "@react-native-firebase/firestore";
import { Link } from "expo-router";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import Option from "./Option";
import FastImage from "react-native-fast-image";
import CountReact from "./CountReact";
import { Skeleton } from "@rneui/themed";
import { useRouter } from "expo-router";

const Blog = ({ blogId, authUser, inMyUserPage = false }) => {
    const router = useRouter();
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

    const [blogData, setBlogData] = useState(null);
    const [authorData, setAuthorData] = useState(); // dữ liệu cá nhân tác giả
    const [isMyBlog, setIsMyBlog] = useState(false);
    const [comments, setComments] = useState();
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        if (blogData?.post.imageURL) {
            Image.getSize(
                blogData.post.imageURL,
                (width, height) => {
                    setImageSize({ width: 350, height: (height / width) * 385 });
                },
                (error) => {
                    console.error("Error getting image size:", error);
                }
            );
        }
    }, [blogData?.post.imageURL]);

    useEffect(() => {
        const unsubscribeComment = firestore()
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
                        setComments(commentsData);
                    } else {
                        setComments([]);
                    }
                },
                (error) => {
                    console.error("Error fetching comments: ", error);
                }
            );
        const subscriberBlogData = firestore()
            .collection("blogs")
            .doc(blogId)
            .onSnapshot((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    const data = documentSnapshot.data();
                    setBlogData(data);
                }
            });
        return () => {
            subscriberBlogData();
            unsubscribeComment();
        };
    }, [blogId]);

    useEffect(() => {
        if (blogData?.author.uid) {
            setIsMyBlog(authUser.uid === blogData.author.uid);

            const subscriber = firestore()
                .collection("users")
                .doc(blogData?.author.uid)
                .onSnapshot((documentSnapshot) => {
                    if (documentSnapshot.exists) {
                        setAuthorData(documentSnapshot.data());
                        setLoading(false);
                    }
                });
            return () => subscriber();
        }
    }, [blogData?.author.uid]);

    return (
        <Text style={styles.main}>
            <View style={styles.blog}>
                <View style={styles.avatar}>
                    {authorData?.photoURL ? (
                        <Link href={!inMyUserPage ? `/userid/${authorData?.uid}` : ""}>
                            <FastImage
                                style={{ width: 36, height: 36, borderRadius: 9999 }}
                                source={{
                                    uri: authorData?.photoURL,
                                    priority: FastImage.priority.low,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </Link>
                    ) : (
                        <Skeleton animation="wave" circle width={36} height={36} />
                    )}
                </View>
                <View style={styles.rightContent}>
                    <View style={styles.header}>
                        <View>
                            {authorData?.displayName ? (
                                <Link href={!inMyUserPage ? `/userid/${authorData?.uid}` : ""}>
                                    <Text style={styles.userName}>{authorData?.displayName}</Text>
                                </Link>
                            ) : (
                                <Skeleton animation="wave" width={100} height={22} />
                            )}
                            <Text style={styles.postTime}>{blogData?.createAt && handleConvertDate(blogData?.createAt)}</Text>
                        </View>
                        <Option isMyBlog={isMyBlog} authUser={authUser} blogData={blogData} blogId={blogId} />
                    </View>
                    <Pressable
                        style={{ width: "100%" }}
                        onPress={() =>
                            router.push({
                                pathname: "/blogid/" + blogId,
                                params: {
                                    data: blogData ? encodeURIComponent(JSON.stringify(blogData)) : null,
                                    author: authorData ? encodeURIComponent(JSON.stringify(authorData)) : null,
                                    authUser: authUser ? encodeURIComponent(JSON.stringify(authUser)) : null,
                                    comments: comments ? encodeURIComponent(JSON.stringify(comments)) : null,
                                    imageSize: imageSize ? encodeURIComponent(JSON.stringify(imageSize)) : null,
                                },
                            })
                        }
                    >
                        {blogData?.post.content &&
                            (!loading ? (
                                <Text style={styles.content}>{blogData?.post.normalText}</Text>
                            ) : (
                                <Skeleton animation="wave" width={150} height={18} style={{ marginBottom: 4 }} />
                            ))}

                        {blogData?.post.imageURL &&
                            (!loading ? (
                                <View style={styles.imageContainer}>
                                    <FastImage
                                        style={{ width: "100%", height: "100%", padding: 0, maxHeight: 320, borderRadius: 8 }}
                                        overflow="hidden"
                                        source={{
                                            uri: blogData?.post.imageURL,
                                            priority: FastImage.priority.normal,
                                        }}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />
                                </View>
                            ) : (
                                <Skeleton animation="wave" style={{ width: "100%", height: 320 }} />
                            ))}
                    </Pressable>
                    <View style={{ marginTop: 20 }}>
                        <CountReact authUser={authUser} blogId={blogId} blogData={blogData} authorData={authorData} imageSize={imageSize} comments={comments} />
                    </View>
                </View>
            </View>
        </Text>
    );
};

export default Blog;
const styles = StyleSheet.create({
    main: {
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#ccc",
        flexDirection: "row",
        overflow: "hidden",
        position: "relative",
        marginBottom: 12,
        backgroundColor: "rgba(255,255,255,0.8)",
    },
    blog: {
        flex: 2,
        flexDirection: "row",
    },
    avatar: {
        display: "flex",
        width: 36,
    },
    avatarImage: {
        width: 32,
        height: 32,
        borderRadius: 99999,
    },
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between", // Đẩy các phần tử về hai đầu
        alignItems: "center",
    },
    rightContent: {
        width: 320,
        marginLeft: 4,
        flex: 1,
    },
    userName: {
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 0,
    },
    postTime: {
        fontSize: 12,
        color: "#888",
    },
    buttonDialog: {
        marginRight: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,

        height: 32,
        borderRadius: 9999,
    },
    content: { fontSize: 16 },
    imageContainer: {
        marginTop: 6,
        flex: 1,
        width: "100%",
        height: 320,
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    imageBackground: {
        width: "100%",
        height: 320,
    },
    image: {
        flex: 1,
        resizeMode: "contain",
    },
});
