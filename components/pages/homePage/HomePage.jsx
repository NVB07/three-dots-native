import React, { useState, useEffect, useContext } from "react";
import firestore from "@react-native-firebase/firestore";
import { StyleSheet, ScrollView, View, Text, Pressable } from "react-native";
import FastImage from "react-native-fast-image";
// import auth from "@react-native-firebase/auth";
// import { ThemedText } from "../ThemedText";
import Blog from "@/components/blog/Blog";
import NewBlogSheet from "@/components/newBlog/NewBlogSheet";
import { Button } from "@rneui/themed";
import { SheetManager } from "react-native-actions-sheet";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { AuthContext } from "@/components/context/AuthProvider";

function HomePage() {
    const { authUser, setAuthUser } = useContext(AuthContext);
    const [blogs, setBlogs] = useState([]);

    const showUser = () => {
        console.log(authUser);
        alert("User: " + authUser.displayName);
    };

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
            <ScrollView style={styles.scroll}>
                <View style={styles.header}>
                    <Pressable
                        type="clear"
                        onPress={() =>
                            SheetManager.show("NewBlogSheet", {
                                payload: authUser,
                            })
                        }
                        radius={"sm"}
                        style={styles.buttonNewBlog}
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
                                <Text style={{ color: "#999", marginLeft: 6 }}>Chạm để thêm bài viết</Text>
                            </View>
                        </View>
                    </Pressable>
                    {/* <Button type="clear" onPress={showUser} radius={9999} style={styles.btn}>
                            log
                        </Button> */}
                </View>

                {blogs.map((blogId, index) => {
                    return <Blog blogId={blogId} key={index} authUser={authUser} />;
                })}
            </ScrollView>
        </View>
    );
}

export default HomePage;

const styles = StyleSheet.create({
    main: {
        flex: 1,
    },
    header: {
        height: 70,
        // backgroundColor: "gray",
        paddingVertical: 8,
    },
    buttonNewBlog: {
        padding: 0,
    },
    scroll: {
        flex: 1,
        padding: 12,
    },
    headerText: {
        fontSize: 16,
        marginLeft: 6,
        fontWeight: "bold",
    },
    avatar: {
        backgroundColor: "yellow",
        width: 36,
        height: 36,
        borderRadius: 9999,
    },
    newBlogAction: {
        width: "100%",
        flexDirection: "row",
    },
});

// <View>
//     <ThemedText>Welcome {authUser?.displayName}</ThemedText>
//     <Button
//         title="sign out"
//         onPress={() =>
//             auth()
//                 .signOut()
//                 .then(() => console.log("User signed out!"))
//         }
//     />
//     <Button title="log" onPress={showUser} />
//     <ThemedText>chao</ThemedText>
// </View>
