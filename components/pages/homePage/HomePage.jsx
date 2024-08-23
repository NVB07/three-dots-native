import React, { useState, useEffect, useContext } from "react";
import firestore from "@react-native-firebase/firestore";
import { StyleSheet, ScrollView, View, Text, Pressable, ImageBackground } from "react-native";
import FastImage from "react-native-fast-image";
// import auth from "@react-native-firebase/auth";
// import { ThemedText } from "../ThemedText";
import Blog from "@/components/blog/Blog";
import { SheetManager } from "react-native-actions-sheet";
import { AuthContext } from "@/components/context/AuthProvider";

function HomePage() {
    const { authUser } = useContext(AuthContext);
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
            <ImageBackground source={require("@/assets/images/bg-login.jpg")} style={{ width: "100%", flex: 1 }}>
                <View style={styles.overlay} />
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
                        return <Blog blogId={blogId} key={index} authUser={authUser} />;
                    })}
                </ScrollView>
            </ImageBackground>
        </View>
    );
}

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
        backgroundColor: "yellow",
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
