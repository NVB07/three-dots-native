import React, { useState, useEffect, useContext, useCallback, memo } from "react";
import firestore from "@react-native-firebase/firestore";
import { StyleSheet, ScrollView, View, Text, Pressable, RefreshControl } from "react-native";
import FastImage from "react-native-fast-image";
// import auth from "@react-native-firebase/auth";
// import { ThemedText } from "../ThemedText";
import Blog from "@/components/blog/Blog";
import { SheetManager } from "react-native-actions-sheet";
import { AuthContext } from "@/components/context/AuthProvider";
function HomePage() {
    const { authUser } = useContext(AuthContext);
    const [blogs, setBlogs] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        firestore()
            .collection("blogs")
            .orderBy("createAt", "desc")
            .onSnapshot((querySnapshot) => {
                let blogTempArray = [];
                querySnapshot.forEach((documentSnapshot) => {
                    blogTempArray.push(documentSnapshot.id);
                });
                setBlogs(blogTempArray);
                setRefreshing(false);
            });
    }, []);

    useEffect(() => {
        const subscriber = firestore()
            .collection("blogs")
            .orderBy("createAt", "desc")
            .onSnapshot((querySnapshot) => {
                let blogTempArray = [];
                querySnapshot.forEach((documentSnapshot) => {
                    blogTempArray.push(documentSnapshot.id);
                });
                setBlogs(blogTempArray);
            });

        return () => subscriber();
    }, []);

    return (
        <View style={styles.main}>
            <ScrollView style={styles.scroll} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <View style={styles.header}>
                    <Pressable
                        type="clear"
                        onPress={() =>
                            SheetManager.show("NewBlogSheet", {
                                payload: authUser,
                            })
                        }
                        radius={"sm"}
                        style={({ pressed }) => [
                            {
                                backgroundColor: pressed ? "#C2C2C2FF" : "#D8D8D8FF",
                            },
                            styles.buttonNewBlog,
                        ]}
                    >
                        <View style={styles.newBlogAction}>
                            <FastImage
                                style={styles.avatar}
                                source={{
                                    uri: authUser?.photoURL,
                                    priority: FastImage.priority.low,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                            <View>
                                <Text style={styles.headerText}>{authUser?.displayName}</Text>
                                <Text style={{ color: "#999", marginLeft: 6 }}>Thêm bài viết</Text>
                            </View>
                        </View>
                    </Pressable>
                </View>

                {blogs.map((blogId, index) => {
                    return <MemoizedBlogs blogId={blogId} key={index} authUser={authUser} />;
                })}
                <View style={{ width: "100%", height: 20 }}></View>
            </ScrollView>
        </View>
    );
}
const MemoizedBlogs = memo(Blog);
export default HomePage;

const styles = StyleSheet.create({
    main: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(255,255,255,0.7)",
    },
    header: {
        backgroundColor: "#D8D8D8FF",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        marginBottom: 8,
    },
    buttonNewBlog: {
        flex: 1,
        borderRadius: 20,
        width: "100%",
        paddingVertical: 10,
    },
    scroll: {
        flex: 1,
        padding: 12,
        paddingBottom: 30,
    },
    headerText: {
        fontSize: 16,
        marginLeft: 6,
        fontWeight: "bold",
        textAlign: "center",
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 9999,
    },
    newBlogAction: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
});
