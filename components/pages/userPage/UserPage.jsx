import { View, ScrollView, Pressable, Text, Alert, RefreshControl } from "react-native";
import { Button, Dialog } from "@rneui/base";
import FastImage from "react-native-fast-image";
import { useState, useEffect, useContext, useCallback } from "react";
import firestore from "@react-native-firebase/firestore";
import Blog from "@/components/blog/Blog";
import Feather from "@expo/vector-icons/Feather";
import auth from "@react-native-firebase/auth";
import HeaderBack from "@/components/headerBack/HeaderBack";
import { useRouter } from "expo-router";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import SocialLink from "./SocialLink";
import { OneSignal } from "react-native-onesignal";
import { followUser } from "@/components/firebase/service";
import { sendPushNotification } from "@/components/oneSignal/notification";
import * as SecureStore from "expo-secure-store";

import { AuthContext } from "@/components/context/AuthProvider";

const UserPage = ({ uid, userTabClick = false }) => {
    const { authUser, setAuthUser } = useContext(AuthContext);
    const [visible1, setVisible1] = useState(false);
    const myUserPage = uid === authUser.uid;
    const [userData, setUserData] = useState();
    const [userBlog, setUserBlog] = useState([]);
    const [loading, setLoading] = useState(false);
    const [followTitleButton, setFollowTitleButton] = useState("---");
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogContent, setDialogContent] = useState([]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        firestore()
            .collection("users")
            .doc(uid)
            .get()
            .then((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    const data = documentSnapshot.data();
                    setUserData(data);
                }
            });

        firestore()
            .collection("blogs")
            .where("author.uid", "==", uid)
            .orderBy("createAt", "desc")
            .get()
            .then((querySnapshot) => {
                let blogTempArray = [];
                querySnapshot.forEach((documentSnapshot) => {
                    blogTempArray.push(documentSnapshot.id);
                });
                setUserBlog(blogTempArray);
            })
            .finally(() => setRefreshing(false));
    }, [uid]);

    const signOut = async () => {
        try {
            await GoogleSignin.signOut();
            await auth().signOut();
            setAuthUser(null);
            await SecureStore.deleteItemAsync("privateKey");
            OneSignal.logout();
            console.log("signOut");
        } catch (e) {
            console.log(e);
        }
    };

    const alertSignOut = () => {
        Alert.alert(
            "Đăng xuất", // Tiêu đề của alert
            "Bạn có muốn đăng xuất tài khoản ?",
            [
                {
                    text: "Hủy",
                    onPress: () => console.log("Hủy bỏ"),
                    style: "cancel",
                },
                {
                    text: "Đăng xuất",
                    style: "destructive",
                    onPress: async () => {
                        await signOut();
                    },
                },
            ],
            { cancelable: false }
        );
    };

    useEffect(() => {
        const subscriberUser = firestore()
            .collection("users")
            .doc(uid)
            .onSnapshot((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    const data = documentSnapshot.data();
                    setUserData(data);
                    setFollowTitleButton(() => {
                        if (data.followers?.includes(authUser.uid)) {
                            return "Bỏ theo dõi";
                        } else {
                            return "Theo dõi";
                        }
                    });
                }
            });
        const subscriberBlog = firestore()
            .collection("blogs")
            .where("author.uid", "==", uid)
            .orderBy("createAt", "desc")
            .onSnapshot((querySnapshot) => {
                let blogTempArray = [];
                querySnapshot.forEach((documentSnapshot) => {
                    blogTempArray.push(documentSnapshot.id);
                });
                setUserBlog(blogTempArray);
            });
        return () => {
            subscriberUser();
            subscriberBlog();
            setUserData();
            setUserBlog([]);
        };
    }, [uid]);

    const handleChat = async () => {
        setLoading(true);
        try {
            const docsWithUserUid = [];
            const querySnapshot = await firestore().collection("roomsChat").get();
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.user && data.user.includes(authUser.uid)) {
                        docsWithUserUid.push({
                            id: doc.id,
                            user: data.user,
                        });
                    }
                });
            }
            const resultId = docsWithUserUid.find((item) => item.user?.includes(authUser.uid) && item.user?.includes(userData.uid));

            if (resultId) {
                setLoading(false);
                router.push({
                    pathname: "/roomChat/" + resultId.id,
                    params: {
                        friendData: userData ? encodeURIComponent(JSON.stringify(userData)) : null,
                    },
                });
            } else {
                const docRef = await firestore()
                    .collection("roomsChat")
                    .add({
                        user: [authUser.uid, userData.uid],
                        createAt: firestore.FieldValue.serverTimestamp(),
                    });
                setLoading(false);
                router.push({
                    pathname: "/roomChat/" + docRef.id,
                    params: {
                        friendData: userData ? encodeURIComponent(JSON.stringify(userData)) : null,
                    },
                });
            }
        } catch (error) {
            console.error("Error handling chat: ", error);
        }
    };
    const handleFollow = async () => {
        setFollowTitleButton("...");
        const title = await followUser(authUser.uid, uid);
        if (title === "Bỏ theo dõi") await sendPushNotification(uid, `Lượt theo dõi mới`, `${authUser?.displayName} đã theo dõi bạn`);
        setFollowTitleButton(title);
    };

    const fetchUsersData = async (uids) => {
        try {
            const userPromises = uids.map((uid) => firestore().collection("users").doc(uid).get());

            const userDocs = await Promise.all(userPromises);

            const usersData = userDocs.map((doc) => ({
                id: doc.id, // UID
                ...doc.data(),
            }));

            return usersData;
        } catch (error) {
            console.error("Error fetching user data: ", error);
            return [];
        }
    };

    const toggleDialog1 = async (title, uids = []) => {
        setVisible1((pre) => {
            if (pre === false) {
                setDialogTitle(title);
                if (uids.length > 0) fetchUsersData(uids).then((usersData) => setDialogContent(usersData));
                return true;
            } else {
                setDialogContent([]);
                return false;
            }
        });
    };
    const handleViewOtherUser = (uid) => {
        setVisible1(false);
        setDialogContent([]);
        router.push(`/userid/${uid}`);
    };

    return (
        <View style={{ paddingBottom: 30 }}>
            <HeaderBack title={userData?.displayName} />
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} style={{ padding: 12 }}>
                <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 20 }}>
                    <View style={{ width: "60%", justifyContent: "flex-start", height: "100%" }}>
                        <View style={{ marginBottom: 12 }}>
                            <Text style={{ fontSize: 18, fontWeight: "bold" }}>{userData?.displayName}</Text>
                            <View style={{ width: "100%", height: 30 }}>
                                <SocialLink userData={userData} />
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", paddingBottom: 8 }}>
                            <Button
                                onPress={async () =>
                                    await toggleDialog1(`Đang theo dõi: ${userData?.following?.length ? userData?.following?.length : "0"} `, userData?.following)
                                }
                                type="clear"
                                titleStyle={{ color: "#666", fontSize: 15 }}
                                buttonStyle={{ padding: 0, paddingHorizontal: 0 }}
                            >
                                <Text> {userData?.following?.length ? userData?.following?.length + " đang theo dõi," : "0 đang theo dõi,"}</Text>
                            </Button>
                            <Button
                                onPress={async () =>
                                    await toggleDialog1(`Người theo dõi: ${userData?.followers?.length ? userData?.followers?.length : "0"} `, userData?.followers)
                                }
                                type="clear"
                                titleStyle={{ color: "#666", fontSize: 15 }}
                                buttonStyle={{ padding: 0, paddingHorizontal: 0 }}
                            >
                                <Text> {userData?.followers?.length ? userData?.followers?.length + " người theo dõi" : " 0 người theo dõi"}</Text>
                            </Button>
                        </View>
                        <Dialog overlayStyle={{ backgroundColor: "#fff", height: "80%", width: "90%" }} isVisible={visible1} onBackdropPress={toggleDialog1}>
                            <Dialog.Title title={dialogTitle} />
                            <ScrollView>
                                <View style={{}}>
                                    {dialogContent.length > 0 ? (
                                        dialogContent?.map((item, index) => {
                                            return (
                                                <Pressable
                                                    key={index}
                                                    onPress={() => handleViewOtherUser(item.id)}
                                                    style={({ pressed }) => [
                                                        {
                                                            backgroundColor: pressed ? "#E2E2E2FF" : "#f2f2f2",
                                                        },
                                                        { padding: 5, flexDirection: "row", borderRadius: 10, marginBottom: 5 },
                                                    ]}
                                                >
                                                    <FastImage
                                                        style={{ width: 36, height: 36, borderRadius: 9999, marginRight: 6 }}
                                                        source={{
                                                            uri: item.photoURL,
                                                            priority: FastImage.priority.low,
                                                        }}
                                                        resizeMode={FastImage.resizeMode.cover}
                                                    />
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ fontSize: 16, fontWeight: 500 }}>{item?.displayName}</Text>

                                                        <Text style={{ color: "red" }}>Trang cá nhân</Text>
                                                    </View>
                                                </Pressable>
                                            );
                                        })
                                    ) : (
                                        <Text>Không có người nào ở đây !</Text>
                                    )}
                                </View>
                            </ScrollView>
                        </Dialog>
                    </View>
                    <View style={{ width: "40%", alignItems: "flex-end" }}>
                        <FastImage
                            style={{ width: 90, height: 90, borderRadius: 9999 }}
                            source={{
                                uri: userData?.photoURL,
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                    </View>
                </View>

                <View style={{ width: "100%", borderBottomWidth: 1, borderColor: "#ccc", paddingBottom: 20, marginBottom: 20 }}>
                    {!myUserPage ? (
                        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
                            <View style={{ width: "49%" }}>
                                <Button buttonStyle={{ borderWidth: 2 }} disabled={loading} loading={loading} onPress={handleChat} radius={"md"}>
                                    Nhắn tin
                                </Button>
                            </View>
                            <View style={{ width: "49%" }}>
                                <Button
                                    buttonStyle={{ borderColor: "#999", borderWidth: 2 }}
                                    disabled={followTitleButton === "..."}
                                    loading={followTitleButton === "..."}
                                    onPress={handleFollow}
                                    radius={"md"}
                                    type="outline"
                                    titleStyle={{ color: "#333" }}
                                    color="error"
                                >
                                    {followTitleButton}
                                </Button>
                            </View>
                        </View>
                    ) : (
                        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
                            <Button
                                titleStyle={{ color: "#333" }}
                                buttonStyle={{ borderColor: "#999", borderWidth: 2 }}
                                type="outline"
                                onPress={() => router.push(`/userid/edit`)}
                                containerStyle={{ width: "80%" }}
                                radius={"md"}
                            >
                                Sửa thông tin
                            </Button>
                            <Button
                                onPress={alertSignOut}
                                type="outline"
                                titleStyle={{ color: "red" }}
                                buttonStyle={{ height: 42, borderColor: "red", borderWidth: 2, padding: 0 }}
                                containerStyle={{ width: "17%", padding: 0 }}
                                radius={"md"}
                            >
                                <Feather name="log-out" size={24} color="red" />
                            </Button>
                        </View>
                    )}
                </View>

                <View style={{ width: "100%" }}>
                    {userBlog.map((item, index) => {
                        return (
                            <Blog
                                blogId={item}
                                key={index}
                                authUser={authUser}
                                inMyUserPage={userTabClick}
                                following={userData?.followers?.includes(authUser.uid)}
                                anotherUserPage={true}
                            />
                        );
                    })}
                </View>
                <View style={{ width: "100%", height: 20 }}></View>
            </ScrollView>
        </View>
    );
};

export default UserPage;
