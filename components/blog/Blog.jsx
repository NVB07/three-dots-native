import firestore from "@react-native-firebase/firestore";
import { Link } from "expo-router";
import { StyleSheet, Text, View, ImageBackground, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import Option from "./Option";
import FastImage from "react-native-fast-image";
import CountReact from "./CountReact";
import { Button } from "@rneui/base";

const Blog = ({ blogId, authUser }) => {
    const [blogData, setBlogData] = useState(null);
    const [authorData, setAuthorData] = useState(); // dữ liệu cá nhân tác giả
    const [isMyBlog, setIsMyBlog] = useState(false);

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
        const subscriber = firestore()
            .collection("blogs")
            .doc(blogId)
            .onSnapshot((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    const data = documentSnapshot.data();
                    setBlogData(data);
                }
            });
        return () => subscriber();
    }, [blogId]);

    useEffect(() => {
        if (blogData?.author.uid) {
            setIsMyBlog(authUser.uid === blogData.author.uid);
            // console.log(authUser.uid === blogData.author.uid);

            const subscriber = firestore()
                .collection("users")
                .doc(blogData?.author.uid)
                .onSnapshot((documentSnapshot) => {
                    if (documentSnapshot.exists) {
                        setAuthorData(documentSnapshot.data());
                    }
                });
            return () => subscriber();
        }
    }, [blogData?.author.uid]);

    return (
        <Text style={styles.main}>
            <View style={styles.blog}>
                <View style={styles.avatar}>
                    {authorData?.photoURL && (
                        <Link href={`/user/${authorData?.uid}`}>
                            <FastImage
                                style={{ width: 36, height: 36, borderRadius: 9999 }}
                                source={{
                                    uri: authorData?.photoURL,
                                    priority: FastImage.priority.low,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </Link>
                    )}
                </View>
                <View style={styles.rightContent}>
                    <View style={styles.header}>
                        <View>
                            <Link href={`/user/${authorData?.uid}`}>
                                <Text style={styles.userName}>{authorData?.displayName}</Text>
                            </Link>
                            <Text style={styles.postTime}>{blogData?.createAt && handleConvertDate(blogData?.createAt)}</Text>
                        </View>
                        <Option isMyBlog={isMyBlog} authUser={authUser} blogData={blogData} blogId={blogId} />
                    </View>
                    {blogData?.post.content && <Text style={styles.content}>{blogData?.post.normalText}</Text>}

                    {blogData?.post.imageURL && (
                        <View style={styles.imageContainer}>
                            <ImageBackground source={require("@/assets/images/background.jpg")} style={styles.imageBackground}>
                                <FastImage
                                    style={{ width: "100%", height: "100%", padding: 0, maxHeight: 350 }}
                                    overflow="hidden"
                                    source={{
                                        uri: blogData?.post.imageURL,
                                        priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.contain}
                                />
                            </ImageBackground>
                        </View>
                    )}
                    <View style={{ marginTop: 20 }}>
                        <CountReact authUser={authUser} blogId={blogId} blogData={blogData} authorData={authorData} />
                    </View>
                </View>
            </View>
        </Text>
    );
};

export default Blog;
const styles = StyleSheet.create({
    main: {
        paddingTop: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderColor: "#ccc",
        flexDirection: "row",
        overflow: "hidden",
        position: "relative",
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
        width: 350,
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
        height: 350,
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    imageBackground: {
        width: "100%",
        height: 350,
    },
    image: {
        flex: 1,
        resizeMode: "contain",
    },
});
