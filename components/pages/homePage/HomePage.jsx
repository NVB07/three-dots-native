import React, { useState, useEffect, useContext, memo } from "react";
import firestore from "@react-native-firebase/firestore";
import { StyleSheet, ScrollView, View, Text, Pressable, RefreshControl, Animated } from "react-native";
import FastImage from "react-native-fast-image";
import Blog from "@/components/blog/Blog";
import { SheetManager } from "react-native-actions-sheet";
import { AuthContext } from "@/components/context/AuthProvider";
import { Tab, TabView } from "@rneui/themed";
function HomePage() {
    const { authUser } = useContext(AuthContext);
    const [blogs, setBlogs] = useState([]);
    const [followingBlogs, setFollowingBlogs] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [refreshingFollowing, setRefreshingFollowing] = useState(false);
    const [indexTab, setIndexTab] = useState(0);
    const [headerHeight, setheaderHeight] = useState(30);
    const [lastOffset, setLastOffset] = useState(0);

    const onRefresh = () => {
        setRefreshing(true);
        firestore()
            .collection("blogs")
            .where("privacyValue", "==", "public")
            .orderBy("createAt", "desc")
            .onSnapshot((querySnapshot) => {
                let blogTempArray = [];
                querySnapshot.forEach((documentSnapshot) => {
                    blogTempArray.push(documentSnapshot.id);
                });
                setBlogs(blogTempArray);
                setRefreshing(false);
            });
    };
    const onRefreshFollowing = () => {
        console.log("refreshing");

        setRefreshingFollowing(true);
        if (authUser?.following?.length > 0) {
            firestore()
                .collection("blogs")
                .where("author.uid", "in", authUser?.following)
                .orderBy("createAt", "desc")
                .onSnapshot((querySnapshot) => {
                    let blogTempArray = [];
                    if (querySnapshot) {
                        querySnapshot.forEach((documentSnapshot) => {
                            blogTempArray.push(documentSnapshot.id);
                        });
                    }
                    setFollowingBlogs(blogTempArray);
                    setRefreshingFollowing(false);
                });
        } else {
            setFollowingBlogs([]);
        }
    };

    useEffect(() => {
        const subscriber = firestore()
            .collection("blogs")
            .where("privacyValue", "==", "public")
            .orderBy("createAt", "desc")
            .onSnapshot((querySnapshot) => {
                let blogTempArray = [];
                if (querySnapshot) {
                    querySnapshot.forEach((documentSnapshot) => {
                        blogTempArray.push(documentSnapshot.id);
                    });
                }
                setBlogs(blogTempArray);
            });
        const subscriberFollowing = () => {
            if (authUser?.following?.length > 0) {
                firestore()
                    .collection("blogs")
                    .where("author.uid", "in", authUser?.following)
                    .orderBy("createAt", "desc")
                    .onSnapshot((querySnapshot) => {
                        let blogTempArray = [];
                        if (querySnapshot) {
                            querySnapshot.forEach((documentSnapshot) => {
                                blogTempArray.push(documentSnapshot.id);
                            });
                        }
                        setFollowingBlogs(blogTempArray);
                    });
            } else {
                setFollowingBlogs([]);
            }
        };

        subscriberFollowing();
        return () => {
            subscriber();
        };
    }, [authUser?.following]);

    const handleScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        if (offsetY > lastOffset && offsetY > 30) {
            setheaderHeight(0);
        } else if (offsetY < lastOffset || offsetY < 30) {
            setheaderHeight(30);
        }
        setLastOffset(offsetY);
    };
    return (
        <View style={styles.main}>
            <View
                style={{
                    width: "100%",
                    borderBottomWidth: 1,
                    borderBottomColor: "#cccccc",
                    backgroundColor: "#f2f2f2",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 999,
                }}
            >
                <Animated.View style={{ height: headerHeight }}>
                    <View
                        style={{ width: "100%", height: headerHeight > 0 ? headerHeight + 20 : 0, paddingHorizontal: 12, alignItems: "center", justifyContent: "center" }}
                    >
                        <Text style={{ fontWeight: 600, fontSize: 30, color: "black", fontFamily: "Allura" }}>Three Dots</Text>
                    </View>
                </Animated.View>
                <Tab
                    buttonStyle={{ padding: 0, borderRadius: 9 }}
                    containerStyle={{ height: 25, padding: 0, paddingVertical: 0 }}
                    value={indexTab}
                    onChange={(e) => setIndexTab(e)}
                    indicatorStyle={{
                        backgroundColor: "#666",
                        marginBottom: -1,
                        height: 3,
                    }}
                    variant="default"
                >
                    <Tab.Item
                        buttonStyle={{ padding: 0 }}
                        containerStyle={{ padding: 0 }}
                        title="Mọi người"
                        titleStyle={(active) => ({ fontSize: 14, color: active ? "#333" : "#7c7c7c" })}
                    />
                    <Tab.Item
                        buttonStyle={{ padding: 0 }}
                        containerStyle={{ padding: 0 }}
                        title="Đang theo dõi"
                        titleStyle={(active) => ({ fontSize: 14, color: active ? "#333" : "#7c7c7c" })}
                    />
                </Tab>
            </View>
            <TabView value={indexTab} onChange={setIndexTab} animationType="spring" disableSwipe>
                <TabView.Item style={{ width: "100%" }}>
                    <ScrollView style={styles.scroll} onScroll={handleScroll} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
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
                                        backgroundColor: pressed ? "#C2C2C2FF" : "#E2E2E2FF",
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
                            return <MemoizedBlogs blogId={blogId} key={index} authUser={authUser} privacyValue={"public"} lastBlog={index + 1 === blogs.length} />;
                        })}
                        <View style={{ width: "100%", height: 20 }}></View>
                    </ScrollView>
                </TabView.Item>
                <TabView.Item style={{ width: "100%" }}>
                    <ScrollView
                        style={styles.scroll}
                        onScroll={handleScroll}
                        refreshControl={<RefreshControl refreshing={refreshingFollowing} onRefresh={onRefreshFollowing} />}
                    >
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
                                        backgroundColor: pressed ? "#C2C2C2FF" : "#E2E2E2FF",
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
                        {followingBlogs.length == 0 ? (
                            <Text style={{ width: "100%", textAlign: "center", marginTop: 20, color: "#666" }}>Bạn chưa theo dõi ai</Text>
                        ) : null}
                        {followingBlogs.map((blogId, index) => {
                            return <MemoizedBlogs blogId={blogId} key={index} authUser={authUser} lastBlog={index + 1 === followingBlogs.length} />;
                        })}
                        <View style={{ width: "100%", height: 20 }}></View>
                    </ScrollView>
                </TabView.Item>
            </TabView>
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
        backgroundColor: "hsla(0, 0.00%, 100.00%, 0.70)",
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
        borderWidth: 1,
        borderColor: "#999",
    },
    scroll: {
        flex: 1,
        padding: 12,
        paddingTop: 80,
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
